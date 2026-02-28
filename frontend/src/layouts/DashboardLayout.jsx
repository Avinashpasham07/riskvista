import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

/**
 * Premium SaaS Dashboard Layout Wrapper
 * Establishes the core 3-pane responsive grid (Sidebar, Navbar, Main Content)
 */
const DashboardLayout = () => {
    return (
        <div className="flex h-screen overflow-hidden bg-zinc-50 text-zinc-900">
            {/* 1. Left Sidebar (Collapsible) */}
            <Sidebar />

            {/* 2. Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Sticky Navbar */}
                <Navbar />

                {/* Main Scrollable Content Pane */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto relative perspective-1000">
                    {/* Ambient Glows for the Dashboard Core */}
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-indigo/5 rounded-full blur-[150px] pointer-events-none -z-10 mix-blend-multiply" />

                    {/* Centered Max-Width Container */}
                    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 w-full min-h-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
