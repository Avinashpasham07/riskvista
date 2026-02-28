const express = require('express');
const router = express.Router();
const {
    getDailyTransactions,
    bulkUploadTransactions,
    deleteTransaction
} = require('../controllers/dailyController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/', getDailyTransactions);
router.post('/bulk', bulkUploadTransactions);
router.delete('/:id', deleteTransaction);

module.exports = router;
