import { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

/**
 * AnimatedCounter
 * Smoothly scales a numerical value from 0 to its target over time.
 * Excellent for adding premium SaaS feel to KPI cards without CSS jank.
 */
const AnimatedCounter = ({ value, prefix = "", suffix = "", decimalPlaces = 0 }) => {
    // Physics-based spring config
    const spring = useSpring(0, { mass: 1, stiffness: 60, damping: 15 });

    // Transform raw spring float into formatted string
    const displayValue = useTransform(spring, (current) => {
        return `${prefix}${current.toFixed(decimalPlaces)}${suffix}`;
    });

    useEffect(() => {
        if (value === undefined || isNaN(value)) {
            spring.set(0);
        } else {
            spring.set(value);
        }
    }, [value, spring]);

    return <motion.span>{displayValue}</motion.span>;
};

export default AnimatedCounter;
