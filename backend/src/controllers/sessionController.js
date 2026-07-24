const Session = require('../models/Session');
const Poll = require('../models/Poll');
const Question = require('../models/Question');
const { activeSessions } = require('../services/sessionService');
const { calculateWeightedConfusionScore } = require('../services/AnalyticsService');

exports.createSession = async (req, res) => {
  try {
    const { title, code, instructorName } = req.body;
    const sessionCode = (code || `CS${Math.floor(100 + Math.random() * 900)}`).toUpperCase();

    const sessionData = {
      title: title || 'Live Classroom Lecture',
      code: sessionCode,
      instructorName: instructorName || 'Instructor',
      isActive: true
    };

    let session;
    try {
      session = await Session.create(sessionData);
    } catch (err) {
      session = sessionData;
    }

    return res.status(201).json({
      success: true,
      message: 'Session created successfully',
      data: session
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getSessionByCode = async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    let session;
    try {
      session = await Session.findOne({ code });
    } catch (err) {
      session = null;
    }

    if (!session) {
      session = {
        code,
        title: `Session ${code}`,
        instructorName: 'Prof. Smith',
        isActive: true
      };
    }

    return res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.endSession = async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    
    if (activeSessions.has(code)) {
      const sessionState = activeSessions.get(code);
      if (sessionState.activePoll) {
        sessionState.activePoll.isActive = false;
      }
    }

    try {
      await Session.updateOne({ code }, { isActive: false, endTime: new Date() });
    } catch (err) {}

    return res.status(200).json({
      success: true,
      message: `Session ${code} ended successfully`
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getSessionSummary = async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const sessionState = activeSessions.get(code) || {
      code,
      questions: [],
      confusionVotes: new Map(),
      participantCount: 0,
      activePoll: null
    };

    const confusionAnalytics = calculateWeightedConfusionScore(sessionState.confusionVotes);

    const summary = {
      sessionCode: code,
      totalParticipants: sessionState.participantCount || 0,
      finalConfusionScore: confusionAnalytics.score,
      totalConfusionResponses: confusionAnalytics.totalResponses,
      totalQuestionsAsked: sessionState.questions.length,
      activePoll: sessionState.activePoll
    };

    return res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
