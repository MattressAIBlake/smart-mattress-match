import { useEffect, useState } from "react";
import { X, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SALE_CONFIG } from "@/config/sale";

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
    <div className={`${SALE_CONFIG.SALE_ACTIVE ? 'bg-gradient-to-r from-red-600 via-red-500 to-orange-600 animate-pulse' : 'bg-gradient-to-r from-primary via-purple-600 to-pink-600'} text-white py-3 px-4 relative animate-in slide-in-from-top duration-500`}>
      <div className="container mx-auto flex items-center justify-center gap-2 text-center">
        <Gift className="h-5 w-5 flex-shrink-0" />
        <p className="text-sm md:text-base font-bold">
          {SALE_CONFIG.SALE_ACTIVE ? SALE_CONFIG.PROMO_MESSAGE : '🎉 First-Time Visitor Special: Buy Today & Get a FREE Bedding Bundle ($180 Value) - Sheet Set, Mattress Protector & Pillow Cases!'}
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-white hover:bg-white/20"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
