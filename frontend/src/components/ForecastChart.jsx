import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';

/**
 * Premium Recharts Forecast Visualization (Light Theme)
 * Maps the 6-month prediction array output from Phase 9 into a highly styled, 
 * smoothly animated light mode chart.
 */
const ForecastChart = ({ data, runwayThreshold = 0 }) => {

    const chartData = data.map((point) => ({
        month: `Month ${point.monthIndex}`,
        Base: point.projectedCashBaseCents / 100,
        Best: point.projectedCashBestCents / 100,
        Worst: point.projectedCashWorstCents / 100
    }));

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/95 backdrop-blur-md border border-zinc-200 p-4 rounded-xl shadow-2xl ring-1 ring-zinc-900/5">
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-3">{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between space-x-6 mb-1 relative z-10">
                            <span className="text-xs font-bold flex items-center" style={{ color: entry.color }}>
                                <div className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
                                {entry.name}
                            </span>
                            <span className="font-black text-zinc-900 text-sm tracking-tight">
                                ${entry.value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ width: '100%', height: 350, minHeight: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorBest" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorWorst" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />

                    <XAxis
                        dataKey="month"
                        stroke="#a1a1aa"
                        fontSize={10}
                        fontWeight={900}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                    />
                    <YAxis
                        stroke="#a1a1aa"
                        fontSize={10}
                        fontWeight={900}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
                        dx={-10}
                    />

                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="3 3" />

                    <Area
                        type="monotone"
                        dataKey="Best"
                        stroke="#10b981"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        fill="url(#colorBest)"
                    />

                    <Area
                        type="monotone"
                        dataKey="Base"
                        stroke="#3b82f6"
                        strokeWidth={4}
                        fill="url(#colorBase)"
                    />

                    <Area
                        type="monotone"
                        dataKey="Worst"
                        stroke="#ef4444"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        fill="url(#colorWorst)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ForecastChart;

