import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LayoutDashboard, SlidersHorizontal, Settings, LogOut, ChartLine, Database } from 'lucide-react';

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const location = useLocation();
    const { logout } = useAuth();

    // Lucide Icons mapped to routes
    const navItems = [
        { path: '/dashboard', label: 'Intelligence', icon: LayoutDashboard },
        { path: '/data-entry', label: 'Data Input', icon: Database },
        { path: '/simulate', label: 'What-If Engine', icon: SlidersHorizontal },
        { path: '/forecast', label: 'Forecast', icon: ChartLine },
    ];

    // Auto-expand on hover if collapsed
    const isExpanded = !collapsed || isHovering;

    return (
        <motion.div
            animate={{ width: isExpanded ? 256 : 80 }}
            className="h-screen sticky top-0 bg-white border-r border-zinc-200 flex flex-col shrink-0 z-50 shadow-sm"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Header / Logo */}
            <div className="h-16 flex items-center px-6 border-b border-zinc-200">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center shrink-0 shadow-sm">
                    <span className="text-white font-bold text-lg">S</span>
                </div>
                <AnimatePresence>
                    {isExpanded && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="ml-3 font-bold tracking-tight text-zinc-900 whitespace-nowrap"
                        >
                            Risk Platform
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
                <p className={`text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 px-3 ${!isExpanded ? 'text-center' : ''}`}>
                    {!isExpanded ? 'Nav' : 'Main Menu'}
                </p>

                {navItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    const Icon = item.icon;
                    return (
                        <Link key={item.path} to={item.path}>
                            <motion.div
                                className={`flex items-center px-3 py-3 rounded-xl transition-all relative group ${isActive ? 'bg-zinc-50 text-zinc-900 shadow-sm border border-zinc-200/50' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50/80 border border-transparent'}`}
                            >
                                {isActive && (
                                    <motion.div layoutId="sidebar-active" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-blue rounded-r-md" />
                                )}
                                <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-brand-blue' : ''}`} />
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.span
                                            initial={{ opacity: 0, w: 0 }}
                                            animate={{ opacity: 1, w: "auto" }}
                                            exit={{ opacity: 0, w: 0 }}
                                            className="ml-3 font-semibold text-sm whitespace-nowrap"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>

                                {/* Tooltip for collapsed state (only if not auto-expanding on hover, though auto-expanding makes this mostly redundant save for very fast swiping) */}
                                {!isExpanded && !isHovering && (
                                    <div className="absolute left-14 bg-zinc-900 text-white font-medium text-xs px-2.5 py-1.5 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-nowrap shadow-lg">
                                        {item.label}
                                    </div>
                                )}
                            </motion.div>
                        </Link>
                    )
                })}
            </div>

            {/* Footer Actions */}
            <div className="p-3 border-t border-zinc-200 space-y-2">
                <button
                    onClick={() => {
                        setCollapsed(!collapsed);
                        if (!collapsed) setIsHovering(false);
                    }}
                    className="w-full flex items-center px-3 py-3 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors group font-semibold"
                >
                    <svg className={`w-5 h-5 shrink-0 transition-transform duration-300 ${!isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                    <AnimatePresence>
                        {isExpanded && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="ml-3 text-sm whitespace-nowrap">Collapse</motion.span>}
                    </AnimatePresence>
                </button>
                <button onClick={logout} className="w-full flex items-center px-3 py-3 rounded-xl text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-colors group font-semibold">
                    <LogOut className="w-5 h-5 shrink-0" />
                    <AnimatePresence>
                        {isExpanded && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="ml-3 text-sm whitespace-nowrap">Sign out</motion.span>}
                    </AnimatePresence>
                </button>
            </div>
        </motion.div>
    );
};

export default Sidebar;
