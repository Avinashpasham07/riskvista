const mongoose = require('mongoose');

const dailyTransactionSchema = new mongoose.Schema(
    {
        tenantId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            index: true,
        },
        date: {
            type: Date,
            required: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            enum: ['Income', 'COGS', 'Opex', 'Fixed'],
        },
        amountCents: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient querying by date range per tenant
dailyTransactionSchema.index({ tenantId: 1, date: 1 });

const DailyTransaction = mongoose.model('DailyTransaction', dailyTransactionSchema);

module.exports = DailyTransaction;
