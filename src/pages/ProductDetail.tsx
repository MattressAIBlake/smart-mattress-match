import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/shopify";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/CartDrawer";
import { useCartStore } from "@/stores/cartStore";
import { ShoppingCart, ArrowLeft, Moon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const ProductDetail = () => {
  const { handle } = useParams();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(100),
  });

  const addItem = useCartStore((state) => state.addItem);

  const product = products?.find((p) => p.node.handle === handle);

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

  const variant = product.node.variants.edges[selectedVariantIndex]?.node;
  const image = product.node.images.edges[0]?.node;

  const handleAddToCart = () => {
    if (!variant) {
      toast.error("Please select a variant");
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
                ${parseFloat(variant?.price.amount || "0").toFixed(0)}
              </p>
              <p className="text-sm text-muted-foreground">
                {variant?.title}
              </p>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed">
              {product.node.description || "Premium mattress designed for exceptional comfort and support."}
            </p>

            {/* Variant Selection */}
            {product.node.variants.edges.length > 1 && (
              <div>
                <label className="block text-sm font-medium mb-2">Size</label>
                <div className="grid grid-cols-2 gap-2">
                  {product.node.variants.edges.map((v, idx) => (
                    <Button
                      key={v.node.id}
                      variant={selectedVariantIndex === idx ? "default" : "outline"}
                      onClick={() => setSelectedVariantIndex(idx)}
                      className="w-full"
                    >
                      {v.node.title}
                    </Button>
                  ))}
                </div>
              </div>
            )}

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
