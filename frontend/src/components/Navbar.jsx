import { useAuth } from '../hooks/useAuth';
import { Bell, Search } from 'lucide-react';

const Navbar = () => {
    const { user } = useAuth(); // Extracted from decoded JWT context

    return (
        <nav className="h-16 px-8 flex items-center justify-between bg-white/80 backdrop-blur-xl border-b border-zinc-200 sticky top-0 z-10 w-full">
            {/* Left side: Context */}
            <div className="flex items-center">
                <h2 className="text-zinc-900 font-bold tracking-tight">Financial Intelligence Dashboard</h2>
            </div>

            {/* Right side: Actions & Profile */}
            <div className="flex items-center space-x-6">
                <div className="relative hidden md:block group text-zinc-400">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 group-hover:text-zinc-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search metrics or commands..."
                        className="bg-zinc-50 border border-zinc-200 rounded-full py-1.5 pl-9 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/50 w-64 transition-all shadow-sm"
                    />
                    <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-sans text-zinc-400 bg-white border border-zinc-200 shadow-sm px-1.5 rounded">⌘K</kbd>
                </div>

                <button className="relative text-zinc-400 hover:text-zinc-600 transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-brand-blue ring-2 ring-white"></span>
                </button>

                <div className="flex items-center pl-6 border-l border-zinc-200">
                    <div className="text-right mr-3 hidden md:block">
                        <p className="text-sm font-bold text-zinc-900 leading-tight">Admin Terminal</p>
                        <p className="text-xs text-zinc-500 leading-tight">{user?.email || 'Tenant User'}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center overflow-hidden flex-shrink-0 relative group cursor-pointer hover:border-brand-blue/50 hover:shadow-sm transition-all">
                        <span className="text-zinc-600 font-bold text-sm">
                            {user?.email?.[0].toUpperCase() || 'U'}
                        </span>
                        <div className="absolute inset-0 bg-zinc-900/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
