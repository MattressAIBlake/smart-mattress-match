import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProducts, fetchProductByHandle } from "@/lib/shopify";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Loader2, Tag } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { LazyImage } from "@/components/LazyImage";
import { ProductGridSkeleton } from "@/components/skeletons/ProductGridSkeleton";
import { SALE_CONFIG, calculateSalePrice } from "@/config/sale";

export const ProductGrid = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(20),
  });

  const addItem = useCartStore((state) => state.addItem);
  const queryClient = useQueryClient();

  const handleAddToCart = (product: any) => {
    const variant = product.node.variants.edges[0]?.node;
    if (!variant) {
      toast.error("Product variant not available");
      return;
    }

    addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });

    toast.success("Added to cart", {
      description: product.node.title,
    });
  };

  if (isLoading) {
    return <ProductGridSkeleton count={9} />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Error loading products. Please try again.</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-semibold mb-2">No Products Found</h3>
        <p className="text-muted-foreground mb-4">
          We're currently setting up our mattress collection. Check back soon!
        </p>
        <p className="text-sm text-muted-foreground">
          Want to add products? Just tell the AI what mattress you'd like to add!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => {
        const image = product.node.images.edges[0]?.node;
        
        // Find Queen size variant for accurate pricing
        const queenVariant = product.node.variants.edges.find(v => 
          v.node.selectedOptions?.some(opt => 
            opt.name === "Size" && opt.value === "Queen"
          )
        )?.node;
        
        const price = queenVariant?.price || product.node.priceRange.minVariantPrice;

        return (
          <Card
            key={product.node.id}
            className="overflow-hidden hover:shadow-soft transition-shadow"
            onMouseEnter={() => {
              // Prefetch product data on hover
              queryClient.prefetchQuery({
                queryKey: ["product", product.node.handle],
                queryFn: () => fetchProductByHandle(product.node.handle),
                staleTime: 30000,
              });
            }}
            onTouchStart={() => {
              // Prefetch on touch for mobile
              queryClient.prefetchQuery({
                queryKey: ["product", product.node.handle],
                queryFn: () => fetchProductByHandle(product.node.handle),
                staleTime: 30000,
              });
            }}
          >
            <Link to={`/product/${product.node.handle}`}>
              <CardHeader className="p-0 relative">
                {SALE_CONFIG.SALE_ACTIVE && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge className="bg-gradient-to-br from-amber-600 to-amber-700 text-white font-bold text-sm px-3 py-2 shadow-xl border-2 border-amber-400/50">
                      {SALE_CONFIG.BADGE_TEXT}
                    </Badge>
                  </div>
                )}
                {image ? (
                  <div className="aspect-square bg-muted overflow-hidden">
                    <LazyImage
                      src={image.url}
                      alt={image.altText || product.node.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="aspect-square bg-gradient-soft flex items-center justify-center">
                    <span className="text-muted-foreground">No image</span>
                  </div>
                )}
              </CardHeader>
            </Link>
            
            <CardContent className="p-4">
              <Link to={`/product/${product.node.handle}`}>
                <CardTitle className="text-lg mb-2 hover:text-primary transition-colors">
                  {product.node.title}
                </CardTitle>
              </Link>
              <CardDescription className="line-clamp-2 mb-4">
                {product.node.description || "Premium mattress for exceptional sleep"}
              </CardDescription>
              <div className="space-y-2">
                {SALE_CONFIG.SALE_ACTIVE ? (
                  <>
                    <div className="inline-block">
                      <Badge className="bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs font-bold px-2 py-0.5 mb-2">
                        LIMITED TIME
                      </Badge>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <p className="price-display text-3xl font-bold text-amber-600 dark:text-amber-500">
                        ${parseFloat(calculateSalePrice(price.amount)).toFixed(0)}
                      </p>
                      <p className="text-lg text-muted-foreground line-through">
                        ${parseFloat(price.amount).toFixed(0)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                      Save ${(parseFloat(price.amount) - parseFloat(calculateSalePrice(price.amount))).toFixed(0)} Today!
                    </p>
                  </>
                ) : (
                  <p className="price-display text-2xl text-foreground">
                    ${parseFloat(price.amount).toFixed(0)}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Queen size price
                </p>
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
              <Link to={`/product/${product.node.handle}`} className="w-full">
                <Button
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  View Details
                </Button>
              </Link>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};
