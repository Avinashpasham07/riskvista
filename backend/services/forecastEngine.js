const {
    calculateProfitMargin,
    calculateBurnRate,
    calculateRunway,
    calculateRiskScore
} = require('./riskEngine');

/**
 * Advanced Dynamic Financial Engine (v2.1)
 * Projects 6 months into the future using compounding growth and simulated volatility.
 */
const generateLinearForecast = (currentRevenueCents, currentCogsCents, currentOpexCents, currentCashOnHandCents, currentLiabilitiesCents, monthsToProject = 6) => {
    const forecast = [];

    let baseCash = currentCashOnHandCents;
    let bestCash = currentCashOnHandCents;
    let worstCash = currentCashOnHandCents;

    // Simulation Constants
    const BASE_GROWTH_RATE = 0.03; // 3% MoM Growth
    const VOLATILITY_FACTOR = 0.015; // 1.5% Random Variance

    for (let month = 1; month <= monthsToProject; month++) {
        // 1. Calculate Growth Multipliers (Compounding)
        const growthMultiplier = Math.pow(1 + BASE_GROWTH_RATE, month - 1);

        // 2. Introduce Simulated Volatility (Pseudo-AI Variation)
        // This prevents the "same data for all" repetitive look
        const variance = 1 + (Math.sin(month * 1.5) * VOLATILITY_FACTOR);

        // Baseline Trajectory
        const baseRevenue = Math.round(currentRevenueCents * growthMultiplier * variance);
        const baseExpenses = Math.round((currentCogsCents + currentOpexCents) * (1 + (BASE_GROWTH_RATE * 0.5 * (month - 1))) * variance);
        const baseNet = baseRevenue - baseExpenses;
        baseCash = Math.max(0, baseCash + baseNet);

        // Best Case (Higher Growth, Lower Expense Scaling)
        const bestRevenue = Math.round(currentRevenueCents * Math.pow(1.05, month) * variance);
        const bestExpenses = Math.round((currentCogsCents + currentOpexCents) * Math.pow(1.01, month) * variance);
        const bestNet = bestRevenue - bestExpenses;
        bestCash = Math.max(0, bestCash + bestNet);

        // Worst Case (Stagnant Growth, Higher Expense Scaling)
        const worstRevenue = Math.round(currentRevenueCents * Math.pow(0.98, month) * variance);
        const worstExpenses = Math.round((currentCogsCents + currentOpexCents) * Math.pow(1.04, month) * variance);
        const worstNet = worstRevenue - worstExpenses;
        worstCash = Math.max(0, worstCash + worstNet);

        // Calculate Projected Metrics for the Baseline Scenario
        const projProfitMargin = calculateProfitMargin(baseRevenue, Math.round(currentCogsCents * growthMultiplier), Math.round(currentOpexCents * growthMultiplier));
        const projBurnRate = calculateBurnRate(baseRevenue, Math.round(currentCogsCents * growthMultiplier), Math.round(currentOpexCents * growthMultiplier));
        const projRunway = calculateRunway(baseCash, projBurnRate);
        const projRiskScore = calculateRiskScore(projProfitMargin, projRunway, currentLiabilitiesCents, baseCash);

        forecast.push({
            monthIndex: month,
            projectedCashBaseCents: Math.round(baseCash),
            projectedCashBestCents: Math.round(bestCash),
            projectedCashWorstCents: Math.round(worstCash),
            projectedRevenueCents: Math.round(baseRevenue),
            projectedExpensesCents: Math.round(baseExpenses),
            projectedNetIncomeCents: Math.round(baseNet),
            projectedRiskScore: Math.round(projRiskScore)
        });
    }

    return forecast;
};

module.exports = {
    generateLinearForecast
};
