import { motion } from "framer-motion";
import { Users, Star, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SocialProofBadgeProps {
  type: 'popular' | 'rated' | 'trending';
  text: string;
}

export const SocialProofBadge = ({ type, text }: SocialProofBadgeProps) => {
  const icons = {
    popular: <Users className="h-3 w-3" />,
    rated: <Star className="h-3 w-3 fill-current" />,
    trending: <TrendingUp className="h-3 w-3" />,
  };

  const colors = {
    popular: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
    rated: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
    trending: 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="inline-block"
    >
      <Badge variant="outline" className={`${colors[type]} gap-1.5 text-xs font-medium`}>
        {icons[type]}
        {text}
      </Badge>
    </motion.div>
  );
};
