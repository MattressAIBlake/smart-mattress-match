import { useQuery } from "@tanstack/react-query";
import { fetchProductByHandle } from "@/lib/shopify";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

interface ProductRecommendationCardProps {
  handle: string;
  queryParams?: string;
  reason: string;
  features: string[];
  price: string;
}

export const ProductRecommendationCard = ({
  handle,
  queryParams,
  reason,
  features,
  price,
}: ProductRecommendationCardProps) => {
  const { data: product } = useQuery({
    queryKey: ["product", handle],
    queryFn: () => fetchProductByHandle(handle),
  });

  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  // Parse query params to find exact variant
  const params = new URLSearchParams(queryParams || "");
  const size = params.get("size");
  const cooling = params.get("cooling");
  const support = params.get("support");

  const matchingVariant = product?.variants.edges.find((v) => {
    const sizeMatch = v.node.selectedOptions.find((o) => o.name === "Size")?.value === size;
    const coolingMatch = !cooling || v.node.selectedOptions.find((o) => o.name === "Cooling")?.value === cooling;
    const supportMatch = !support || v.node.selectedOptions.find((o) => o.name === "Support")?.value === support;
    return sizeMatch && coolingMatch && supportMatch;
  })?.node;

  // Fallback to first available variant if no exact match
  const selectedVariant = matchingVariant || product?.variants.edges[0]?.node;

  const handleQuickAdd = () => {
    if (!selectedVariant || !product) {
      toast.error("Product unavailable");
      return;
    }

    addItem({
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions,
    });
    
    openCart();
  };

  if (!product) return null;

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow border-2">
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
          {(size || cooling || support) && (
            <div className="text-xs text-muted-foreground mb-2">
              {size && <span>{size}</span>}
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
              <Button size="sm" onClick={handleQuickAdd} className="h-8 text-xs">
                <ShoppingCart className="w-3 h-3 mr-1" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
