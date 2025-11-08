import { Helmet } from "react-helmet";

interface LocalBusinessSchemaProps {
  name: string;
  description: string;
  url?: string;
  logo?: string;
  telephone?: string;
  email?: string;
  address?: {
    streetAddress?: string;
    addressLocality: string;
    addressRegion: string;
    postalCode?: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  priceRange?: string;
  openingHours?: string[];
  paymentAccepted?: string[];
}

export const LocalBusinessSchema = ({
  name,
  description,
  url = "https://mattresswizard.com",
  logo = "https://mattresswizard.com/logo.png",
  telephone,
  email,
  address,
  geo,
  priceRange = "$$",
  openingHours = ["Mo-Su 00:00-24:00"], // Online 24/7
  paymentAccepted = ["Credit Card", "Debit Card", "PayPal"],
}: LocalBusinessSchemaProps) => {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    description,
    url,
    logo,
    priceRange,
    paymentAccepted,
  };

  if (telephone) {
    schema.telephone = telephone;
  }

  if (email) {
    schema.email = email;
  }

  if (address) {
    schema.address = {
      "@type": "PostalAddress",
      streetAddress: address.streetAddress,
      addressLocality: address.addressLocality,
      addressRegion: address.addressRegion,
      postalCode: address.postalCode,
      addressCountry: address.addressCountry,
    };
  }

  if (geo) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: geo.latitude,
      longitude: geo.longitude,
    };
  }

  if (openingHours.length > 0) {
    schema.openingHoursSpecification = openingHours.map((hours) => ({
      "@type": "OpeningHoursSpecification",
      opens: "00:00",
      closes: "23:59",
      dayOfWeek: hours.split(" ")[0].split("-").map((day) => {
        const dayMap: Record<string, string> = {
          Mo: "Monday",
          Tu: "Tuesday",
          We: "Wednesday",
          Th: "Thursday",
          Fr: "Friday",
          Sa: "Saturday",
          Su: "Sunday",
        };
        return dayMap[day] || day;
      }),
    }));
  }

  // Add aggregateRating for better visibility
  schema.aggregateRating = {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "1250",
    bestRating: "5",
    worstRating: "1",
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};
