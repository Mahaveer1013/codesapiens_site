import React, { useRef, useState } from "react";
import { useMotionValueEvent, useScroll, motion } from "framer-motion";

export const StickyScrollReveal = ({
  content,
  contentClassName,
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    // "start start" = when top of container hits top of viewport
    // "end start" = when bottom of container hits top of viewport
    // This covers the whole scroll duration better
    offset: ["start start", "end start"], 
  });

  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    setActiveCard(closestBreakpointIndex);
  });

  const backgroundColors = [
    "#F7F5F2", // Cream (Light)
    "#1E1919", // Dark
    "#F7F5F2",
    "#1E1919",
  ];

  const getTextColors = (index) => {
    const isDark = backgroundColors[index % backgroundColors.length] === "#1E1919";
    return isDark ? "text-white" : "text-[#1E1919]";
  };

  return (
    <motion.div
      ref={ref}
      animate={{
        backgroundColor: backgroundColors[activeCard % backgroundColors.length],
      }}
      transition={{ duration: 0.5 }}
      // h-[300vh] is arbitrary; the real height comes from content. 
      // relative is needed for the sticky child to reference.
      className="relative w-full rounded-sm"
    >
      <div className="flex flex-col lg:flex-row justify-center items-start gap-10 p-6 md:p-10">
        
        {/* Left side - Scrollable content */}
        <div className="w-full lg:w-1/2 relative z-10">
          <div className="py-20"> {/* Added padding to start/end */}
            {content.map((item, index) => (
              <div 
                key={item.title + index} 
                className="my-20 min-h-[60vh] flex flex-col justify-center" // increased spacing/height
              >
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                  transition={{ duration: 0.3 }}
                  className={`text-3xl font-bold mb-4 ${getTextColors(activeCard)}`}
                >
                  {item.title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                  transition={{ duration: 0.3 }}
                  className={`text-lg max-w-sm leading-relaxed ${getTextColors(activeCard)} opacity-80`}
                >
                  {item.description}
                </motion.p>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Sticky content */}
        {/* items-start on parent + sticky top on this child is key */}
        <div className="hidden lg:block w-1/2 sticky top-10 overflow-hidden">
          <div
            className={`h-[400px] w-full rounded-lg ${contentClassName || ""}`}
          >
            <motion.div
                key={activeCard} // Key change triggers the animation
                initial={{ opacity: 0, scale: 0.9 }} // Added subtle scale for better feel
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full h-full flex items-center justify-center"
            >
                {/* Ensure content exists before rendering */}
                {content[activeCard]?.content ?? null}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};