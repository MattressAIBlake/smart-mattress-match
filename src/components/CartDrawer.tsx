import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ShoppingCart, Minus, Plus, Trash2, ExternalLink, Loader2, Gift, ChevronDown, Sparkles } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useRecommendedBases } from "@/hooks/useRecommendedBases";
import { optimizeShopifyImage } from "@/lib/shopify";

export const CartDrawer = () => {
  const [showPromo, setShowPromo] = useState(false);
  const [isBaseUpsellOpen, setIsBaseUpsellOpen] = useState(false);
  const { 
    items, 
    isLoading,
    isCartOpen,
    updateQuantity, 
    removeItem, 
    createCheckout,
    openCart,
    closeCart,
    addItem
  } = useCartStore();

  const { recommendedBases, shouldShow, mattressSize } = useRecommendedBases(items);

  useEffect(() => {
    // Show promo if first-time visitor
    const hasVisited = localStorage.getItem('mattress-wizard-visited');
    if (hasVisited === 'true') {
      setShowPromo(true);
    }
  }, []);
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);

  const handleCheckout = async () => {
    try {
      await createCheckout();
      const checkoutUrl = useCartStore.getState().checkoutUrl;
      if (checkoutUrl) {
        window.open(checkoutUrl, '_blank');
        closeCart();
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      toast.error('Checkout failed. Please try again.');
    }
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => open ? openCart() : closeCart()}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-accent">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            {totalItems === 0 ? "Your cart is empty" : `${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart`}
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-col flex-1 pt-6 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Your cart is empty</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-4 p-2 border rounded-lg">
                      <div className="w-16 h-16 bg-secondary/20 rounded-md overflow-hidden flex-shrink-0">
                        {item.product.node.images?.edges?.[0]?.node && (
                          <img
                            src={item.product.node.images.edges[0].node.url}
                            alt={item.product.node.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{item.product.node.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.selectedOptions.map(option => option.value).join(' • ')}
                        </p>
                        <p className="font-semibold">
                          {item.price.currencyCode} {parseFloat(item.price.amount).toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeItem(item.variantId)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Adjustable Base Upsell */}
                {shouldShow && recommendedBases.length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    <Collapsible open={isBaseUpsellOpen} onOpenChange={setIsBaseUpsellOpen}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/10 hover:border-primary/20 transition-colors">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span className="text-sm font-semibold">Complete Your Setup</span>
                          <Badge variant="secondary" className="text-xs">Save up to $500</Badge>
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isBaseUpsellOpen ? 'rotate-180' : ''}`} />
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent className="pt-3 space-y-2">
                        <p className="text-xs text-muted-foreground mb-3">
                          Maximize comfort with an adjustable base {mattressSize ? `for your ${mattressSize} mattress` : ''}
                        </p>
                        <div className="space-y-2">
                          {recommendedBases.map((base) => {
                            const variant = base.node.variants.edges.find(v => 
                              mattressSize ? v.node.selectedOptions.some(opt => opt.value === mattressSize) : true
                            )?.node || base.node.variants.edges[0].node;

                            return (
                              <div key={base.node.id} className="flex gap-3 p-2 border rounded-lg bg-background hover:border-primary/30 transition-colors">
                                <div className="w-16 h-16 bg-secondary/20 rounded-md overflow-hidden flex-shrink-0">
                                  {base.node.images?.edges?.[0]?.node && (
                                    <img
                                      src={optimizeShopifyImage(base.node.images.edges[0].node.url, 100)}
                                      alt={base.node.title}
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h5 className="text-sm font-medium truncate">{base.node.title}</h5>
                                  <p className="text-xs text-muted-foreground">{mattressSize || 'Queen'}</p>
                                  <p className="text-sm font-semibold text-primary">
                                    ${parseFloat(variant.price.amount).toFixed(0)}
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-shrink-0 h-8"
                                  onClick={() => {
                                    addItem({
                                      product: base,
                                      variantId: variant.id,
                                      variantTitle: variant.title,
                                      price: variant.price,
                                      quantity: 1,
                                      selectedOptions: variant.selectedOptions,
                                    });
                                    toast.success("Added to cart!", {
                                      description: base.node.title,
                                    });
                                  }}
                                >
                                  Add
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                )}
              </div>
              
              <div className="flex-shrink-0 space-y-4 pt-4 border-t bg-background">
                {showPromo && (
                  <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border border-primary/20 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Gift className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-primary">Don't forget your FREE Bedding Bundle!</p>
                        <p className="text-muted-foreground">Complete your order today to claim your $180 gift</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-xl font-bold">
                    {items[0]?.price.currencyCode || '$'} {totalPrice.toFixed(2)}
                  </span>
                </div>
                
                <Button 
                  onClick={handleCheckout}
                  className="w-full" 
                  size="lg"
                  disabled={items.length === 0 || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Checkout...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Checkout & Claim Bonus
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
