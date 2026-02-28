import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    Sparkles,
    ArrowRight,
    Shield,
    Zap,
    TrendingUp,
    Activity,
    Cpu,
    Database,
    Globe,
    BarChart3,
    MessageSquare,
    Plus,
    Minus
} from "lucide-react";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { BackgroundBeams } from "@/components/ui/background-beams";

const Landing = () => {
    const [openFaq, setOpenFaq] = useState(0);

    const testimonials = [
        {
            quote: "RiskVista transformed our burn analysis. We identified a 15% efficiency gap in our sales cycle within 48 hours.",
            name: "Marcus Thorne",
            designation: "CEO at NovaScale",
            src: "https://tse4.mm.bing.net/th/id/OIP.eqWZZ_heeTqdWYRJlTNhKAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
        },
        {
            quote: "The hiring simulator is a game-changer. Seeing the 2-month ramp-up delay plotted against our runway saved us from a bad Q3 pivot.",
            name: "Elena Rodriguez",
            designation: "Founder at Bloom AI",
            src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=3540&auto=format&fit=crop",
        },
        {
            quote: "Multicurrency support in a risk platform? Finally. Handling our EUR and INR entities in one dashboard is seamless.",
            name: "Sanjay Gupta",
            designation: "CFO at GlobalStack",
            src: "https://petapixel.com/assets/uploads/2019/02/download-4.jpeg",
        },
    ];

    const steps = [
        {
            num: "01",
            title: "Ingest Data",
            desc: "Connect your bank APIs or manually upload P&L statements. We process everything in cents to ensure zero mathematical drift.",
            icon: <Database className="w-6 h-6" />
        },
        {
            num: "02",
            title: "Compute Intelligence",
            desc: "The RiskVista Engine v2.1 calculates your 100-point Health Index and identifies hidden burn acceleration.",
            icon: <Cpu className="w-6 h-6" />
        },
        {
            num: "03",
            title: "Simulate Pivots",
            desc: "Use the projection engine to stress-test your business against revenue drops or sudden expense spikes.",
            icon: <Activity className="w-6 h-6" />
        },
        {
            num: "04",
            title: "Deploy Directives",
            desc: "Receive actionable survival advice tailored to your specific liquidity bottoms and debt ratios.",
            icon: <MessageSquare className="w-6 h-6" />
        }
    ];

    const faqs = [
        {
            q: "How accurate are the 6-month projections?",
            a: "Our v2.1 Engine utilizes MoM growth compounding and a +/- 1.5% volatility variance model. While no model can predict the future with 100% certainty, our simulations out-perform linear spreadsheets by accounting for realistic market fluctuations."
        },
        {
            q: "Is my financial data secure?",
            a: "RiskVista uses institutional-grade security. All records are isolated, encrypted at rest, and protected by JWT-guarded REST APIs with strict rate-limiting protocol."
        },
        {
            q: "What is the 'Collapse Probability'?",
            a: "This is a predictive metric that quantifies the likelihood of insolvency within 3-6 months. It factors in your current runway, debt leverage, and historical burn acceleration."
        }
    ];

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900 selection:bg-blue-500/10 overflow-x-hidden font-sans">

            {/* --- NAVIGATION --- */}
            <nav className="fixed w-full top-0 z-[100] border-b border-zinc-200 bg-white/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center font-black text-white shadow-lg text-[10px]">
                            RV
                        </div>
                        <span className="font-black tracking-tighter text-lg uppercase text-zinc-900">RiskVista</span>
                    </div>
                    <div className="flex items-center gap-8">
                        <Link to="/login" className="text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors">SignIn</Link>
                        <Link to="/register" className="h-10 px-6 flex items-center bg-zinc-900 text-white text-sm font-bold rounded-lg hover:bg-zinc-800 transition-all active:scale-95">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <section className="relative pt-40 pb-32 lg:pt-56 lg:pb-56 px-6 overflow-hidden">
                <BackgroundBeams className="opacity-20" />
                <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-8">
                            <Sparkles className="w-3 h-3" />
                            Financial Intelligence Re-Engineered
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-zinc-900 overflow-visible">
                            The mathematical <span className="text-shimmer">future</span> of your startup.
                        </h1>
                        <p className="text-lg md:text-xl text-zinc-500 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                            Stop guessing. Deploy AI-driven stress tests, compound growth modeling, and predictive solvency alerts in 30 seconds.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/register" className="group h-14 px-10 bg-zinc-900 text-white font-black rounded-xl flex items-center gap-2 hover:bg-zinc-800 transition-all hover:scale-105 active:scale-95 shadow-xl">
                                Launch Dashboard
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                            </Link>
                            <a href="#how" className="h-14 px-10 border border-zinc-200 text-zinc-900 font-bold rounded-xl flex items-center hover:bg-white transition-colors">
                                Understand the Journey
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- OPERATIONAL PROTOCOL (The Step Section) --- */}
            <section id="how" className="py-24 px-6 border-y border-zinc-100 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24 space-y-4">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.34em] text-blue-600">Operational Protocol</h2>
                        <h3 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-900">From Raw Data to <br /> <span className="text-zinc-400">Total Intelligence.</span></h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="relative group"
                            >
                                <div className="text-[80px] font-black text-zinc-100 leading-none absolute -top-12 -left-2 -z-10 group-hover:text-zinc-200 transition-colors">
                                    {step.num}
                                </div>
                                <div className="p-8 rounded-[2.5rem] bg-zinc-50/50 border border-zinc-200 hover:border-zinc-300 hover:bg-white transition-all duration-300 h-full flex flex-col shadow-sm">
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center shadow-sm mb-8 group-hover:scale-110 transition-transform">
                                        <div className="text-zinc-900">{step.icon}</div>
                                    </div>
                                    <h4 className="text-xl font-black mb-4 text-zinc-900">{step.title}</h4>
                                    <p className="text-sm font-medium text-zinc-500 leading-relaxed mb-6">
                                        {step.desc}
                                    </p>
                                    <div className="mt-auto h-1 w-12 bg-zinc-200 rounded-full group-hover:bg-blue-600 group-hover:w-full transition-all duration-500" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- BENTO GRID FEATURES --- */}
            <section id="bento" className="py-24 px-6 bg-zinc-50/30">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                        <div className="space-y-4">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Core Engine</h2>
                            <p className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900">Quantified Solvency.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 grid-rows-2 gap-4">
                        <div className="md:col-span-2 lg:col-span-3 md:row-span-2 p-10 bg-white border border-zinc-200 rounded-3xl shadow-lg hover:shadow-xl transition-all group overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -z-10" />
                            <div className="p-4 bg-zinc-900 text-white rounded-2xl w-fit mb-8 shadow-lg"><Shield className="w-8 h-8" strokeWidth={2.5} /></div>
                            <h3 className="text-3xl font-black mb-4 tracking-tighter text-zinc-900">Vista Risk Index</h3>
                            <p className="text-zinc-500 font-medium leading-relaxed text-lg mb-8">Proprietary 0-100 scoring based on cash-to-debt ratios, burn sensitivity, and margin stability.</p>
                            <div className="mt-auto pt-8 border-t border-zinc-100 flex items-center justify-between">
                                <span className="text-xs font-black uppercase text-zinc-400">Analysis v2.1</span>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1.5 h-6 rounded-full bg-zinc-900" style={{ height: `${i * 6}px` }} />)}
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-2 lg:col-span-3 p-8 bg-white border border-zinc-200 rounded-3xl flex flex-col justify-between shadow-sm">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Activity className="w-6 h-6" /></div>
                                <h4 className="font-black tracking-tight text-lg text-zinc-900">What-If Machine</h4>
                            </div>
                            <p className="text-zinc-500 text-sm font-medium">Instantly simulate loan injections, hiring growth, or revenue pivots to see immediate runway impact.</p>
                        </div>
                        <div className="md:col-span-2 lg:col-span-2 p-8 bg-white border border-zinc-200 rounded-3xl flex flex-col justify-between shadow-sm">
                            <BarChart3 className="text-zinc-300 w-10 h-10 mb-4" />
                            <h4 className="font-black text-lg text-zinc-900">Survival Directives</h4>
                            <p className="text-zinc-500 text-xs font-medium">Real-time survival advice based on your margin health and monthly burn acceleration.</p>
                        </div>
                        <div className="md:col-span-2 lg:col-span-1 p-8 bg-zinc-900 text-white rounded-3xl flex flex-col items-center justify-center text-center shadow-lg">
                            <Globe className="w-8 h-8 mb-4 text-white" />
                            <h4 className="font-black text-xl">Global IQ</h4>
                            <p className="text-[10px] uppercase font-black tracking-widest opacity-60">Multi-Currency</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- TESTIMONIALS (Premium Social Proof) --- */}
            <section className="py-32 px-6 border-y border-zinc-100 bg-white">
                <div className="max-w-7xl mx-auto text-center mb-16">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Validation</h2>
                    <h3 className="text-4xl md:text-5xl font-black mt-4 text-zinc-900">Growth Ops <span className="text-zinc-400">Consensus.</span></h3>
                </div>
                <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
            </section>

            {/* --- FAQ SECTION --- */}
            <section className="py-32 px-6 bg-zinc-50/50">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Knowledge Base</h2>
                        <h3 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900">Common <span className="text-zinc-400">Queries.</span></h3>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                                className={`p-6 md:p-8 rounded-[2rem] border transition-all cursor-pointer ${openFaq === i ? 'bg-zinc-900 border-zinc-900 shadow-xl' : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-sm'}`}
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <h4 className={`text-lg md:text-xl font-black tracking-tight ${openFaq === i ? 'text-white' : 'text-zinc-900'}`}>
                                        {faq.q}
                                    </h4>
                                    <div className={`p-2 rounded-full ${openFaq === i ? 'bg-white/10 text-white' : 'bg-zinc-50 text-zinc-400'}`}>
                                        {openFaq === i ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                    </div>
                                </div>
                                {openFaq === i && (
                                    <motion.p
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-6 text-zinc-400 font-medium leading-relaxed"
                                    >
                                        {faq.a}
                                    </motion.p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <section className="py-32 px-6 bg-zinc-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <BackgroundBeams />
                </div>
                <div className="max-w-5xl mx-auto text-center relative z-10 space-y-12">
                    <h2 className="text-5xl md:text-9xl font-black text-white tracking-tighter leading-tight shadow-2xl">Solvency is <br /> non-negotiable.</h2>
                    <Link to="/register" className="inline-flex h-20 px-12 bg-white text-zinc-900 font-black rounded-2xl items-center hover:scale-105 active:scale-95 transition-all shadow-2xl text-2xl">
                        Join the Protocol
                    </Link>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="py-20 px-6 border-t border-zinc-100 bg-white">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-12 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                        <div className="w-8 h-8 rounded bg-zinc-900 flex items-center justify-center font-black text-[10px] text-white">RV</div>
                        <span className="font-black text-xs tracking-tighter uppercase text-zinc-900">RiskVista Intelligence</span>
                    </div>
                    <div className="flex items-center justify-center gap-10">
                        {['Protocol', 'Engine', 'Security'].map(link => (
                            <a key={link} href="#" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">{link}</a>
                        ))}
                    </div>
                    <p className="text-[10px] font-bold text-zinc-400 md:text-right uppercase tracking-[0.2em]">© 2026 RISK VISTA LABS. SECURED PROTOCOL.</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
