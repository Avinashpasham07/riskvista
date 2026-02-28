import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';

/**
 * Premium SaaS Authentication Layout
 * Wraps the auth screens in a subtle dark gradient and animates the outlet.
 */
const AuthLayout = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full bg-zinc-950 pointer-events-none -z-20" />
            <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-brand-blue/20 rounded-full blur-[120px] pointer-events-none -z-10" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-indigo/10 rounded-full blur-[100px] pointer-events-none -z-10" />

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md z-10"
            >
                <Outlet />
            </motion.div>
        </div>
    );
};

export default AuthLayout;
