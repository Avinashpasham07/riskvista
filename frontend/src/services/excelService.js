import * as XLSX from 'xlsx';

/**
 * Excel/CSV Parsing Service
 * Specifically designed to handle daily transaction ledgers
 */

export const parseLedgerFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                // Convert to JSON
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                if (jsonData.length === 0) {
                    throw new Error("The file appears to be empty.");
                }

                const normalize = (str) => str?.toString().toLowerCase().replace(/[^a-z0-9]/g, '') || '';

                // Expected columns and their common aliases
                const formatMapping = {
                    date: ['date', 'day', 'timestamp', 'period'],
                    description: ['description', 'desc', 'memo', 'details', 'particulars'],
                    category: ['category', 'type', 'class', 'group'],
                    amount: ['amount', 'value', 'price', 'income', 'expense', 'cost']
                };

                const categoryMapping = {
                    income: 'Income',
                    revenue: 'Income',
                    sales: 'Income',
                    cogs: 'COGS',
                    costofgoods: 'COGS',
                    opex: 'Opex',
                    expense: 'Opex',
                    overhead: 'Opex',
                    fixed: 'Fixed',
                    rent: 'Fixed',
                    salary: 'Fixed'
                };

                const headers = Object.keys(jsonData[0]);

                const processed = jsonData.map((row, idx) => {
                    const entry = {};

                    Object.keys(formatMapping).forEach(field => {
                        const headerKey = headers.find(h =>
                            formatMapping[field].some(alias => normalize(h).includes(normalize(alias)))
                        );

                        let val = row[headerKey];

                        if (field === 'date') {
                            // Handle Excel date numbers
                            if (typeof val === 'number') {
                                const date = XLSX.utils.format_cell({ t: 'n', v: val, z: 'yyyy-mm-dd' });
                                entry[field] = new Date(val * 86400000 - 2209161600000).toISOString().split('T')[0];
                            } else {
                                entry[field] = val;
                            }
                        } else if (field === 'category') {
                            const normVal = normalize(val);
                            entry[field] = categoryMapping[normVal] || 'Opex';
                        } else if (field === 'amount') {
                            entry[field] = parseFloat(val?.toString().replace(/[$,]/g, '') || 0);
                        } else {
                            entry[field] = val || 'No description';
                        }
                    });

                    return entry;
                });

                resolve(processed);
            } catch (err) {
                reject(err);
            }
        };

        reader.onerror = () => reject(new Error("Failed to read file."));
        reader.readAsArrayBuffer(file);
    });
};

/**
 * Export Analysis to Excel
 */
export const exportToExcel = (data, fileName = "Analysis_Report.xlsx") => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Financial_Analysis");
    XLSX.writeFile(wb, fileName);
};
