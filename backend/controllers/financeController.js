const FinancialRecord = require('../models/FinancialRecord');
const {
    calculateProfitMargin,
    calculateBurnRate,
    calculateRunway,
    calculateRiskScore,
    calculateCollapseProbability
} = require('../services/riskEngine');
const { generateLinearForecast } = require('../services/forecastEngine');

// @desc    Create a new financial record
// @route   POST /api/financial-records
// @access  Private
const createFinancialRecord = async (req, res, next) => {
    try {
        const {
            periodDate,
            revenue,
            cogs,
            opex,
            cashOnHand,
            liabilities,
        } = req.body;

        // 1. Convert incoming dollars to integer cents
        // Example: 10500.50 * 100 = 1050050
        const revenueCents = Math.round(Number(revenue) * 100);
        const cogsCents = Math.round(Number(cogs) * 100);
        const opexCents = Math.round(Number(opex) * 100);
        const cashOnHandCents = Math.round(Number(cashOnHand) * 100);
        const liabilitiesCents = Math.round(Number(liabilities) * 100);

        // 2. Validate all inputs are valid numbers after parsing
        if (
            isNaN(revenueCents) ||
            isNaN(cogsCents) ||
            isNaN(opexCents) ||
            isNaN(cashOnHandCents) ||
            isNaN(liabilitiesCents) ||
            !periodDate
        ) {
            res.status(400);
            throw new Error('Please provide all valid financial fields and a period date');
        }

        // 3. Ensure the periodDate is valid
        const dateObj = new Date(periodDate);
        if (isNaN(dateObj.getTime())) {
            res.status(400);
            throw new Error('Invalid periodDate format. Use YYYY-MM-DD');
        }

        // 4. RUN RISK ENGINE CALCULATIONS (Phase 7 & 8)
        const profitMargin = calculateProfitMargin(revenueCents, cogsCents, opexCents);
        const burnRateCents = calculateBurnRate(revenueCents, cogsCents, opexCents);
        const runwayMonths = calculateRunway(cashOnHandCents, burnRateCents);
        const riskScore = calculateRiskScore(profitMargin, runwayMonths, liabilitiesCents, cashOnHandCents);
        const collapseProbability = calculateCollapseProbability(runwayMonths, riskScore, liabilitiesCents, cashOnHandCents);

        // 5. RUN FORECAST ENGINE (Phase 9)
        const forecasts = generateLinearForecast(revenueCents, cogsCents, opexCents, cashOnHandCents, liabilitiesCents, 6);

        // 6. UPSERT Record: Update if exists for this tenant/date, else create
        // This fulfills the "automatically update in previous data" requirement.
        const record = await FinancialRecord.findOneAndUpdate(
            { tenantId: req.tenantId, periodDate: dateObj },
            {
                revenueCents,
                cogsCents,
                opexCents,
                cashOnHandCents,
                liabilitiesCents,
                calculatedMetrics: {
                    runwayMonths,
                    riskScore,
                    collapseProbability
                },
                forecasts: forecasts
            },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(201).json(record);

    } catch (error) {
        next(error);
    }
};

// @desc    Wipe all financial records for testing
// @route   DELETE /api/financial-records/reset
// @access  Private
const wipeFinancialRecords = async (req, res, next) => {
    try {
        await FinancialRecord.deleteMany({ tenantId: req.tenantId });
        res.status(200).json({ message: 'All financial data wiped for this tenant. Fresh start.' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createFinancialRecord,
    wipeFinancialRecords
};
