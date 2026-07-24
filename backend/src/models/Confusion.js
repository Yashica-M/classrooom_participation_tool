const mongoose = require('mongoose');

const confusionSchema = new mongoose.Schema({
  sessionCode: {
    type: String,
    required: true,
    uppercase: true
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  socketId: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Confusion', confusionSchema);
