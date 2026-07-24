const { getOrCreateSession } = require('../services/sessionService');
const { aggregatePollResults } = require('../utils/aggregator');
const Poll = require('../models/Poll');

module.exports = (io, socket) => {
  // Start Poll (Instructor)
  socket.on('start-poll', async ({ sessionCode, question, options }) => {
    const session = getOrCreateSession(sessionCode);

    const pollData = {
      id: `poll_${Date.now()}`,
      sessionCode: session.code,
      question,
      options: options.map((optText, idx) => ({
        id: `opt_${idx + 1}`,
        text: optText,
        votes: 0
      })),
      totalVotes: 0,
      isActive: true,
      createdAt: new Date()
    };

    session.activePoll = pollData;

    // Broadcast poll to all clients in session room
    io.to(session.code).emit('poll-started', pollData);
    console.log(`[Socket] Poll launched in room ${session.code}: "${question}"`);

    // Async DB persist fallback
    try {
      await Poll.create(pollData);
    } catch (err) {
      // Ignored if DB offline
    }
  });

  // Submit Poll Vote (Student)
  socket.on('submit-vote', async ({ sessionCode, optionId }) => {
    const session = getOrCreateSession(sessionCode);

    if (!session.activePoll || !session.activePoll.isActive) {
      return socket.emit('error-msg', { message: 'No active poll available' });
    }

    const option = session.activePoll.options.find(opt => opt.id === optionId);
    if (option) {
      option.votes += 1;
      session.activePoll.totalVotes += 1;

      const aggregatedPoll = {
        ...session.activePoll,
        optionsWithPercentage: aggregatePollResults(session.activePoll)
      };

      // Broadcast real-time updated poll data (<50ms latency)
      io.to(session.code).emit('poll-updated', aggregatedPoll);

      try {
        await Poll.updateOne(
          { id: session.activePoll.id, "options.id": optionId },
          { $inc: { totalVotes: 1, "options.$.votes": 1 } }
        );
      } catch (err) {}
    }
  });
};
