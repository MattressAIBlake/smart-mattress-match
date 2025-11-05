import { FeaturedProduct } from "@/components/FeaturedProduct";
import { BrandProducts } from "@/components/BrandProducts";
import { MattressAIChat } from "@/components/MattressAIChat";
import { CartDrawer } from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import { Moon, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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

      {/* Hero Section with AI Chat */}
      <section className="bg-gradient-soft py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-sm font-semibold uppercase tracking-wide text-primary">AI-Powered Selection</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
              Skip the Research.<br />Trust AI Expertise.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Our AI mattress expert has unbiased knowledge of every mattress from Helix, Leesa, Birch, Plank, and Brooklyn Bedding. Get your perfect match in minutes.
            </p>
          </div>
          <MattressAIChat />
        </div>
      </section>

      {/* Featured Product */}
      <FeaturedProduct />

      {/* Brand Products */}
      <BrandProducts />

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/50">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Mattress Wizard. All rights reserved.</p>
          <p className="text-sm mt-2">Helix • Leesa • Birch • Plank • Brooklyn Bedding</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
