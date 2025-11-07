import { lazy, Suspense, useEffect, useState } from "react";
import { FeaturedProduct } from "@/components/FeaturedProduct";
import { MattressAIChat } from "@/components/MattressAIChat";
import { CartDrawer } from "@/components/CartDrawer";
import { ReferralButton } from "@/components/ReferralButton";
import { PromoBar } from "@/components/PromoBar";
import { ReferralShareCard } from "@/components/ReferralShareCard";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { OrganizationSchema } from "@/components/seo/OrganizationSchema";
import { ProductGridSkeleton } from "@/components/skeletons/ProductGridSkeleton";
import { useCartStore } from "@/stores/cartStore";
import { SALE_CONFIG } from "@/config/sale";

// Lazy load below-fold components
const BrandProducts = lazy(() => import("@/components/BrandProducts").then(m => ({ default: m.BrandProducts })));

const Index = () => {
  const navigate = useNavigate();
  const setReferralCode = useCartStore(state => state.setReferralCode);

  useEffect(() => {
    // Check for referral code in URL
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');
    
    if (refCode) {
      setReferralCode(refCode);
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [setReferralCode]);

  return (
    <div className="min-h-screen bg-background">
      {/* SEO Schemas */}
      <FAQSchema
        questions={[
          {
            question: "How does the AI mattress recommendation work?",
            answer: "Our AI analyzes your sleep position, body type, temperature preferences, and support needs to recommend the perfect mattress from premium brands like Helix, Leesa, Birch, Plank, and Brooklyn Bedding.",
          },
          {
            question: "What mattress brands do you recommend?",
            answer: "We feature 5 premium mattress brands: Helix Sleep, Leesa, Birch Natural Mattress, Brooklyn Bedding Plank, and Brooklyn Bedding signature collections. Each brand offers unique features for different sleep preferences.",
          },
          {
            question: "How do I choose the right mattress firmness?",
            answer: "Mattress firmness depends on your sleep position and body weight. Side sleepers typically prefer softer mattresses (3-5 firmness), back sleepers medium (5-7), and stomach sleepers firmer options (7-9). Our AI considers these factors in recommendations.",
          },
          {
            question: "What is the best mattress for hot sleepers?",
            answer: "For hot sleepers, we recommend mattresses with cooling technology like gel-infused memory foam, breathable covers, or hybrid designs with enhanced airflow. Helix Midnight Luxe and Leesa Studio feature excellent cooling properties.",
          },
          {
            question: "Do you offer free shipping and returns?",
            answer: "Most of our partner brands offer free shipping and generous trial periods (typically 100 nights) with hassle-free returns. Check individual product pages for specific brand policies.",
          },
        ]}
      />
      <OrganizationSchema
        name="Mattress Wizard"
        description="AI-powered mattress recommendations from premium brands including Helix, Leesa, Birch, Plank, and Brooklyn Bedding"
        url="https://mattresswizard.com"
      />

      {/* Promo Bar */}
      <PromoBar />

      {/* Header */}
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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

      {/* Hero Section with AI Chat */}
      <section className="bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 dark:from-blue-950/30 dark:via-purple-950/20 dark:to-pink-950/30 py-16 md:py-24 min-h-[70vh] flex items-center relative overflow-hidden">
        {SALE_CONFIG.SALE_ACTIVE && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
            <Badge className="px-8 py-3 text-xl md:text-2xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-black shadow-2xl animate-pulse">
              <Tag className="h-6 w-6 mr-3" />
              {SALE_CONFIG.BADGE_TEXT} - {SALE_CONFIG.DISCOUNT_PERCENT}% OFF ALL MATTRESSES
            </Badge>
          </div>
        )}
        <div className="container mx-auto px-4">
          <MattressAIChat />
        </div>
      </section>

      {/* Featured Product */}
      <FeaturedProduct />

      {/* Referral Share Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-purple-500/5">
        <div className="container mx-auto px-4">
          <ReferralShareCard />
        </div>
      </section>

      {/* Brand Products - Lazy loaded */}
      <Suspense fallback={<div className="py-16"><div className="container mx-auto px-4"><ProductGridSkeleton count={12} /></div></div>}>
        <BrandProducts />
      </Suspense>

      {/* Footer with Brand Links */}
      <footer className="border-t py-8 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground mb-6">
            <p className="mb-4">&copy; 2024 Mattress Wizard. All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <Link to="/brand/helix" className="hover:text-primary transition-colors">
                Helix Mattresses
              </Link>
              <span className="text-muted-foreground/40">•</span>
              <Link to="/brand/leesa" className="hover:text-primary transition-colors">
                Leesa Mattresses
              </Link>
              <span className="text-muted-foreground/40">•</span>
              <Link to="/brand/brooklyn-bedding" className="hover:text-primary transition-colors">
                Brooklyn Bedding
              </Link>
              <span className="text-muted-foreground/40">•</span>
              <Link to="/brand/birch" className="hover:text-primary transition-colors">
                Birch Natural
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
