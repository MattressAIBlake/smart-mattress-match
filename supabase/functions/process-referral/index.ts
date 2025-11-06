import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { orderId, referralCode, customerEmail } = await req.json();

    console.log("Processing referral for order:", orderId, "with code:", referralCode);

    // Verify referral code exists
    const { data: referrer, error: referrerError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("referral_code", referralCode)
      .single();

    if (referrerError || !referrer) {
      console.error("Referrer not found:", referrerError);
      return new Response(
        JSON.stringify({ error: "Invalid referral code" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if customer already used this referral code
    const { data: existingTx } = await supabase
      .from("referral_transactions")
      .select("*")
      .eq("referee_email", customerEmail)
      .eq("referrer_code", referralCode)
      .single();

    if (existingTx) {
      return new Response(
        JSON.stringify({ message: "Referral already processed" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create referral transaction
    const { error: txError } = await supabase
      .from("referral_transactions")
      .insert({
        referrer_code: referralCode,
        referee_email: customerEmail,
        reward_amount: 100,
        status: "completed",
        order_id: orderId,
        completed_at: new Date().toISOString(),
      });

    if (txError) {
      console.error("Failed to create transaction:", txError);
      throw txError;
    }

    // Update referrer's balance and count
    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({
        reward_balance: referrer.reward_balance + 100,
        total_referrals: referrer.total_referrals + 1,
      })
      .eq("id", referrer.id);

    if (updateError) {
      console.error("Failed to update referrer:", updateError);
      throw updateError;
    }

    // Generate redemption code for referee
    const redemptionCode = `REWARD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 365); // Valid for 1 year

    const { error: redemptionError } = await supabase
      .from("reward_redemptions")
      .insert({
        user_email: customerEmail,
        amount: 100,
        redemption_code: redemptionCode,
        status: "active",
        expires_at: expiresAt.toISOString(),
      });

    if (redemptionError) {
      console.error("Failed to create redemption:", redemptionError);
    }

    console.log("Referral processed successfully");

    return new Response(
      JSON.stringify({
        success: true,
        referrerReward: 100,
        refereeCode: redemptionCode,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing referral:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
