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
    <div className={`${SALE_CONFIG.SALE_ACTIVE ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600' : 'bg-gradient-to-r from-primary via-purple-600 to-pink-600'} text-white py-4 px-4 relative animate-in slide-in-from-top duration-500 shadow-lg`}>
      <div className="container mx-auto">
        {SALE_CONFIG.SALE_ACTIVE ? (
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 text-center">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 flex-shrink-0" />
              <p className="text-base md:text-lg font-bold tracking-wide">
                {SALE_CONFIG.PROMO_MESSAGE}
              </p>
            </div>
            <SaleCountdown size="sm" showLabel={true} />
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-center">
            <Gift className="h-4 w-4 flex-shrink-0 opacity-80" />
            <p className="text-sm md:text-base font-medium">
              🎉 First-Time Visitor Special: Buy Today & Get a FREE Bedding Bundle ($180 Value) - Sheet Set, Mattress Protector & Pillow Cases!
            </p>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 text-white hover:bg-white/20 rounded-full"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
