import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/seo/SEOHead";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { LazyImage } from "@/components/LazyImage";
import { ProductDetailSkeleton } from "@/components/skeletons/ProductDetailSkeleton";
import { toast } from "sonner";

interface ComparisonProduct {
  handle: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  firmness: number;
  cooling: string;
  bestFor: string;
  matchPercentage: number;
}

interface ComparisonData {
  sender_name: string;
  personal_note: string | null;
  profile_data: { summary: string };
  compared_products: ComparisonProduct[];
  created_at: string;
}

export default function SharedComparison() {
  const { id } = useParams<{ id: string }>();
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComparison = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from("mattress_comparisons")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        setComparison(data as any);

        // Increment view count
        await supabase.rpc("increment_share_count", { profile_id: id });
      } catch (error) {
        console.error("Error fetching comparison:", error);
        toast.error("Failed to load comparison");
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-6xl mx-auto py-8 px-4">
          <ProductDetailSkeleton />
        </div>
      </div>
    );
  }

  if (!comparison) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Comparison Not Found</h2>
          <p className="text-muted-foreground mb-6">
            This comparison link may have expired or is invalid.
          </p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  const products = comparison.compared_products;
  const topProduct = products[0];
  const secondProduct = products[1];

  return (
    <>
      <SEOHead
        title={`Mattress Comparison from ${comparison.sender_name}`}
        description={`${comparison.sender_name} shared their top mattress recommendations with you. Compare ${topProduct.title} vs ${secondProduct.title}.`}
      />

      <div className="min-h-screen bg-background">
        <div className="container max-w-6xl mx-auto py-8 px-4">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>

            <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
              <h1 className="text-3xl font-bold mb-2">
                🛏️ {comparison.sender_name} shared these mattresses with you!
              </h1>
              {comparison.personal_note && (
                <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">
                  "{comparison.personal_note}"
                </blockquote>
              )}
              <p className="text-sm text-muted-foreground">
                Based on: {comparison.profile_data.summary}
              </p>
            </Card>
          </div>

          {/* Product Comparison */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {products.map((product, index) => (
              <Card key={product.handle} className="p-6">
                {index === 0 && (
                  <Badge className="mb-4 bg-primary">
                    🥇 Top Recommendation
                  </Badge>
                )}
                {index === 1 && (
                  <Badge className="mb-4" variant="secondary">
                    🥈 Runner Up
                  </Badge>
                )}

                <LazyImage
                  src={product.image}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />

                <h2 className="text-2xl font-bold mb-2">{product.title}</h2>

                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary" className="text-lg">
                    {product.matchPercentage}% Match
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Firmness:</span>
                    <span className="font-medium">{product.firmness}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cooling:</span>
                    <span className="font-medium">{product.cooling}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Best For:</span>
                    <span className="font-medium">{product.bestFor}</span>
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-primary">
                    ${product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-lg text-muted-foreground line-through">
                        ${product.originalPrice.toLocaleString()}
                      </span>
                      <Badge variant="destructive">
                        Save ${(product.originalPrice - product.price).toLocaleString()}
                      </Badge>
                    </>
                  )}
                </div>

                <Button asChild className="w-full" size="lg">
                  <Link to={`/product/${product.handle}`}>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    View Details
                  </Link>
                </Button>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <Card className="p-8 text-center bg-gradient-to-br from-primary/10 to-secondary/10">
            <h3 className="text-2xl font-bold mb-4">
              Want to find your perfect mattress?
            </h3>
            <p className="text-muted-foreground mb-6">
              Chat with our AI to get personalized recommendations based on your sleep preferences
            </p>
            <Button asChild size="lg">
              <Link to="/">Start Your Recommendation Quiz</Link>
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
}
