const express = require('express');
const router = express.Router();
const { simulateScenario } = require('../controllers/simulationController');
const { protect } = require('../middlewares/authMiddleware');
const rateLimit = require('express-rate-limit');

// Dedicated, stricter rate limiter for CPU-intensive simulations
// Increased to allow frontend debounced slider testing without blocking
const simulationLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 1000,
    message: 'Too many simulation requests from this IP, please try again after 5 minutes.',
    standardHeaders: true,
    legacyHeaders: false,
});

router.route('/')
    .post(simulationLimiter, protect, simulateScenario);

module.exports = router;
