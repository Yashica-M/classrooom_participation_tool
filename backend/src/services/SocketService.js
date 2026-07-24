const { calculateWeightedConfusionScore } = require('./AnalyticsService');
const { getOrCreateSession, handleParticipantDisconnect } = require('./sessionService');
const Question = require('../models/Question');
const Poll = require('../models/Poll');
const Confusion = require('../models/Confusion');

class SocketService {
  constructor(io) {
    this.io = io;
  }

  init() {
    this.io.on('connection', (socket) => {
      console.log(`[SocketService] Connection established: ${socket.id}`);

      // 1. Join Room Event
      socket.on('join-session', ({ sessionCode, role, name }) => {
        const code = (sessionCode || 'CS101').toUpperCase().trim();
        socket.join(code);
        socket.sessionCode = code;
        socket.userRole = role || 'STUDENT';
        socket.userName = name || 'User';

        const session = getOrCreateSession(code);
        session.participantCount += 1;

        console.log(`[SocketService] ${socket.userName} (${role}) joined room: ${code}. Total active: ${session.participantCount}`);

        const confusionData = calculateWeightedConfusionScore(session.confusionVotes);

        const activeQuestions = session.questions.filter(q => !q.isAnswered);

        const roomStatePayload = {
          sessionCode: code,
          role: socket.userRole,
          activePoll: session.activePoll,
          questions: activeQuestions,
          confusionScore: confusionData.score,
          weightedScore: confusionData.score,
          totalResponses: confusionData.totalResponses,
          participantCount: session.participantCount
        };

        // Dual emission for maximum client compatibility
        socket.emit('session-joined', roomStatePayload);
        socket.emit('room-state', roomStatePayload);

        this.io.to(code).emit('room-participants-update', {
          participantCount: session.participantCount
        });
      });

      // Explicit Leave Room Event
      const handleLeave = () => {
        if (socket.sessionCode) {
          const code = socket.sessionCode;
          socket.leave(code);
          const update = handleParticipantDisconnect(code, socket.id);
          if (update) {
            console.log(`[SocketService] Socket ${socket.id} left room ${code}. Remaining: ${update.participantCount}`);
            const confusionPayload = {
              sessionCode: code,
              confusionScore: update.confusionScore,
              weightedScore: update.confusionScore,
              totalResponses: update.totalResponses
            };
            this.io.to(code).emit('confusion-updated', confusionPayload);
            this.io.to(code).emit('confusion-update', confusionPayload);
            this.io.to(code).emit('room-participants-update', {
              participantCount: Math.max(0, update.participantCount)
            });
          }
          socket.sessionCode = null;
        }
      };

      socket.on('leave-session', handleLeave);

      // 2. Poll Launch Handler (supports 'start-poll' and 'create-poll')
      const handleStartPoll = async ({ sessionCode, question, options }) => {
        const code = (sessionCode || 'CS101').toUpperCase().trim();
        const session = getOrCreateSession(code);

        const pollData = {
          id: `poll_${Date.now()}`,
          sessionCode: code,
          question,
          options: (options || []).map((optText, idx) => ({
            id: `opt_${idx + 1}`,
            text: optText,
            votes: 0
          })),
          totalVotes: 0,
          isActive: true,
          createdAt: new Date()
        };

        session.activePoll = pollData;

        // Dual broadcast
        this.io.to(code).emit('poll-started', pollData);
        this.io.to(code).emit('poll-created', pollData);
        console.log(`[SocketService] Poll launched in room ${code}: "${question}"`);

        try {
          await Poll.create(pollData);
        } catch (err) {}
      };

      socket.on('start-poll', handleStartPoll);
      socket.on('create-poll', handleStartPoll);

      // 3. Poll Vote Handler (supports 'submit-vote' and 'submit-poll-vote')
      const handleSubmitVote = async ({ sessionCode, optionId, optionIndex }) => {
        const code = (sessionCode || 'CS101').toUpperCase().trim();
        const session = getOrCreateSession(code);

        if (!session.activePoll || !session.activePoll.isActive) return;

        let option;
        if (optionId) {
          option = session.activePoll.options.find(opt => opt.id === optionId);
        } else if (optionIndex !== undefined && session.activePoll.options[optionIndex]) {
          option = session.activePoll.options[optionIndex];
        }

        if (option) {
          option.votes += 1;
          session.activePoll.totalVotes += 1;

          // Dual broadcast
          this.io.to(code).emit('poll-updated', session.activePoll);
          this.io.to(code).emit('poll-update', session.activePoll);

          try {
            await Poll.updateOne(
              { id: session.activePoll.id, "options.id": option.id },
              { $inc: { totalVotes: 1, "options.$.votes": 1 } }
            );
          } catch (err) {}
        }
      };

      socket.on('submit-vote', handleSubmitVote);
      socket.on('submit-poll-vote', handleSubmitVote);

      // 4. Confusion Pulse Handler (supports 'send-confusion' and 'submit-pulse')
      const handleSendConfusion = async ({ sessionCode, level }) => {
        const code = (sessionCode || 'CS101').toUpperCase().trim();
        const session = getOrCreateSession(code);

        const validLevel = Math.max(1, Math.min(5, Number(level) || 3));
        session.confusionVotes.set(socket.id, validLevel);

        const confusionData = calculateWeightedConfusionScore(session.confusionVotes);

        const confusionPayload = {
          sessionCode: code,
          confusionScore: confusionData.score,
          weightedScore: confusionData.score,
          totalResponses: confusionData.totalResponses,
          totalVotes: confusionData.totalResponses,
          levelCounts: confusionData.levelCounts
        };

        // Dual broadcast
        this.io.to(code).emit('confusion-updated', confusionPayload);
        this.io.to(code).emit('confusion-update', confusionPayload);

        console.log(`[SocketService] Room ${code} Confusion update: ${confusionData.score}/5.0`);

        try {
          await Confusion.create({
            sessionCode: code,
            level: validLevel,
            socketId: socket.id
          });
        } catch (err) {}
      };

      socket.on('send-confusion', handleSendConfusion);
      socket.on('submit-pulse', handleSendConfusion);

      // 5. Submit Question Event
      socket.on('submit-question', async ({ sessionCode, text, isAnonymous }) => {
        const code = (sessionCode || 'CS101').toUpperCase().trim();
        const session = getOrCreateSession(code);

        const newQuestion = {
          id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          sessionCode: code,
          text,
          author: isAnonymous ? 'Anonymous Student' : (socket.userName || 'Student'),
          isAnonymous: isAnonymous !== false,
          upvotes: 0,
          isAnswered: false,
          createdAt: new Date()
        };

        session.questions.unshift(newQuestion);

        const activeQuestions = session.questions.filter(q => !q.isAnswered);
        this.io.to(code).emit('questions-updated', activeQuestions);
        this.io.to(code).emit('qa-update', activeQuestions);

        try {
          await Question.create(newQuestion);
        } catch (err) {}
      });

      // 6. Upvote Question Event
      socket.on('upvote-question', async ({ sessionCode, questionId }) => {
        const code = (sessionCode || 'CS101').toUpperCase().trim();
        const session = getOrCreateSession(code);

        const question = session.questions.find(q => q.id === questionId);
        if (question) {
          question.upvotes += 1;
          session.questions.sort((a, b) => b.upvotes - a.upvotes);

          const activeQuestions = session.questions.filter(q => !q.isAnswered);
          this.io.to(code).emit('questions-updated', activeQuestions);
          this.io.to(code).emit('qa-update', activeQuestions);
        }
      });

      // 7. Mark as Answered Event (Instructor)
      socket.on('mark-answered', async ({ sessionCode, questionId }) => {
        const code = (sessionCode || 'CS101').toUpperCase().trim();
        const session = getOrCreateSession(code);

        const question = session.questions.find(q => q.id === questionId);
        if (question) {
          question.isAnswered = true;

          const activeQuestions = session.questions.filter(q => !q.isAnswered);
          this.io.to(code).emit('questions-updated', activeQuestions);
          this.io.to(code).emit('qa-update', activeQuestions);

          console.log(`[SocketService] Question ${questionId} marked as answered in room ${code}`);

          try {
            await Question.updateOne({ id: questionId }, { isAnswered: true });
          } catch (err) {}
        }
      });

      // Disconnect Event
      socket.on('disconnect', handleLeave);
    });
  }
}

module.exports = SocketService;
