const { runSimulation } = require('./services/simulationService');

const mockRecord = {
    revenueCents: 434200,
    cogsCents: 2424300,
    opexCents: 2423423399,
    cashOnHandCents: 2344200,
    liabilitiesCents: 2432400,
    calculatedMetrics: {
        runwayMonths: 0,
        riskScore: 5,
        collapseProbability: 100
    }
};

const result = runSimulation(mockRecord, 0, 100, 0);
console.log(JSON.stringify(result, null, 2));
