import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface FirmnessScaleProps {
  recommendedRange: [number, number]; // e.g., [4, 6]
}

export const FirmnessScale = ({ recommendedRange }: FirmnessScaleProps) => {
  const [min, max] = recommendedRange;
  const labels = ['Soft', '', '', '', 'Medium', '', '', '', '', 'Firm'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full my-4"
    >
      <Card className="p-4 bg-white/80 dark:bg-white/5 backdrop-blur-sm border-white/40 dark:border-white/20">
        <div className="space-y-3">
          {/* Scale */}
          <div className="relative h-12">
            {/* Background bar */}
            <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-muted rounded-full" />
            
            {/* Recommended range highlight */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="absolute top-1/2 -translate-y-1/2 h-3 bg-primary rounded-full"
              style={{
                left: `${((min - 1) / 9) * 100}%`,
                width: `${((max - min + 1) / 10) * 100}%`,
              }}
            />

            {/* Markers */}
            <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                const isInRange = num >= min && num <= max;
                return (
                  <motion.div
                    key={num}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2, delay: num * 0.05 }}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isInRange
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {num}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Labels */}
          <div className="flex justify-between text-xs font-medium text-muted-foreground px-1">
            <span>Soft</span>
            <span>Medium</span>
            <span>Firm</span>
          </div>

          {/* Description */}
          <p className="text-sm text-center text-foreground/80">
            Recommended firmness range: <span className="font-semibold text-primary">{min}-{max}/10</span>
          </p>
        </div>
      </Card>
    </motion.div>
  );
};
