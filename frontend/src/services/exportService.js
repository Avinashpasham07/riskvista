/**
 * Export Service for RISKVISTA
 * Handles spreadsheet-compatible exports (CSV).
 */

export const exportToExcel = (forecasts, modifiers) => {
    try {
        // Headers for the financial model
        const headers = [
            "Month Horizon",
            "Baseline Revenue ($)",
            "Simulated Revenue ($)",
            "Baseline Expenses ($)",
            "Simulated Expenses ($)",
            "Baseline Net P&L ($)",
            "Simulated Net P&L ($)",
            "Baseline Cash ($)",
            "Simulated Cash ($)",
            "Health Index Score (0-100)"
        ];

        const formatC = (cents) => (cents / 100).toFixed(2);

        // Convert the simulation data into rows
        const rows = forecasts.map(f => [
            `Month ${f.monthIndex}`,
            formatC(f.revenueCents), // Assuming original revenue is stored or we can calculate back
            formatC(f.projectedRevenueCents),
            formatC(f.expensesCents || (f.projectedExpensesCents / (modifiers.exp / 100))),
            formatC(f.projectedExpensesCents),
            formatC(f.netIncomeCents),
            formatC(f.projectedNetIncomeCents),
            formatC(f.cashOnHandCents),
            formatC(f.projectedCashBaseCents),
            f.projectedRiskScore
        ]);

        // Add metadata/simulation parameters at the top
        const metaData = [
            ["SIMULATION PARAMETERS"],
            ["Revenue Scaling", `${modifiers.rev}%`],
            ["Expense Scaling", `${modifiers.exp}%`],
            ["Capital Injection", `$${modifiers.funding}`],
            ["Generated At", new Date().toISOString()],
            [], // Spacer
            headers
        ];

        // Join everything into a CSV string
        const csvContent = metaData
            .concat(rows)
            .map(e => e.join(","))
            .join("\n");

        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `RISKVISTA_Projection_Model_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (error) {
        console.error("CSV Export Failed:", error);
        alert("Failed to export financial model. See console for details.");
    }
};
