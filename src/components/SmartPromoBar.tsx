import { useEffect, useState } from "react";
import { X, Gift, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SALE_CONFIG } from "@/config/sale";
import { SaleCountdown } from "./SaleCountdown";
import { useNavigate } from "react-router-dom";

export const SmartPromoBar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const promoDismissed = sessionStorage.getItem('promo-dismissed');
    
    if (!promoDismissed) {
      setIsVisible(true);
      const hasVisited = localStorage.getItem('mattress-wizard-visited');
      if (!hasVisited) {
        localStorage.setItem('mattress-wizard-visited', 'true');
      }
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('promo-dismissed', 'true');
  };

  const handleSleepStyleClick = () => {
    navigate('/sleepstyle');
  };

  if (!isVisible || isDismissed) return null;

  // Show Black Friday banner if sale is active
  if (SALE_CONFIG.SALE_ACTIVE) {
    return (
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white py-3 px-4 relative animate-in slide-in-from-top duration-500">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
          <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <p className="text-sm sm:text-base font-bold">
                <span className="sm:hidden">AI Shopper Discount: Save 20%</span>
                <span className="hidden sm:inline">AI Shopper Discount: Save 20% — Unlock an Extra 10% When You Complete Our Short Mattress Education Guide</span>
              </p>
            </div>
            <SaleCountdown size="sm" showLabel={false} />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-white hover:bg-white/20 rounded-full"
            onClick={handleDismiss}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  }

  // Show Sleep Style banner when sale is inactive
  return (
    <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white py-3 px-4 relative animate-in slide-in-from-top duration-500 cursor-pointer hover:from-pink-600 hover:via-rose-600 hover:to-red-600 transition-all" onClick={handleSleepStyleClick}>
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 animate-pulse" />
            <p className="text-sm sm:text-base font-bold">
              <span className="sm:hidden">💤 What's Your Sleep Style? Take the 30-sec quiz!</span>
              <span className="hidden sm:inline">💤 What's Your Sleep Style? Take our 30-second quiz → Perfect ice breaker for your next date!</span>
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-white hover:bg-white/20 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            handleDismiss();
          }}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};
