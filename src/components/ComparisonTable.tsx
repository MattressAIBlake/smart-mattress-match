import { useQuery } from "@tanstack/react-query";
import { fetchProductByHandle } from "@/lib/shopify";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface ComparisonTableProps {
  productHandles: string[];
}

export const ComparisonTable = ({ productHandles }: ComparisonTableProps) => {
  const productQueries = productHandles.map(handle =>
    useQuery({
      queryKey: ["product", handle],
      queryFn: () => fetchProductByHandle(handle),
      retry: 2,
    })
  );

  const isLoading = productQueries.some(q => q.isLoading);
  const products = productQueries.map(q => q.data).filter(Boolean);

  if (isLoading || products.length === 0) {
    return (
      <Card className="p-4 animate-pulse">
        <div className="h-40 bg-muted rounded" />
      </Card>
    );
  }

  // Extract comparison data
  const getPrice = (product: any) => {
    const price = parseFloat(product.priceRange.minVariantPrice.amount);
    return (price * 0.75).toFixed(0); // Apply 25% sale discount
  };

  const getFirmness = (title: string) => {
    if (title.includes('Sunset') || title.includes('Moonlight')) return 'Soft (2-3/10)';
    if (title.includes('Midnight')) return 'Medium (4-6/10)';
    if (title.includes('Dusk')) return 'Medium-Firm (5-6/10)';
    if (title.includes('Twilight') || title.includes('Dawn')) return 'Firm (8-9/10)';
    if (title.includes('Aurora') || title.includes('Signature')) return 'Multiple Options';
    return 'Medium (5-6/10)';
  };

  const getCooling = (title: string) => {
    if (title.includes('Aurora')) return 'CopperFlex + Gel';
    if (title.includes('Luxe')) return 'GlacioTex™';
    if (title.includes('Natural') || title.includes('Birch')) return 'Natural Latex';
    return 'Standard Hybrid';
  };

  const getBestFor = (title: string) => {
    if (title.includes('Sunset') || title.includes('Legend')) return 'Side Sleepers';
    if (title.includes('Midnight')) return 'Side & Combo';
    if (title.includes('Dusk')) return 'Back & Stomach';
    if (title.includes('Aurora')) return 'Hot Sleepers';
    if (title.includes('Plus') || title.includes('Titan')) return 'Plus-Size';
    return 'All Positions';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <Card className="overflow-x-auto bg-white/80 dark:bg-white/5 backdrop-blur-sm border-white/40 dark:border-white/20">
        <div className="min-w-[600px]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="p-4 text-left font-semibold">Feature</th>
                {products.map((product, idx) => (
                  <th key={idx} className="p-4 text-center font-semibold">
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={product.images.edges[0]?.node.url}
                        alt={product.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <span className="text-sm">{product.title}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="p-4 font-medium">Price</td>
                {products.map((product, idx) => (
                  <td key={idx} className="p-4 text-center">
                    <span className="text-lg font-bold text-primary">${getPrice(product)}</span>
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border/50 bg-muted/20">
                <td className="p-4 font-medium">Firmness</td>
                {products.map((product, idx) => (
                  <td key={idx} className="p-4 text-center text-sm">
                    {getFirmness(product.title)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-4 font-medium">Cooling</td>
                {products.map((product, idx) => (
                  <td key={idx} className="p-4 text-center text-sm">
                    {getCooling(product.title)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border/50 bg-muted/20">
                <td className="p-4 font-medium">Best For</td>
                {products.map((product, idx) => (
                  <td key={idx} className="p-4 text-center text-sm">
                    {getBestFor(product.title)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium">Action</td>
                {products.map((product, idx) => (
                  <td key={idx} className="p-4 text-center">
                    <Link to={`/product/${product.handle}`}>
                      <Button size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
};
