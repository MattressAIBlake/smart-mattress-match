import { MattressAIChat } from "@/components/MattressAIChat";
import { ProductGrid } from "@/components/ProductGrid";
import { CartDrawer } from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import { Moon, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Mattress Wizard</h1>
              <p className="text-xs text-muted-foreground">Premium Sleep Solutions</p>
            </div>
          </div>
          <CartDrawer />
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-primary text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6" />
            <span className="text-sm font-semibold uppercase tracking-wide">AI-Powered Recommendations</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Find Your Perfect Mattress
          </h2>
          <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-2xl mx-auto">
            Let our AI expert guide you to the ideal mattress from Helix, Leesa, Birch, Plank, and Brooklyn Bedding
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8">
            Start Shopping
          </Button>
        </div>
      </section>

      {/* AI Chat Section */}
      <section className="py-16 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Talk to Our AI Mattress Expert
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Answer a few questions and get personalized recommendations tailored to your sleep style
            </p>
          </div>
          <MattressAIChat />
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Premium Brands You Trust
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            All mattresses from renowned premium brands
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {["Helix", "Leesa", "Birch", "Plank", "Brooklyn Bedding"].map((brand) => (
              <div
                key={brand}
                className="flex items-center justify-center p-6 bg-card rounded-lg shadow-card hover:shadow-soft transition-shadow"
              >
                <span className="text-xl font-semibold text-foreground">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Our Mattress Collection
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Explore our curated selection of premium mattresses
          </p>
          <ProductGrid />
        </div>
      </section>

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
