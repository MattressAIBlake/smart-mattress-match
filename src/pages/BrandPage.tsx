import { useParams, Link, Navigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProducts, fetchProductByHandle } from "@/lib/shopify";
import { getBrandInfo } from "@/data/brandInfo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Check } from "lucide-react";
import { LazyImage } from "@/components/LazyImage";
import { ProductGridSkeleton } from "@/components/skeletons/ProductGridSkeleton";
import { SEOHead } from "@/components/seo/SEOHead";
import { Helmet } from "react-helmet";

const BrandPage = () => {
  const { brandSlug } = useParams<{ brandSlug: string }>();
  const brandInfo = brandSlug ? getBrandInfo(brandSlug) : undefined;
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ["brand-products", brandInfo?.name],
    queryFn: () => fetchProducts(50),
    enabled: !!brandInfo,
  });

  if (!brandInfo) {
    return <Navigate to="/" replace />;
  }

  const brandProducts = products?.filter(
    (product) => product.node.vendor.toLowerCase() === brandInfo.name.toLowerCase()
  );

  return (
    <>
      <Helmet>
        <title>{`${brandInfo.name} Mattresses - Premium Sleep Solutions | Mattress Wizard`}</title>
        <meta 
          name="description" 
          content={`${brandInfo.description.slice(0, 155)}...`} 
        />
        <meta property="og:title" content={`${brandInfo.name} Mattresses | Mattress Wizard`} />
        <meta property="og:description" content={brandInfo.tagline} />
        <link rel="canonical" href={`https://mattresswizard.com/brand/${brandInfo.slug}`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border">
          <div className="container mx-auto px-4 py-6">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Brands
              </Button>
            </Link>
          </div>
        </div>

        {/* Brand Hero */}
        <section className="py-16 bg-gradient-soft">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{brandInfo.name} Mattresses</h1>
              <p className="text-xl text-muted-foreground mb-6">{brandInfo.tagline}</p>
              <p className="text-lg text-foreground/80 leading-relaxed">{brandInfo.description}</p>
            </div>
          </div>
        </section>

        {/* Brand Features */}
        <section className="py-12 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Why Choose {brandInfo.name}?</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {brandInfo.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Shop {brandInfo.name} Mattresses
            </h2>

            {isLoading ? (
              <ProductGridSkeleton count={6} />
            ) : !brandProducts || brandProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products available for this brand yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brandProducts.map((product) => {
                  const image = product.node.images.edges[0]?.node;
                  const price = product.node.priceRange.minVariantPrice;

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
                          <p className="price-display text-2xl text-foreground">
                            ${parseFloat(price.amount).toFixed(0)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Starting at Queen size
                          </p>
                        </div>
                      </CardContent>

                      <CardFooter className="p-4 pt-0">
                        <Link to={`/product/${product.node.handle}`} className="w-full">
                          <Button variant="outline" className="w-full" size="lg">
                            View Details
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default BrandPage;
