import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Report Service for RISKVISTA
 * Generates professional financial dossiers for investors.
 */
export const generateInvestorDossier = (data, simulatedForecasts, modifiers, radarData) => {
    try {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const primaryColor = [24, 24, 27]; // Dark Zinc
        const brandColor = [59, 130, 246]; // Blue-500
        const accentColor = [16, 185, 129]; // Emerald-500

        // --- HEADER SETTINGS ---
        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.setTextColor(...primaryColor);
        doc.text("RISKVISTA", 20, 25);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(150, 150, 150);
        doc.text("STRATEGIC FINANCIAL INTELLIGENCE REPORT", 20, 32);

        // --- TOP RIGHT INFO ---
        doc.setFontSize(8);
        doc.text(`DATE: ${new Date().toLocaleDateString()}`, 150, 25);
        doc.text(`VERSION: 2.2 INTELLIGENCE-PLUS`, 150, 29);

        // --- DIVIDER ---
        doc.setDrawColor(240, 240, 240);
        doc.line(20, 40, 190, 40);

        // --- EXECUTIVE SUMMARY SECTION ---
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...primaryColor);
        doc.text("EXECUTIVE SUMMARY", 20, 50);

        const latest = simulatedForecasts[simulatedForecasts.length - 1];
        const formatting = (cents) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format((cents || 0) / 100);

        const summaryData = [
            ["Current Starting Cash", formatting(data?.financialMetrics?.cashOnHandCents || data?.cashOnHandCents)],
            ["VC Funding Injection", formatting(modifiers.funding * 100)],
            ["Projected 6-Month Runway", formatting(latest?.projectedCashBaseCents)],
            ["Revenue Growth Target", `${modifiers.rev}%`],
            ["OpEx Efficiency Target", `${modifiers.exp}%`],
            ["Holistic Health Score", `${latest?.projectedRiskScore || 0}/100`]
        ];

        autoTable(doc, {
            startY: 55,
            margin: { left: 20 },
            head: [['Metric', 'Simulation Target']],
            body: summaryData,
            theme: 'striped',
            headStyles: { fillColor: primaryColor, textColor: 255 },
            styles: { fontSize: 9, cellPadding: 4 }
        });

        // --- SURVIVAL RADAR SECTION ---
        let finalY = doc.lastAutoTable.finalY + 15;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("SURVIVAL RADAR INTELLIGENCE", 20, finalY);

        if (radarData && radarData.length) {
            const radarTable = radarData.map(d => [d.subject, `${d.A.toFixed(0)}%`]);
            autoTable(doc, {
                startY: finalY + 5,
                margin: { left: 20 },
                head: [['Health Dimension', 'Index Score']],
                body: radarTable,
                theme: 'plain',
                headStyles: { fillColor: [100, 100, 100], textColor: 255 },
                styles: { fontSize: 8, cellPadding: 2 }
            });
            finalY = doc.lastAutoTable.finalY + 15;
        } else {
            finalY += 10;
        }

        // --- FINANCIAL PROJECTION TABLE ---
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("6-MONTH FORWARD PROJECTIONS", 20, finalY);

        const tableData = simulatedForecasts.map(f => [
            `Month ${f.monthIndex}`,
            formatting(f.projectedRevenueCents),
            formatting(f.projectedExpensesCents),
            formatting(f.projectedNetIncomeCents),
            formatting(f.projectedCashBaseCents)
        ]);

        autoTable(doc, {
            startY: finalY + 5,
            margin: { left: 20 },
            head: [['Horizon', 'Revenue', 'Expenses', 'Net Income', 'Projected Cash']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: primaryColor, textColor: 255 },
            columnStyles: {
                3: { fontStyle: 'bold' }, // Net Income bold
                4: { fontStyle: 'bold', textColor: brandColor } // Cash bold
            },
            styles: { fontSize: 8, cellPadding: 3 }
        });

        // --- RISK ADVISORY ---
        const riskY = doc.lastAutoTable.finalY + 15;
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("STRATEGIC ADVISORY & RISK ASSESSMENT", 20, riskY);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);

        const fundingNote = modifiers.funding > 0
            ? `With a ${formatting(modifiers.funding * 100)} capital injection, the runway extension is quantified in the Month 6 delta. `
            : "This projection assumes zero external capital injection. ";

        const riskNote = `${fundingNote}Based on ${modifiers.rev}% revenue scaling and ${modifiers.exp}% expense scaling, ` +
            `the 6-month stability index remains at ${latest?.projectedRiskScore || 0}/100. ` +
            `Strategic Recommendation: ${latest?.projectedRiskScore > 70 ? 'Maintain aggressive growth posture.' : 'Execute OpEx compression to preserve liquidity.'}`;

        doc.text(doc.splitTextToSize(riskNote, 170), 20, riskY + 5);

        // --- FOOTER ---
        doc.setFontSize(7);
        doc.setTextColor(180, 180, 180);
        doc.text("CONFIDENTIAL - GENERATED VIA RISKVISTA INTELLIGENCE PLATFORM", 105, 285, { align: 'center' });

        // --- SAVE ---
        doc.save(`RISKVISTA_Dossier_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
        console.error("PDF Generation Failed:", error);
        alert("Critical failure during PDF generation. Check console for details.");
    }
};
