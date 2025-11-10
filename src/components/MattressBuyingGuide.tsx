import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bed, ThermometerSun, Weight, Moon, DollarSign, Truck } from "lucide-react";

export const MattressBuyingGuide = () => {
  const guides = [
    {
      icon: <Bed className="w-8 h-8 text-primary" />,
      title: "Sleep Position Matters",
      description: "Side sleepers need softer mattresses (3-5 firmness) for pressure relief on shoulders and hips. Back sleepers benefit from medium firmness (5-7) for spinal alignment. Stomach sleepers require firmer support (7-9) to prevent lower back pain.",
      keywords: "side sleeper mattress, back sleeper support, stomach sleeper firmness"
    },
    {
      icon: <Weight className="w-8 h-8 text-primary" />,
      title: "Body Weight Guide",
      description: "Lighter individuals (under 130 lbs) typically prefer softer mattresses for adequate contouring. Average weight sleepers (130-230 lbs) find medium firmness ideal. Heavier individuals (over 230 lbs) need firmer, more supportive mattresses to prevent sagging.",
      keywords: "mattress for heavy person, lightweight sleeper mattress"
    },
    {
      icon: <ThermometerSun className="w-8 h-8 text-primary" />,
      title: "Temperature Regulation",
      description: "Hot sleepers should look for mattresses with cooling gel memory foam, breathable covers, or hybrid designs with enhanced airflow. Cooling technology helps regulate body temperature throughout the night for better sleep quality.",
      keywords: "cooling mattress, hot sleeper mattress, temperature regulation"
    },
    {
      icon: <Moon className="w-8 h-8 text-primary" />,
      title: "Mattress Types Explained",
      description: "Memory foam offers excellent pressure relief and motion isolation. Hybrid mattresses combine foam comfort with individually wrapped coils for superior support and motion isolation. Latex provides responsive, eco-friendly support. Choose based on your comfort preferences and sleep needs.",
      keywords: "memory foam vs hybrid, best mattress type, latex mattress benefits"
    },
    {
      icon: <DollarSign className="w-8 h-8 text-primary" />,
      title: "Budget & Value",
      description: "Quality mattresses range from $800-$3000. Consider total value: warranty length, shipping costs, and expected lifespan (8-10 years). Investing in better sleep improves health, productivity, and quality of life.",
      keywords: "best mattress value, mattress price guide, affordable premium mattress"
    },
    {
      icon: <Truck className="w-8 h-8 text-primary" />,
      title: "Warranty & Shipping",
      description: "Quality brands offer 10-25 year warranties covering manufacturing defects. Free shipping is standard for reputable online mattress companies.",
      keywords: "mattress warranty, free mattress shipping"
    }
  ];

  return (
    <section className="py-16 bg-background" id="buying-guide">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Complete Mattress Buying Guide 2024
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Expert tips to help you choose the perfect mattress based on your sleep position, body type, temperature preferences, and budget. Make an informed decision for better sleep.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {guides.map((guide, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mb-4">{guide.icon}</div>
                <CardTitle className="text-xl">{guide.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {guide.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* SEO-Rich Content Block */}
        <div className="max-w-4xl mx-auto space-y-6 text-muted-foreground">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              How to Choose the Right Mattress Firmness
            </h3>
            <p className="leading-relaxed">
              Mattress firmness is rated on a scale from 1-10, where 1 is extremely soft and 10 is extremely firm. Most people find comfort in the 4-7 range. Your ideal firmness depends on multiple factors including sleep position, body weight, and personal preference. Side sleepers typically need softer mattresses (3-5) to cushion pressure points, while back and stomach sleepers benefit from firmer support (6-8) to maintain spinal alignment.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Best Mattress Materials for Different Sleepers
            </h3>
            <p className="leading-relaxed">
              Memory foam mattresses excel at pressure relief and motion isolation, making them perfect for side sleepers and couples. Hybrid mattresses combine memory foam comfort with individually wrapped coils, offering superior motion isolation, enhanced breathability, and compatibility with adjustable bases. Natural latex mattresses provide responsive, eco-friendly support with excellent durability. All premium mattresses feature individually wrapped coils that minimize motion transfer for undisturbed sleep.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Understanding Mattress Warranties
            </h3>
            <p className="leading-relaxed">
              Most quality mattresses come with 10-25 year warranties covering manufacturing defects like sagging, indentations, and structural issues. Always read warranty terms carefully, as most require using a proper foundation and mattress protector to maintain coverage.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
