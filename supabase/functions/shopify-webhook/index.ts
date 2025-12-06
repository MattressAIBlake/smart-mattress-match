import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-shopify-hmac-sha256, x-shopify-topic, x-shopify-shop-domain',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Shopify webhook received');

    // Verify webhook authenticity
    const hmacHeader = req.headers.get('x-shopify-hmac-sha256');
    const topic = req.headers.get('x-shopify-topic');
    const shopDomain = req.headers.get('x-shopify-shop-domain');

    console.log('Webhook topic:', topic);
    console.log('Shop domain:', shopDomain);

    if (!hmacHeader) {
      console.error('Missing HMAC header');
      return new Response(JSON.stringify({ error: 'Missing HMAC signature' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get webhook secret from environment
    const webhookSecret = Deno.env.get('SHOPIFY_WEBHOOK_SECRET');
    if (!webhookSecret) {
      console.error('SHOPIFY_WEBHOOK_SECRET not configured');
      return new Response(JSON.stringify({ error: 'Webhook secret not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Read and verify the request body
    const body = await req.text();
    const encoder = new TextEncoder();
    const data = encoder.encode(body);
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(webhookSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, data);
    const base64Signature = btoa(String.fromCharCode(...new Uint8Array(signature)));

    if (base64Signature !== hmacHeader) {
      console.error('Invalid HMAC signature');
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Webhook signature verified');

    // Parse the order data
    const order = JSON.parse(body);
    console.log('Processing order received');

    // Only process paid orders
    if (topic !== 'orders/paid' && order.financial_status !== 'paid') {
      console.log('Order not paid yet, skipping');
      return new Response(JSON.stringify({ message: 'Order not paid, skipping' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extract referral code from custom attributes or note attributes
    let referralCode: string | null = null;
    
    if (order.note_attributes && Array.isArray(order.note_attributes)) {
      const referralAttr = order.note_attributes.find(
        (attr: any) => attr.name === 'referral_code'
      );
      if (referralAttr) {
        referralCode = referralAttr.value;
      }
    }

    // Also check custom attributes on line items (cart attributes)
    if (!referralCode && order.line_items && Array.isArray(order.line_items)) {
      for (const lineItem of order.line_items) {
        if (lineItem.properties && Array.isArray(lineItem.properties)) {
          const referralProp = lineItem.properties.find(
            (prop: any) => prop.name === 'referral_code'
          );
          if (referralProp) {
            referralCode = referralProp.value;
            break;
          }
        }
      }
    }

    console.log('Referral code:', referralCode ? 'found' : 'not found');

    // If no referral code, nothing to process
    if (!referralCode) {
      console.log('No referral code in order, skipping');
      return new Response(JSON.stringify({ message: 'No referral code found' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Process the referral
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Processing referral...');

    // Call the process-referral function
    const { data: processData, error: processError } = await supabase.functions.invoke(
      'process-referral',
      {
        body: {
          orderId: order.name || order.id.toString(),
          referralCode: referralCode,
          customerEmail: order.email,
        },
      }
    );

    if (processError) {
      console.error('Error processing referral:', processError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to process referral',
          details: processError 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Referral processed successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Referral processed',
        data: processData 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
