"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export const DraggableCardContainer = ({
    children,
    className
}) => {
    const containerRef = useRef(null);

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative flex min-h-screen w-full items-center justify-center overflow-clip",
                className
            )}
        >
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child) && child.type === DraggableCardBody) {
                    return React.cloneElement(child, { containerRef });
                }
                return child;
            })}
        </div>
    );
};

export const DraggableCardBody = ({
    children,
    className,
    containerRef
}) => {
    return (
        <motion.div
            drag
            dragConstraints={containerRef}
            whileDrag={{ scale: 1.05, zIndex: 50 }}
            dragTransition={{ power: 0.2, timeConstant: 200 }}
            className={cn(
                "absolute cursor-grab active:cursor-grabbing p-4 bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border border-neutral-100 dark:border-neutral-700",
                className
            )}
        >
            {children}
        </motion.div>
    );
};
