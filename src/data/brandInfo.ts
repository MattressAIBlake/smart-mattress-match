export interface BrandInfo {
  name: string;
  slug: string;
  description: string;
  tagline: string;
  features: string[];
  logo: string;
  brandColor: string;
  madeIn: string;
}

export const BRAND_INFO: Record<string, BrandInfo> = {
  helix: {
    name: "Helix",
    slug: "helix",
    tagline: "Personalized Sleep Solutions",
    description: "Helix offers a range of premium mattresses designed to match your unique sleep preferences. With options from Core to Luxe to Elite collections, Helix uses advanced technology and materials to deliver personalized comfort and support.",
    logo: "/src/assets/brand-logos/helix-logo.jpg",
    brandColor: "#1d4a7a",
    madeIn: "Made in Arizona, USA",
    features: [
      "Personalized firmness options for every sleep style",
      "Cooling technology with breathable materials",
      "Excellent motion isolation for couples",
      "Made in the USA with premium materials",
      "100-night sleep trial with free returns",
    ],
  },
  leesa: {
    name: "Leesa",
    slug: "leesa",
    tagline: "Premium Comfort, Social Impact",
    description: "Leesa combines exceptional comfort with social responsibility. Known for their innovative foam layers and commitment to giving back, Leesa mattresses deliver pressure relief and support while making a positive impact on communities.",
    logo: "/src/assets/brand-logos/leesa-logo.jpg",
    brandColor: "#1a4d47",
    madeIn: "Made in Arizona, USA",
    features: [
      "Multi-layer foam construction for optimal comfort",
      "Breathable cover for temperature regulation",
      "Universal comfort that fits most sleep styles",
      "Social impact: One mattress donated for every 10 sold",
      "100-night risk-free trial",
    ],
  },
  birch: {
    name: "Birch",
    slug: "birch",
    tagline: "Natural & Sustainable Sleep",
    description: "Birch mattresses are crafted from natural and organic materials, perfect for eco-conscious sleepers. Featuring organic wool, natural latex, and sustainable manufacturing, Birch delivers healthy, chemical-free sleep.",
    logo: "/src/assets/brand-logos/birch-logo.png",
    brandColor: "#0f5647",
    madeIn: "Made in Arizona, USA",
    features: [
      "100% natural Talalay latex for responsive support",
      "Organic wool for natural temperature regulation",
      "GREENGUARD Gold certified for low emissions",
      "Sustainably sourced and eco-friendly materials",
      "25-year warranty for long-lasting quality",
    ],
  },
  "brooklyn-bedding": {
    name: "Brooklyn Bedding",
    slug: "brooklyn-bedding",
    tagline: "Handcrafted Quality Since 1995",
    description: "Brooklyn Bedding has been handcrafting premium mattresses since 1995. From their signature hybrid models to specialty options like the Plank firmness collection, Brooklyn Bedding offers exceptional value with factory-direct pricing.",
    logo: "/src/assets/brand-logos/brooklyn-bedding-logo.jpg",
    brandColor: "#1e3a5f",
    madeIn: "Made in Arizona, USA",
    features: [
      "Handcrafted in the USA with premium materials",
      "Multiple firmness options and specialty models",
      "Advanced cooling technology in premium lines",
      "Factory-direct pricing for exceptional value",
      "120-night sleep trial with free shipping",
    ],
  },
  bear: {
    name: "Bear",
    slug: "bear",
    tagline: "Performance & Recovery",
    description: "Bear mattresses are engineered for active lifestyles and athletic recovery. Featuring Celliant® technology and cooling materials, Bear mattresses help you recover faster and sleep deeper.",
    logo: "",
    brandColor: "#d97706",
    madeIn: "Made in USA",
    features: [
      "Celliant® cover for enhanced recovery",
      "Gel memory foam for pressure relief",
      "Cooling technology for temperature regulation",
      "Ideal for athletes and active individuals",
      "100-night trial and 10-year warranty",
    ],
  },
};

export const getBrandInfo = (slug: string): BrandInfo | undefined => {
  return BRAND_INFO[slug.toLowerCase()];
};
