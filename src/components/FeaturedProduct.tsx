import { useQuery } from "@tanstack/react-query";
import { fetchProductByHandle } from "@/lib/shopify";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Loader2, Star, Tag } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { SALE_CONFIG, calculateSalePrice } from "@/config/sale";

export const FeaturedProduct = () => {
  const { data: product, isLoading } = useQuery({
    queryKey: ["featured-product", "helix-midnight-luxe"],
    queryFn: () => fetchProductByHandle("helix-midnight-luxe"),
  });

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (!product) return;
    
    const variant = product.variants.edges[0]?.node;
    if (!variant) {
      toast.error("Product variant not available");
      return;
    }

    addItem({
      product: { node: product },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });

    toast.success("Added to cart", {
      description: product.title,
    });
  };

  if (isLoading || !product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const image = product.images.edges[0]?.node;
  const price = product.priceRange.minVariantPrice;
  const queenPrice = product.variants.edges.find(v => v.node.selectedOptions?.find(o => o.name === "Size")?.value === "Queen")?.node.price.amount || price.amount;

  return (
    <section className="py-12 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          {SALE_CONFIG.SALE_ACTIVE && (
            <div className="mb-6">
              <Badge className="px-6 py-2.5 text-base bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold shadow-2xl border-2 border-amber-400/50">
                🔥 {SALE_CONFIG.BADGE_TEXT} - {SALE_CONFIG.SALE_NAME} 🔥
              </Badge>
            </div>
          )}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-semibold">Featured Premium Mattress</span>
          </div>
          <h2 className="text-4xl font-bold mb-2">Helix Midnight Luxe</h2>
          <p className="text-muted-foreground">
            Our most popular luxury mattress for exceptional side sleeping comfort
          </p>
        </div>

        <Card className="overflow-hidden max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <Link to={`/product/${product.handle}`} className="group">
              <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                {image ? (
                  <img
                    src={image.url}
                    alt={image.altText || product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-soft flex items-center justify-center">
                    <span className="text-muted-foreground">No image</span>
                  </div>
                )}
              </div>
            </Link>

            <div className="flex flex-col justify-center">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                  <span className="text-sm text-muted-foreground">(2,847 reviews)</span>
                </div>
                <div className="space-y-3">
                  {SALE_CONFIG.SALE_ACTIVE ? (
                    <>
                      <div className="inline-block">
                        <Badge className="bg-gradient-to-r from-amber-600 to-amber-700 text-white text-sm font-bold px-3 py-1">
                          LIMITED TIME OFFER
                        </Badge>
                      </div>
                      <div className="flex items-baseline gap-3">
                        <p className="price-display text-5xl font-bold text-amber-600 dark:text-amber-500">
                          ${parseFloat(calculateSalePrice(queenPrice)).toFixed(0)}
                        </p>
                        <p className="text-2xl text-muted-foreground line-through">
                          ${parseFloat(queenPrice).toFixed(0)}
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/30 border-2 border-amber-500/30 rounded-lg p-3">
                        <p className="text-lg font-bold text-amber-900 dark:text-amber-100">
                          🎉 You Save ${(parseFloat(queenPrice) - parseFloat(calculateSalePrice(queenPrice))).toFixed(0)} Today!
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="price-display text-3xl text-foreground">
                      ${parseFloat(queenPrice).toFixed(0)}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Queen size starting price
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Medium feel (5-6/10) - Perfect for side sleepers</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Enhanced cooling technology with GlacioTex™ Cover</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Premium zoned lumbar support for pressure relief</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Extended sleep trial & 15-year warranty</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Link to={`/product/${product.handle}`} className="flex-1">
                  <Button className="w-full" size="lg">
                    Select Size & Checkout
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
