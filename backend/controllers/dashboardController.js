const FinancialRecord = require('../models/FinancialRecord');
const User = require('../models/User');
const { getIndustryBenchmark } = require('../services/benchmarkService');
const { calculateLoanReadiness } = require('../services/loanEngine');
const { generateAdvice } = require('../services/advisor');

// @desc    Get aggregate dashboard intelligence
// @route   GET /api/dashboard
// @access  Private
const getDashboardData = async (req, res, next) => {
    try {
        const user = await User.findById(req.tenantId).select('industryCategory');
        const latestRecord = await FinancialRecord.findOne({ tenantId: req.tenantId }).sort({ periodDate: -1 });

        if (!latestRecord) {
            res.status(404);
            throw new Error('No financial records found. Please ingest data first.');
        }

        const {
            revenueCents,
            cogsCents,
            opexCents,
            cashOnHandCents,
            liabilitiesCents
        } = latestRecord;

        // --- REAL-TIME RECALCULATION (ensures logic changes apply to old data) ---
        const {
            calculateProfitMargin,
            calculateBurnRate,
            calculateRunway,
            calculateRiskScore,
            calculateCollapseProbability
        } = require('../services/riskEngine');

        const profitMargin = calculateProfitMargin(revenueCents, cogsCents, opexCents);
        const burnRateCents = calculateBurnRate(revenueCents, cogsCents, opexCents);
        const runwayMonths = calculateRunway(cashOnHandCents, burnRateCents);
        const riskScore = calculateRiskScore(profitMargin, runwayMonths, liabilitiesCents, cashOnHandCents);
        const collapseProbability = calculateCollapseProbability(runwayMonths, riskScore, liabilitiesCents, cashOnHandCents);

        const metrics = {
            runwayMonths,
            riskScore,
            collapseProbability,
            profitMargin // Include margin for benchmark
        };

        const benchmarkData = getIndustryBenchmark(profitMargin, user.industryCategory);
        const loanData = calculateLoanReadiness(liabilitiesCents, cashOnHandCents, profitMargin, runwayMonths);
        const advisorFeedback = generateAdvice(runwayMonths, liabilitiesCents, cashOnHandCents, profitMargin);

        const { generateLinearForecast } = require('../services/forecastEngine');
        const detailedForecasts = generateLinearForecast(revenueCents, cogsCents, opexCents, cashOnHandCents, liabilitiesCents, 6);

        res.status(200).json({
            periodDate: latestRecord.periodDate,
            coreMetrics: metrics,
            financialMetrics: {
                revenueCents,
                cogsCents,
                opexCents,
                cashOnHandCents,
                liabilitiesCents
            },
            forecasts: detailedForecasts,
            benchmark: benchmarkData,
            loanReadiness: loanData,
            aiAdvisor: advisorFeedback
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboardData
};
