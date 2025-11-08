import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const DetailedFAQ = () => {
  const faqs = [
    {
      question: "How does AI-powered mattress recommendation work?",
      answer: "Our AI mattress recommendation system analyzes multiple factors including your sleep position (side, back, stomach), body weight, temperature preferences, firmness preferences, and any specific concerns like back pain or partner disturbance. The AI then matches you with the most suitable mattresses from premium brands like Helix, Leesa, Birch, and Brooklyn Bedding. This personalized approach ensures you find a mattress that meets your unique sleep needs, rather than relying on generic recommendations."
    },
    {
      question: "What makes Helix, Leesa, Birch, and Brooklyn Bedding the best mattress brands?",
      answer: "These four brands represent the top tier of American-made mattresses. Helix offers personalized sleep solutions with multiple firmness options across Core, Luxe, and Elite collections. Leesa combines premium comfort with social responsibility, donating mattresses to those in need. Birch provides 100% natural and organic materials for eco-conscious sleepers, with GREENGUARD Gold certification. Brooklyn Bedding has been handcrafting quality mattresses since 1995, offering exceptional value with factory-direct pricing. All four brands are made in Arizona, USA, with premium materials and generous trial periods."
    },
    {
      question: "How do I choose the right mattress firmness for my sleep position?",
      answer: "Sleep position is crucial for determining ideal firmness. Side sleepers need softer mattresses (firmness 3-5 out of 10) to relieve pressure on shoulders and hips while maintaining spinal alignment. Back sleepers require medium firmness (5-7) for balanced support that prevents lower back sagging. Stomach sleepers need firmer mattresses (7-9) to keep hips from sinking too deep, which can strain the lower back. Your body weight also matters - lighter individuals may prefer softer options within their range, while heavier individuals benefit from firmer support."
    },
    {
      question: "What's the best mattress for hot sleepers and night sweats?",
      answer: "Hot sleepers should look for mattresses with advanced cooling technology. Gel-infused memory foam helps dissipate heat, while hybrid designs with individually wrapped coils provide better airflow than all-foam models. Look for mattresses with breathable covers made from moisture-wicking materials. The Helix Midnight Luxe and Brooklyn Bedding Aurora feature excellent cooling technology. Natural latex mattresses like Birch also sleep cooler than traditional memory foam due to their open-cell structure and breathable design."
    },
    {
      question: "How long do mattresses last and when should I replace mine?",
      answer: "Quality mattresses typically last 8-10 years with proper care, though this varies by type and usage. Memory foam and latex mattresses often last 10+ years. Replace your mattress if you notice visible sagging (over 1.5 inches), consistent back pain, poor sleep quality, or if it's over 8 years old. Using a mattress protector and rotating your mattress every 3-6 months (if recommended by manufacturer) extends its lifespan significantly."
    },
    {
      question: "What's included in mattress trial periods and return policies?",
      answer: "Premium mattress brands offer generous risk-free trials. During this period, you can test the mattress at home and return it for a full refund if unsatisfied. Most companies require a 30-day break-in period before accepting returns. Returns are typically hassle-free - the company arranges pickup and donation of the mattress. All featured brands include free shipping both ways during the trial period."
    },
    {
      question: "Do I need a box spring or special foundation for my new mattress?",
      answer: "Modern mattresses don't require traditional box springs. Most work best on a solid platform bed, slatted foundation (with slats no more than 3 inches apart), or an adjustable base. Memory foam and hybrid mattresses need proper support to prevent sagging and maintain warranty coverage. Check your specific mattress warranty requirements - many require a foundation that meets certain standards. Platform beds with solid surfaces or closely-spaced slats work perfectly for most contemporary mattresses."
    },
    {
      question: "What's the difference between memory foam, hybrid, and latex mattresses?",
      answer: "Memory foam mattresses contour closely to your body, providing excellent pressure relief and motion isolation - ideal for couples and side sleepers. They may sleep warmer unless featuring cooling technology. Hybrid mattresses combine memory foam comfort layers with individually wrapped coils, offering balanced support, superior motion isolation, enhanced breathability, and compatibility with adjustable bases. Latex mattresses (like Birch) provide responsive support, natural temperature regulation, and durability. They're eco-friendly, hypoallergenic, and sleep cooler than memory foam while offering similar pressure relief with more bounce."
    },
    {
      question: "Are mattresses really made in USA, and why does it matter?",
      answer: "Yes, Helix, Leesa, Birch, and Brooklyn Bedding mattresses are all manufactured in Arizona, USA. American manufacturing matters for several reasons: stringent quality control standards, safer materials (CertiPUR-US certified foams), fair labor practices, reduced environmental impact from shorter shipping distances, and support for American jobs. USA-made mattresses typically use higher-quality materials and undergo more rigorous testing than imported alternatives. You also benefit from better customer service and easier warranty claims with domestic manufacturers."
    },
    {
      question: "How much should I expect to spend on a quality mattress?",
      answer: "Quality mattresses for a Queen size typically range from $800-$2,500, depending on materials and construction. Budget mattresses ($300-$800) may lack durability and advanced features. Mid-range mattresses ($800-$1,500) like Brooklyn Bedding offer excellent value with quality materials. Premium mattresses ($1,500-$3,000+) like Helix Luxe or Elite collections feature advanced cooling, enhanced support, and luxury materials. Consider the cost-per-night over 8-10 years - a $1,500 mattress costs about 50 cents per night over 8 years, making it an excellent investment in your health and sleep quality."
    }
  ];

  return (
    <section className="py-16 bg-muted/30" id="faq">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions About Mattresses
            </h2>
            <p className="text-lg text-muted-foreground">
              Expert answers to your most common mattress buying questions. Get the knowledge you need to make the best decision for your sleep.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-background border rounded-lg px-6 hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="font-semibold text-lg pr-4">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 p-6 bg-primary/5 rounded-lg border-2 border-primary/20">
            <h3 className="text-xl font-bold mb-3 text-center">Still Have Questions?</h3>
            <p className="text-center text-muted-foreground">
              Use our AI-powered mattress finder above to get personalized recommendations based on your specific needs. Our intelligent system will help you find the perfect mattress from our curated selection of premium brands.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
