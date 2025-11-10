import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Package, Shield, Truck, Award } from "lucide-react";

interface ProductDetailTabsProps {
  description: string;
  brand: string;
}

export const ProductDetailTabs = ({ description, brand }: ProductDetailTabsProps) => {
  return (
    <section className="w-full border-t pt-12 mt-12">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="specs">Specifications</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-8">
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-4">Product Overview</h3>
            <div className="prose prose-gray max-w-none dark:prose-invert">
              <p className="text-muted-foreground leading-relaxed text-lg">
                {description || "Premium mattress designed for exceptional comfort and support."}
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="specs" className="mt-8">
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-6">Specifications</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Materials</h4>
                    <p className="text-sm text-muted-foreground">Premium foam layers with advanced cooling technology and breathable cover</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Certifications</h4>
                    <p className="text-sm text-muted-foreground">CertiPUR-US® certified foams, OEKO-TEX® Standard 100</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Warranty</h4>
                    <p className="text-sm text-muted-foreground">10-year limited warranty covering manufacturing defects</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Made In</h4>
                    <p className="text-sm text-muted-foreground">Proudly manufactured in the USA by {brand}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="mt-8">
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-6">Key Features & Benefits</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div>
                    <h4 className="font-semibold mb-1">Advanced Pressure Relief</h4>
                    <p className="text-sm text-muted-foreground">Multiple comfort layers conform to your body, reducing pressure points for better sleep</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div>
                    <h4 className="font-semibold mb-1">Temperature Regulation</h4>
                    <p className="text-sm text-muted-foreground">Cooling technology and breathable materials keep you comfortable all night</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div>
                    <h4 className="font-semibold mb-1">Motion Isolation</h4>
                    <p className="text-sm text-muted-foreground">Excellent motion transfer reduction for undisturbed sleep with a partner</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div>
                    <h4 className="font-semibold mb-1">Edge Support</h4>
                    <p className="text-sm text-muted-foreground">Reinforced perimeter provides stable edge support and maximizes sleep surface</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div>
                    <h4 className="font-semibold mb-1">Durability</h4>
                    <p className="text-sm text-muted-foreground">High-density materials maintain shape and support for years of quality sleep</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div>
                    <h4 className="font-semibold mb-1">Hypoallergenic</h4>
                    <p className="text-sm text-muted-foreground">Resistant to dust mites, allergens, and bacteria for healthier sleep</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="mt-8">
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-6">Shipping & Returns</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Truck className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg mb-2">Free Shipping</h4>
                  <p className="text-muted-foreground">We offer free ground shipping to the contiguous United States. Your mattress will arrive compressed in a box for easy delivery and setup. Most orders ship within 1-3 business days.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Package className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg mb-2">Sleep Trial</h4>
                  <p className="text-muted-foreground">Try your new mattress risk-free for 100-365 nights (varies by brand). If you're not completely satisfied, we'll arrange a free pickup and full refund. We recommend sleeping on it for at least 30 nights to allow your body to adjust.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg mb-2">Easy Returns</h4>
                  <p className="text-muted-foreground">Returns are hassle-free. Simply contact our customer service team, and we'll coordinate pickup at no cost to you. All returned mattresses are donated to local charities when possible.</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
};
