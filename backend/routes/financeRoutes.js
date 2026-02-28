const express = require('express');
const router = express.Router();
const { createFinancialRecord, wipeFinancialRecords } = require('../controllers/financeController');
const { protect } = require('../middlewares/authMiddleware');
const { ensureTenantIsolation } = require('../middlewares/tenantMiddleware');

// Route is protected by JWT, and explicitly enforced via the Isolation filter
router.route('/').post(protect, ensureTenantIsolation, createFinancialRecord);
router.route('/reset').delete(protect, wipeFinancialRecords);

module.exports = router;
