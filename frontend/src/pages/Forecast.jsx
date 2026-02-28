import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Legend, BarChart, Bar,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import {
    TrendingUp, TrendingDown, AlertTriangle, ShieldCheck,
    ArrowRight, Info, DollarSign, Calendar, Sliders, Zap, Download
} from 'lucide-react';
import apiClient from '../services/apiClient';
import GlassCard from '../components/GlassCard';
import { generateInvestorDossier } from '../services/reportService';
import { exportToExcel } from '../services/exportService';

const Forecast = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --- REAL-TIME SIMULATION STATE ---
    const [revMod, setRevMod] = useState(100);
    const [expMod, setExpMod] = useState(100);
    const [fundingIn, setFundingIn] = useState(0);
    const [stressToggle, setStressToggle] = useState(false);
    const [devHires, setDevHires] = useState(0);
    const [salesHires, setSalesHires] = useState(0);
    const [currency, setCurrency] = useState('USD');

    const exchangeRates = {
        USD: 1,
        INR: 82.5,
        EUR: 0.94
    };

    const currencySymbols = {
        USD: '$',
        INR: '₹',
        EUR: '€'
    };

    useEffect(() => {
        const fetchForecastData = async () => {
            try {
                const response = await apiClient.get('dashboard');
                if (response.status === 200 && response.data && response.data.forecasts) {
                    setData(response.data);
                } else {
                    setError('Forecast intelligence requires baseline financial records.');
                }
            } catch (err) {
                console.error("Dashboard Forecast API Error:", err);
                setError(err.response?.data?.message || 'Failed to load forecast data.');
            } finally {
                setLoading(false);
            }
        };

        fetchForecastData();
    }, []);

    const formatCurrency = (cents) => {
        if (cents === undefined || isNaN(cents)) return '$0';
        const convertedValue = (cents / 100) * (exchangeRates[currency] || 1);
        const absoluteValue = Math.abs(convertedValue);

        const formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0
        }).format(absoluteValue);

        return convertedValue < 0 ? `-${formatted}` : formatted;
    };

    // --- HIGH-PERFORMANCE SIMULATION ENGINE ---
    const simulatedData = useMemo(() => {
        if (!data || !data.forecasts) return { forecasts: [], metrics: {}, radarData: [] };

        const baseCash = data.financialMetrics?.cashOnHandCents || data.cashOnHandCents || 0;
        let currentCashBase = baseCash + (fundingIn * 100);

        // Hiring Costs (Cents)
        const hiringCostsMonthly = (devHires * 1000000) + (salesHires * 700000);

        const simulatedForecasts = data.forecasts.map((f, index) => {
            // Apply Sliders to P&L
            const hiringRampFactor = index >= 2 ? (1 + (devHires * 0.05) + (salesHires * 0.08)) : 1;
            const simulatedRev = f.projectedRevenueCents * (revMod / 100) * hiringRampFactor;

            const rawExp = f.projectedExpensesCents * (expMod / 100);
            const totalExpWithHiring = rawExp + hiringCostsMonthly;
            const simulatedExp = stressToggle ? totalExpWithHiring * 0.85 : totalExpWithHiring;

            const simulatedNet = simulatedRev - simulatedExp;

            currentCashBase += simulatedNet;

            const spread = f.projectedCashBestCents - f.projectedCashBaseCents;
            const currentCashBest = currentCashBase + spread;
            const currentCashWorst = currentCashBase - spread;

            return {
                ...f,
                projectedRevenueCents: simulatedRev,
                projectedExpensesCents: simulatedExp,
                projectedNetIncomeCents: simulatedNet,
                projectedCashBaseCents: currentCashBase,
                projectedCashBestCents: currentCashBest,
                projectedCashWorstCents: currentCashWorst
            };
        });

        const latest = simulatedForecasts[simulatedForecasts.length - 1];
        const latestCash = latest?.projectedCashBaseCents || 0;
        const breakthrough = simulatedForecasts.find(f => f.projectedNetIncomeCents > 0)?.monthIndex;

        // --- VALUATION & RUNWAY PULSE ---
        const latestCashClamped = Math.max(0, latestCash);
        const monthlyBurn = Math.abs(Math.min(0, latest?.projectedNetIncomeCents || 0));
        const runwayDaysPulse = monthlyBurn > 0 ? Math.floor((latestCashClamped / monthlyBurn) * 30.44) : 9999;

        const avgMonthRev = simulatedForecasts.reduce((acc, f) => acc + f.projectedRevenueCents, 0) / simulatedForecasts.length;
        const enterpriseValue = (avgMonthRev * 12) * 4.5;

        // --- RADAR DATA ---
        const growthVelocity = Math.min(100, (revMod / 1.5));
        const liquidityDepth = Math.min(100, Math.max(0, (latestCash / (baseCash || 1)) * 50));
        const stabilityCore = Math.max(0, 100 - (latest?.projectedRiskScore || 0));
        const opexEfficiency = Math.min(100, Math.max(0, (revMod / (expMod || 1)) * 80));
        const riskBuffer = Math.min(100, (latest?.projectedRiskScore || 50));

        const radarData = [
            { subject: 'Growth Velocity', A: growthVelocity, fullMark: 100 },
            { subject: 'Liquidity Depth', A: liquidityDepth, fullMark: 100 },
            { subject: 'Stability Core', A: stabilityCore, fullMark: 100 },
            { subject: 'OpEx Efficiency', A: opexEfficiency, fullMark: 100 },
            { subject: 'Risk Buffer', A: riskBuffer, fullMark: 100 },
        ];

        return {
            forecasts: simulatedForecasts,
            latestMonth: latest,
            breakthroughMonth: breakthrough,
            radarData,
            runwayDaysPulse,
            enterpriseValue,
            teamSize: (data.teamSize || 1) + devHires + salesHires
        };
    }, [data, revMod, expMod, fundingIn, stressToggle, devHires, salesHires, currency]);

    const { forecasts, latestMonth, breakthroughMonth, radarData, runwayDaysPulse, enterpriseValue, teamSize } = simulatedData;

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/95 backdrop-blur-md border border-zinc-200 p-4 rounded-xl shadow-2xl ring-1 ring-zinc-900/5">
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-3">Time Horizon: Month {label}</p>
                    <div className="space-y-2">
                        {payload.map((entry, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-zinc-500 text-xs font-bold capitalize">{entry.name}:</span>
                                <span className="text-zinc-900 font-extrabold text-sm ml-auto">
                                    {typeof entry.value === 'number' && entry.name.toLowerCase().includes('score')
                                        ? entry.value
                                        : formatCurrency(entry.value)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    if (loading) return (
        <div className="flex items-center justify-center h-[70vh]">
            <div className="w-12 h-12 border-4 border-zinc-100 border-t-zinc-900 rounded-full animate-spin" />
        </div>
    );

    if (error) return (
        <div className="max-w-2xl mx-auto mt-20 p-8 bg-white border border-zinc-200 rounded-3xl text-center shadow-xl">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="text-red-600 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-zinc-900 mb-2">Analysis Unavailable</h2>
            <p className="text-zinc-500 font-medium mb-8 leading-relaxed">{error}</p>
            <button onClick={() => window.location.reload()} className="primary-btn px-8">Try Again</button>
        </div>
    );

    const isProfitable = latestMonth?.projectedNetIncomeCents > 0;

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-24">
            {/* Page Header */}
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center shadow-lg shadow-brand-blue/20">
                            <Zap className="text-white w-5 h-5" fill="currentColor" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-zinc-900 leading-none">Intelligence Forecast</h1>
                    </div>
                    <p className="text-zinc-500 font-medium ml-1">Predictive risk modeling & real-time survival simulation.</p>
                </div>

                <div className="flex flex-col items-end gap-3">
                    <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200 shadow-sm overflow-hidden min-w-[200px]">
                        {['USD', 'INR', 'EUR'].map((curr) => (
                            <button
                                key={curr}
                                onClick={() => setCurrency(curr)}
                                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${currency === curr ? 'bg-white text-zinc-900 shadow-sm rounded-lg' : 'text-zinc-400 hover:text-zinc-600'}`}
                            >
                                {curr}
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4 lg:gap-8 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm w-full md:w-auto">
                        <div className="min-w-[140px]">
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Founders' Exit Value</p>
                            <p className="text-xl font-black text-brand-blue">{formatCurrency(enterpriseValue)}</p>
                        </div>
                        <div className="border-l border-zinc-100 pl-6 min-w-[140px]">
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Survival Pulse</p>
                            <p className={`text-xl font-black ${runwayDaysPulse < 90 ? 'text-red-500 animate-pulse' : 'text-zinc-900'}`}>
                                {runwayDaysPulse >= 9000 ? 'Vanguard (Safe)' : `${runwayDaysPulse} Days`}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Analysis Milestones Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <GlassCard className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-zinc-900">
                            <DollarSign className="w-5 h-5" strokeWidth={2.5} />
                        </div>
                        {isProfitable ? (
                            <span className="flex items-center gap-1 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                                <ShieldCheck className="w-3 h-3" /> Secure
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-amber-600 text-[10px] font-black uppercase tracking-widest">
                                <TrendingDown className="w-3 h-3" /> Burning
                            </span>
                        )}
                    </div>
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1">Break-Even Velocity</h3>
                    <p className="text-2xl font-black text-zinc-900">
                        {breakthroughMonth ? `Month ${breakthroughMonth}` : (isProfitable ? 'Zero Burn' : 'Pre-Profit')}
                    </p>
                </GlassCard>

                <GlassCard className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-zinc-900">
                            <Zap className="w-5 h-5" strokeWidth={2.5} />
                        </div>
                    </div>
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1">Max At Risk</h3>
                    <p className="text-2xl font-black text-zinc-900">{formatCurrency(latestMonth?.projectedCashWorstCents)}</p>
                </GlassCard>

                <GlassCard className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-zinc-900">
                            <AlertTriangle className="w-5 h-5" strokeWidth={2.5} />
                        </div>
                    </div>
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1">Health Index</h3>
                    <p className={`text-2xl font-black ${latestMonth?.projectedRiskScore >= 70 ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {latestMonth?.projectedRiskScore}/100
                    </p>
                </GlassCard>

                <GlassCard className="p-6 bg-brand-blue/5 border-brand-blue/10">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-brand-blue text-white rounded-xl shadow-lg shadow-brand-blue/20">
                            <Calendar className="w-5 h-5" strokeWidth={2.5} />
                        </div>
                    </div>
                    <h3 className="text-sm font-bold text-brand-blue uppercase tracking-wider mb-1">Total Team</h3>
                    <p className="text-2xl font-black text-zinc-900">{teamSize} Members</p>
                </GlassCard>
            </div>

            {/* SIMULATION CONTROL CENTER */}
            <GlassCard className="p-0 border-zinc-900 bg-zinc-950 text-white overflow-hidden">
                <div className="p-6 md:p-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Sliders className="w-5 h-5 text-blue-400" />
                                <h2 className="text-xl font-black text-white tracking-tight leading-none">Intelligence Simulator</h2>
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Real-Time Scenario Modeling</p>
                        </div>

                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => setStressToggle(!stressToggle)}
                                className={`px-4 py-2 border rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${stressToggle ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10'}`}
                            >
                                Stress Mode
                            </button>
                            <button
                                onClick={() => {
                                    setRevMod(100); setExpMod(100); setFundingIn(0); setDevHires(0); setSalesHires(0); setStressToggle(false);
                                }}
                                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 border-b border-white/5 pb-12 overflow-hidden">
                        <div className="space-y-10">
                            <h3 className="text-sm font-black text-blue-400 uppercase tracking-widest border-l-2 border-blue-500 pl-4">Financial Levers</h3>
                            <div className="space-y-8">
                                <div>
                                    <div className="flex justify-between mb-4">
                                        <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Revenue Growth</span>
                                        <span className={`text-xs font-black ${revMod > 100 ? 'text-emerald-400' : 'text-blue-400'}`}>{revMod}%</span>
                                    </div>
                                    <input type="range" min="50" max="250" step="5" value={revMod} onChange={(e) => setRevMod(Number(e.target.value))} className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                                </div>
                                <div>
                                    <div className="flex justify-between mb-4">
                                        <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Expense Scaling</span>
                                        <span className={`text-xs font-black ${expMod < 100 ? 'text-emerald-400' : 'text-blue-400'}`}>{expMod}%</span>
                                    </div>
                                    <input type="range" min="50" max="200" step="5" value={expMod} onChange={(e) => setExpMod(Number(e.target.value))} className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <h3 className="text-sm font-black text-purple-400 uppercase tracking-widest border-l-2 border-purple-500 pl-4">Strategic Actions</h3>
                            <div className="space-y-8">
                                <div>
                                    <div className="flex justify-between mb-4">
                                        <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Fundraising Injection</span>
                                        <span className="text-xs font-black text-purple-400">+{formatCurrency(fundingIn * 100)}</span>
                                    </div>
                                    <input type="range" min="0" max="1000000" step="50000" value={fundingIn} onChange={(e) => setFundingIn(Number(e.target.value))} className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-10">
                            <h3 className="text-sm font-black text-emerald-400 uppercase tracking-widest border-l-2 border-emerald-500 pl-4">Hiring & ROI Simulator</h3>
                            <div className="space-y-8">
                                <div>
                                    <div className="flex justify-between mb-4">
                                        <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Engineer Hires ($10k/mo)</span>
                                        <span className="text-xs font-black text-emerald-400">+{devHires} Heads</span>
                                    </div>
                                    <input type="range" min="0" max="10" step="1" value={devHires} onChange={(e) => setDevHires(Number(e.target.value))} className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                                </div>
                                <div>
                                    <div className="flex justify-between mb-4">
                                        <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Sales Hires ($7k/mo)</span>
                                        <span className="text-xs font-black text-emerald-400">+{salesHires} Heads</span>
                                    </div>
                                    <input type="range" min="0" max="10" step="1" value={salesHires} onChange={(e) => setSalesHires(Number(e.target.value))} className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-3xl p-8 border border-white/10 flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-4">
                                <Info className="text-emerald-400 w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Intelligence Briefing</span>
                            </div>
                            <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                                Growth talent requires a <span className="text-white">2-month ramp-up</span>. Hires increase <span className="text-red-400">OpEx</span> immediately, but improve <span className="text-emerald-400">Growth Velocity</span> significantly after the onboarding phase.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 border-t border-white/5 p-6 flex items-center justify-center gap-12">
                    <div className="flex items-center gap-3">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Net Impact:</span>
                        <span className={`text-sm font-black ${revMod >= expMod ? 'text-emerald-400' : 'text-red-400'}`}>
                            {(revMod - expMod).toFixed(0)}% Margin Delta
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Liquidity:</span>
                        <span className="text-sm font-black text-white">{formatCurrency(latestMonth?.projectedCashBaseCents)}</span>
                    </div>
                </div>
            </GlassCard>

            {/* CHARTS CONTAINER */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <GlassCard className="p-8 lg:col-span-1 border-zinc-200">
                    <div className="mb-8">
                        <h2 className="text-xl font-black text-zinc-900 tracking-tight">Survival Radar</h2>
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">Multi-Axis Intelligence</p>
                    </div>
                    <div className="w-full h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#e4e4e7" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 9, fontWeight: 900 }} />
                                <Radar name="Startup Health" dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.4} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                <GlassCard className="p-8 lg:col-span-2 border-zinc-200">
                    <div className="mb-8">
                        <h2 className="text-xl font-black text-zinc-900 tracking-tight">Scenario Pulse</h2>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Liquidity Forecasting</p>
                    </div>
                    <div className="w-full h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={forecasts}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                <XAxis dataKey="monthIndex" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 800 }} tickFormatter={(val) => `Mo ${val}`} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 800 }} tickFormatter={(val) => `${currencySymbols[currency]}${(val / 100000).toFixed(0)}k`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="projectedCashBaseCents" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>
            </div>

            {/* DATA TABLE */}
            <div className="bg-white rounded-[32px] border border-zinc-200 shadow-sm overflow-hidden mt-10">
                <div className="p-6 border-b border-zinc-100 flex items-center gap-3 bg-zinc-50/50">
                    <Calendar className="text-zinc-400 w-5 h-5" />
                    <h2 className="font-black text-zinc-900 tracking-tight">Analytical Breakdown</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-zinc-100 bg-white">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Horizon</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Baseline Cash</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Monthly P&L</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Risk Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {forecasts.map((f, i) => (
                                <tr key={i} className="hover:bg-zinc-50/50 transition-colors">
                                    <td className="px-8 py-5 text-sm font-black text-zinc-900">Month {f.monthIndex}</td>
                                    <td className="px-8 py-5 text-sm font-bold text-zinc-600">{formatCurrency(f.projectedCashBaseCents)}</td>
                                    <td className={`px-8 py-5 text-sm font-black ${f.projectedNetIncomeCents >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                        {formatCurrency(f.projectedNetIncomeCents)}
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden min-w-[60px]">
                                                <div
                                                    className={`h-full rounded-full ${f.projectedRiskScore > 70 ? 'bg-emerald-500' : f.projectedRiskScore > 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                    style={{ width: `${f.projectedRiskScore}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-black text-zinc-400">{f.projectedRiskScore}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-20 flex flex-col items-center justify-between gap-10 p-12 bg-zinc-900 rounded-[40px] text-white relative overflow-hidden text-center md:text-left md:flex-row">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/10 blur-[120px] -mr-20 -mt-20" />
                <div className="space-y-4 relative z-10">
                    <h2 className="text-3xl font-black tracking-tight leading-tight">Prepare for Scale. <span className="text-brand-blue">Optimize for Value.</span></h2>
                    <p className="text-zinc-400 font-medium max-w-lg">
                        Our intelligence engine suggests that simulation scenario Month {breakthroughMonth || 4} is your critical pivot point.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
                    <button
                        onClick={() => exportToExcel(forecasts, { rev: revMod, exp: expMod, funding: fundingIn, dev: devHires, sales: salesHires })}
                        className="bg-zinc-800 text-white border border-white/10 font-black px-8 py-5 rounded-2xl hover:bg-zinc-700 transition-all flex items-center gap-3 whitespace-nowrap"
                    >
                        <Download className="w-5 h-5 text-zinc-400" /> Export Modeling
                    </button>
                    <button
                        onClick={() => generateInvestorDossier(data, forecasts, { rev: revMod, exp: expMod, funding: fundingIn }, radarData)}
                        className="bg-white text-zinc-900 font-black px-10 py-5 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-3 whitespace-nowrap"
                    >
                        Investor Dossier <ArrowRight strokeWidth={3} className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Forecast;
