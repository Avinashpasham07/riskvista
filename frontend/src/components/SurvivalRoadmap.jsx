import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, TrendingUp, AlertTriangle, ShieldCheck, Zap, ArrowRight, BrainCircuit } from "lucide-react";
import GlassCard from "./GlassCard";

const SurvivalRoadmap = ({ coreMetrics, aiAdvisor }) => {
    const [isCalculating, setIsCalculating] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsCalculating(false), 500);
                    return 100;
                }
                return prev + 5;
            });
        }, 100);
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (urgency) => {
        switch (urgency) {
            case "High": return "text-risk-high bg-risk-high/10 border-risk-high/20";
            case "Medium": return "text-risk-warn bg-risk-warn/10 border-risk-warn/20";
            default: return "text-risk-safe bg-risk-safe/10 border-risk-safe/20";
        }
    };

    const getStatusIcon = (urgency) => {
        switch (urgency) {
            case "High": return <AlertTriangle className="w-5 h-5" />;
            case "Medium": return <Zap className="w-5 h-5" />;
            default: return <ShieldCheck className="w-5 h-5" />;
        }
    };

    return (
        <GlassCard className="relative overflow-hidden min-h-[400px] flex flex-col p-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-zinc-900 rounded-xl">
                        <BrainCircuit className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-zinc-900">Survival Roadmap</h2>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Predictive Solvency Protocol v2.4</p>
                    </div>
                </div>
                {!isCalculating && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[10px] font-black uppercase text-emerald-600">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        AI Analysis Complete
                    </div>
                )}
            </div>

            <AnimatePresence mode="wait">
                {isCalculating ? (
                    <motion.div
                        key="calculating"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col items-center justify-center space-y-8 py-12"
                    >
                        <div className="relative w-24 h-24">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 rounded-full border-4 border-t-zinc-900 border-r-zinc-200 border-b-zinc-200 border-l-zinc-200"
                            />
                            <div className="absolute inset-0 flex items-center justify-center font-black text-xl text-zinc-900">
                                {progress}%
                            </div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-zinc-900">Simulating Liquidity Vectors...</h3>
                            <p className="text-zinc-500 text-sm mt-1 max-w-[280px]">Synthesizing burn volatility and revenue MoM growth patterns.</p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex-1 space-y-6"
                    >
                        {/* Summary Pulse */}
                        <div className="p-6 bg-zinc-900 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <TrendingUp className="w-32 h-32" />
                            </div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Core Directive</h4>
                            <p className="text-xl font-bold leading-tight relative z-10">
                                {coreMetrics.runwayMonths >= 99 ? (
                                    <>Maintain stable fiscal trajectory. Identified {aiAdvisor?.length || 0} optimization vectors in current OPEX structure.</>
                                ) : (
                                    <>Maintain {coreMetrics.runwayMonths.toFixed(1)} months of runway. Identified {aiAdvisor?.length || 0} critical bottlenecks in current OPEX structure.</>
                                )}
                            </p>
                        </div>

                        {/* Directives List */}
                        <div className="space-y-4">
                            {aiAdvisor?.slice(0, 3).map((advice, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-start gap-4 p-5 bg-white border border-zinc-100 rounded-2xl hover:border-zinc-300 transition-colors shadow-sm"
                                >
                                    <div className={`p-2.5 rounded-xl border ${getStatusColor(advice.urgency)} flex-shrink-0`}>
                                        {getStatusIcon(advice.urgency)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{advice.category}</span>
                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${getStatusColor(advice.urgency)}`}>{advice.urgency} Priority</span>
                                        </div>
                                        <p className="text-sm font-bold text-zinc-800 leading-snug">{advice.message}</p>
                                    </div>
                                    <div className="flex-shrink-0 self-center">
                                        <ArrowRight className="w-4 h-4 text-zinc-300" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <button className="w-full py-4 text-sm font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 border-t border-zinc-100 mt-4 transition-colors">
                            View Full Technical Directive
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </GlassCard>
    );
};

export default SurvivalRoadmap;
