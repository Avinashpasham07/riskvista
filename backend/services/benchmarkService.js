/**
 * Industry Benchmark Logic
 * Hardcoded industry averages for comparison.
 */

const INDUSTRY_MEDIANS = {
    'SaaS': { profitMargin: 20 },
    'Retail': { profitMargin: 5 },
    'Restaurant': { profitMargin: 10 },
    'Default': { profitMargin: 15 } // Fallback
};

/**
 * Compare user profit margin vs industry median
 * @param {Number} userMargin - The user's calculated profit margin (%)
 * @param {String} industryCategory - The user's industry
 * @returns {Object} Benchmark comparison result
 */
const getIndustryBenchmark = (userMargin, industryCategory) => {
    const category = INDUSTRY_MEDIANS[industryCategory] ? industryCategory : 'Default';
    const industryMedianMargin = INDUSTRY_MEDIANS[category].profitMargin;

    // Calculate difference (delta)
    const benchmarkDeltaPercent = Number((userMargin - industryMedianMargin).toFixed(2));

    let status = 'Equal';
    if (benchmarkDeltaPercent > 0) status = 'Above';
    else if (benchmarkDeltaPercent < 0) status = 'Below';

    return {
        industry: category,
        industryMedianMargin,
        userMargin,
        benchmarkDeltaPercent,
        status
    };
};

module.exports = {
    getIndustryBenchmark
};
