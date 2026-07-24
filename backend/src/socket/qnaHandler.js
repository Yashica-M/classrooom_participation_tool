const { getOrCreateSession } = require('../services/sessionService');
const Question = require('../models/Question');

module.exports = (io, socket) => {
  // Submit Question (Student)
  socket.on('submit-question', async ({ sessionCode, text, isAnonymous }) => {
    const session = getOrCreateSession(sessionCode);

    const newQuestion = {
      id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      sessionCode: session.code,
      text,
      author: isAnonymous ? 'Anonymous Student' : 'Student',
      isAnonymous: isAnonymous !== false,
      upvotes: 0,
      createdAt: new Date()
    };

    session.questions.unshift(newQuestion);

    // Broadcast updated question list
    io.to(session.code).emit('questions-updated', session.questions);

    try {
      await Question.create(newQuestion);
    } catch (err) {}
  });

  // Upvote Question
  socket.on('upvote-question', async ({ sessionCode, questionId }) => {
    const session = getOrCreateSession(sessionCode);

    const question = session.questions.find(q => q.id === questionId);
    if (question) {
      question.upvotes += 1;
      // Sort questions descending by upvotes
      session.questions.sort((a, b) => b.upvotes - a.upvotes);

      io.to(session.code).emit('questions-updated', session.questions);
    }
  });
};
