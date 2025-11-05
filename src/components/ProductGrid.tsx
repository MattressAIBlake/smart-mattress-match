import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/shopify";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export const ProductGrid = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(20),
  });

  const addItem = useCartStore((state) => state.addItem);

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
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
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
        const price = product.node.priceRange.minVariantPrice;

        return (
          <Card key={product.node.id} className="overflow-hidden hover:shadow-soft transition-shadow">
            <Link to={`/product/${product.node.handle}`}>
              <CardHeader className="p-0">
                {image ? (
                  <div className="aspect-square bg-muted overflow-hidden">
                    <img
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
              <CardDescription className="line-clamp-2">
                {product.node.description || "Premium mattress for exceptional sleep"}
              </CardDescription>
              <p className="text-2xl font-bold text-primary mt-3">
                {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
              </p>
            </CardContent>

            <CardFooter className="p-4 pt-0">
              <Button
                onClick={() => handleAddToCart(product)}
                className="w-full"
                size="lg"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};
