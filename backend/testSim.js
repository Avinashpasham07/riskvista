const { runSimulation } = require('./services/simulationService');

// Dummy profitable baseline
const profitableBaseline = {
    revenueCents: 10500000,
    cogsCents: 3200000,
    opexCents: 4400000,
    cashOnHandCents: 45000000,
    liabilitiesCents: 12000000,
    calculatedMetrics: {
        runwayMonths: 999, // Profitable
        riskScore: 100,
        collapseProbability: 0
    }
};

console.log("--- Baseline: Profitable ---");
// Drop revenue by 100% -> Revenue = 0
// Burn should become 3.2M + 4.4M = 7.6M
// Runway = 45M / 7.6M = 5.9 months
console.log("Simulating -100% Revenue:");
const sim1 = runSimulation(profitableBaseline, -100, 0, 0);
console.log(sim1);

console.log("\n--- Baseline: Losing Money ---");
const losingBaseline = {
    revenueCents: 5000000,
    cogsCents: 3200000,
    opexCents: 4400000,
    cashOnHandCents: 45000000,
    liabilitiesCents: 12000000,
    calculatedMetrics: {
        runwayMonths: 17.3, // (45 / 2.6)
        riskScore: 80,
        collapseProbability: 20
    }
};

console.log("Simulating +100% Revenue:");
const sim2 = runSimulation(losingBaseline, 100, 0, 0);
console.log(sim2);
