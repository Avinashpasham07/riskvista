const FinancialRecord = require('../models/FinancialRecord');
const { runSimulation } = require('../services/simulationService');

// @desc    Run What-If Simulation on most recent financial data
// @route   POST /api/simulate
// @access  Private
const simulateScenario = async (req, res, next) => {
    try {
        const {
            revenueChangePercent = 0,
            expenseChangePercent = 0,
            loanInjectionDollars = 0
        } = req.body;

        // 1. Enforce safety and data validation
        if (typeof revenueChangePercent !== 'number' || typeof expenseChangePercent !== 'number' || typeof loanInjectionDollars !== 'number') {
            res.status(400);
            throw new Error('Simulation adjustments must be valid numbers.');
        }

        // Convert the injected loan from decimal dollars to integer cents
        const loanInjectionCents = Math.round(Number(loanInjectionDollars) * 100);

        // 2. Fetch the most recent historical financial record for this tenant
        // Uses req.tenantId to strictly ensure Tenant Isolation
        const latestRecord = await FinancialRecord.findOne({ tenantId: req.tenantId }).sort({ periodDate: -1 });

        if (!latestRecord) {
            res.status(404);
            throw new Error('No baseline financial records found for this user to run a simulation on.');
        }

        // 3. Delegate business logic to the simulation engine
        const simulationResult = runSimulation(
            latestRecord,
            revenueChangePercent,
            expenseChangePercent,
            loanInjectionCents
        );

        // 4. Return results (Crucial: DO NOT persist to MongoDB)
        res.status(200).json({
            message: "Simulation successful. These results are ephemeral and have strictly NOT been written to the database.",
            baselinePeriodDate: latestRecord.periodDate,
            simulation: simulationResult
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    simulateScenario
};
