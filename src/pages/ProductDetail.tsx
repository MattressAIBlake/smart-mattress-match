import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProducts, fetchProductByHandle } from "@/lib/shopify";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CartDrawer } from "@/components/CartDrawer";
import { ReferralButton } from "@/components/ReferralButton";
import { useCartStore } from "@/stores/cartStore";
import { ShoppingCart, ArrowLeft, Gift, Tag } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { LazyImage } from "@/components/LazyImage";
import { ProductDetailSkeleton } from "@/components/skeletons/ProductDetailSkeleton";
import { ProductSchema } from "@/components/seo/ProductSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { SEOHead } from "@/components/seo/SEOHead";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SALE_CONFIG, calculateSalePrice } from "@/config/sale";
import { SaleCountdown } from "@/components/SaleCountdown";

const ProductDetail = () => {
  const { handle } = useParams();
  const location = window.location;
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedCooling, setSelectedCooling] = useState("");
  const [selectedSupport, setSelectedSupport] = useState("");
  const [showPromo, setShowPromo] = useState(false);

  useEffect(() => {
    // Show promo if first-time visitor
    const hasVisited = localStorage.getItem('mattress-wizard-visited');
    if (hasVisited === 'true') {
      setShowPromo(true);
    }
  }, []);
  
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(100),
  });

  const queryClient = useQueryClient();
  const addItem = useCartStore((state) => state.addItem);
  const product = products?.find((p) => p.node.handle === handle);

  // Related products from same brand
  const relatedProducts = products
    ?.filter((p) => p.node.vendor === product?.node.vendor && p.node.handle !== handle)
    ?.slice(0, 3);

  // Pre-select variant from URL params (from AI recommendations)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sizeParam = params.get("size");
    const coolingParam = params.get("cooling");
    const supportParam = params.get("support");

    if (sizeParam) setSelectedSize(sizeParam);
    if (coolingParam) setSelectedCooling(coolingParam);
    if (supportParam) setSelectedSupport(supportParam);
  }, [location.search]);

  // Set defaults if not pre-selected
  useEffect(() => {
    if (product && !selectedSize) {
      const firstSize = product.node.options.find(o => o.name === "Size")?.values[0];
      if (firstSize) setSelectedSize(firstSize);
    }
    if (product && !selectedCooling) {
      const firstCooling = product.node.options.find(o => o.name === "Cooling")?.values[0];
      if (firstCooling) setSelectedCooling(firstCooling);
    }
    if (product && !selectedSupport) {
      const firstSupport = product.node.options.find(o => o.name === "Support")?.values[0];
      if (firstSupport) setSelectedSupport(firstSupport);
    }
  }, [product, selectedSize, selectedCooling, selectedSupport]);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Link to="/">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  // Find matching variant based on selected options
  const selectedVariant = product?.node.variants.edges.find((v) => {
    const variantOptions = v.node.selectedOptions;
    
    // Check each option that exists on this product
    const sizeOption = variantOptions.find((o) => o.name === "Size");
    const coolingOption = variantOptions.find((o) => o.name === "Cooling");
    const supportOption = variantOptions.find((o) => o.name === "Support");
    
    // Match size if product has size option
    const sizeMatch = !sizeOption || sizeOption.value === selectedSize;
    
    // Match cooling if product has cooling option
    const coolingMatch = !coolingOption || coolingOption.value === selectedCooling;
    
    // Match support if product has support option
    const supportMatch = !supportOption || supportOption.value === selectedSupport;
    
    return sizeMatch && coolingMatch && supportMatch;
  })?.node;

  const image = product?.node.images.edges[0]?.node;
  const hasOptions = product?.node.options && product.node.options.length > 0;

  const handleAddToCart = () => {
    if (!selectedVariant || !product) {
      toast.error("Please select all options");
      return;
    }

    addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions,
    });

    toast.success("Added to cart", {
      description: product.node.title,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* SEO Meta Tags */}
      <SEOHead
        title={`${product.node.title} Review 2024 - ${product.node.vendor} Mattress | Mattress Wizard`}
        description={`${product.node.title} ${product.node.vendor} mattress. ${product.node.description?.slice(0, 100) || `Premium mattress with advanced comfort & support`}. $${parseFloat(product.node.priceRange.minVariantPrice.amount).toFixed(0)}+. Free shipping, generous trial. Made in USA. Expert review & AI recommendations.`}
        canonical={`https://mattresswizard.com/product/${product.node.handle}`}
        ogImage={product.node.images.edges[0]?.node.url}
        ogType="product"
      />
      
      {/* Structured Data */}
      <ProductSchema
        name={product.node.title}
        description={product.node.description}
        brand={product.node.vendor}
        price={selectedVariant?.price.amount || product.node.priceRange.minVariantPrice.amount}
        currency={selectedVariant?.price.currencyCode || product.node.priceRange.minVariantPrice.currencyCode}
        image={product.node.images.edges[0]?.node.url}
        url={`${window.location.origin}/product/${product.node.handle}`}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: window.location.origin },
          { name: product.node.vendor, url: `${window.location.origin}/brand/${product.node.vendor.toLowerCase().replace(" ", "-")}` },
          { name: product.node.title, url: window.location.href },
        ]}
      />
      
      {/* Header */}
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div>
              <h1 className="text-2xl font-bold">Mattress Wizard</h1>
              <p className="text-xs text-muted-foreground">Premium Sleep Solutions</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <ReferralButton />
            <CartDrawer />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </Link>
        
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: product.node.vendor, href: `/brand/${product.node.vendor.toLowerCase().replace(/\s+/g, '-')}` },
            { label: product.node.title, href: `/product/${product.node.handle}` },
          ]}
        />

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4 relative">
            {SALE_CONFIG.SALE_ACTIVE && (
              <Badge className="absolute top-4 right-4 z-10 bg-slate-900/90 backdrop-blur-sm text-white text-sm font-semibold px-3 py-1.5 shadow-md">
                {SALE_CONFIG.BADGE_TEXT}
              </Badge>
            )}
            {image ? (
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <LazyImage
                  src={image.url}
                  alt={image.altText || product.node.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-square bg-gradient-soft rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">No image available</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Sale Banner */}
            {SALE_CONFIG.SALE_ACTIVE && (
              <div className="bg-gradient-to-br from-black via-amber-950 to-black text-white rounded-xl p-6 shadow-2xl border-2 border-amber-500/30 relative overflow-hidden animate-fade-in">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/10 pointer-events-none" />
                <div className="relative z-10 text-center space-y-3">
                  <Badge className="bg-amber-500 text-black font-bold text-xs px-3 py-1">
                    {SALE_CONFIG.SALE_NAME}
                  </Badge>
                  <p className="text-2xl font-bold tracking-tight">
                    Save {SALE_CONFIG.DISCOUNT_PERCENT}% Today!
                  </p>
                  <SaleCountdown size="md" showLabel={true} className="justify-center text-white" />
                </div>
              </div>
            )}

            <div>
              <h1 className="text-4xl font-bold mb-4">{product.node.title}</h1>
              {SALE_CONFIG.SALE_ACTIVE ? (
                <>
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/30 border-2 border-amber-500/40 rounded-xl p-5 mb-4 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-gradient-to-r from-amber-600 to-amber-700 text-white text-sm font-bold px-3 py-1">
                        LIMITED TIME
                      </Badge>
                    </div>
                    <div className="flex items-baseline gap-3 mb-2">
                      <p className="price-display text-5xl font-bold text-amber-600 dark:text-amber-500">
                        {selectedVariant ? (
                          `$${parseFloat(calculateSalePrice(selectedVariant.price.amount)).toFixed(0)}`
                        ) : (
                          `$${parseFloat(calculateSalePrice(product.node.priceRange.minVariantPrice.amount)).toFixed(0)}`
                        )}
                      </p>
                      <p className="price-display text-3xl text-muted-foreground line-through">
                        {selectedVariant ? (
                          `$${parseFloat(selectedVariant.price.amount).toFixed(0)}`
                        ) : (
                          `$${parseFloat(product.node.priceRange.minVariantPrice.amount).toFixed(0)}`
                        )}
                      </p>
                    </div>
                    <div className="bg-white/70 dark:bg-black/30 rounded-lg p-3 border border-amber-500/20">
                      <p className="text-xl font-bold text-amber-900 dark:text-amber-100">
                        💰 Your Savings: ${selectedVariant 
                          ? (parseFloat(selectedVariant.price.amount) - parseFloat(calculateSalePrice(selectedVariant.price.amount))).toFixed(0)
                          : (parseFloat(product.node.priceRange.minVariantPrice.amount) - parseFloat(calculateSalePrice(product.node.priceRange.minVariantPrice.amount))).toFixed(0)
                        }
                      </p>
                      <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                        This deal won't last - prices return to normal soon!
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <p className="price-display text-4xl text-foreground mb-2">
                  {selectedVariant ? (
                    `$${parseFloat(selectedVariant.price.amount).toFixed(0)}`
                  ) : (
                    `$${parseFloat(product.node.priceRange.minVariantPrice.amount).toFixed(0)}`
                  )}
                </p>
              )}
              {selectedVariant && (
                <p className="text-sm text-muted-foreground">
                  {selectedVariant.title}
                </p>
              )}
            </div>

            {showPromo && (
              <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-2 border-primary/30 rounded-lg p-4 animate-pulse">
                <div className="flex items-start gap-3">
                  <Gift className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-lg text-primary mb-1">🎁 Limited Time: FREE Bedding Bundle!</p>
                    <p className="text-sm text-foreground">Buy today and get a complete bedding set, mattress protector & pillow cases - a <span className="font-semibold">$180 value</span> absolutely FREE!</p>
                  </div>
                </div>
              </div>
            )}

            <p className="text-muted-foreground text-lg leading-relaxed">
              {product.node.description || "Premium mattress designed for exceptional comfort and support."}
            </p>

            {/* Option Selectors */}
            {hasOptions && product.node.options.map((option) => (
              <div key={option.name}>
                <label className="block text-sm font-medium mb-3">{option.name}</label>
                <div className="grid grid-cols-2 gap-2">
                  {option.values.map((value) => {
                    const isSelected = 
                      (option.name === "Size" && value === selectedSize) ||
                      (option.name === "Cooling" && value === selectedCooling) ||
                      (option.name === "Support" && value === selectedSupport);
                    
                    return (
                      <Button
                        key={value}
                        variant={isSelected ? "default" : "outline"}
                        onClick={() => {
                          if (option.name === "Size") setSelectedSize(value);
                          if (option.name === "Cooling") setSelectedCooling(value);
                          if (option.name === "Support") setSelectedSupport(value);
                        }}
                        className="w-full text-sm"
                      >
                        {value}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}

            <Button 
              size="lg" 
              className={`w-full text-lg ${SALE_CONFIG.SALE_ACTIVE ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-2xl border-2 border-amber-400/50 font-bold' : ''}`}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {SALE_CONFIG.SALE_ACTIVE ? `Add to Cart - Save ${SALE_CONFIG.DISCOUNT_PERCENT}%` : 'Add to Cart'}
            </Button>

            <div className="border-t pt-6 space-y-4">
              <h3 className="font-semibold text-lg">Features</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>✓ Premium materials for lasting comfort</li>
                <li>✓ Advanced support technology</li>
                <li>✓ Temperature regulation</li>
                <li>✓ Made by trusted premium brands</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="mt-16 border-t pt-12">
            <h3 className="text-2xl font-bold mb-6">More from {product.node.vendor}</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => {
                const relImage = relatedProduct.node.images.edges[0]?.node;
                const relPrice = relatedProduct.node.priceRange.minVariantPrice;
                
                return (
                  <Card
                    key={relatedProduct.node.id}
                    className="overflow-hidden hover:shadow-soft transition-shadow"
                    onMouseEnter={() => {
                      // Prefetch product data on hover
                      queryClient.prefetchQuery({
                        queryKey: ["product", relatedProduct.node.handle],
                        queryFn: () => fetchProductByHandle(relatedProduct.node.handle),
                      });
                    }}
                  >
                    <Link to={`/product/${relatedProduct.node.handle}`}>
                      <CardHeader className="p-0">
                        {relImage ? (
                          <div className="aspect-square bg-muted overflow-hidden">
                            <LazyImage
                              src={relImage.url}
                              alt={relImage.altText || relatedProduct.node.title}
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
                      <Link to={`/product/${relatedProduct.node.handle}`}>
                        <CardTitle className="text-base mb-2 hover:text-primary transition-colors line-clamp-2">
                          {relatedProduct.node.title}
                        </CardTitle>
                      </Link>
                      <CardDescription className="line-clamp-2 text-sm mb-3">
                        {relatedProduct.node.description || "Premium mattress"}
                      </CardDescription>
                      <p className="text-xl font-bold text-primary">
                        ${parseFloat(relPrice.amount).toFixed(0)}
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Link to={`/product/${relatedProduct.node.handle}`} className="w-full">
                        <Button variant="outline" size="sm" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
