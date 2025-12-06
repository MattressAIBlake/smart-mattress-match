import { useEffect, useState } from "react";
import { X, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SALE_CONFIG } from "@/config/sale";
import { SaleCountdown } from "./SaleCountdown";

export const PromoBar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Always show for Black Friday sale, otherwise check first-time visitor
    if (SALE_CONFIG.SALE_ACTIVE) {
      setIsVisible(true);
    } else {
      const hasVisited = localStorage.getItem('mattress-wizard-visited');
      const promoDismissed = sessionStorage.getItem('promo-dismissed');
      
      if (!hasVisited && !promoDismissed) {
        setIsVisible(true);
        localStorage.setItem('mattress-wizard-visited', 'true');
      }
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('promo-dismissed', 'true');
  };

  if (!isVisible || isDismissed) return null;

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
};
