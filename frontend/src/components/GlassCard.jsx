import { motion } from 'framer-motion';

/**
 * Reusable Premium Card
 * Standardizes the Awwwards-winning minimal SaaS aesthetic.
 */
const GlassCard = ({ children, className = "" }) => {
    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`premium-card p-8 ${className}`}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;
