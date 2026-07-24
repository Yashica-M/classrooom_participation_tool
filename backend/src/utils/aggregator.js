/**
 * Analytical Utility for Aggregating Real-time Classroom Metrics
 */

/**
 * Calculates the Weighted Average Confusion Score from live student votes.
 * Formula: Sum(level * count) / Sum(count)
 * Levels: 1 (Clear), 2 (Mostly Clear), 3 (Unsure), 4 (Confused), 5 (Lost)
 * @param {Map<string, number>} confusionVotes - Map of socketId -> level (1-5)
 * @returns {object} { score: number, totalResponses: number, levelCounts: object }
 */
function calculateWeightedConfusion(confusionVotes) {
  if (!confusionVotes || confusionVotes.size === 0) {
    return {
      score: 1.0,
      totalResponses: 0,
      levelCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }

  let totalWeight = 0;
  const levelCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  for (const level of confusionVotes.values()) {
    const validLevel = Math.max(1, Math.min(5, Number(level) || 1));
    levelCounts[validLevel] += 1;
    totalWeight += validLevel;
  }

  const totalResponses = confusionVotes.size;
  const weightedScore = Number((totalWeight / totalResponses).toFixed(2));

  return {
    score: weightedScore,
    totalResponses,
    levelCounts
  };
}

/**
 * Calculates percentage breakdown for poll options
 * @param {object} poll - Poll object with options array
 * @returns {Array} Array of options with percentage
 */
function aggregatePollResults(poll) {
  if (!poll || !poll.options) return [];

  const totalVotes = poll.totalVotes || 0;
  return poll.options.map(opt => ({
    ...opt,
    percentage: totalVotes > 0 ? Number(((opt.votes / totalVotes) * 100).toFixed(1)) : 0
  }));
}

module.exports = {
  calculateWeightedConfusion,
  aggregatePollResults
};
