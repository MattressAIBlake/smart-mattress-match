import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import { BRAND_INFO } from "@/data/brandInfo";
import helixLogo from "@/assets/brand-logos/helix-logo.jpg";
import leesaLogo from "@/assets/brand-logos/leesa-logo.jpg";
import birchLogo from "@/assets/brand-logos/birch-logo.png";
import brooklynLogo from "@/assets/brand-logos/brooklyn-bedding-logo.jpg";

export const ShopByBrand = () => {
  // Display main brands (exclude bear as it's not in the footer)
  const mainBrands = Object.values(BRAND_INFO).filter(
    brand => brand.slug !== "bear"
  );

  const brandLogos: Record<string, string> = {
    helix: helixLogo,
    leesa: leesaLogo,
    birch: birchLogo,
    "brooklyn-bedding": brooklynLogo,
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Shop Premium Mattress Brands
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover top-rated mattresses from trusted American manufacturers. All brands are proudly made in Arizona, USA.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mainBrands.map((brand) => (
            <Card
              key={brand.slug}
              className="group hover:shadow-lg transition-all duration-300 border-2 bg-background overflow-hidden"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="w-32 h-16 flex items-center justify-center rounded-lg overflow-hidden"
                    style={{ backgroundColor: brand.brandColor }}
                  >
                    <img 
                      src={brandLogos[brand.slug as keyof typeof brandLogos]} 
                      alt={`${brand.name} logo`}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span className="text-sm font-semibold">4.8</span>
                  </div>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {brand.name}
                </CardTitle>
                <CardDescription className="text-sm font-medium">
                  {brand.tagline}
                </CardDescription>
                <p className="text-xs text-primary font-semibold mt-2">
                  🇺🇸 {brand.madeIn}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {brand.description}
                </p>
                
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-foreground/70">Key Features:</p>
                  <ul className="space-y-1">
                    {brand.features.slice(0, 2).map((feature, index) => (
                      <li key={index} className="text-xs text-muted-foreground flex items-start gap-1">
                        <span className="text-primary mt-0.5">✓</span>
                        <span className="line-clamp-1">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link to={`/brand/${brand.slug}`} className="block">
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    Shop {brand.name}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            All brands offer free shipping, comprehensive warranties, and expert support
          </p>
        </div>
      </div>
    </section>
  );
};
