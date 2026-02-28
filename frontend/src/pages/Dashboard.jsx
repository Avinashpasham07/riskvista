import { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import AnimatedCounter from '../components/AnimatedCounter';
import ForecastChart from '../components/ForecastChart';
import SurvivalRoadmap from '../components/SurvivalRoadmap';
import ScenarioStudio from '../components/ScenarioStudio';
import { generateAuditReport } from '../services/ReportExporter';
import apiClient from '../services/apiClient';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await apiClient.get('dashboard');
                setData(response.data);
            } catch (err) {
                console.error("Dashboard Fetch Error:", err);
                if (err.response?.status === 404) {
                    setError('No financial data found. Please ingest records first.');
                } else {
                    setError(`Failed to load dashboard intelligence: ${err.message || 'Unknown Network Error'}`);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-lg">
                <h3 className="text-red-400 font-medium">Data Required</h3>
                <p className="text-zinc-400 text-sm mt-1">{error || 'Please seed your financial data via Postman or the ingestion API to view the dashboard.'}</p>
            </div>
        );
    }

    // Safety guard for malformed or missing data
    if (!data || !data.coreMetrics) {
        return (
            <div className="p-10 text-center">
                <div className="w-16 h-16 bg-zinc-50 border border-zinc-200 flex items-center justify-center mx-auto mb-4 rounded-2xl">
                    <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 className="text-xl font-black text-zinc-900">Analysis Incomplete</h2>
                <p className="text-zinc-500 font-medium mt-2">Data signature is missing. Please re-ingest your financials.</p>
            </div>
        );
    }

    const { coreMetrics, loanReadiness, forecasts, aiAdvisor, benchmark, financialMetrics } = data;

    const getRiskColor = (score) => {
        if (score < 40) return { border: 'border-risk-safe', text: 'text-risk-safe' };
        if (score < 70) return { border: 'border-risk-warn', text: 'text-risk-warn' };
        return { border: 'border-risk-high', text: 'text-risk-high' };
    };

    const riskColor = getRiskColor(coreMetrics.riskScore);
    const isCollapseHigh = coreMetrics.collapseProbability > 50;

    return (
        <div className="space-y-6 pb-20">
            <header className="mb-8 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase">Intelligence Overview</h1>
                    <p className="text-zinc-500 mt-2 text-sm font-bold bg-white border border-zinc-200 shadow-sm inline-block px-3 py-1.5 rounded-lg uppercase tracking-widest">
                        Solvency Monitoring Protocol v2.1
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => generateAuditReport(data)}
                        className="h-10 px-4 bg-zinc-900 text-white text-xs font-black uppercase tracking-widest rounded-lg hover:bg-zinc-800 transition-all shadow-lg active:scale-95"
                    >
                        Export Audit PDF
                    </button>
                    <button className="h-10 px-4 bg-white border border-zinc-200 text-zinc-900 text-xs font-black uppercase tracking-widest rounded-lg hover:bg-zinc-50 transition-all shadow-sm active:scale-95">
                        Sync Data
                    </button>
                </div>
            </header>

            {/* Top KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                <GlassCard className={`h-36 flex flex-col justify-center border-l-4 relative overflow-hidden ${riskColor.border}`}>
                    <div className="absolute top-2 right-2 flex gap-1">
                        <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-tighter">Live Engine</span>
                    </div>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Overall Risk Score</p>
                    <div className={`text-5xl font-black tracking-tighter ${riskColor.text} flex items-baseline`}>
                        <AnimatedCounter value={coreMetrics.riskScore} />
                        <span className="text-xl text-zinc-400 ml-2 font-black tracking-tighter">/ 100</span>
                    </div>
                </GlassCard>

                <GlassCard className="h-36 flex flex-col justify-center border-l-4 border-brand-blue relative">
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Cash Runway</p>
                    <div className="text-5xl font-black tracking-tighter text-zinc-900 flex items-baseline">
                        {coreMetrics.runwayMonths >= 99 ? (
                            <>
                                <span className="text-3xl font-black text-emerald-500 tracking-tight">Safe</span>
                                <span className="text-[10px] text-emerald-500 ml-2 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 font-black uppercase tracking-widest">Stable</span>
                            </>
                        ) : (
                            <>
                                <AnimatedCounter value={coreMetrics.runwayMonths} decimalPlaces={1} />
                                <span className="text-lg text-zinc-400 ml-2 font-black uppercase tracking-tighter">Months</span>
                            </>
                        )}
                    </div>
                </GlassCard>

                <GlassCard className={`h-36 flex flex-col justify-center border-l-4 relative overflow-hidden ${isCollapseHigh ? 'border-risk-high' : 'border-zinc-300'}`}>
                    {isCollapseHigh && (
                        <>
                            <div className="absolute inset-0 bg-risk-high/5 animate-pulse pointer-events-none" />
                            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-risk-high animate-ping" />
                        </>
                    )}
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Collapse Prob.</p>
                    <div className={`text-5xl font-black tracking-tighter flex items-baseline ${isCollapseHigh ? 'text-risk-high' : 'text-zinc-900'}`}>
                        <AnimatedCounter value={coreMetrics.collapseProbability} suffix="%" />
                    </div>
                </GlassCard>

                <GlassCard className="h-36 flex flex-col justify-center border-l-4 border-brand-indigo">
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Loan Readiness</p>
                    <div className="text-5xl font-black tracking-tighter text-zinc-900 flex items-baseline">
                        <AnimatedCounter value={loanReadiness.loanScore} />
                        <span className="text-[10px] text-brand-indigo ml-2 px-2 py-0.5 rounded bg-brand-indigo/10 border border-brand-indigo/20 font-black uppercase tracking-widest">
                            {loanReadiness.readinessTier}
                        </span>
                    </div>
                </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
                <GlassCard className="lg:col-span-2 h-[520px] flex flex-col p-8 bg-white">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black text-zinc-900 tracking-tight uppercase">Cash Flow Velocity</h2>
                            <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-1">Predictive scenario modeling interface</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="px-2 py-1 rounded-md border border-zinc-100 bg-zinc-50 text-[9px] font-black uppercase tracking-tighter">Normal</div>
                            <div className="px-2 py-1 rounded-md border border-red-500/20 bg-red-500/10 text-red-500 text-[9px] font-black uppercase tracking-tighter">Aggressive</div>
                        </div>
                    </div>
                    <div className="flex-1 w-full relative -ml-4">
                        <div className="absolute inset-0">
                            <ForecastChart data={forecasts} />
                        </div>
                    </div>
                </GlassCard>

                {/* The Survival Roadmap Widget */}
                <SurvivalRoadmap coreMetrics={coreMetrics} aiAdvisor={aiAdvisor} />
            </div>

            {/* Scenario Studio - Interactive Canvas */}
            <div className="relative z-10">
                <ScenarioStudio coreMetrics={coreMetrics} financialMetrics={financialMetrics} />
            </div>

            {/* Benchmark Section */}
            {benchmark && (
                <div className="relative z-10">
                    <GlassCard className="p-8 border-t-4 border-emerald-500">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                    <Globe className="w-8 h-8 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-zinc-900 uppercase tracking-tighter">Global Market Intelligence</h3>
                                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Benchmarking against {benchmark.industry} average</p>
                                </div>
                            </div>
                            <div className="flex gap-12">
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">Company Margin</p>
                                    <p className="text-3xl font-black text-zinc-900 tracking-tighter">{benchmark.userMargin}%</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">Variance</p>
                                    <p className={`text-3xl font-black tracking-tighter ${benchmark.status === 'Above' ? 'text-risk-safe' : 'text-risk-high'}`}>
                                        {benchmark.status === 'Above' ? '+' : ''}{benchmark.benchmarkDeltaPercent}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            )}
        </div>
    );
};

// Mock Globe icon since it wasn't imported in original file but I used it for brand polish
const Globe = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
);

export default Dashboard;
