import { useState, useEffect, useRef } from 'react';
import GlassCard from '../components/GlassCard';
import apiClient from '../services/apiClient';
import { parseLedgerFile, exportToExcel } from '../services/excelService';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileSpreadsheet,
    Upload,
    TrendingUp,
    TrendingDown,
    Calendar,
    Search,
    Download,
    Trash2,
    Plus,
    AlertCircle
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';

const DailyLedger = () => {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await apiClient.get('daily');
            if (response.status === 200) {
                setTransactions(response.data.transactions);
                setSummary(response.data.dailySummary);
            }
        } catch (err) {
            console.error("Fetch Daily Error:", err);
            setError("Failed to synchronize with ledger engine.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (file) => {
        if (!file) return;
        setUploading(true);
        setError(null);
        try {
            const parsed = await parseLedgerFile(file);
            const response = await apiClient.post('daily/bulk', { transactions: parsed });
            if (response.status === 201) {
                fetchData();
            }
        } catch (err) {
            setError(err.message || "Spreadsheet ingestion failed.");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Remove this transaction from intelligence ledger?")) return;
        try {
            await apiClient.delete(`daily/${id}`);
            setTransactions(prev => prev.filter(t => t._id !== id));
            // In a real app we'd re-aggregate summary or re-fetch
        } catch (err) {
            alert("Delete operation failed.");
        }
    };

    const filteredTransactions = transactions.filter(t =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const chartData = Object.entries(summary).map(([date, vals]) => ({
        date,
        income: vals.income / 100,
        expense: vals.expense / 100,
        net: (vals.income - vals.expense) / 100
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    const totalIncome = transactions.reduce((sum, t) => t.category === 'Income' ? sum + t.amountCents : sum, 0) / 100;
    const totalExpense = transactions.reduce((sum, t) => t.category !== 'Income' ? sum + t.amountCents : sum, 0) / 100;

    if (loading) return <div className="flex h-96 items-center justify-center animate-pulse text-zinc-400 font-black uppercase text-xs tracking-widest">Initialising Ledger Engine...</div>;

    return (
        <div className="space-y-6 pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase">Daily Transaction Matrix</h1>
                    <p className="text-zinc-500 mt-2 text-sm font-bold bg-white border border-zinc-200 shadow-sm inline-block px-3 py-1.5 rounded-lg uppercase tracking-widest">High-Frequency Ledger Intelligence</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => exportToExcel(transactions)}
                        className="h-12 px-6 bg-white border border-zinc-200 text-zinc-900 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-zinc-50 transition-all shadow-sm active:scale-95 flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" /> Export Excel
                    </button>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="h-12 px-6 bg-brand-blue text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-brand-indigo transition-all shadow-lg shadow-brand-blue/20 active:scale-95 flex items-center gap-2"
                    >
                        {uploading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white" /> : <Plus className="w-4 h-4" />}
                        {uploading ? 'Processing...' : 'Sync Spreadsheet'}
                    </button>
                    <input type="file" ref={fileInputRef} onChange={e => handleFileUpload(e.target.files[0])} className="hidden" accept=".xlsx,.csv" />
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="p-8 border-l-4 border-emerald-500">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Total Period Inflow</p>
                        <TrendingUp className="text-emerald-500 w-4 h-4" />
                    </div>
                    <div className="text-4xl font-black tracking-tighter text-zinc-900">
                        ₹{totalIncome.toLocaleString()}
                    </div>
                </GlassCard>

                <GlassCard className="p-8 border-l-4 border-risk-high">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Total Period Outflow</p>
                        <TrendingDown className="text-risk-high w-4 h-4" />
                    </div>
                    <div className="text-4xl font-black tracking-tighter text-zinc-900">
                        ₹{totalExpense.toLocaleString()}
                    </div>
                </GlassCard>

                <GlassCard className={`p-8 border-l-4 ${totalIncome - totalExpense >= 0 ? 'border-brand-blue' : 'border-orange-500'}`}>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Net Transaction Velocity</p>
                    <div className="text-4xl font-black tracking-tighter text-zinc-900">
                        ₹{(totalIncome - totalExpense).toLocaleString()}
                    </div>
                </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <GlassCard className="lg:col-span-2 p-8 h-[450px]">
                    <h2 className="text-xl font-black text-zinc-900 uppercase tracking-tighter mb-8">Daily Cash Velocity</h2>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 9, fontWeight: 700, fill: '#71717a' }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                />
                                <YAxis
                                    tick={{ fontSize: 9, fontWeight: 700, fill: '#71717a' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e4e4e7', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}
                                />
                                <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                                <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} fillOpacity={0} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                <GlassCard className="p-8 flex flex-col">
                    <h2 className="text-xl font-black text-zinc-900 uppercase tracking-tighter mb-8">Quick Entry</h2>
                    <form className="space-y-4 flex-1" onSubmit={e => e.preventDefault()}>
                        {/* Simple form placeholders for manual entry if needed */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Description</label>
                            <input className="w-full bg-zinc-50 border border-zinc-100 rounded-lg p-3 text-sm font-bold" placeholder="Vendor Payment..." />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Category</label>
                                <select className="w-full bg-zinc-50 border border-zinc-100 rounded-lg p-3 text-sm font-bold">
                                    <option>Income</option>
                                    <option>Opex</option>
                                    <option>COGS</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Amount</label>
                                <input className="w-full bg-zinc-50 border border-zinc-100 rounded-lg p-3 text-sm font-bold" placeholder="0.00" />
                            </div>
                        </div>
                        <button className="w-full py-4 bg-zinc-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-all mt-auto">Record Transaction</button>
                    </form>
                </GlassCard>
            </div>

            <GlassCard className="overflow-hidden">
                <div className="p-8 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-xl font-black text-zinc-900 uppercase tracking-tighter">Master Transaction Ledger</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                        <input
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="bg-zinc-100 border-none rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold w-full md:w-64 focus:ring-2 focus:ring-brand-blue/20"
                            placeholder="Search ledger..."
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-zinc-50 border-b border-zinc-100">
                                <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Date</th>
                                <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Description</th>
                                <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Category</th>
                                <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Amount</th>
                                <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {filteredTransactions.map((t) => (
                                <tr key={t._id} className="hover:bg-zinc-50/50 transition-colors">
                                    <td className="px-8 py-4 font-bold text-zinc-500 text-sm">{new Date(t.date).toLocaleDateString()}</td>
                                    <td className="px-8 py-4 font-black text-zinc-900 text-sm uppercase tracking-tighter">{t.description}</td>
                                    <td className="px-8 py-4">
                                        <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${t.category === 'Income' ? 'bg-emerald-500/10 text-emerald-600' :
                                                t.category === 'COGS' ? 'bg-orange-500/10 text-orange-600' :
                                                    'bg-zinc-100 text-zinc-500'
                                            }`}>
                                            {t.category}
                                        </span>
                                    </td>
                                    <td className={`px-8 py-4 font-black text-sm ${t.category === 'Income' ? 'text-emerald-500' : 'text-zinc-900'}`}>
                                        {t.category === 'Income' ? '+' : '-'}₹{(t.amountCents / 100).toLocaleString()}
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(t._id)}
                                            className="p-2 text-zinc-300 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredTransactions.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <AlertCircle className="w-8 h-8 text-zinc-200 mb-2" />
                                            <p className="text-zinc-400 font-black uppercase text-xs tracking-widest">Ledger is empty. Sync your spreadsheet to begin.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
};

export default DailyLedger;
