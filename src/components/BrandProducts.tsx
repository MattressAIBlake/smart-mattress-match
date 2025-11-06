import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProducts, fetchProductByHandle } from "@/lib/shopify";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { LazyImage } from "@/components/LazyImage";
import { ProductGridSkeleton } from "@/components/skeletons/ProductGridSkeleton";

const BRANDS = [
  { name: "All Brands", value: "all" },
  { name: "Helix", value: "Helix" },
  { name: "Leesa", value: "Leesa" },
  { name: "Brooklyn Bedding", value: "Brooklyn Bedding" },
  { name: "Birch", value: "Birch" },
];

export const BrandProducts = () => {
  const [selectedBrand, setSelectedBrand] = useState("all");
  const queryClient = useQueryClient();
  
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(100),
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

  const filteredProducts = products
    ?.filter((product) => {
      if (selectedBrand === "all") return product.node.title !== "Helix Midnight Luxe";
      return product.node.vendor === selectedBrand;
    })
    ?.sort((a, b) => {
      // Prioritize Elite mattresses first
      const aIsElite = a.node.title.toLowerCase().includes("elite");
      const bIsElite = b.node.title.toLowerCase().includes("elite");
      
      if (aIsElite && !bIsElite) return -1;
      if (!aIsElite && bIsElite) return 1;
      
      // Then prioritize Luxe mattresses
      const aIsLuxe = a.node.title.toLowerCase().includes("luxe");
      const bIsLuxe = b.node.title.toLowerCase().includes("luxe");
      
      if (aIsLuxe && !bIsLuxe) return -1;
      if (!aIsLuxe && bIsLuxe) return 1;
      
      // Keep original order for others
      return 0;
    });

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Brand</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our complete collection of premium mattresses from the industry's most trusted brands
            </p>
          </div>
          <ProductGridSkeleton count={12} />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Error loading products. Please try again.</p>
      </div>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Browse by Brand</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our complete collection of premium mattresses from the industry's most trusted brands
          </p>
        </div>

        <Tabs value={selectedBrand} onValueChange={setSelectedBrand} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-2 bg-transparent mb-8">
            {BRANDS.map((brand) => (
              brand.value === "all" ? (
                <TabsTrigger
                  key={brand.value}
                  value={brand.value}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {brand.name}
                </TabsTrigger>
              ) : (
                <Link key={brand.value} to={`/brand/${brand.value.toLowerCase().replace(" ", "-")}`}>
                  <TabsTrigger
                    value={brand.value}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {brand.name}
                  </TabsTrigger>
                </Link>
              )
            ))}
          </TabsList>

          <TabsContent value={selectedBrand} className="mt-8">
            {!filteredProducts || filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-2xl font-semibold mb-2">No Products Found</h3>
                <p className="text-muted-foreground">
                  No products available for this brand yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => {
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
                      className="overflow-hidden hover:shadow-soft transition-shadow flex flex-col"
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
                        <CardHeader className="p-0">
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
                              <span className="text-muted-foreground text-sm">No image</span>
                            </div>
                          )}
                        </CardHeader>
                      </Link>
                      
                      <CardContent className="p-4 flex-1">
                        <div className="text-xs text-muted-foreground mb-1">{product.node.vendor}</div>
                        <Link to={`/product/${product.node.handle}`}>
                          <CardTitle className="text-base mb-2 hover:text-primary transition-colors line-clamp-2">
                            {product.node.title}
                          </CardTitle>
                        </Link>
                        <CardDescription className="line-clamp-2 text-sm mb-4">
                          {product.node.description || "Premium mattress for exceptional sleep"}
                        </CardDescription>
                        <div className="space-y-1">
                          <p className="text-xl font-bold text-primary">
                            ${parseFloat(price.amount).toFixed(0)}
                          </p>
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
                            size="sm"
                          >
                            View Details
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
