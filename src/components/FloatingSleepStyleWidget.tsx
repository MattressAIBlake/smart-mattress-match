import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const FloatingSleepStyleWidget = () => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <Button
      size="lg"
      className="fixed bottom-6 right-6 z-50 rounded-full shadow-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 hover:scale-105 transition-all duration-300 group overflow-hidden px-5 py-3 h-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate('/sleepstyle')}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      <div className="relative flex items-center gap-3">
        <div className="relative">
          <Heart className="h-5 w-5 text-white group-hover:scale-110 transition-transform" fill={isHovered ? "white" : "none"} />
          <Sparkles className="h-3 w-3 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
        </div>
        <span className="text-white font-semibold text-sm whitespace-nowrap">
          Sleep Style Quiz
        </span>
      </div>
    </Button>
  );
};
