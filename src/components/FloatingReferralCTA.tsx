import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Gift, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingReferralCTAProps {
  onOpen: () => void;
}

export const FloatingReferralCTA = ({ onOpen }: FloatingReferralCTAProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  
  useEffect(() => {
    // Show after 10 seconds or scroll
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setIsVisible(true);
      }
    }, 10000);
    
    const handleScroll = () => {
      if (window.scrollY > 300 && !isDismissed) {
        setIsVisible(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isDismissed]);
  
  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className="relative">
            <Button
              size="lg"
              className="rounded-full shadow-2xl bg-gradient-to-r from-primary via-purple-500 to-pink-500 hover:from-primary/90 hover:via-purple-500/90 hover:to-pink-500/90 pr-14"
              onClick={onOpen}
            >
              <Gift className="h-5 w-5 mr-2" />
              <div className="text-left">
                <div className="font-bold">Refer & Earn</div>
                <div className="text-xs opacity-90">$100 for you and friends</div>
              </div>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background border shadow"
              onClick={handleDismiss}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
