const { getOrCreateSession } = require('../services/sessionService');
const { calculateWeightedConfusion } = require('../utils/aggregator');
const Confusion = require('../models/Confusion');

module.exports = (io, socket) => {
  // Send Confusion Pulse (Student)
  socket.on('send-confusion', async ({ sessionCode, level }) => {
    const session = getOrCreateSession(sessionCode);

    const validLevel = Math.max(1, Math.min(5, Number(level) || 3));
    session.confusionVotes.set(socket.id, validLevel);

    // Compute Weighted Average Score using Aggregator Utility
    const confusionData = calculateWeightedConfusion(session.confusionVotes);

    // Broadcast weighted aggregate score to session room
    io.to(session.code).emit('confusion-updated', {
      sessionCode: session.code,
      confusionScore: confusionData.score,
      totalResponses: confusionData.totalResponses,
      levelCounts: confusionData.levelCounts,
      timestamp: new Date()
    });

    console.log(`[Socket] Room ${session.code} Confusion pulse level ${validLevel}. Weighted Avg: ${confusionData.score}/5.0`);

    try {
      await Confusion.create({
        sessionCode: session.code,
        level: validLevel,
        socketId: socket.id
      });
    } catch (err) {}
  });
};
