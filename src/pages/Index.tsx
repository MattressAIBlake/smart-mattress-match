import { lazy, Suspense, useEffect, useState } from "react";
import { FeaturedProduct } from "@/components/FeaturedProduct";
import { MattressAIChat } from "@/components/MattressAIChat";
import { CartDrawer } from "@/components/CartDrawer";
import { ReferralButton } from "@/components/ReferralButton";
import { ShopByBrand } from "@/components/ShopByBrand";
import { FloatingReferralWidget } from "@/components/FloatingReferralWidget";
import { SmartPromoBar } from "@/components/SmartPromoBar";
import { FloatingSleepStyleWidget } from "@/components/FloatingSleepStyleWidget";
import { TrustBar } from "@/components/TrustBar";
import { ReferralShareCard } from "@/components/ReferralShareCard";
import { MattressBuyingGuide } from "@/components/MattressBuyingGuide";
import { DetailedFAQ } from "@/components/DetailedFAQ";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { OrganizationSchema } from "@/components/seo/OrganizationSchema";
import { LocalBusinessSchema } from "@/components/seo/LocalBusinessSchema";
import { SEOHead } from "@/components/seo/SEOHead";
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
      {/* SEO Meta Tags */}
      <SEOHead
        title="Best Mattress 2024 - AI-Powered Sleep Recommendations | Mattress Wizard"
        description="Find the perfect mattress with our AI recommendation system. Compare top-rated Helix, Leesa, Birch, and Brooklyn Bedding mattresses. Expert reviews, free shipping, generous trial periods. Made in USA. Get personalized sleep solutions for side sleepers, back pain, hot sleepers & more."
        canonical="https://mattresswizard.com/"
      />
      
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
            answer: "Most of our partner brands offer free shipping and generous trial periods with hassle-free returns. Check individual product pages for specific brand policies.",
          },
        ]}
      />
      <OrganizationSchema
        name="Mattress Wizard"
        description="AI-powered mattress recommendations from premium brands including Helix, Leesa, Birch, Plank, and Brooklyn Bedding"
        url="https://mattresswizard.com"
        socialLinks={{
          facebook: "https://facebook.com/mattresswizard",
          twitter: "https://twitter.com/mattresswizard",
          instagram: "https://instagram.com/mattresswizard",
          youtube: "https://youtube.com/@mattresswizard",
        }}
        contactInfo={{
          email: "support@mattresswizard.com",
        }}
      />
      <LocalBusinessSchema
        name="Mattress Wizard"
        description="AI-powered mattress recommendations and premium sleep solutions available online 24/7"
        url="https://mattresswizard.com"
        email="support@mattresswizard.com"
        address={{
          addressLocality: "Online",
          addressRegion: "Nationwide",
          addressCountry: "US",
        }}
        priceRange="$$-$$$"
        openingHours={["Mo-Su 00:00-24:00"]}
        paymentAccepted={["Credit Card", "Debit Card", "PayPal", "Affirm"]}
      />

      {/* Promo Bar */}
      <SmartPromoBar />

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
      <section className="bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 dark:from-blue-950/30 dark:via-purple-950/20 dark:to-pink-950/30 pt-8 pb-12 md:pt-12 md:pb-16 flex items-center relative overflow-hidden">
        <div className="container mx-auto px-4">
          <MattressAIChat />
        </div>
      </section>

      {/* Trust Bar */}
      <TrustBar />

      {/* Featured Product */}
      <FeaturedProduct />

      {/* Shop by Brand Section */}
      <ShopByBrand />

      {/* Brand Products - Lazy loaded */}
      <Suspense fallback={<div className="py-16"><div className="container mx-auto px-4"><ProductGridSkeleton count={12} /></div></div>}>
        <BrandProducts />
      </Suspense>

      {/* Mattress Buying Guide */}
      <MattressBuyingGuide />

      {/* Detailed FAQ Section */}
      <DetailedFAQ />

      {/* Footer with Brand Links */}
      <footer className="border-t py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* About Section */}
            <div>
              <h3 className="font-semibold text-lg mb-4">About Mattress Wizard</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your trusted source for AI-powered mattress recommendations. We help you find the perfect sleep solution from premium brands with expert guidance and unbiased reviews.
              </p>
              <div className="text-sm text-muted-foreground">
                <p>📧 support@mattresswizard.com</p>
              </div>
            </div>

            {/* Shop by Brand */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Shop by Brand</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/brand/helix" className="text-muted-foreground hover:text-primary transition-colors">
                    Helix Mattresses
                  </Link>
                </li>
                <li>
                  <Link to="/brand/leesa" className="text-muted-foreground hover:text-primary transition-colors">
                    Leesa Mattresses
                  </Link>
                </li>
                <li>
                  <Link to="/brand/brooklyn-bedding" className="text-muted-foreground hover:text-primary transition-colors">
                    Brooklyn Bedding
                  </Link>
                </li>
                <li>
                  <Link to="/brand/birch" className="text-muted-foreground hover:text-primary transition-colors">
                    Birch Natural Mattresses
                  </Link>
                </li>
              </ul>
            </div>

            {/* Popular Products */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Popular Products</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/product/helix-midnight-luxe" className="text-muted-foreground hover:text-primary transition-colors">
                    Helix Midnight Luxe
                  </Link>
                </li>
                <li>
                  <Link to="/product/brooklyn-signature-hybrid" className="text-muted-foreground hover:text-primary transition-colors">
                    Brooklyn Signature
                  </Link>
                </li>
                <li>
                  <Link to="/product/leesa-original-mattress" className="text-muted-foreground hover:text-primary transition-colors">
                    Leesa Original
                  </Link>
                </li>
                <li>
                  <Link to="/product/birch-natural-mattress" className="text-muted-foreground hover:text-primary transition-colors">
                    Birch Natural
                  </Link>
                </li>
              </ul>
            </div>

            {/* Sleep Resources */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Sleep Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                    AI Mattress Finder
                  </Link>
                </li>
                <li>
                  <Link to="/sleepstyle" className="text-muted-foreground hover:text-primary transition-colors">
                    Sleep Style Quiz 💕
                  </Link>
                </li>
                <li>
                  <a href="#faq" className="text-muted-foreground hover:text-primary transition-colors">
                    Mattress Buying Guide
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-muted-foreground hover:text-primary transition-colors">
                    Sleep Tips & Advice
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-muted-foreground hover:text-primary transition-colors">
                    Firmness Guide
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t pt-6 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Mattress Wizard. All rights reserved.</p>
            <p className="mt-2">
              Premium mattresses from Helix, Leesa, Birch, Brooklyn Bedding, and Plank with free shipping and generous trial periods.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Referral Widget */}
      <FloatingReferralWidget />
      <FloatingSleepStyleWidget />
    </div>
  );
};

export default Index;
