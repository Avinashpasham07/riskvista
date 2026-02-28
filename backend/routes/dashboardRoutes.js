const express = require('express');
const router = express.Router();
const { getDashboardData } = require('../controllers/dashboardController');
const { protect } = require('../middlewares/authMiddleware');

// @route   GET /api/dashboard
// @desc    Get comprehensive analytics including loans, benchmarks, and AI advice
// @access  Private
router.route('/').get(protect, getDashboardData);

module.exports = router;
