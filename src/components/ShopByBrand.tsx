import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import { BRAND_INFO } from "@/data/brandInfo";

const brandColors = {
  helix: "from-blue-500/10 to-purple-500/10 border-blue-500/20",
  leesa: "from-green-500/10 to-emerald-500/10 border-green-500/20",
  birch: "from-amber-500/10 to-green-600/10 border-amber-500/20",
  "brooklyn-bedding": "from-slate-500/10 to-blue-500/10 border-slate-500/20",
  bear: "from-orange-500/10 to-red-500/10 border-orange-500/20",
};

const brandIcons = {
  helix: "🌙",
  leesa: "💚",
  birch: "🌿",
  "brooklyn-bedding": "🏭",
  bear: "🐻",
};

export const ShopByBrand = () => {
  // Display main brands (exclude bear as it's not in the footer)
  const mainBrands = Object.values(BRAND_INFO).filter(
    brand => brand.slug !== "bear"
  );

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Shop Premium Mattress Brands
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover top-rated mattresses from trusted manufacturers. Each brand offers unique features tailored to different sleep preferences.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mainBrands.map((brand) => (
            <Card
              key={brand.slug}
              className={`group hover:shadow-lg transition-all duration-300 border-2 bg-gradient-to-br ${
                brandColors[brand.slug as keyof typeof brandColors]
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="text-4xl mb-2">
                    {brandIcons[brand.slug as keyof typeof brandIcons]}
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
            All brands offer free shipping, generous trial periods, and expert support
          </p>
        </div>
      </div>
    </section>
  );
};
