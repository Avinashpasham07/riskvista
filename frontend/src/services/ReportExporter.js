export const generateAuditReport = (data) => {
    const { coreMetrics, loanReadiness, aiAdvisor, benchmark } = data;

    const reportHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: 'Inter', system-ui, sans-serif; padding: 40px; color: #18181b; line-height: 1.5; }
                .header { border-bottom: 4px solid #18181b; padding-bottom: 20px; margin-bottom: 40px; display: flex; justify-content: space-between; align-items: flex-end; }
                .logo { font-weight: 900; font-size: 24px; text-transform: uppercase; letter-spacing: -1px; }
                .title { font-size: 32px; font-weight: 900; tracking: tight; margin: 0; }
                .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 40px; }
                .card { border: 1px solid #e4e4e7; padding: 24px; rounded: 16px; background: #fafafa; }
                .label { font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; color: #71717a; margin-bottom: 8px; }
                .value { font-size: 36px; font-weight: 900; }
                .directive { border-left: 4px solid #18181b; padding: 15px; background: #f4f4f5; margin-bottom: 15px; }
                .directive-title { font-weight: 900; font-size: 14px; text-transform: uppercase; margin-bottom: 5px; }
                .directive-msg { font-size: 14px; font-weight: 500; }
                .footer { margin-top: 60px; font-size: 10px; font-weight: 700; color: #a1a1aa; text-align: center; border-top: 1px solid #e4e4e7; pt: 20px; text-transform: uppercase; letter-spacing: 0.1em; }
            </style>
        </head>
        <body>
            <div class="header">
                <div>
                    <div class="logo">RiskVista Labs</div>
                    <h1 class="title">Investor Solvency Audit</h1>
                </div>
                <div style="text-align: right;">
                    <div class="label">Report ID</div>
                    <div style="font-weight: 900; font-size: 12px;">RV-AUDIT-${Math.floor(Date.now() / 1000)}</div>
                </div>
            </div>

            <div class="grid">
                <div class="card">
                    <div class="label">Risk Index Score</div>
                    <div class="value">${coreMetrics.riskScore}/100</div>
                </div>
                <div class="card">
                    <div class="label">Liquidity Runway</div>
                    <div class="value">${coreMetrics.runwayMonths >= 99 ? 'Safe' : coreMetrics.runwayMonths.toFixed(1) + ' Months'}</div>
                </div>
                <div class="card">
                    <div class="label">Collapse Probability</div>
                    <div class="value">${coreMetrics.collapseProbability}%</div>
                </div>
                <div class="card">
                    <div class="label">Loan Readiness</div>
                    <div class="value">${loanReadiness.readinessTier}</div>
                </div>
            </div>

            <h2 style="font-weight: 900; text-transform: uppercase; font-size: 18px; margin-bottom: 20px;">AI Survival Directives</h2>
            ${aiAdvisor.map(a => `
                <div class="directive">
                    <div class="directive-title">${a.category} (${a.urgency} Priority)</div>
                    <div class="directive-msg">${a.message}</div>
                </div>
            `).join('')}

            <div class="footer">
                RiskVista Intelligence Protocol | Institutional Grade Financial Monitoring | © 2026
            </div>

            <script>
                window.onload = () => { setTimeout(() => { window.print(); }, 500); };
            </script>
        </body>
        </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(reportHtml);
    printWindow.document.close();
};
