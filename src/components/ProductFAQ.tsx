import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

export const ProductFAQ = () => {
  return (
    <section className="w-full border-t pt-12 mt-12">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">Frequently Asked Questions</h3>
        <p className="text-muted-foreground">Everything you need to know about your new mattress</p>
      </div>
      
      <Card className="p-8 max-w-4xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="trial">
            <AccordionTrigger className="text-left">How long is the sleep trial?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Most of our mattresses come with a 100-365 night sleep trial (varies by brand). We recommend sleeping on your new mattress for at least 30 nights to allow your body to adjust. If you're not completely satisfied after the trial period, we'll arrange a free pickup and provide a full refund.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="shipping">
            <AccordionTrigger className="text-left">How is the mattress shipped?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Your mattress will arrive compressed and rolled in a box for easy delivery. We offer free ground shipping to all 50 states. Most orders ship within 1-3 business days and arrive within 5-7 business days. Once delivered, simply unbox, unroll, and allow 24-48 hours for the mattress to fully expand.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="firmness">
            <AccordionTrigger className="text-left">How do I know which firmness is right for me?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Firmness preference depends on your sleep position and body type. Side sleepers typically prefer softer mattresses (4-6/10), back sleepers prefer medium-firm (5-7/10), and stomach sleepers prefer firmer options (6-8/10). Our AI chat can help you find the perfect firmness based on your specific needs.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cooling">
            <AccordionTrigger className="text-left">Will this mattress sleep cool?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Most of our mattresses feature advanced cooling technologies including gel-infused foam, breathable covers, and airflow channels. If you're a hot sleeper, look for models with "Cooling" in the name or ask our AI assistant for recommendations specifically designed for temperature regulation.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="partner">
            <AccordionTrigger className="text-left">Is this good for couples?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Yes! Our mattresses feature excellent motion isolation, meaning you won't feel your partner's movements during the night. Many models also have reinforced edge support for maximum usable sleep surface. For couples with different firmness preferences, consider our models with dual-sided firmness options.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="warranty">
            <AccordionTrigger className="text-left">What does the warranty cover?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              All mattresses come with a 10-year limited warranty that covers manufacturing defects, including sagging beyond a certain depth (typically 1-1.5 inches), broken coils, and zipper defects. Normal wear and tear, stains, and damage from improper use are not covered. Be sure to use a proper foundation and mattress protector to maintain your warranty.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="foundation">
            <AccordionTrigger className="text-left">Do I need a box spring or special foundation?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              These mattresses work best on a solid platform bed, slatted frame (with slats no more than 3 inches apart), adjustable base, or traditional box spring. Proper support is essential for maintaining your warranty and ensuring the mattress performs as designed. We also offer compatible bases if needed.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="odor">
            <AccordionTrigger className="text-left">Will there be a smell when I open the mattress?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Some mattresses may have a slight "new mattress" smell when first unboxed due to the compression and packaging. This is completely normal and harmless. The odor typically dissipates within a few hours to a few days. We recommend unboxing in a well-ventilated room and allowing the mattress to air out before adding bedding.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </section>
  );
};
