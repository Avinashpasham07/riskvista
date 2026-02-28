import { useState, useRef } from 'react';
import GlassCard from '../components/GlassCard';
import apiClient from '../services/apiClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileText, CheckCircle } from 'lucide-react';
import { parseFinancialCSV } from '../services/csvParser';

const DataEntry = () => {
    const [formData, setFormData] = useState({
        periodDate: '',
        revenue: '',
        cogs: '',
        opex: '',
        cashOnHand: '',
        liabilities: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileUpload = async (file) => {
        if (!file) return;
        setUploadedFile(file);
        setLoading(true);
        setError(null);

        try {
            const parsedData = await parseFinancialCSV(file);
            setFormData(prev => ({
                ...prev,
                ...parsedData
            }));
            setSuccess(`File "${file.name}" parsed successfully! Form fields have been pre-filled.`);
        } catch (err) {
            setError(`Failed to parse file: ${err.message}`);
            setUploadedFile(null);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Frontend validation (all fields must be positive numbers)
            const payload = { periodDate: formData.periodDate };
            if (!payload.periodDate) throw new Error("Please select a Period Date");

            // Strip out any commas or strings the user might have typed, force to Float
            ['revenue', 'cogs', 'opex', 'cashOnHand', 'liabilities'].forEach(field => {
                const rawValue = formData[field].toString().replace(/,/g, '');
                const cleanNumber = parseFloat(rawValue);

                if (isNaN(cleanNumber) || cleanNumber < 0) {
                    throw new Error(`Invalid numerical value for ${field}`);
                }
                payload[field] = cleanNumber;
            });

            // Post to our ingestion API
            await apiClient.post('financial-records', payload);

            setSuccess('Financial record successfully ingested!');

            // Reset form for next month
            setFormData({
                periodDate: '',
                revenue: '',
                cogs: '',
                opex: '',
                cashOnHand: '',
                liabilities: ''
            });

        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to ingest data");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <header className="mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Data Ingestion</h1>
                    <p className="text-zinc-600 mt-2 text-sm font-medium bg-white border border-zinc-200 shadow-sm inline-block px-3 py-1.5 rounded-lg">Upload monthly telemetry into the risk intelligence engine.</p>
                </div>
            </header>

            <GlassCard className="p-0 border-zinc-200 overflow-hidden mb-10">
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const file = e.dataTransfer.files[0];
                        if (file) handleFileUpload(file);
                    }}
                    className={`p-10 border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer ${isDragging ? 'border-brand-blue bg-brand-blue/5' : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50'}`}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => handleFileUpload(e.target.files?.[0])}
                        className="hidden"
                        accept=".csv"
                    />

                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-zinc-100 mb-4">
                        {uploadedFile ? (
                            <CheckCircle className="text-emerald-500 w-8 h-8" />
                        ) : (
                            <Upload className="text-zinc-400 w-8 h-8" />
                        )}
                    </div>

                    <h3 className="text-lg font-black text-zinc-900 tracking-tight">
                        {uploadedFile ? `Ready to Commit: ${uploadedFile.name}` : 'Drop Financial File'}
                    </h3>
                    <p className="text-zinc-500 text-sm font-medium mt-1 max-w-xs">
                        {uploadedFile ? 'We\'ve pre-filled the form below based on your file. Review and save.' : 'Upload your monthly CSV to automatically map Revenue, Expenses, and Cash.'}
                    </p>

                    <div className="mt-6 flex items-center gap-2 px-3 py-1.5 bg-zinc-100 rounded-lg">
                        <FileText className="w-4 h-4 text-zinc-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Supports .CSV only</span>
                    </div>
                </div>
            </GlassCard>

            <GlassCard className="p-8">
                <div className="flex items-center justify-between mb-8 border-b border-zinc-100 pb-4">
                    <h2 className="text-xl font-black text-zinc-900 tracking-tight">Financial Record Details</h2>
                    {uploadedFile && (
                        <button
                            onClick={() => {
                                setUploadedFile(null);
                                setFormData({
                                    periodDate: '',
                                    revenue: '',
                                    cogs: '',
                                    opex: '',
                                    cashOnHand: '',
                                    liabilities: ''
                                });
                            }}
                            className="text-zinc-400 hover:text-red-500 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Date Row */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Period Date (Start of Month)</label>
                        <input
                            type="date"
                            name="periodDate"
                            value={formData.periodDate}
                            onChange={handleChange}
                            required
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all shadow-inner"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* P&L Block */}
                        <div className="space-y-5">
                            <h3 className="text-brand-blue font-bold text-sm tracking-widest uppercase border-b border-zinc-200 pb-2">Income Statement</h3>

                            <div>
                                <label className="block text-sm font-bold text-zinc-700 mb-1">Gross Revenue</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3.5 text-zinc-500 font-medium">$</span>
                                    <input type="number" step="0.01" name="revenue" value={formData.revenue} onChange={handleChange} required className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-8 pr-4 py-3 text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all shadow-inner" placeholder="105000.00" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-zinc-700 mb-1">Cost of Goods Sold (COGS)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3.5 text-zinc-500 font-medium">$</span>
                                    <input type="number" step="0.01" name="cogs" value={formData.cogs} onChange={handleChange} required className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-8 pr-4 py-3 text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all shadow-inner" placeholder="32000.00" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-zinc-700 mb-1">Operating Expenses (OPEX)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3.5 text-zinc-500 font-medium">$</span>
                                    <input type="number" step="0.01" name="opex" value={formData.opex} onChange={handleChange} required className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-8 pr-4 py-3 text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all shadow-inner" placeholder="84000.00" />
                                </div>
                            </div>
                        </div>

                        {/* Balance Sheet Block */}
                        <div className="space-y-5">
                            <h3 className="text-brand-indigo font-bold text-sm tracking-widest uppercase border-b border-zinc-200 pb-2">Balance Sheet Assets</h3>

                            <div>
                                <label className="block text-sm font-bold text-zinc-700 mb-1">Current Cash On Hand</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3.5 text-zinc-500 font-medium">$</span>
                                    <input type="number" step="0.01" name="cashOnHand" value={formData.cashOnHand} onChange={handleChange} required className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-8 pr-4 py-3 text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 transition-all shadow-inner" placeholder="450000.00" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-zinc-700 mb-1">Total Outstanding Liabilities</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3.5 text-zinc-500 font-medium">$</span>
                                    <input type="number" step="0.01" name="liabilities" value={formData.liabilities} onChange={handleChange} required className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-8 pr-4 py-3 text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 transition-all shadow-inner" placeholder="120000.00" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-medium text-sm shadow-sm">
                            {error}
                        </motion.div>
                    )}

                    {success && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 font-medium text-sm shadow-sm">
                            {success}
                        </motion.div>
                    )}

                    <div className="pt-6 border-t border-zinc-200">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-xl shadow-brand-blue/20 ${loading ? 'bg-brand-blue/50 cursor-not-allowed' : 'bg-brand-blue hover:bg-brand-indigo hover:shadow-brand-indigo/40'}`}
                        >
                            {loading ? 'Processing Array...' : 'Commit Financial Telemetry'}
                        </button>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
};

export default DataEntry;
