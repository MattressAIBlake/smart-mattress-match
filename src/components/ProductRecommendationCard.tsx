import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProductByHandle } from "@/lib/shopify";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProductRecommendationCardProps {
  handle: string;
  queryParams?: string;
  reason: string;
  features: string[];
  price: string;
  matchPercentage?: string;
}

export const ProductRecommendationCard = ({
  handle,
  queryParams,
  reason,
  features,
  price,
  matchPercentage,
}: ProductRecommendationCardProps) => {
  const matchScore = matchPercentage ? parseInt(matchPercentage) : null;
  const [showSizeDialog, setShowSizeDialog] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", handle],
    queryFn: () => fetchProductByHandle(handle),
    retry: 2,
  });

  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  // Parse query params to find exact variant
  const params = new URLSearchParams(queryParams || "");
  const recommendedSize = params.get("size");
  const cooling = params.get("cooling");
  const support = params.get("support");

  // Get available sizes from product
  const sizeOption = product?.options.find(opt => opt.name === "Size");
  const availableSizes = sizeOption?.values || [];

  // Find matching variant based on selected or recommended size
  const getVariantForSize = (sizeValue: string) => {
    return product?.variants.edges.find((v) => {
      const sizeMatch = v.node.selectedOptions.find((o) => o.name === "Size")?.value === sizeValue;
      const coolingMatch = !cooling || v.node.selectedOptions.find((o) => o.name === "Cooling")?.value === cooling;
      const supportMatch = !support || v.node.selectedOptions.find((o) => o.name === "Support")?.value === support;
      return sizeMatch && coolingMatch && supportMatch;
    })?.node;
  };

  const handleAddToCartClick = () => {
    // If there are multiple sizes, show the size selection dialog
    if (availableSizes.length > 1) {
      setSelectedSize(recommendedSize || availableSizes[0]);
      setShowSizeDialog(true);
    } else {
      // If only one size, add directly
      const variant = getVariantForSize(availableSizes[0]);
      if (variant && product) {
        addToCart(variant);
      }
    }
  };

  const addToCart = (variant: any) => {
    if (!variant || !product) {
      toast.error("Product variant unavailable");
      return;
    }

    addItem({
      product: { node: product },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions,
    });
    
    toast.success("Added to cart", {
      description: `${product.title} - ${variant.title}`,
    });
    
    openCart();
    setShowSizeDialog(false);
  };

  const handleConfirmSize = () => {
    const variant = getVariantForSize(selectedSize);
    if (variant) {
      addToCart(variant);
    }
  };

  // Show loading skeleton while product is fetching - consistent height
  if (isLoading) {
    return (
      <Card className="p-4 border-2 relative min-h-[140px]">
        <div className="flex gap-4 animate-pulse">
          <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-5/6" />
            <div className="h-8 bg-muted rounded w-24 mt-4" />
          </div>
        </div>
      </Card>
    );
  }

  // Show error message if product failed to load
  if (error || !product) {
    console.error('Failed to load product:', { handle, error });
    return (
      <Card className="p-4 border-2 border-destructive/50 bg-destructive/5">
        <div className="flex items-start gap-3">
          <div className="text-destructive">⚠️</div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-destructive mb-1">
              Product Not Found
            </div>
            <div className="text-xs text-muted-foreground">
              The product "{handle}" could not be loaded. This may be a temporary issue or the product may no longer be available.
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow border-2 relative min-h-[140px]">
      {/* Match Badge */}
      {matchScore && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
            matchScore >= 95 
              ? 'bg-green-500 text-white' 
              : matchScore >= 90 
              ? 'bg-blue-500 text-white'
              : 'bg-primary text-primary-foreground'
          }`}>
            ★ {matchScore}% MATCH
          </div>
        </div>
      )}
      
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
          {product.images.edges[0] && (
            <img
              src={product.images.edges[0].node.url}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-base mb-1 truncate">{product.title}</h4>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{reason}</p>

          {/* Configuration */}
          {(recommendedSize || cooling || support) && (
            <div className="text-xs text-muted-foreground mb-2">
              {recommendedSize && <span>Recommended: {recommendedSize}</span>}
              {cooling && <span> • {cooling}</span>}
              {support && <span> • {support}</span>}
            </div>
          )}

          {/* Key Features */}
          <ul className="text-xs text-muted-foreground space-y-0.5 mb-3">
            {features.slice(0, 3).map((f, i) => (
              <li key={i} className="truncate">✓ {f}</li>
            ))}
          </ul>

          {/* Price & Actions */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-lg font-bold">${price}</span>
            <div className="flex gap-2">
              <Link to={`/product/${handle}${queryParams ? "?" + queryParams : ""}`}>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View
                </Button>
              </Link>
              <Button size="sm" onClick={handleAddToCartClick} className="h-8 text-xs">
                <ShoppingCart className="w-3 h-3 mr-1" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Size Selection Dialog */}
      <Dialog open={showSizeDialog} onOpenChange={setShowSizeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Mattress Size</DialogTitle>
            <DialogDescription>
              Choose the size for {product?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-2">
              {availableSizes.map((size) => {
                const variant = getVariantForSize(size);
                const isRecommended = size === recommendedSize;
                return (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    onClick={() => setSelectedSize(size)}
                    className="h-auto py-3 flex flex-col items-start relative"
                  >
                    {isRecommended && (
                      <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                        Recommended
                      </span>
                    )}
                    <span className="font-semibold">{size}</span>
                    {variant && (
                      <span className="text-xs text-muted-foreground">
                        ${parseFloat(variant.price.amount).toFixed(0)}
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
            <Button 
              onClick={handleConfirmSize} 
              className="w-full"
              disabled={!selectedSize}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart - {selectedSize}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
