const {
    calculateProfitMargin,
    calculateBurnRate,
    calculateRunway,
    calculateRiskScore,
    calculateCollapseProbability
} = require('./riskEngine');
const { generateLinearForecast } = require('./forecastEngine');

/**
 * What-If Simulation Engine
 * Applies hypothetical changes to a baseline financial record and strictly returns 
 * calculations in-memory without database writes.
 * 
 * @param {Object} baselineRecord - The latest financial record from the DB
 * @param {Number} revenueChangePercent - E.g., 10 for +10% revenue
 * @param {Number} expenseChangePercent - E.g., -5 for -5% expenses
 * @param {Number} loanInjectionCents - E.g., 5000000 cents for a $50k injection
 */
const runSimulation = (baselineRecord, revenueChangePercent = 0, expenseChangePercent = 0, loanInjectionCents = 0) => {
    // 1. Extract base integer cents (Clone to ensure no accidental mutations)
    let simRevenueCents = baselineRecord.revenueCents || 0;
    let simCogsCents = baselineRecord.cogsCents || 0;
    let simOpexCents = baselineRecord.opexCents || 0;
    let simCashOnHandCents = baselineRecord.cashOnHandCents || 0;
    let simLiabilitiesCents = baselineRecord.liabilitiesCents || 0;

    // 2. Apply hypothetical adjustments
    if (revenueChangePercent !== 0) {
        const factor = 1 + (revenueChangePercent / 100);
        simRevenueCents = Math.round(simRevenueCents * factor);
    }

    if (expenseChangePercent !== 0) {
        const factor = 1 + (expenseChangePercent / 100);
        simCogsCents = Math.round(simCogsCents * factor);
        simOpexCents = Math.round(simOpexCents * factor);
    }

    if (loanInjectionCents > 0) {
        simCashOnHandCents += loanInjectionCents;
        simLiabilitiesCents += loanInjectionCents; // A loan adds cash but also adds debt
    }

    // Floor values at 0 to prevent mathematically impossible scenarios
    simRevenueCents = Math.max(0, simRevenueCents);
    simCogsCents = Math.max(0, simCogsCents);
    simOpexCents = Math.max(0, simOpexCents);
    simCashOnHandCents = Math.max(0, simCashOnHandCents);
    simLiabilitiesCents = Math.max(0, simLiabilitiesCents);

    // 3. Recalculate Risk Engine
    const profitMargin = calculateProfitMargin(simRevenueCents, simCogsCents, simOpexCents);
    const burnRateCents = calculateBurnRate(simRevenueCents, simCogsCents, simOpexCents);
    const runwayMonths = calculateRunway(simCashOnHandCents, burnRateCents);
    const riskScore = calculateRiskScore(profitMargin, runwayMonths, simLiabilitiesCents, simCashOnHandCents);
    const collapseProbability = calculateCollapseProbability(runwayMonths, riskScore, simLiabilitiesCents, simCashOnHandCents);

    // 4. Recalculate Forecast
    const forecasts = generateLinearForecast(simRevenueCents, simCogsCents, simOpexCents, simCashOnHandCents, simLiabilitiesCents, 6);

    // Calculate Raw Cash Flows (To ensure the UI has absolute numbers that always move)
    const baselineNetIncomeCents = (baselineRecord.revenueCents || 0) - (baselineRecord.cogsCents || 0) - (baselineRecord.opexCents || 0);
    const simNetIncomeCents = simRevenueCents - simCogsCents - simOpexCents;
    const netIncomeDeltaDollars = (simNetIncomeCents - baselineNetIncomeCents) / 100;

    // 5. Return the ephemeral, recalculated payload
    return {
        simulatedInputs: {
            revenueCents: simRevenueCents,
            cogsCents: simCogsCents,
            opexCents: simOpexCents,
            cashOnHandCents: simCashOnHandCents,
            liabilitiesCents: simLiabilitiesCents,
        },
        calculatedMetrics: {
            profitMargin,
            burnRateCents,
            runwayMonths,
            riskScore,
            collapseProbability
        },
        postSimulationRunway: runwayMonths,
        postSimulationRisk: riskScore,
        runwayDelta: Number((runwayMonths - (baselineRecord.calculatedMetrics?.runwayMonths || 0)).toFixed(1)),
        riskDelta: Math.round(riskScore - (baselineRecord.calculatedMetrics?.riskScore || 0)),
        simNetIncomeDollars: simNetIncomeCents / 100,
        netIncomeDeltaDollars: netIncomeDeltaDollars,
        forecasts
    };
};

module.exports = {
    runSimulation
};
