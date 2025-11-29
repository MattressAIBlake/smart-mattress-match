import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface QuickReplyChipsProps {
  options: string[];
  onSelect: (option: string) => void;
  disabled?: boolean;
}

export const QuickReplyChips = ({ options, onSelect, disabled }: QuickReplyChipsProps) => {
  return (
    <motion.div 
      className="flex flex-wrap gap-2 mt-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {options.map((option, idx) => (
        <motion.div
          key={option}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.05, duration: 0.2 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelect(option)}
            disabled={disabled}
            className="rounded-full bg-white/60 dark:bg-white/5 hover:bg-primary hover:text-primary-foreground border-white/40 dark:border-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-105 shadow-sm"
          >
            {option}
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
};
