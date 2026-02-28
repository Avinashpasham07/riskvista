const { runSimulation } = require('./services/simulationService');

const userDB = {
    "revenueCents": 10000000,
    "cogsCents": 1000000,
    "opexCents": 3000000,
    "cashOnHandCents": 50000000,
    "liabilitiesCents": 1999999,
    "calculatedMetrics": {
        "runwayMonths": 999,
        "riskScore": 100,
        "collapseProbability": 0
    }
};

console.log("--- Baseline Data ---");
console.log("- Revenue: -100%");
console.log(JSON.stringify(runSimulation(userDB, -100, 0, 0), null, 2));

console.log("\n- Expense: +200%");
console.log(JSON.stringify(runSimulation(userDB, 0, 200, 0), null, 2));
