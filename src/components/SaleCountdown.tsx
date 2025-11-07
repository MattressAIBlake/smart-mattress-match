import { useState, useEffect } from "react";
import { SALE_CONFIG } from "@/config/sale";

interface SaleCountdownProps {
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export const SaleCountdown = ({ className = "", showLabel = true, size = "md" }: SaleCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!SALE_CONFIG.SALE_ACTIVE) return;

    const calculateTimeLeft = () => {
      const difference = +new Date(SALE_CONFIG.SALE_END_DATE) - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!SALE_CONFIG.SALE_ACTIVE) return null;

  const sizeClasses = {
    sm: "text-xs gap-1",
    md: "text-sm gap-2",
    lg: "text-base gap-3",
  };

  const digitClasses = {
    sm: "min-w-[28px] h-7 text-sm",
    md: "min-w-[36px] h-9 text-base",
    lg: "min-w-[44px] h-11 text-lg",
  };

  return (
    <div className={`flex items-center ${sizeClasses[size]} ${className}`}>
      {showLabel && (
        <span className="font-semibold text-amber-600 dark:text-amber-400 mr-2">
          Sale Ends In:
        </span>
      )}
      <div className="flex items-center gap-1">
        {[
          { value: timeLeft.days, label: "D" },
          { value: timeLeft.hours, label: "H" },
          { value: timeLeft.minutes, label: "M" },
          { value: timeLeft.seconds, label: "S" },
        ].map((unit, index) => (
          <div key={unit.label} className="flex items-center">
            <div className={`flex flex-col items-center justify-center ${digitClasses[size]} bg-gradient-to-br from-amber-900 to-amber-700 text-white font-bold rounded px-1 shadow-md`}>
              <span className="leading-none">{String(unit.value).padStart(2, "0")}</span>
              <span className="text-[0.6em] opacity-80 leading-none">{unit.label}</span>
            </div>
            {index < 3 && <span className="mx-0.5 text-amber-600 dark:text-amber-400 font-bold">:</span>}
          </div>
        ))}
      </div>
    </div>
  );
};
