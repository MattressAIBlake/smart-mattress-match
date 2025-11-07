import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.79.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateDiscountRequest {
  code: string;
  name: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, name }: CreateDiscountRequest = await req.json();

    if (!code || !name) {
      return new Response(
        JSON.stringify({ error: 'Code and name are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Creating referral discount code: ${code} for ${name}`);

    // Create a price rule for 10% off
    const priceRuleResponse = await fetch(
      `https://${Deno.env.get('SHOPIFY_SHOP_PERMANENT_DOMAIN')}/admin/api/2025-01/price_rules.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': Deno.env.get('SHOPIFY_ACCESS_TOKEN') || '',
        },
        body: JSON.stringify({
          price_rule: {
            title: `Referral Discount - ${name}`,
            target_type: 'line_item',
            target_selection: 'all',
            allocation_method: 'across',
            value_type: 'percentage',
            value: '-10.0',
            customer_selection: 'all',
            once_per_customer: false,
            usage_limit: null,
            starts_at: new Date().toISOString(),
          }
        })
      }
    );

    if (!priceRuleResponse.ok) {
      const errorText = await priceRuleResponse.text();
      console.error('Failed to create price rule:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to create price rule', details: errorText }),
        { status: priceRuleResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const priceRuleData = await priceRuleResponse.json();
    const priceRuleId = priceRuleData.price_rule.id;

    console.log(`Price rule created with ID: ${priceRuleId}`);

    // Create the discount code
    const discountCodeResponse = await fetch(
      `https://${Deno.env.get('SHOPIFY_SHOP_PERMANENT_DOMAIN')}/admin/api/2025-01/price_rules/${priceRuleId}/discount_codes.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': Deno.env.get('SHOPIFY_ACCESS_TOKEN') || '',
        },
        body: JSON.stringify({
          discount_code: {
            code: code,
          }
        })
      }
    );

    if (!discountCodeResponse.ok) {
      const errorText = await discountCodeResponse.text();
      console.error('Failed to create discount code:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to create discount code', details: errorText }),
        { status: discountCodeResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const discountCodeData = await discountCodeResponse.json();
    console.log(`Discount code created: ${discountCodeData.discount_code.code}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        code: discountCodeData.discount_code.code,
        priceRuleId: priceRuleId
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in create-referral-discount:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
