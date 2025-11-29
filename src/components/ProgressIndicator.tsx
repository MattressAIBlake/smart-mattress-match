import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface ProgressIndicatorProps {
  currentStep: number;
  steps: string[];
}

export const ProgressIndicator = ({ currentStep, steps }: ProgressIndicatorProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center gap-2 sm:gap-3 mb-6 px-4 overflow-x-auto"
    >
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isCurrent = idx === currentStep;
        
        return (
          <div key={step} className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`flex items-center justify-center h-6 w-6 sm:h-8 sm:w-8 rounded-full transition-all duration-300 ${
                  isCompleted
                    ? "bg-primary text-primary-foreground"
                    : isCurrent
                    ? "bg-primary/20 border-2 border-primary"
                    : "bg-muted border-2 border-muted"
                }`}
              >
                {isCompleted ? (
                  <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                ) : (
                  <span className="text-xs sm:text-sm font-semibold">{idx + 1}</span>
                )}
              </motion.div>
              <span
                className={`text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                  isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`h-0.5 w-4 sm:w-8 transition-colors duration-300 ${
                  isCompleted ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        );
      })}
    </motion.div>
  );
};
