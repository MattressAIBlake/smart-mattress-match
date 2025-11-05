import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/shopify";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/CartDrawer";
import { useCartStore } from "@/stores/cartStore";
import { ShoppingCart, ArrowLeft, Moon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";

const ProductDetail = () => {
  const { handle } = useParams();
  const location = window.location;
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedCooling, setSelectedCooling] = useState("");
  const [selectedSupport, setSelectedSupport] = useState("");
  
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(100),
  });

  const addItem = useCartStore((state) => state.addItem);
  const product = products?.find((p) => p.node.handle === handle);

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
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
    const sizeMatch = v.node.selectedOptions.find((o) => o.name === "Size")?.value === selectedSize;
    const coolingMatch = !selectedCooling || v.node.selectedOptions.find((o) => o.name === "Cooling")?.value === selectedCooling;
    const supportMatch = !selectedSupport || v.node.selectedOptions.find((o) => o.name === "Support")?.value === selectedSupport;
    return sizeMatch && coolingMatch && supportMatch;
  })?.node;

  const image = product?.node.images.edges[0]?.node;
  const hasMultipleOptions = product?.node.options && product.node.options.length > 1;

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
      {/* Header */}
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Moon className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Mattress Wizard</h1>
              <p className="text-xs text-muted-foreground">Premium Sleep Solutions</p>
            </div>
          </Link>
          <CartDrawer />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            {image ? (
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <img
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
            <div>
              <h1 className="text-4xl font-bold mb-4">{product.node.title}</h1>
              <p className="price-display text-4xl text-foreground mb-2">
                ${selectedVariant ? parseFloat(selectedVariant.price.amount).toFixed(0) : "—"}
              </p>
              {selectedVariant && (
                <p className="text-sm text-muted-foreground">
                  {selectedVariant.title}
                </p>
              )}
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed">
              {product.node.description || "Premium mattress designed for exceptional comfort and support."}
            </p>

            {/* Option Selectors */}
            {hasMultipleOptions && product.node.options.map((option) => (
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

            <Button size="lg" className="w-full text-lg" onClick={handleAddToCart}>
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
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
      </div>
    </div>
  );
};

export default ProductDetail;
