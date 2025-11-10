import { Card } from "@/components/ui/card";
import { Shield, Truck, Award, Clock, Heart, BadgeCheck } from "lucide-react";

export const ProductTrustBadges = () => {
  return (
    <section className="w-full border-t pt-12 mt-12">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">Why Buy From Us?</h3>
        <p className="text-muted-foreground">Premium mattresses backed by industry-leading guarantees</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-6 text-center hover:shadow-md transition-shadow">
          <Truck className="w-8 h-8 mx-auto mb-3 text-primary" />
          <h4 className="font-semibold text-sm mb-1">Free Shipping</h4>
          <p className="text-xs text-muted-foreground">To all 50 states</p>
        </Card>
        
        <Card className="p-6 text-center hover:shadow-md transition-shadow">
          <Clock className="w-8 h-8 mx-auto mb-3 text-primary" />
          <h4 className="font-semibold text-sm mb-1">Fast Delivery</h4>
          <p className="text-xs text-muted-foreground">Ships in 1-3 days</p>
        </Card>
        
        <Card className="p-6 text-center hover:shadow-md transition-shadow">
          <Shield className="w-8 h-8 mx-auto mb-3 text-primary" />
          <h4 className="font-semibold text-sm mb-1">10 Year Warranty</h4>
          <p className="text-xs text-muted-foreground">Full coverage</p>
        </Card>
        
        <Card className="p-6 text-center hover:shadow-md transition-shadow">
          <Award className="w-8 h-8 mx-auto mb-3 text-primary" />
          <h4 className="font-semibold text-sm mb-1">Made in USA</h4>
          <p className="text-xs text-muted-foreground">Premium quality</p>
        </Card>
        
        <Card className="p-6 text-center hover:shadow-md transition-shadow">
          <BadgeCheck className="w-8 h-8 mx-auto mb-3 text-primary" />
          <h4 className="font-semibold text-sm mb-1">CertiPUR-US®</h4>
          <p className="text-xs text-muted-foreground">Certified safe</p>
        </Card>
        
        <Card className="p-6 text-center hover:shadow-md transition-shadow">
          <Heart className="w-8 h-8 mx-auto mb-3 text-primary" />
          <h4 className="font-semibold text-sm mb-1">Eco-Friendly</h4>
          <p className="text-xs text-muted-foreground">Sustainable materials</p>
        </Card>
      </div>
    </section>
  );
};
