import React, { useRef, useState } from "react";
import { useMotionValueEvent, useScroll, motion } from "framer-motion";

export const StickyScrollReveal = ({
    content,
    contentClassName
}) => {
    const [activeCard, setActiveCard] = useState(0);
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        // Using container: ref for contained scroll as requested
        container: ref,
        offset: ["start start", "end start"],
    });
    const cardLength = content.length;

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const cardsBreakpoints = content.map((_, index) => index / cardLength);
        const closestBreakpointIndex = cardsBreakpoints.reduce((acc, breakpoint, index) => {
            const distance = Math.abs(latest - breakpoint);
            if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
                return index;
            }
            return acc;
        }, 0);
        setActiveCard(closestBreakpointIndex);
    });

    // CodeSapiens Brand Colors / Gradients
    const backgroundColors = [
        "#F7F5F2", // Cream (Light)
        "#1E1919", // Dark
        "#F7F5F2",
        "#1E1919"
    ];

    // Custom text colors based on background
    const getTextColors = (index) => {
        const isDark = backgroundColors[index % backgroundColors.length] === "#1E1919";
        return isDark ? "text-white" : "text-[#1E1919]";
    };

    return (
        <motion.div
            animate={{
                backgroundColor: backgroundColors[activeCard % backgroundColors.length],
            }}
            transition={{ duration: 0.5 }}
            // Fixed height and overflow-y-auto for contained scroll
            className="h-[30rem] overflow-y-auto flex justify-center relative space-x-10 rounded-sm p-10 hide-scrollbar"
            ref={ref}
        >
            <div className="div relative flex items-start px-4 w-full md:w-1/2">
                <div className="max-w-2xl">
                    {content.map((item, index) => (
                        <div key={item.title + index} className="my-20 min-h-[200px]">
                            <motion.h2
                                initial={{ opacity: 0 }}
                                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                                className={`text-3xl font-bold mb-4 ${getTextColors(activeCard)}`}
                            >
                                {item.title}
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                                className={`text-lg max-w-sm leading-relaxed ${getTextColors(activeCard)} opacity-80`}
                            >
                                {item.description}
                            </motion.p>
                        </div>
                    ))}
                    <div className="h-40" />
                </div>
            </div>
            <div
                className={`hidden lg:block h-80 w-1/2 sticky top-10 overflow-hidden rounded-sm ${contentClassName || ""}`}
            >
                {content[activeCard].content ?? null}
            </div>
        </motion.div>
    );
};
