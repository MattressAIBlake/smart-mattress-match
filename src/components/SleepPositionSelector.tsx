import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface SleepPositionSelectorProps {
  onSelect: (position: string) => void;
  disabled?: boolean;
}

const positions = [
  { icon: "🌙", label: "Side Sleeper", value: "I sleep on my side" },
  { icon: "😴", label: "Back Sleeper", value: "I sleep on my back" },
  { icon: "🛏️", label: "Stomach Sleeper", value: "I sleep on my stomach" },
  { icon: "🔄", label: "Combination", value: "I switch positions throughout the night" },
];

export const SleepPositionSelector = ({ onSelect, disabled }: SleepPositionSelectorProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {positions.map((position, idx) => (
          <motion.div
            key={position.value}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1, duration: 0.3 }}
          >
            <Card
              className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/70 dark:bg-white/10 backdrop-blur-md border-white/40 dark:border-white/20 p-4 sm:p-6 group"
              onClick={() => !disabled && onSelect(position.value)}
            >
              <div className="flex flex-col items-center gap-2 sm:gap-3">
                <motion.div
                  className="text-4xl sm:text-5xl"
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {position.icon}
                </motion.div>
                <p className="text-sm sm:text-base font-semibold text-center group-hover:text-primary transition-colors">
                  {position.label}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
