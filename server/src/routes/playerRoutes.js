const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

router.get('/avatar', playerController.getPlayerData);
router.post('/daily-score', playerController.submitDailyScore);

module.exports = router;