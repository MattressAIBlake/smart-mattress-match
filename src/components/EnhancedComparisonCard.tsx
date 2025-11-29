import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Flame, Moon, Award, Share2 } from "lucide-react";
import { LazyImage } from "./LazyImage";
import { motion } from "framer-motion";

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

interface EnhancedComparisonCardProps {
  products: ComparisonProduct[];
  profileSummary: string;
  aiVerdict: string;
  onShare: () => void;
}

export const EnhancedComparisonCard = ({
  products,
  profileSummary,
  aiVerdict,
  onShare,
}: EnhancedComparisonCardProps) => {
  const topProduct = products[0];
  const secondProduct = products[1];

  const getWinnerForCategory = (category: 'firmness' | 'price' | 'cooling') => {
    if (category === 'price') {
      return products[0].price <= products[1].price ? 0 : 1;
    }
    // Default to first product for other categories
    return 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="my-6"
    >
      <Card className="p-6 bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-primary/20">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-bold">Your Top Mattress Matches</h3>
            </div>
            <p className="text-sm text-muted-foreground">{profileSummary}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onShare}
            className="gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>

        {/* Product Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {products.map((product, index) => (
            <motion.div
              key={product.handle}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Card className="p-4 relative overflow-hidden hover:shadow-lg transition-shadow">
                {index === 0 && (
                  <Badge className="absolute top-2 right-2 bg-primary gap-1">
                    <Crown className="h-3 w-3" />
                    Top Match
                  </Badge>
                )}
                <LazyImage
                  src={product.image}
                  alt={product.title}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="font-semibold text-lg mb-2">{product.title}</h4>
                <div className="flex items-baseline gap-2 mb-2">
                  <Badge variant="secondary" className="text-lg font-bold">
                    {product.matchPercentage}% Match
                  </Badge>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-primary">
                    ${product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold">Feature</th>
                <th className="text-left py-3 px-4 font-semibold">{topProduct.title}</th>
                <th className="text-left py-3 px-4 font-semibold">{secondProduct.title}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 text-muted-foreground">Firmness</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {getWinnerForCategory('firmness') === 0 && (
                      <Crown className="h-4 w-4 text-primary" />
                    )}
                    <span>Medium ({topProduct.firmness}/10)</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {getWinnerForCategory('firmness') === 1 && (
                      <Crown className="h-4 w-4 text-primary" />
                    )}
                    <span>Medium-Firm ({secondProduct.firmness}/10)</span>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 text-muted-foreground">Cooling</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {getWinnerForCategory('cooling') === 0 && (
                      <Flame className="h-4 w-4 text-primary" />
                    )}
                    <span>{topProduct.cooling}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {getWinnerForCategory('cooling') === 1 && (
                      <Flame className="h-4 w-4 text-primary" />
                    )}
                    <span>{secondProduct.cooling}</span>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 text-muted-foreground">Best For</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4 text-primary" />
                    <span>{topProduct.bestFor}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4 text-muted-foreground" />
                    <span>{secondProduct.bestFor}</span>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 text-muted-foreground">Price</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {getWinnerForCategory('price') === 0 && (
                      <Crown className="h-4 w-4 text-primary" />
                    )}
                    <span className="font-semibold">${topProduct.price.toLocaleString()}</span>
                    {topProduct.originalPrice && (
                      <span className="text-xs text-muted-foreground">
                        (25% off)
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {getWinnerForCategory('price') === 1 && (
                      <Crown className="h-4 w-4 text-primary" />
                    )}
                    <span className="font-semibold">${secondProduct.price.toLocaleString()}</span>
                    {secondProduct.originalPrice && (
                      <span className="text-xs text-muted-foreground">
                        (25% off)
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* AI Verdict */}
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold mb-2">AI Verdict</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {aiVerdict}
              </p>
            </div>
          </div>
        </Card>
      </Card>
    </motion.div>
  );
};
