/**
 * Loan Readiness Score
 * Calculates a 0-100 score indicating how likely a startup is to be approved for a loan.
 */

/**
 * Calculate the overall loan readiness score
 * @param {Number} debtToCashRatio - Ratio of liabilities to cash
 * @param {Number} profitMargin - Profit margin percentage
 * @param {Number} runwayMonths - Runway in months
 * @returns {Object} Loan readiness data including score, tier, and blockers
 */
const calculateLoanReadiness = (liabilitiesCents, cashOnHandCents, profitMargin, runwayMonths) => {
    let loanScore = 100;
    const blockers = [];

    // 1. Debt-to-Cash Ratio Score Penalty
    let debtToCashRatio = 0;
    if (cashOnHandCents > 0) {
        debtToCashRatio = liabilitiesCents / cashOnHandCents;
        if (debtToCashRatio > 2.0) {
            loanScore -= 40;
            blockers.push("Extreme debt-to-cash ratio");
        } else if (debtToCashRatio > 1.0) {
            loanScore -= 20;
            blockers.push("High debt burden compared to cash reserves");
        }
    } else if (liabilitiesCents > 0) {
        loanScore -= 50;
        blockers.push("Liabilities exist with zero cash on hand");
    }

    // 2. Profit Margin Score Penalty
    if (profitMargin < -20) {
        loanScore -= 30;
        blockers.push("Severe negative profit margin (high burn)");
    } else if (profitMargin < 0) {
        loanScore -= 10;
        blockers.push("Currently unprofitable");
    } else if (profitMargin >= 20) {
        loanScore = Math.min(100, loanScore + 10); // Bonus for high profitability
    }

    // 3. Runway Score Penalty
    if (runwayMonths < 6) {
        loanScore -= 40;
        blockers.push("Runway is critically short (< 6 months)");
    } else if (runwayMonths < 12) {
        loanScore -= 15;
        blockers.push("Runway is under 12 months");
    }

    // Floor at 0
    loanScore = Math.max(0, loanScore);

    // Determine Readiness Tier
    let readinessTier = 'Unlikely';
    if (loanScore >= 80) readinessTier = 'Highly Likely';
    else if (loanScore >= 50) readinessTier = 'Moderate';
    else if (loanScore >= 25) readinessTier = 'Risky';

    return {
        loanScore,
        readinessTier,
        blockers
    };
};

module.exports = {
    calculateLoanReadiness
};
