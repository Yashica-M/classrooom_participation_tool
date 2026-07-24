const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  votes: { type: Number, default: 0 }
});

const pollSchema = new mongoose.Schema({
  sessionCode: {
    type: String,
    required: true,
    uppercase: true
  },
  question: {
    type: String,
    required: true
  },
  options: [optionSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  totalVotes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Poll', pollSchema);
