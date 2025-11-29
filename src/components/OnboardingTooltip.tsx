import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Sparkles } from "lucide-react";

export const OnboardingTooltip = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen the tooltip before
    const hasSeenTooltip = localStorage.getItem('hasSeenMattressTooltip');
    
    if (!hasSeenTooltip) {
      // Show tooltip after a brief delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenMattressTooltip', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md mx-4"
        >
          <Card className="relative bg-gradient-to-br from-primary/95 to-purple-500/95 text-primary-foreground p-6 shadow-2xl border-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="absolute top-2 right-2 h-8 w-8 text-primary-foreground hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
            
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-white/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex-1 pr-6">
                <h3 className="font-bold text-lg mb-2">👋 Welcome to Mattress Wizard!</h3>
                <p className="text-sm leading-relaxed opacity-95">
                  I'm your AI mattress expert. Just tell me how you sleep and I'll find your perfect match in 60 seconds. No quiz, no hassle!
                </p>
                <Button
                  onClick={handleDismiss}
                  variant="secondary"
                  size="sm"
                  className="mt-4"
                >
                  Got it!
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
