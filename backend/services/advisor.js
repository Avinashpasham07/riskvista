/**
 * AI Advisor (Rule-Based)
 * Generates automated financial advice based on core metrics.
 */

/**
 * Generate advice based on financial state
 * @param {Number} runwayMonths 
 * @param {Number} liabilitiesCents 
 * @param {Number} cashOnHandCents 
 * @param {Number} profitMargin 
 * @returns {Array} List of advice objects
 */
const generateAdvice = (runwayMonths, liabilitiesCents, cashOnHandCents, profitMargin) => {
    const adviceList = [];

    // IF runway < 3 months: return urgent cost reduction advice
    if (runwayMonths < 3) {
        adviceList.push({
            urgency: 'High',
            category: 'Survival',
            message: 'URGENT: Runway is under 3 months. Immediate cost reduction required. Halt all non-essential marketing and hiring. Focus strictly on closing near-term revenue.'
        });
    }

    // IF liabilities > cash: return debt restructuring advice
    if (liabilitiesCents > cashOnHandCents) {
        adviceList.push({
            urgency: 'High',
            category: 'Debt',
            message: 'WARNING: Your immediate liabilities exceed your cash on hand. Look into debt restructuring, extending payment terms with vendors, or bridging capital immediately.'
        });
    }

    // IF strong margin but low cash: return liquidity improvement advice
    if (profitMargin >= 15 && cashOnHandCents < 5000000) { // arbitrary threshold for "low cash" = $50k
        adviceList.push({
            urgency: 'Medium',
            category: 'Liquidity',
            message: 'Your profit margins are strong, but cash reserves are relatively low. Consider offering upfront annual discounts to customers to pull forward cash flow, or secure a revolving credit line.'
        });
    }

    // IF burn is high but runway is safeish
    if (profitMargin < -30 && runwayMonths >= 6) {
        adviceList.push({
            urgency: 'Medium',
            category: 'Efficiency',
            message: 'You have a comfortable cash buffer, but your burn rate is aggressive. Optimize your customer acquisition costs (CAC) and evaluate software bloat to improve capital efficiency.'
        });
    }

    if (adviceList.length === 0) {
        adviceList.push({
            urgency: 'Low',
            category: 'Growth',
            message: 'Strong financial health detected. Maintain current lean operations and consider allocating excess cash into high-ROI growth channels.'
        });
    }

    return adviceList;
};

module.exports = {
    generateAdvice
};
