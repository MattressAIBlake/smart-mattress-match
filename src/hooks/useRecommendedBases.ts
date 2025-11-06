import { useQuery } from "@tanstack/react-query";
import { fetchAdjustableBases, ShopifyProduct } from "@/lib/shopify";
import { CartItem } from "@/stores/cartStore";

export const useRecommendedBases = (cartItems: CartItem[]) => {
  const { data: bases, isLoading } = useQuery({
    queryKey: ['adjustable-bases'],
    queryFn: () => fetchAdjustableBases(6),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Check if cart has a mattress
  const hasMattress = cartItems.some(item => 
    item.product.node.vendor !== 'BedTech'
  );

  // Check if cart already has an adjustable base
  const hasBase = cartItems.some(item => 
    item.product.node.vendor === 'BedTech'
  );

  // Get mattress size from cart to filter compatible bases
  const getMattressSize = () => {
    const mattressItem = cartItems.find(item => 
      item.product.node.vendor !== 'BedTech'
    );
    
    if (!mattressItem) return null;
    
    // Extract size from selected options
    const sizeOption = mattressItem.selectedOptions.find(
      opt => opt.name.toLowerCase() === 'size'
    );
    
    return sizeOption?.value || null;
  };

  // Filter bases by size compatibility
  const getCompatibleBases = (): ShopifyProduct[] => {
    if (!bases || !hasMattress || hasBase) return [];
    
    const mattressSize = getMattressSize();
    if (!mattressSize) return bases.slice(0, 3);

    // Filter bases that have matching size variants
    const compatible = bases.filter(base => {
      const hasMatchingSize = base.node.variants.edges.some(variant =>
        variant.node.selectedOptions.some(opt => 
          opt.value === mattressSize
        )
      );
      return hasMatchingSize;
    });

    return compatible.slice(0, 3);
  };

  return {
    recommendedBases: getCompatibleBases(),
    isLoading,
    shouldShow: hasMattress && !hasBase,
    mattressSize: getMattressSize(),
  };
};
