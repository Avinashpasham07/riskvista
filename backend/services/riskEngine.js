// All inputs are expected to be INTEGER CENTS
// All outputs represent the final actual integer or decimal ratios

/**
 * Calculate Profit Margin Percentage
 * Formula: ((Revenue - COGS - OpEx) / Revenue) * 100
 */
const calculateProfitMargin = (revenueCents, cogsCents, opexCents) => {
    if (revenueCents === 0) return 0; // Prevent division by zero

    const totalExpenses = cogsCents + opexCents;
    const netIncome = revenueCents - totalExpenses;

    // Return as a percentage (e.g., 25.5 for 25.5%)
    return Number(((netIncome / revenueCents) * 100).toFixed(2));
};

/**
 * Calculate Monthly Burn Rate (Only if net income is negative)
 * If profitable, burn rate is 0.
 */
const calculateBurnRate = (revenueCents, cogsCents, opexCents) => {
    const totalExpenses = cogsCents + opexCents;
    const netIncome = revenueCents - totalExpenses;

    if (netIncome >= 0) return 0;

    // Return positive value of the burn in integer cents
    return Math.abs(netIncome);
};

/**
 * Calculate Runway in Months
 * Formula: Cash On Hand / Burn Rate
 */
const calculateRunway = (cashOnHandCents, burnRateCents) => {
    if (burnRateCents === 0) return 999; // Represents 'Infinite' Runway
    if (cashOnHandCents === 0) return 0;

    return Number((cashOnHandCents / burnRateCents).toFixed(1));
};

/**
 * Generate Unified Financial Risk Score (0-100)
 * 100 = Perfect Health, 0 = Imminent Collapse
 */
const calculateRiskScore = (profitMargin, runwayMonths, liabilitiesCents, cashOnHandCents) => {
    let score = 100;

    // 1. Runway Penalty (Most heavily weighted)
    if (runwayMonths < 3) score -= 65;
    else if (runwayMonths < 6) score -= 35;
    else if (runwayMonths < 12) score -= 20;
    else if (runwayMonths < 24) score -= 10;
    else if (runwayMonths === 999 && cashOnHandCents < 500000) score -= 15; // Low cash floor penalty ($5k)

    // 2. Profit / Burn Penalty
    if (profitMargin <= 50 && profitMargin > 30) score -= 5;
    else if (profitMargin <= 30 && profitMargin > 15) score -= 12;
    else if (profitMargin <= 15 && profitMargin >= 0) score -= 25;
    else if (profitMargin < 0 && profitMargin > -20) score -= 40;
    else if (profitMargin <= -20 && profitMargin > -50) score -= 60;
    else if (profitMargin <= -50) score -= 85;

    // 3. Debt-to-Cash Penalty (Leverage Risk)
    if (cashOnHandCents > 0) {
        const debtRatio = liabilitiesCents / cashOnHandCents;
        if (debtRatio > 2.0) score -= 30;
        else if (debtRatio > 1.2) score -= 20;
        else if (debtRatio > 0.8) score -= 10;
        else if (debtRatio > 0.4) score -= 5;
    } else if (liabilitiesCents > 0) {
        score -= 50; // High debt with zero cash
    }

    // 4. Ghost Town Penalty: If all inputs are zero, health is questionable
    if (cashOnHandCents === 0 && liabilitiesCents === 0 && profitMargin === 0) {
        score = 50; // Neutral/Unknown state
    }

    return Math.max(0, Math.min(100, score));
};

const calculateCollapseProbability = (runwayMonths, riskScore, liabilitiesCents, cashOnHandCents) => {
    let probability = 0;

    // Base probability: More aggressive inversion
    probability = (100 - riskScore) * 0.8;

    // Severity Multipliers
    if (runwayMonths <= 0) {
        probability = 100;
    } else if (runwayMonths < 3) {
        probability += 40;
    } else if (runwayMonths < 6) {
        probability += 20;
    }

    // Leverage Spike: High debt relative to cash increases collapse risk even if runway is 'long'
    if (cashOnHandCents > 0 && liabilitiesCents > cashOnHandCents * 1.5) {
        probability += 25;
    }

    // Liquidity Floor: If cash is less than $1000, risk is high regardless of burn
    if (cashOnHandCents < 100000 && runwayMonths > 0) {
        probability += 30;
    }

    // Safety Cap for High Prosperity
    if (runwayMonths > 36 && riskScore > 90) {
        probability = Math.max(0, probability - 50);
    }

    return Number(Math.min(100, probability).toFixed(2));
};

module.exports = {
    calculateProfitMargin,
    calculateBurnRate,
    calculateRunway,
    calculateRiskScore,
    calculateCollapseProbability
};
