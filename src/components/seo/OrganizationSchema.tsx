import { Helmet } from "react-helmet";

interface OrganizationSchemaProps {
  name: string;
  description: string;
  logo?: string;
  url?: string;
}

export const OrganizationSchema = ({
  name,
  description,
  logo = "https://mattresswizard.com/logo.png",
  url = "https://mattresswizard.com",
}: OrganizationSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    description,
    url,
    logo,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "1250",
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};
