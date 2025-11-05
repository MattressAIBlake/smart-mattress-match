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
                    <h3 className="text-lg font-semibold mb-4">Which cooling option is right for you?</h3>
                  </div>
                  
                  <RadioGroup value={coolingOption} onValueChange={(value) => setCoolingOption(value as CoolingOption)}>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="tencel" id="tencel" className="mt-1" />
                        <Label htmlFor="tencel" className="flex-1 cursor-pointer">
                          <div className="font-semibold mb-2">TENCEL™ Cover (+$0)</div>
                          <div className="text-sm text-muted-foreground leading-relaxed">
                            Made from sustainably sourced eucalyptus fibers, is naturally hypoallergenic, and is luxuriously smooth and ultra-soft. It also naturally enhances airflow and regulates temperature for a comfortable night of rest.
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-start space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="glaciotex" id="glaciotex" className="mt-1" />
                        <Label htmlFor="glaciotex" className="flex-1 cursor-pointer">
                          <div className="font-semibold mb-2">GlacioTex™ Cooling Cover (+$187)</div>
                          <div className="text-sm text-muted-foreground leading-relaxed">
                            A great option for people who like that feeling of crisp, cool sheets when they get into bed each night. Made from our cutting-edge, heat conductive fabric, the GlacioTex Cooling Cover draws heat away from the surface of the mattress for a cool-to-the-touch feel — while also feeling soft and comfortable beneath you.
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-start space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="glaciotex-coolforce" id="glaciotex-coolforce" className="mt-1" />
                        <Label htmlFor="glaciotex-coolforce" className="flex-1 cursor-pointer">
                          <div className="font-semibold mb-2">GlacioTex™ Cooling Cover + CoolForce Layer (+$374)</div>
                          <div className="text-sm text-muted-foreground leading-relaxed">
                            For anyone who sleeps warm and wants the absolute latest in mattress-cooling technology. Made from five graphite ribbons embedded seamlessly beneath the surface of your mattress, the CoolForce Layer is proven to pull 22% more heat away from the body to keep you cool continuously for over 12 hours.
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </Card>

                {/* Support Layer Options */}
                <Card className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Wake up with back pain?</h3>
                    <div className="text-sm text-muted-foreground leading-relaxed space-y-3 mb-4">
                      <p>
                        If you're someone who wakes most mornings feeling tightness and discomfort in your lower back, there's a good chance you're not getting the necessary support from your mattress. In most cases, that lack of support is causing your hips to sag into the surface of the mattress and creating tension at your spine and lower back.
                      </p>
                      <p>
                        Some sleepers deal with the pain. Others seek out ultra-firm mattress models that prevent you from sinking into the mattress at all, but might not be comfortable.
                      </p>
                      <p className="font-medium text-foreground">
                        At Helix, we've created the ErgoAlign Layer.
                      </p>
                    </div>
                  </div>
                  
                  <RadioGroup value={supportOption} onValueChange={(value) => setSupportOption(value as SupportOption)}>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="luxe" id="luxe" className="mt-1" />
                        <Label htmlFor="luxe" className="flex-1 cursor-pointer">
                          <div className="font-semibold mb-2">Luxe Responsive Foam (+$0)</div>
                          <div className="text-sm text-muted-foreground leading-relaxed">
                            Every Helix Luxe mattress includes a premium pillow top, 3 layers of high-density foam, and up to 1,000 individually wrapped steel coils with our advanced zoned lumbar support for exceptional comfort and support.
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-start space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="ergoalign" id="ergoalign" className="mt-1" />
                        <Label htmlFor="ergoalign" className="flex-1 cursor-pointer">
                          <div className="font-semibold mb-2">ErgoAlign™ Layer (+$187)</div>
                          <div className="text-sm text-muted-foreground leading-relaxed">
                            This innovative design is a zoned top layer which features a segment of ultra-dense foam beneath your midsection to provide additional support and pressure relief where you need it, while the bottom and top sections follow the natural contours of your body. The result is an alignment structure ideal for reducing stress points and helping to provide a better night's sleep.
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>

                  <div className="text-xs text-muted-foreground leading-relaxed pt-2">
                    When you add the ErgoAlign Layer to your new mattress, you'll enjoy increased support where you need it most and additional pressure relief in all sleeping positions.
                  </div>
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
