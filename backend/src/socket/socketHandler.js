const Session = require('../models/Session');
const Poll = require('../models/Poll');
const Question = require('../models/Question');
const Confusion = require('../models/Confusion');

// In-memory real-time state store for high-concurrency aggregation (<50ms performance)
const sessionStates = new Map();

function getOrCreateSessionState(sessionCode) {
  const code = sessionCode.toUpperCase();
  if (!sessionStates.has(code)) {
    sessionStates.set(code, {
      code,
      activePoll: null,
      confusionVotes: new Map(), // socketId -> level
      questions: [],
      participantCount: 0
    });
  }
  return sessionStates.get(code);
}

function computeAverageConfusion(state) {
  if (state.confusionVotes.size === 0) return 1.0;
  let sum = 0;
  for (const level of state.confusionVotes.values()) {
    sum += level;
  }
  return Number((sum / state.confusionVotes.size).toFixed(2));
}

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Join Session Room by Code
    socket.on('join-session', async ({ sessionCode, role }) => {
      const code = (sessionCode || 'CS101').toUpperCase();
      socket.join(code);
      socket.sessionCode = code;
      socket.userRole = role || 'STUDENT';

      const state = getOrCreateSessionState(code);
      state.participantCount += 1;

      console.log(`[Socket.io] Socket ${socket.id} (${role}) joined session room: ${code}`);

      // Emit initial room state to joining client
      socket.emit('session-joined', {
        sessionCode: code,
        activePoll: state.activePoll,
        questions: state.questions,
        confusionScore: computeAverageConfusion(state),
        participantCount: state.participantCount
      });

      // Broadcast updated participant count
      io.to(code).emit('room-participants-update', {
        participantCount: state.participantCount
      });
    });

    // Start / Broadcast Poll (Instructor)
    socket.on('start-poll', async ({ sessionCode, question, options }) => {
      const code = (sessionCode || 'CS101').toUpperCase();
      const state = getOrCreateSessionState(code);

      const pollData = {
        id: `poll_${Date.now()}`,
        sessionCode: code,
        question,
        options: options.map((opt, idx) => ({
          id: `opt_${idx + 1}`,
          text: opt,
          votes: 0
        })),
        totalVotes: 0,
        isActive: true,
        createdAt: new Date()
      };

      state.activePoll = pollData;

      // Save to MongoDB asynchronously
      try {
        await Poll.create(pollData);
      } catch (err) {
        console.warn(`[MongoDB Warning] Could not persist poll: ${err.message}`);
      }

      // Broadcast poll to all connected clients in the room
      io.to(code).emit('poll-started', pollData);
      console.log(`[Socket.io] Poll started in room ${code}: "${question}"`);
    });

    // Submit Vote on Active Poll (Student)
    socket.on('submit-vote', async ({ sessionCode, optionId }) => {
      const code = (sessionCode || 'CS101').toUpperCase();
      const state = getOrCreateSessionState(code);

      if (!state.activePoll || !state.activePoll.isActive) {
        return socket.emit('error-msg', { message: 'No active poll available' });
      }

      const option = state.activePoll.options.find(opt => opt.id === optionId);
      if (option) {
        option.votes += 1;
        state.activePoll.totalVotes += 1;

        // Broadcast updated poll data instantly (<50ms latency)
        io.to(code).emit('poll-updated', state.activePoll);

        // Async persist update
        try {
          await Poll.updateOne(
            { id: state.activePoll.id, "options.id": optionId },
            { $inc: { totalVotes: 1, "options.$.votes": 1 } }
          );
        } catch (err) {
          // Fallback ignore if DB is offline
        }
      }
    });

    // Send Confusion Pulse (Student)
    socket.on('send-confusion', async ({ sessionCode, level }) => {
      const code = (sessionCode || 'CS101').toUpperCase();
      const state = getOrCreateSessionState(code);

      const confusionLevel = Number(level) || 3;
      state.confusionVotes.set(socket.id, confusionLevel);

      const avgScore = computeAverageConfusion(state);

      // Broadcast real-time confusion metric update to room & instructor gauge
      io.to(code).emit('confusion-updated', {
        sessionCode: code,
        confusionScore: avgScore,
        totalResponses: state.confusionVotes.size,
        timestamp: new Date()
      });

      console.log(`[Socket.io] Room ${code} Confusion update: ${avgScore}/5.0 (from ${state.confusionVotes.size} students)`);

      // Async DB record
      try {
        await Confusion.create({
          sessionCode: code,
          level: confusionLevel,
          socketId: socket.id
        });
      } catch (err) {
        // Fallback ignore
      }
    });

    // Submit Anonymous Q&A Question (Student)
    socket.on('submit-question', async ({ sessionCode, text, isAnonymous }) => {
      const code = (sessionCode || 'CS101').toUpperCase();
      const state = getOrCreateSessionState(code);

      const newQuestion = {
        id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        sessionCode: code,
        text,
        author: isAnonymous ? 'Anonymous Student' : 'Student',
        isAnonymous: isAnonymous !== false,
        upvotes: 0,
        createdAt: new Date()
      };

      state.questions.unshift(newQuestion);

      // Broadcast new question to room
      io.to(code).emit('questions-updated', state.questions);

      try {
        await Question.create(newQuestion);
      } catch (err) {}
    });

    // Upvote Question
    socket.on('upvote-question', async ({ sessionCode, questionId }) => {
      const code = (sessionCode || 'CS101').toUpperCase();
      const state = getOrCreateSessionState(code);

      const question = state.questions.find(q => q.id === questionId);
      if (question) {
        question.upvotes += 1;
        // Sort questions by upvotes descending
        state.questions.sort((a, b) => b.upvotes - a.upvotes);

        io.to(code).emit('questions-updated', state.questions);
      }
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
      if (socket.sessionCode && sessionStates.has(socket.sessionCode)) {
        const state = sessionStates.get(socket.sessionCode);
        state.participantCount = Math.max(0, state.participantCount - 1);
        state.confusionVotes.delete(socket.id);

        const avgScore = computeAverageConfusion(state);
        io.to(socket.sessionCode).emit('confusion-updated', {
          sessionCode: socket.sessionCode,
          confusionScore: avgScore,
          totalResponses: state.confusionVotes.size
        });
        io.to(socket.sessionCode).emit('room-participants-update', {
          participantCount: state.participantCount
        });
      }
    });
  });
};
