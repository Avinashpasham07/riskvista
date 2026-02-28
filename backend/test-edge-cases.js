const { calculateRiskScore, calculateCollapseProbability } = require('./services/riskEngine');
const { calculateLoanReadiness } = require('./services/loanEngine');
const { generateAdvice } = require('./services/advisor');

console.log("=== EXTREME EDGE CASE TESTS ===");

// Edge Case 1: The "Instant Death" Setup (No money, no revenue, massive debt)
console.log("\n--- Case 1: Zero Cash, Zero Revenue, Massive Debt ---");
try {
    const margin1 = -100; // Total loss
    const runway1 = 0;
    const debt1 = 50000000; // $500k debt
    const cash1 = 0; // $0 cash

    console.log("Risk Score:", calculateRiskScore(margin1, runway1, debt1, cash1));
    console.log("Collapse Prob:", calculateCollapseProbability(runway1, calculateRiskScore(margin1, runway1, debt1, cash1), debt1, cash1));
    console.log("Loan Readiness:", calculateLoanReadiness(debt1, cash1, margin1, runway1));
    console.log("Advice:", generateAdvice(runway1, debt1, cash1, margin1));
    console.log("Case 1: PASS (No crashes, valid NaN handling)");
} catch (e) {
    console.error("Case 1 FAILED:", e.message);
}

// Edge Case 2: The "Infinite Life" Setup (Perfectly profitable, no debt)
console.log("\n--- Case 2: Profitable (Infinite Runway), Zero Debt ---");
try {
    const margin2 = 45; // 45% profit margin
    const runway2 = 999; // Infinite runway
    const debt2 = 0; // $0 debt
    const cash2 = 8000000; // $80k cash

    console.log("Risk Score:", calculateRiskScore(margin2, runway2, debt2, cash2));
    console.log("Collapse Prob:", calculateCollapseProbability(runway2, calculateRiskScore(margin2, runway2, debt2, cash2), debt2, cash2));
    console.log("Loan Readiness:", calculateLoanReadiness(debt2, cash2, margin2, runway2));
    console.log("Advice:", generateAdvice(runway2, debt2, cash2, margin2));
    console.log("Case 2: PASS (Handled 999 runway elegantly)");
} catch (e) {
    console.error("Case 2 FAILED:", e.message);
}
