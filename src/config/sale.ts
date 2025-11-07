// BLACK FRIDAY SALE CONFIGURATION
// To disable the sale, set SALE_ACTIVE to false

export const SALE_CONFIG = {
  SALE_ACTIVE: true,
  SALE_NAME: "BLACK FRIDAY SALE",
  DISCOUNT_PERCENT: 25,
  SALE_END_DATE: "2025-12-02", // Cyber Monday
  BADGE_TEXT: "25% OFF",
  PROMO_MESSAGE: "Black Friday Event: Save 25% + Free Shipping on All Premium Mattresses"
} as const;

export function calculateSalePrice(originalPrice: string | number): string {
  if (!SALE_CONFIG.SALE_ACTIVE) {
    return String(originalPrice);
  }
  
  const price = typeof originalPrice === 'string' ? parseFloat(originalPrice) : originalPrice;
  const discountedPrice = price * (1 - SALE_CONFIG.DISCOUNT_PERCENT / 100);
  return discountedPrice.toFixed(2);
}

export function getSaleDiscountAmount(originalPrice: string | number): string {
  const price = typeof originalPrice === 'string' ? parseFloat(originalPrice) : originalPrice;
  const salePrice = parseFloat(calculateSalePrice(originalPrice));
  return (price - salePrice).toFixed(2);
}
