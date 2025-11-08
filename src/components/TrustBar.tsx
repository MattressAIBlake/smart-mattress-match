import { Star, Truck, Shield, Award } from "lucide-react";

export const TrustBar = () => {
  return (
    <div className="w-full border-t border-b border-border/40 bg-background/50 backdrop-blur-sm py-6 mt-8">
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

        {/* Brand Logos & Social Proof */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Brand Logos */}
          <div className="flex items-center gap-4 md:gap-6 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
            <img 
              src="/src/assets/brand-logos/helix-logo.jpg" 
              alt="Helix Sleep" 
              className="h-6 md:h-8 w-auto object-contain"
            />
            <img 
              src="/src/assets/brand-logos/brooklyn-bedding-logo.jpg" 
              alt="Brooklyn Bedding" 
              className="h-6 md:h-8 w-auto object-contain"
            />
            <img 
              src="/src/assets/brand-logos/leesa-logo.jpg" 
              alt="Leesa" 
              className="h-6 md:h-8 w-auto object-contain"
            />
            <img 
              src="/src/assets/brand-logos/birch-logo.png" 
              alt="Birch Natural" 
              className="h-6 md:h-8 w-auto object-contain"
            />
          </div>

          {/* Testimonial/Rating */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div className="text-sm">
              <span className="font-semibold text-foreground">4.8/5</span>
              <span className="text-muted-foreground ml-1">from 2,847 reviews</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
