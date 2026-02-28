const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected test route
router.get('/test', protect, (req, res) => {
    res.json({ message: 'You have access to this protected route', tenantId: req.tenantId });
});

module.exports = router;
