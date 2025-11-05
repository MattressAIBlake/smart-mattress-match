import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/shopify";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/CartDrawer";
import { useCartStore } from "@/stores/cartStore";
import { ShoppingCart, ArrowLeft, Moon, Loader2, Info } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type CoolingOption = "tencel" | "glaciotex" | "glaciotex-coolforce";
type SupportOption = "luxe" | "ergoalign";

const ProductDetail = () => {
  const { handle } = useParams();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [coolingOption, setCoolingOption] = useState<CoolingOption>("tencel");
  const [supportOption, setSupportOption] = useState<SupportOption>("luxe");
  
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(100),
  });

  const addItem = useCartStore((state) => state.addItem);

  const product = products?.find((p) => p.node.handle === handle);
  const isLuxeModel = product?.node.title.toLowerCase().includes("luxe");

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

  const coolingPrices = {
    tencel: 0,
    glaciotex: 187,
    "glaciotex-coolforce": 374,
  };

  const supportPrices = {
    luxe: 0,
    ergoalign: 187,
  };

  const getCustomizationPrice = () => {
    if (!isLuxeModel) return 0;
    return coolingPrices[coolingOption] + supportPrices[supportOption];
  };

  const getTotalPrice = () => {
    const basePrice = parseFloat(variant?.price.amount || "0");
    return basePrice + getCustomizationPrice();
  };

  const handleAddToCart = () => {
    if (!variant) {
      toast.error("Please select a variant");
      return;
    }

    const customizations = isLuxeModel
      ? [
          coolingOption === "tencel" ? "TENCEL™ Cover" : 
          coolingOption === "glaciotex" ? "GlacioTex™ Cooling Cover" :
          "GlacioTex™ Cooling Cover + CoolForce Layer",
          supportOption === "luxe" ? "Luxe Responsive Foam" : "ErgoAlign Layer"
        ]
      : [];

    addItem({
      product,
      variantId: variant.id,
      variantTitle: `${variant.title}${customizations.length > 0 ? ` (${customizations.join(", ")})` : ""}`,
      price: {
        amount: getTotalPrice().toString(),
        currencyCode: variant.price.currencyCode,
      },
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
                ${getTotalPrice().toFixed(0)}
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
                <label className="block text-sm font-medium mb-3">Select Size</label>
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

            {/* Luxe Customization Options */}
            {isLuxeModel && (
              <>
                {/* Cooling Options */}
                <Card className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Sleep hot?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Select the right cooling option for you!
                    </p>
                  </div>
                  
                  <RadioGroup value={coolingOption} onValueChange={(value) => setCoolingOption(value as CoolingOption)}>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="tencel" id="tencel" className="mt-1" />
                        <Label htmlFor="tencel" className="flex-1 cursor-pointer">
                          <div className="font-medium">TENCEL™ Cover</div>
                          <div className="text-sm text-muted-foreground">
                            A super soft, ultra-smooth, premium mattress top fabric.
                          </div>
                          <div className="text-sm font-semibold mt-1">+$0</div>
                        </Label>
                      </div>

                      <div className="flex items-start space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="glaciotex" id="glaciotex" className="mt-1" />
                        <Label htmlFor="glaciotex" className="flex-1 cursor-pointer">
                          <div className="font-medium">GlacioTex™ Cooling Cover</div>
                          <div className="text-sm text-muted-foreground">
                            A cutting-edge top fabric that feels instantly cool when you get into bed.
                          </div>
                          <div className="text-sm font-semibold mt-1">+$187</div>
                        </Label>
                      </div>

                      <div className="flex items-start space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="glaciotex-coolforce" id="glaciotex-coolforce" className="mt-1" />
                        <Label htmlFor="glaciotex-coolforce" className="flex-1 cursor-pointer">
                          <div className="font-medium">GlacioTex™ Cooling Cover + CoolForce Layer</div>
                          <div className="text-sm text-muted-foreground">
                            Our cooling cover plus our heat transfer layer for the ultimate cool sleep.
                          </div>
                          <div className="text-sm font-semibold mt-1">+$374</div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>

                  <Button variant="link" className="text-xs p-0 h-auto">
                    <Info className="w-3 h-3 mr-1" />
                    Not sure how much cooling you need? Compare the cooling options
                  </Button>
                </Card>

                {/* Support Layer Options */}
                <Card className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Wake up with back pain?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Choose a Support layer.
                    </p>
                  </div>
                  
                  <RadioGroup value={supportOption} onValueChange={(value) => setSupportOption(value as SupportOption)}>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="luxe" id="luxe" className="mt-1" />
                        <Label htmlFor="luxe" className="flex-1 cursor-pointer">
                          <div className="font-medium">Luxe Responsive Foam</div>
                          <div className="text-sm text-muted-foreground">
                            Premium comfort layer included with your Luxe mattress.
                          </div>
                          <div className="text-sm font-semibold mt-1">+$0</div>
                        </Label>
                      </div>

                      <div className="flex items-start space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="ergoalign" id="ergoalign" className="mt-1" />
                        <Label htmlFor="ergoalign" className="flex-1 cursor-pointer">
                          <div className="font-medium">ErgoAlign™ Layer</div>
                          <div className="text-sm text-muted-foreground">
                            Ideal for anyone with frequent lower back pain.
                          </div>
                          <div className="text-sm font-semibold mt-1">+$187</div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>

                  <Button variant="link" className="text-xs p-0 h-auto">
                    <Info className="w-3 h-3 mr-1" />
                    Not sure if you need ErgoAlign support? Get answers here
                  </Button>
                </Card>
              </>
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
