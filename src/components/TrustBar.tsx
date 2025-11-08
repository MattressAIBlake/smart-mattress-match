import { Truck, Shield, Award } from "lucide-react";
import helixLogo from "@/assets/brand-logos/helix-logo.jpg";
import brooklynLogo from "@/assets/brand-logos/brooklyn-bedding-logo.jpg";
import leesaLogo from "@/assets/brand-logos/leesa-logo.jpg";
import birchLogo from "@/assets/brand-logos/birch-logo.png";

export const TrustBar = () => {
  return (
    <div className="w-full border-t border-b border-border/40 bg-background/50 backdrop-blur-sm py-6">
      <div className="container mx-auto px-4">
        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mb-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-primary" />
            <span className="font-medium">Free Shipping</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-muted-foreground/40" />
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            <span className="font-medium">5 Premium Brands</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-muted-foreground/40" />
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-medium">Secure Checkout</span>
          </div>
        </div>

        {/* Brand Logos */}
        <div className="flex items-center justify-center gap-6 md:gap-8">
          <img 
            src={helixLogo} 
            alt="Helix Sleep" 
            className="h-8 md:h-10 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
          />
          <img 
            src={brooklynLogo} 
            alt="Brooklyn Bedding" 
            className="h-8 md:h-10 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
          />
          <img 
            src={leesaLogo} 
            alt="Leesa" 
            className="h-8 md:h-10 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
          />
          <img 
            src={birchLogo} 
            alt="Birch Natural" 
            className="h-8 md:h-10 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
          />
        </div>
      </div>
    </div>
  );
};
