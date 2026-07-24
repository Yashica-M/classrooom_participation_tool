const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

router.post('/', sessionController.createSession);
router.post('/create', sessionController.createSession);
router.get('/:code', sessionController.getSessionByCode);
router.post('/:code/end', sessionController.endSession);
router.get('/:code/summary', sessionController.getSessionSummary);

module.exports = router;
