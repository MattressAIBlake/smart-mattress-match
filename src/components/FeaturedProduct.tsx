import { useQuery } from "@tanstack/react-query";
import { fetchProductByHandle } from "@/lib/shopify";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Loader2, Star } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { Link } from "react-router-dom";

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

  return (
    <section className="py-12 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
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
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-primary">
                    ${parseFloat(price.amount).toFixed(0)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Queen size price
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
                  <span>100-night sleep trial & 15-year warranty</span>
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
