const express = require('express');
const predictionController = require('../controllers/predictionController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/predict', authMiddleware, predictionController.predict);

module.exports = router;