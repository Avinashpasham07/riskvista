import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Play, RotateCcw, TrendingUp, TrendingDown, Users, Coins, AlertCircle } from "lucide-react";
import GlassCard from "./GlassCard";

const ScenarioStudio = ({ coreMetrics, financialMetrics }) => {
    const [activeScenarios, setActiveScenarios] = useState([]);

    const availableEvents = [
        {
            id: "series_a",
            name: "Series A Success",
            cashMod: 120000000, // $1.2M
            revMod: 0,
            expMod: 0,
            desc: "Inject $1.2M capital | High liquidity boost",
            icon: <Coins className="w-5 h-5 text-emerald-500" />
        },
        {
            id: "hiring_spree",
            name: "Add 3 Developers",
            cashMod: 0,
            revMod: 0,
            expMod: 4500000, // $45k/mo
            desc: "Add $45k/mo OPEX | Scale faster",
            icon: <Users className="w-5 h-5 text-blue-500" />
        },
        {
            id: "churn_event",
            name: "Enterprise Churn",
            cashMod: 0,
            revMod: -2000000, // -$20k MRR
            expMod: 0,
            desc: "Lose $20k MRR | Massive burn spike",
            icon: <TrendingDown className="w-5 h-5 text-risk-high" />
        },
        {
            id: "pivot_success",
            name: "Pivot ROI Hit",
            cashMod: 0,
            revMod: 5000000, // +$50k MRR
            expMod: 1500000, // +$15k/mo infrastructure
            desc: "+$50k MRR | Strategic pivot success",
            icon: <TrendingUp className="w-5 h-5 text-emerald-500" />
        },
    ];

    const currentImpact = useMemo(() => {
        if (!financialMetrics) return 0;

        let deltaCash = 0;
        let deltaRev = 0;
        let deltaExp = 0;

        activeScenarios.forEach(s => {
            deltaCash += s.cashMod;
            deltaRev += s.revMod;
            deltaExp += s.expMod;
        });

        const currentRevenue = financialMetrics.revenueCents;
        const currentExpenses = financialMetrics.cogsCents + financialMetrics.opexCents;
        const currentCash = financialMetrics.cashOnHandCents;

        // BASELINE LOGIC: If currently profitable (999), we use a high baseline (e.g. 72mo) for comparison
        // so that dropping to a finite runway shows a large negative impact.
        const currentIsProfitable = coreMetrics.runwayMonths === 999;
        const baselineMonths = currentIsProfitable ? 72.0 : coreMetrics.runwayMonths;

        const adjCash = currentCash + deltaCash;
        const adjRevenue = currentRevenue + deltaRev;
        const adjExpenses = currentExpenses + deltaExp;
        const netBurn = adjExpenses - adjRevenue;

        let newRunway;
        if (netBurn <= 0) {
            newRunway = 999;
        } else {
            newRunway = Math.max(0, adjCash / netBurn);
        }

        // Case 1: Still Infinite -> No change in terminal state
        if (newRunway === 999 && currentIsProfitable) return 0;

        // Case 2: Became Profitable -> Positive Impact
        if (newRunway === 999 && !currentIsProfitable) return 24.0; // Show high positive cap

        // Case 3: Calculation of delta
        // If we were at 999 (baseline 72) and now at 12, impact is -60
        const diff = Number((newRunway - baselineMonths).toFixed(1));
        return diff;
    }, [activeScenarios, financialMetrics, coreMetrics]);

    const toggleScenario = (event) => {
        if (activeScenarios.find(s => s.id === event.id)) {
            setActiveScenarios(activeScenarios.filter(s => s.id !== event.id));
        } else {
            setActiveScenarios([...activeScenarios, event]);
        }
    };

    const reset = () => {
        setActiveScenarios([]);
    };

    return (
        <GlassCard className="p-8 bg-white border-zinc-200">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-black text-zinc-900 tracking-tight uppercase">Scenario Studio</h2>
                    <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-1">Interactive Stress-Test Canvas</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${currentImpact >= 0 ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-risk-high'}`}>
                        <span className="text-[10px] font-black uppercase opacity-60">Impact:</span>
                        <span className="text-sm font-black tracking-tighter">
                            {currentImpact === 24 ? '+∞' : (currentImpact > 0 ? `+${currentImpact}` : currentImpact)} MO
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Available Library */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                        <Plus className="w-3 h-3" /> Event Library
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                        {availableEvents.map((event) => {
                            const isActive = activeScenarios.find(s => s.id === event.id);
                            return (
                                <button
                                    key={event.id}
                                    onClick={() => toggleScenario(event)}
                                    className={`p-4 rounded-2xl border text-left transition-all group ${isActive ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl translate-x-1' : 'bg-zinc-50 border-zinc-100 hover:border-zinc-200 text-zinc-900'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${isActive ? 'bg-white/10' : 'bg-white shadow-sm'}`}>
                                                {event.icon}
                                            </div>
                                            <div>
                                                <p className="font-black text-sm tracking-tight">{event.name}</p>
                                                <p className={`text-[10px] font-medium leading-tight ${isActive ? 'text-zinc-400' : 'text-zinc-500'}`}>{event.desc}</p>
                                            </div>
                                        </div>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${isActive ? 'bg-white text-zinc-900 rotate-45' : 'bg-zinc-200 text-zinc-500 group-hover:rotate-90'}`}>
                                            <Plus className="w-4 h-4" />
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Active Simulation */}
                <div className="flex flex-col h-full space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                        <Play className="w-3 h-3" /> Digital Twin Simulation
                    </h3>
                    <div className="flex-1 bg-zinc-50 border border-zinc-100 rounded-[2.5rem] p-6 relative overflow-hidden flex flex-col items-center justify-center text-center">
                        <AnimatePresence>
                            {activeScenarios.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-4"
                                >
                                    <div className="w-16 h-16 bg-white border border-zinc-200 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                                        <AlertCircle className="w-8 h-8 text-zinc-300" />
                                    </div>
                                    <p className="text-sm font-bold text-zinc-400 max-w-[200px]">Add events from the library to start the "What-If" engine.</p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="w-full h-full flex flex-col"
                                >
                                    <div className="flex-1 flex flex-wrap gap-2 content-start justify-center overflow-y-auto max-h-[120px] custom-scrollbar">
                                        {activeScenarios.map((s) => (
                                            <motion.div
                                                layout
                                                key={s.id}
                                                className="px-4 py-2 bg-zinc-900 text-white border border-white/10 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg"
                                            >
                                                {s.name}
                                                <button onClick={() => toggleScenario(s)} className="hover:text-red-400 transition-colors">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-zinc-200">
                                        <p className="text-[10px] font-black uppercase text-zinc-400 mb-2">Projected Deviation</p>
                                        <div className={`text-4xl font-black tracking-tighter ${currentImpact >= 0 ? 'text-emerald-500' : 'text-risk-high'}`}>
                                            {currentImpact === 24 ? '+∞' : (currentImpact > 0 ? `+${currentImpact}` : currentImpact)} MO
                                        </div>
                                        <p className="text-[10px] font-bold text-zinc-400 mt-2">Calculated using live financial vectors</p>
                                        <button
                                            onClick={reset}
                                            className="mt-6 flex items-center gap-2 mx-auto text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors"
                                        >
                                            <RotateCcw className="w-3 h-3" /> Reset Simulator
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};

export default ScenarioStudio;
