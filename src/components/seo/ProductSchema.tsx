import { Helmet } from "react-helmet";

interface ProductSchemaProps {
  name: string;
  description: string;
  brand: string;
  price: string;
  currency: string;
  image?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  url: string;
}

export const ProductSchema = ({
  name,
  description,
  brand,
  price,
  currency,
  image,
  availability = "InStock",
  url,
}: ProductSchemaProps) => {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name,
    description,
    brand: {
      "@type": "Brand",
      name: brand,
    },
    image: image || undefined,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: currency,
      availability: `https://schema.org/${availability}`,
      url,
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};
