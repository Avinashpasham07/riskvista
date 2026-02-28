/**
 * CSV Parser for RISKVISTA
 * Handles automatic mapping of financial file headers to internal state.
 */

export const parseFinancialCSV = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const text = e.target.result;
                const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
                if (lines.length < 2) throw new Error("File must contain at least a header row and one data row.");

                const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

                const headers = lines[0].split(",").map(h => normalize(h));
                const firstDataRow = lines[1].split(",").map(v => v.trim());

                // Advanced Mapping Logic with Normalization
                const mapping = {
                    periodDate: ["date", "period", "month", "time", "timestamp"],
                    revenue: ["revenue", "sales", "income", "grossrevenue", "turnover", "inflow"],
                    cogs: ["cogs", "costofgoods", "directcosts", "inventorycost", "costofsales"],
                    opex: ["opex", "expenses", "operatingexpenses", "burn", "overhead", "operatingcosts"],
                    cashOnHand: ["cash", "liquidity", "bankbalance", "cashonhand", "balancesheet", "currentcash"],
                    liabilities: ["liabilities", "debt", "totaldebt", "accountspayable", "loans", "totaloutstanding"]
                };

                const result = {};

                Object.keys(mapping).forEach(field => {
                    const index = headers.findIndex(h =>
                        mapping[field].some(alias => h.includes(alias) || alias.includes(h))
                    );

                    if (index !== -1) {
                        const val = firstDataRow[index];
                        if (field === 'periodDate') {
                            result[field] = val;
                        } else {
                            // Extract numeric value (handle parentheses for negative, remove symbols)
                            let cleanVal = val.replace(/[$,]/g, '');
                            if (cleanVal.startsWith('(') && cleanVal.endsWith(')')) {
                                cleanVal = '-' + cleanVal.slice(1, -1);
                            }
                            result[field] = cleanVal;
                        }
                    }
                });

                resolve(result);
            } catch (err) {
                reject(err);
            }
        };

        reader.onerror = () => reject(new Error("Failed to read file."));
        reader.readAsText(file);
    });
};
