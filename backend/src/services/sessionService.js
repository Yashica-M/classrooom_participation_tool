const { calculateWeightedConfusion } = require('../utils/aggregator');

// In-memory active session store (Map<sessionCode, SessionState>)
const activeSessions = new Map();

/**
 * Gets existing session state or initializes a new state for a given sessionCode
 * @param {string} sessionCode 
 * @returns {object} SessionState
 */
function getOrCreateSession(sessionCode) {
  const code = (sessionCode || 'CS101').toUpperCase().trim();
  if (!activeSessions.has(code)) {
    activeSessions.set(code, {
      code,
      activePoll: null,
      confusionVotes: new Map(), // socketId -> level (1-5)
      questions: [],
      participantCount: 0,
      createdAt: new Date()
    });
  }
  return activeSessions.get(code);
}

/**
 * Removes socket confusion vote and decrements participant count on disconnect
 * @param {string} sessionCode 
 * @param {string} socketId 
 */
function handleParticipantDisconnect(sessionCode, socketId) {
  if (!sessionCode || !activeSessions.has(sessionCode)) return null;

  const session = activeSessions.get(sessionCode);
  session.participantCount = Math.max(0, session.participantCount - 1);
  session.confusionVotes.delete(socketId);

  const confusionData = calculateWeightedConfusion(session.confusionVotes);

  return {
    participantCount: session.participantCount,
    confusionScore: confusionData.score,
    totalResponses: confusionData.totalResponses
  };
}

module.exports = {
  getOrCreateSession,
  handleParticipantDisconnect,
  activeSessions
};
