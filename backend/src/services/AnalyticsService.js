/**
 * Analytics Engine Service for SyncPoll Real-time Metrics
 */

/**
 * Calculates weighted average confusion score
 * @param {Map<string, number>} confusionVotes - Map of socketId -> confusion level (1 to 5)
 * @returns {object} { score: number, totalResponses: number, levelCounts: object }
 */
exports.calculateWeightedConfusionScore = (confusionVotes) => {
  if (!confusionVotes || confusionVotes.size === 0) {
    return {
      score: 1.0,
      totalResponses: 0,
      levelCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }

  let sumWeights = 0;
  const levelCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  for (const level of confusionVotes.values()) {
    const validLevel = Math.max(1, Math.min(5, Number(level) || 1));
    levelCounts[validLevel] += 1;
    sumWeights += validLevel;
  }

  const totalResponses = confusionVotes.size;
  const score = Number((sumWeights / totalResponses).toFixed(2));

  return {
    score,
    totalResponses,
    levelCounts
  };
};

/**
 * Calculates percentage breakdown for live poll options
 * @param {object} poll 
 * @returns {Array} Options with percentage values
 */
exports.calculatePollPercentages = (poll) => {
  if (!poll || !poll.options) return [];

  const totalVotes = poll.totalVotes || 0;
  return poll.options.map(opt => ({
    ...opt,
    percentage: totalVotes > 0 ? Number(((opt.votes / totalVotes) * 100).toFixed(1)) : 0
  }));
};
