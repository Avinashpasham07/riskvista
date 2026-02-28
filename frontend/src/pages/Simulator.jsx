import { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import AnimatedCounter from '../components/AnimatedCounter';
import apiClient from '../services/apiClient';

const Simulator = () => {
    // Input State
    const [revenueAdjustment, setRevenueAdjustment] = useState(0);
    const [expenseAdjustment, setExpenseAdjustment] = useState(0);
    const [loanInjection, setLoanInjection] = useState(0);

    // API State
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    // Increment this on every simulation run to force AnimatedCounter to restart its spring animation
    const [simulationKey, setSimulationKey] = useState(0);

    // Auto-Run Simulator on Input Change (debounced)
    useEffect(() => {
        const handler = setTimeout(() => {
            runSimulation();
        }, 400); // 400ms debounce

        return () => clearTimeout(handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [revenueAdjustment, expenseAdjustment, loanInjection]);

    const runSimulation = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                revenueChangePercent: Number(revenueAdjustment),
                expenseChangePercent: Number(expenseAdjustment),
                loanInjectionDollars: Number(loanInjection)
            };

            const response = await apiClient.post('simulate', payload);
            setResult(response.data.simulation);
            setSimulationKey(prev => prev + 1); // Force counters to animate again
        } catch (err) {
            if (err.response?.status === 404) {
                setError('No baseline data found. Please enter data in the Data Input page first.');
            } else {
                setError(err.response?.data?.message || 'Simulation failed to run.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
            <header className="mb-8 relative z-10">
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">What-If Engine</h1>
                <p className="text-zinc-600 mt-2 text-sm font-medium bg-white border border-zinc-200 shadow-sm inline-block px-3 py-1.5 rounded-lg">
                    Adjust variables below to instantly simulate alternate funding and operational scenarios.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">

                {/* Control Panel (Left column) */}
                <div className="lg:col-span-5 space-y-6">
                    <GlassCard className="p-6 border-l-4 border-brand-blue">
                        <form onSubmit={runSimulation} className="space-y-8">

                            {/* Revenue Slider */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <label className="text-sm font-bold text-zinc-700">Revenue Adjustment</label>
                                    <span className={`text-xl font-black ${revenueAdjustment > 0 ? 'text-brand-indigo' : revenueAdjustment < 0 ? 'text-risk-high' : 'text-zinc-900'}`}>
                                        {revenueAdjustment > 0 ? '+' : ''}{revenueAdjustment}%
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="-100"
                                    max="200"
                                    step="5"
                                    value={revenueAdjustment}
                                    onChange={(e) => setRevenueAdjustment(e.target.value)}
                                    className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
                                />
                                <div className="flex justify-between text-xs text-zinc-500 font-bold uppercase tracking-wider">
                                    <span>-100%</span>
                                    <span>Current</span>
                                    <span>+200%</span>
                                </div>
                            </div>

                            {/* Expenses Slider */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <label className="text-sm font-bold text-zinc-700">Expenses Adjustment (COGS & OPEX)</label>
                                    <span className={`text-xl font-black ${expenseAdjustment < 0 ? 'text-brand-indigo' : expenseAdjustment > 0 ? 'text-risk-high' : 'text-zinc-900'}`}>
                                        {expenseAdjustment > 0 ? '+' : ''}{expenseAdjustment}%
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="-100"
                                    max="200"
                                    step="5"
                                    value={expenseAdjustment}
                                    onChange={(e) => setExpenseAdjustment(e.target.value)}
                                    className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-risk-warn focus:outline-none focus:ring-2 focus:ring-risk-warn/50"
                                />
                                <div className="flex justify-between text-xs text-zinc-500 font-bold uppercase tracking-wider">
                                    <span>-100% (Zero Spend)</span>
                                    <span>Current</span>
                                    <span>+200%</span>
                                </div>
                            </div>

                            {/* Loan Required */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-zinc-700 block">Bridge Funding Needed ($)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-zinc-500 font-medium sm:text-sm">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        min="0"
                                        value={loanInjection}
                                        onChange={(e) => setLoanInjection(e.target.value)}
                                        className="bg-zinc-50 border border-zinc-200 text-zinc-900 font-medium rounded-xl focus:ring-2 focus:outline-none focus:ring-brand-blue/50 focus:border-brand-blue block w-full pl-8 p-3 transition-all shadow-inner"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-brand-blue hover:bg-brand-indigo text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-xl shadow-brand-blue/20 flex justify-center items-center h-12"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    'Run Simulation'
                                )}
                            </button>

                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
                                    <p className="text-red-600 font-medium text-sm text-center">{error}</p>
                                </div>
                            )}
                        </form>
                    </GlassCard>
                </div>

                {/* Results Panel (Right column) */}
                <div className="lg:col-span-7">
                    <GlassCard className="h-full p-8 flex flex-col items-center justify-center min-h-[400px]">
                        {!result ? (
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-zinc-900">Waiting for parameters</h3>
                                <p className="text-zinc-500 font-medium text-sm max-w-sm">
                                    Adjust the variables on the left and hit run to see how your runway and risk score shifts in alternative realities.
                                </p>
                            </div>
                        ) : (
                            <div className="w-full space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                                <div className="text-center border-b border-zinc-200 pb-6 mb-2">
                                    <h3 className="text-2xl font-extrabold tracking-tight text-brand-blue">
                                        Simulated Future
                                    </h3>
                                    <p className="text-zinc-500 font-medium mt-1">If adjustments are executed today.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                    {/* Simulated Net Income */}
                                    <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm relative overflow-hidden group">
                                        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 z-10 mt-2 text-center">Net Income (Month)</p>
                                        <div className="text-4xl font-black tracking-tighter text-zinc-900 flex items-baseline z-10">
                                            <span className="text-xl text-zinc-500 mr-1 font-semibold">$</span>
                                            <AnimatedCounter key={simulationKey + 'net'} value={result.simNetIncomeDollars || 0} decimalPlaces={0} />
                                        </div>

                                        {/* Delta pill */}
                                        <div className={`mt-4 px-3 py-1 rounded-md text-sm font-bold z-10 flex items-center shadow-sm border ${result.netIncomeDeltaDollars > 0 ? 'bg-brand-indigo/10 border-brand-indigo/20 text-brand-indigo' : result.netIncomeDeltaDollars < 0 ? 'bg-risk-high/10 border-risk-high/20 text-risk-high' : 'bg-zinc-50 border-zinc-200 text-zinc-500'}`}>
                                            {result.netIncomeDeltaDollars > 0 ? '+$' : result.netIncomeDeltaDollars < 0 ? '-$' : '$'}
                                            {Math.abs(result.netIncomeDeltaDollars).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                        </div>
                                    </div>

                                    {/* Simulated Runway */}
                                    <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm relative overflow-hidden group">
                                        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 z-10 mt-2 text-center">New Runway</p>
                                        <div className="text-4xl font-black tracking-tighter text-zinc-900 flex items-baseline z-10">
                                            {result.postSimulationRunway >= 999 ? (
                                                <span className="text-emerald-600">Secure</span>
                                            ) : (
                                                <AnimatedCounter key={simulationKey + 'run'} value={result.postSimulationRunway} decimalPlaces={1} />
                                            )}
                                            {result.postSimulationRunway < 999 && <span className="text-xl text-zinc-500 ml-2 font-semibold">Mo</span>}
                                        </div>

                                        {/* Status Badge */}
                                        <div className={`mt-4 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest z-10 border shadow-sm ${result.simNetIncomeDollars >= 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                                            {result.simNetIncomeDollars >= 0 ? 'Profitable (Infinite)' : 'Burning Cash'}
                                        </div>
                                    </div>

                                    {/* Simulated Risk */}
                                    <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-risk-warn/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl z-0" />

                                        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 z-10 mt-2 text-center">New Risk Score</p>
                                        <div className="text-4xl font-black tracking-tighter text-zinc-900 z-10">
                                            <AnimatedCounter key={simulationKey + 'risk'} value={result.postSimulationRisk} />
                                            <span className="text-xl text-zinc-500 ml-1 font-semibold z-10">/ 100</span>
                                        </div>

                                        {/* Delta pill */}
                                        <div className={`mt-4 px-3 py-1 rounded-md text-sm font-bold z-10 flex items-center shadow-sm border ${result.riskDelta < 0 ? 'bg-brand-indigo/10 border-brand-indigo/20 text-brand-indigo' : result.riskDelta > 0 ? 'bg-risk-high/10 border-risk-high/20 text-risk-high' : 'bg-zinc-50 border-zinc-200 text-zinc-500'}`}>
                                            {/* Note: Reductions in risk are GOOD (green/indigo) */}
                                            {result.riskDelta < 0 ? '↓' : result.riskDelta > 0 ? '↑' : ''} {Math.abs(result.riskDelta)} Points
                                        </div>
                                    </div>

                                </div>

                                <p className="text-xs font-medium text-center text-zinc-400 mt-8">
                                    Simulations are ephemeral and do not impact your baseline intelligence dashboard.
                                </p>
                            </div>
                        )}
                    </GlassCard>
                </div>

            </div>
        </div>
    );
};

export default Simulator;
