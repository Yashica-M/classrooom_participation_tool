const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  sessionCode: {
    type: String,
    required: true,
    uppercase: true
  },
  text: {
    type: String,
    required: true
  },
  author: {
    type: String,
    default: 'Anonymous Student'
  },
  isAnonymous: {
    type: Boolean,
    default: true
  },
  upvotes: {
    type: Number,
    default: 0
  },
  isAnswered: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Question', questionSchema);
