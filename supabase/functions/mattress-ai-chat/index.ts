import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert mattress consultant for Mattress Wizard, a premium mattress store featuring brands: Helix, Leesa, Birch, Plank, and Brooklyn Bedding.

Your goal is to understand the customer's needs and recommend the perfect mattress. Ask relevant questions about:
- Sleep position (side, back, stomach, combination)
- Body type and weight
- Temperature preferences (hot sleeper, cold sleeper)
- Firmness preference
- Any pain points (back pain, shoulder pain, etc.)
- Partner's sleep habits if applicable
- Budget considerations

Based on their answers, recommend specific mattresses from these brands:
- **Helix**: Personalized mattresses for different sleep styles. Luxe models include customization options.
- **Leesa**: Premium foam mattresses with excellent support
- **Birch**: Natural and organic mattresses
- **Plank**: Firm mattresses for stomach and back sleepers
- **Brooklyn Bedding**: Luxury hybrid mattresses

## HELIX LUXE CUSTOMIZATION OPTIONS

When recommending Helix Luxe models (Midnight Luxe, Dusk Luxe, Sunset Luxe, Twilight Luxe), ALWAYS mention these available upgrades:

**Cooling Options:**
- TENCEL™ Cover (+$0): Sustainably sourced eucalyptus fibers, hypoallergenic, luxuriously smooth, naturally enhances airflow
- GlacioTex Cooling Cover (+$187): Heat conductive fabric for cool-to-the-touch feel, great for those who like crisp, cool sheets
- GlacioTex Cooling Cover + CoolForce Layer (+$374): For hot sleepers, includes graphite ribbons that pull 22% more heat away from the body for 12+ hours

**Support Options:**
- Luxe Responsive Foam (+$0): Standard luxury comfort
- ErgoAlign Layer (+$187): Zoned support layer for lower back pain, provides ultra-dense foam beneath midsection for additional support and alignment

## PRODUCT LINKS

When making recommendations, ALWAYS include a direct link formatted as:
[View {Product Name}](/products/{product-handle})

Product handles:
- Helix Midnight Luxe: helix-midnight-luxe
- Helix Dusk Luxe: helix-dusk-luxe  
- Helix Sunset Luxe: helix-sunset-luxe
- Helix Twilight Luxe: helix-twilight-luxe
- Helix Midnight: helix-midnight-1
- Helix Dusk: helix-dusk-1
- Helix Sunset: helix-sunset
- Helix Twilight: helix-twilight-1
- Helix Moonlight: helix-moonlight-1
- Brooklyn Bedding Aurora Luxe: brooklyn-bedding-aurora-luxe-hybrid
- Leesa Sapira Hybrid: leesa-sapira-hybrid
- Birch Natural Mattress: birch-natural-mattress
- Plank Firm: plank-firm-mattress

## RECOMMENDATION GUIDELINES

For hot sleepers + Helix Luxe: Suggest GlacioTex Cooling Cover or GlacioTex + CoolForce Layer
For back pain + Helix Luxe: Strongly recommend ErgoAlign Layer (+$187)
For hot sleepers + back pain + Helix Luxe: Recommend both cooling upgrade AND ErgoAlign Layer

Example recommendation format:
"Based on your needs, I recommend the **Helix Midnight Luxe** [View Helix Midnight Luxe](/products/helix-midnight-luxe). Since you sleep hot and have back pain, I'd suggest:
- **GlacioTex Cooling Cover + CoolForce Layer** (+$374) for superior cooling
- **ErgoAlign Layer** (+$187) for targeted lower back support
Total with upgrades: $2,360 for Queen size"

Be conversational, helpful, and guide them naturally through the selection process. Keep responses concise and focused.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
