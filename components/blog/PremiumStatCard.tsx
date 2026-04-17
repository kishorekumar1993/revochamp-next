// PremiumStatCard.tsx
import React, { useState, useEffect, useRef } from "react";

interface PremiumStatCardProps {
  stat: string | number;
  label?: string;
  trend?: string | number | null;
  icon?: React.ReactNode | string;
  trendDirection?: "up" | "down" | "neutral";
  animateNumber?: boolean;
  duration?: number;
  className?: string;
}

const PremiumStatCard: React.FC<PremiumStatCardProps> = ({
  stat,
  label,
  trend,
  icon = "📊",
  animateNumber = true,
  duration = 1000,
  className = "",
}) => {
  const [displayValue, setDisplayValue] = useState<string | number>(
    animateNumber ? 0 : stat
  );
  const [isHovered, setIsHovered] = useState(false);
  const prevStatRef = useRef(stat);

  // Animate number on mount or stat change
  useEffect(() => {
    if (!animateNumber) {
      setDisplayValue(stat);
      return;
    }

    const start = parseFloat(String(prevStatRef.current)) || 0;
    const end = parseFloat(String(stat));
    if (isNaN(end)) {
      setDisplayValue(stat);
      return;
    }

    const step = (end - start) / (duration / 16);
    let current = start;
    const timer = setInterval(() => {
      current += step;
      if ((step > 0 && current >= end) || (step < 0 && current <= end)) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.round(current));
      }
    }, 16);
    prevStatRef.current = stat;
    return () => clearInterval(timer);
  }, [stat, animateNumber, duration]);

  // Trend detection and formatting
  const getTrendInfo = () => {
    if (trend == null) return null;
    const str = String(trend).trim();
    if (str === "") return null;

    const firstChar = str[0];
    let direction: "up" | "down" | "neutral" = "neutral";
    let value = str;

    if (firstChar === "+") {
      direction = "up";
      value = str.slice(1);
    } else if (firstChar === "-") {
      direction = "down";
      value = str.slice(1);
    } else if (!isNaN(Number(str)) && str !== "") {
      const num = Number(str);
      direction = num >= 0 ? "up" : "down";
      value = Math.abs(num).toString();
    }

    return { direction, value };
  };

  const trendInfo = getTrendInfo();

  // Helper to render icon
  const renderIcon = () => {
    if (typeof icon === "string") {
      return <span className="text-4xl">{icon}</span>;
    }
    return icon;
  };

  return (
    <div
      className={`
        relative group overflow-hidden rounded-3xl
        bg-white/10 backdrop-blur-xl
        dark:bg-slate-900/80 dark:backdrop-blur-xl
        border border-white/20 dark:border-slate-700/50
        shadow-2xl
        transition-all duration-500 ease-out
        hover:shadow-blue-500/20 dark:hover:shadow-purple-500/20
        hover:scale-[1.02] hover:rotate-[0.5deg]
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      aria-label={`${label || "Stat"} card: ${stat}`}
    >
      {/* Animated gradient border (on hover) */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 blur-xl" />

      {/* Glass inner card */}
      <div className="relative z-10 p-6 rounded-3xl bg-white/5 dark:bg-slate-800/30 backdrop-blur-sm h-full">
        {/* Top bar with shine effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left rounded-t-3xl" />

        <div className="flex items-start justify-between gap-4">
          {/* Left content */}
          <div className="flex-1 min-w-0">
            {/* Label with subtle badge style */}
            {label && (
              <div className="inline-block mb-3 px-2 py-0.5 text-xs font-semibold tracking-wider uppercase rounded-full bg-white/10 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-white/20">
                {label}
              </div>
            )}

            {/* Stat value with dynamic sizing and gradient */}
            <div className="flex items-baseline gap-2 flex-wrap">
              <span
                className={`
                  text-5xl md:text-6xl lg:text-7xl font-black
                  bg-gradient-to-r from-slate-800 to-slate-600
                  dark:from-white dark:to-slate-300
                  bg-clip-text text-transparent
                  tracking-tight leading-none
                  transition-all duration-300
                  ${isHovered ? "scale-105 origin-left" : ""}
                `}
              >
                {displayValue}
              </span>
              {trendInfo && (
                <span
                  className={`
                    text-sm font-bold px-2 py-1 rounded-full
                    flex items-center gap-1
                    transition-all duration-300
                    ${trendInfo.direction === "up" ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" : ""}
                    ${trendInfo.direction === "down" ? "bg-rose-500/20 text-rose-600 dark:text-rose-400" : ""}
                    ${trendInfo.direction === "neutral" ? "bg-slate-500/20 text-slate-600 dark:text-slate-400" : ""}
                  `}
                  aria-label={`Trend ${trendInfo.direction}: ${trendInfo.value}`}
                >
                  {trendInfo.direction === "up" && "▲"}
                  {trendInfo.direction === "down" && "▼"}
                  {trendInfo.direction === "neutral" && "•"}
                  <span>{trendInfo.value}</span>
                </span>
              )}
            </div>
          </div>

          {/* Icon with animated pulse on hover */}
          <div
            className={`
              flex-shrink-0 text-5xl transition-all duration-500
              ${isHovered ? "scale-110 rotate-3" : "scale-100"}
            `}
          >
            <div className="relative">
              {renderIcon()}
              {/* Glow behind icon on hover */}
              <div className="absolute inset-0 blur-xl bg-white/30 dark:bg-purple-500/30 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 -z-10" />
            </div>
          </div>
        </div>

        {/* Optional subtle progress bar or extra info can go here */}
        <div className="mt-4 h-0.5 w-full bg-white/10 dark:bg-slate-700/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-1000"
            style={{ width: isHovered ? "100%" : "0%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default PremiumStatCard;