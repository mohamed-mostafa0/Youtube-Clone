"use client";
import { useState, useRef, useEffect } from "react";
import { categories } from "../data/mockData";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { motion } from "framer-motion";

export default function CategoryBar() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [scrollAmount, setScrollAmount] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const updateMaxScroll = () => {
      if (containerRef.current) {
        const { scrollWidth, clientWidth } = containerRef.current;
        setMaxScroll(scrollWidth - clientWidth);
      }
    };
    updateMaxScroll();
    
    setTimeout(updateMaxScroll, 100);
    
    window.addEventListener("resize", updateMaxScroll);
    return () => window.removeEventListener("resize", updateMaxScroll);
  }, []);

  const handleScroll = (direction) => {
    const amount = 200; 
    if (direction === "left") {
      setScrollAmount(Math.max(scrollAmount - amount, 0));
    } else {
      setScrollAmount(Math.min(scrollAmount + amount, maxScroll));
    }
  };

  return (
    <div className="sticky top-0 mb-10 z-10 bg-white dark:bg-[#0f0f0f] w-full border-b border-gray-200 dark:border-gray-800 flex items-center py-3 relative">
      
      {scrollAmount > 0 && (
        <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-white via-white dark:from-[#0f0f0f] dark:via-[#0f0f0f] to-transparent w-24 flex items-center justify-start px-4 z-10 pointer-events-none">
          <button
            onClick={() => handleScroll("left")}
            className="w-10 h-10 rounded-full bg-white dark:bg-[#0f0f0f] hover:bg-gray-100 dark:hover:bg-[#272727] flex items-center justify-center transition-colors pointer-events-auto shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
          >
            <MdChevronLeft className="w-6 h-6 text-gray-800 dark:text-gray-200" />
          </button>
        </div>
      )}

      <div className="overflow-hidden w-full px-4" ref={containerRef}>
        <motion.div 
          className="flex gap-3 whitespace-nowrap w-max"
          animate={{ x: -scrollAmount }}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === category
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-[#272727] dark:text-gray-200 dark:hover:bg-[#3f3f3f]"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>
      </div>

      {scrollAmount < maxScroll && (
        <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-white via-white dark:from-[#0f0f0f] dark:via-[#0f0f0f] to-transparent w-24 flex items-center justify-end px-4 z-10 pointer-events-none">
          <button
            onClick={() => handleScroll("right")}
            className="w-10 h-10 rounded-full bg-white dark:bg-[#0f0f0f] hover:bg-gray-100 dark:hover:bg-[#272727] flex items-center justify-center transition-colors pointer-events-auto shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
          >
            <MdChevronRight className="w-6 h-6 text-gray-800 dark:text-gray-200" />
          </button>
        </div>
      )}

    </div>
  );
}
