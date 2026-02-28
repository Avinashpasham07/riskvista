const {
    calculateProfitMargin,
    calculateBurnRate,
    calculateRunway,
    calculateRiskScore,
    calculateCollapseProbability
} = require('../services/riskEngine');

describe('Risk Engine Calculation Tests (Phase 7 & 8)', () => {

    // ... previous Phase 7 tests omitted for brevity, but exist in memory

    describe('calculateCollapseProbability (Phase 8)', () => {

        it('should be 100% if runway is 0 or less', () => {
            // Risk Score: 50
            const prob = calculateCollapseProbability(0, 50, 0, 0);
            expect(prob).toBe(100);
        });

        it('should heavily spike probability if extremely low runway is paired with high debt', () => {
            // Score: 30, Runway: 1 month, Liabilities: $5M, Cash: $1M
            // Base Prob = 100 - 30 = 70%
            // Severity (+30) applied due to < 2mo runway + debt > cash
            const prob = calculateCollapseProbability(1, 30, 5000000, 1000000);
            expect(prob).toBe(100); // Maxes out at 100
        });

        it('should mildly spike probability if runway is just under 4 months', () => {
            // Score: 80, Runway: 3 months, No Debt
            // Base Prob = 100 - 80 = 20%
            // Severity (+15) applied due to < 4mo runway
            const prob = calculateCollapseProbability(3, 80, 0, 5000000);
            expect(prob).toBe(35);
        });

        it('should drastically reduce probability if the company is profitable with infinite runway', () => {
            // Score: 95, Runway: 999 (Infinity), No Debt
            // Base Prob = 100 - 95 = 5%
            // Safety Modifier (-40) applied due to > 24mo runway
            const prob = calculateCollapseProbability(999, 95, 0, 10000000);
            expect(prob).toBe(0); // Minimum bound is 0
        });
    });

});
