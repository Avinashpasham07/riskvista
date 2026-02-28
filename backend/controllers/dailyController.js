const DailyTransaction = require('../models/DailyTransaction');

// @desc    Get daily transactions with analysis
// @route   GET /api/daily
// @access  Private
const getDailyTransactions = async (req, res, next) => {
    try {
        const transactions = await DailyTransaction.find({ tenantId: req.tenantId }).sort({ date: -1 });

        // Basic aggregation for frontend charts
        const summary = transactions.reduce((acc, curr) => {
            const dateStr = curr.date.toISOString().split('T')[0];
            if (!acc[dateStr]) acc[dateStr] = { income: 0, expense: 0 };

            if (curr.category === 'Income') {
                acc[dateStr].income += curr.amountCents;
            } else {
                acc[dateStr].expense += curr.amountCents;
            }
            return acc;
        }, {});

        res.status(200).json({
            transactions,
            dailySummary: summary
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Bulk upload daily transactions
// @route   POST /api/daily/bulk
// @access  Private
const bulkUploadTransactions = async (req, res, next) => {
    try {
        const transactions = req.body.transactions.map(t => ({
            ...t,
            tenantId: req.tenantId,
            amountCents: Math.round(parseFloat(t.amount) * 100)
        }));

        const savedTransactions = await DailyTransaction.insertMany(transactions);
        res.status(201).json({
            message: `Successfully uploaded ${savedTransactions.length} transactions`,
            count: savedTransactions.length
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a transaction
// @route   DELETE /api/daily/:id
// @access  Private
const deleteTransaction = async (req, res, next) => {
    try {
        const transaction = await DailyTransaction.findOneAndDelete({
            _id: req.params.id,
            tenantId: req.tenantId
        });

        if (!transaction) {
            res.status(404);
            throw new Error('Transaction not found');
        }

        res.status(200).json({ message: 'Transaction removed' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDailyTransactions,
    bulkUploadTransactions,
    deleteTransaction
};
