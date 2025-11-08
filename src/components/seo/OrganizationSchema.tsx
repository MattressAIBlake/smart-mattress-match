import { Helmet } from "react-helmet";

interface OrganizationSchemaProps {
  name: string;
  description: string;
  logo?: string;
  url?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  contactInfo?: {
    email?: string;
    telephone?: string;
    address?: {
      streetAddress?: string;
      addressLocality?: string;
      addressRegion?: string;
      postalCode?: string;
      addressCountry?: string;
    };
  };
}

export const OrganizationSchema = ({
  name,
  description,
  logo = "https://mattresswizard.com/logo.png",
  url = "https://mattresswizard.com",
  socialLinks,
  contactInfo,
}: OrganizationSchemaProps) => {
  const sameAs = socialLinks ? Object.values(socialLinks).filter(Boolean) : [];
  
  const schema: any = {
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

  // Add social media links if provided
  if (sameAs.length > 0) {
    schema.sameAs = sameAs;
  }

  // Add contact information if provided
  if (contactInfo?.email) {
    schema.email = contactInfo.email;
  }
  
  if (contactInfo?.telephone) {
    schema.telephone = contactInfo.telephone;
  }
  
  if (contactInfo?.address) {
    schema.address = {
      "@type": "PostalAddress",
      ...contactInfo.address,
    };
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};
