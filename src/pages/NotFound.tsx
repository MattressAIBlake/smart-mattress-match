import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/shopify";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Search } from "lucide-react";
import { LazyImage } from "@/components/LazyImage";
import { SEOHead } from "@/components/seo/SEOHead";
import { Helmet } from "react-helmet";

const NotFound = () => {
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(4),
  });

  return (
    <div className="min-h-screen bg-background">
      {/* SEO Meta Tags - Prevent indexing of 404 page */}
      <Helmet>
        <title>404 - Page Not Found | Mattress Wizard</title>
        <meta name="description" content="The page you're looking for doesn't exist. Explore our AI-powered mattress recommendations and find your perfect sleep solution." />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-4 text-primary">404</h1>
          <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Looking for the perfect mattress? Let our AI help you find it.
          </p>
          
          <div className="flex gap-4 justify-center mb-12">
            <Link to="/">
              <Button size="lg">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Link to="/">
              <Button size="lg" variant="outline">
                <Search className="w-4 h-4 mr-2" />
                Find My Mattress
              </Button>
            </Link>
          </div>

          {products && products.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl font-semibold mb-6">Popular Mattresses</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.slice(0, 4).map((product) => {
                  const image = product.node.images.edges[0]?.node;
                  const price = product.node.priceRange.minVariantPrice;

                  return (
                    <Card key={product.node.id} className="overflow-hidden hover:shadow-soft transition-shadow">
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
                      <CardContent className="p-4">
                        <Link to={`/product/${product.node.handle}`}>
                          <CardTitle className="text-base mb-2 hover:text-primary transition-colors line-clamp-2">
                            {product.node.title}
                          </CardTitle>
                        </Link>
                        <p className="text-lg font-bold text-primary">
                          ${parseFloat(price.amount).toFixed(0)}
                        </p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Link to={`/product/${product.node.handle}`} className="w-full">
                          <Button variant="outline" size="sm" className="w-full">
                            View Details
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
