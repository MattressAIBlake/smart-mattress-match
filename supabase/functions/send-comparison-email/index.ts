import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
const SITE_URL = 'https://hfdyxsxlwfogtwgjahkg.lovable.app';
const FROM_EMAIL = Deno.env.get('SENDGRID_FROM_EMAIL') || 'noreply@mattresswizard.com';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple in-memory rate limiting (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5; // Max emails per window
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour window

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return true;
  }
  
  record.count++;
  return false;
}

interface EmailRequest {
  recipientEmail: string;
  senderName: string;
  personalNote?: string;
  comparisonId: string;
  products: Array<{
    title: string;
    price: number;
    originalPrice?: number;
    matchPercentage: number;
    image: string;
  }>;
  profileSummary?: string;
  includePricing: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('cf-connecting-ip') || 
                     'unknown';
    
    // Check rate limit
    if (isRateLimited(clientIP)) {
      console.log('Rate limit exceeded for IP:', clientIP);
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 429,
        }
      );
    }

    const {
      recipientEmail,
      senderName,
      personalNote,
      comparisonId,
      products,
      profileSummary,
      includePricing,
    }: EmailRequest = await req.json();

    // Validate required fields
    if (!recipientEmail || !senderName || !comparisonId || !products || products.length < 2) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Validate comparisonId exists in database before sending email
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: comparison, error: dbError } = await supabase
      .rpc('get_comparison_by_id', { comparison_uuid: comparisonId });

    if (dbError || !comparison || comparison.length === 0) {
      console.log('Invalid comparison ID:', comparisonId);
      return new Response(
        JSON.stringify({ error: 'Invalid comparison ID' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    const comparisonUrl = `${SITE_URL}/compare/${comparisonId}`;
    const topProduct = products[0];
    const secondProduct = products[1];

    // Build HTML email
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mattress Recommendations from ${senderName}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { padding: 30px 20px; }
    .personal-note { background: #f8f9fa; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 4px; font-style: italic; }
    .product-card { border: 1px solid #e1e4e8; border-radius: 8px; padding: 20px; margin: 15px 0; background: #fafbfc; }
    .product-header { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; }
    .product-image { width: 80px; height: 80px; object-fit: cover; border-radius: 8px; }
    .badge { display: inline-block; background: #667eea; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; }
    .badge.top { background: #ffd700; color: #333; }
    .price { font-size: 24px; font-weight: bold; color: #667eea; margin: 10px 0; }
    .original-price { text-decoration: line-through; color: #666; font-size: 16px; margin-left: 8px; }
    .cta-button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; text-align: center; }
    .cta-button:hover { background: #5568d3; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
    .profile-summary { background: #e8f4f8; padding: 15px; border-radius: 6px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🛏️ ${senderName} shared mattress recommendations with you!</h1>
    </div>
    
    <div class="content">
      ${personalNote ? `
        <div class="personal-note">
          "${personalNote}"
        </div>
      ` : ''}
      
      ${profileSummary ? `
        <div class="profile-summary">
          <strong>Based on these preferences:</strong><br>
          ${profileSummary}
        </div>
      ` : ''}
      
      <h2 style="margin-top: 30px;">Your Partner's Top Matches</h2>
      
      <div class="product-card">
        <div class="product-header">
          <img src="${topProduct.image}" alt="${topProduct.title}" class="product-image">
          <div>
            <span class="badge top">🥇 Top Match</span>
            <h3 style="margin: 8px 0;">${topProduct.title}</h3>
            <span class="badge">${topProduct.matchPercentage}% Match</span>
          </div>
        </div>
        ${includePricing ? `
          <div class="price">
            $${topProduct.price.toLocaleString()}
            ${topProduct.originalPrice ? `<span class="original-price">$${topProduct.originalPrice.toLocaleString()}</span>` : ''}
          </div>
          ${topProduct.originalPrice ? `<p style="color: #28a745; font-weight: bold;">💰 Save $${(topProduct.originalPrice - topProduct.price).toLocaleString()}!</p>` : ''}
        ` : ''}
      </div>
      
      <div class="product-card">
        <div class="product-header">
          <img src="${secondProduct.image}" alt="${secondProduct.title}" class="product-image">
          <div>
            <span class="badge">🥈 Runner Up</span>
            <h3 style="margin: 8px 0;">${secondProduct.title}</h3>
            <span class="badge">${secondProduct.matchPercentage}% Match</span>
          </div>
        </div>
        ${includePricing ? `
          <div class="price">
            $${secondProduct.price.toLocaleString()}
            ${secondProduct.originalPrice ? `<span class="original-price">$${secondProduct.originalPrice.toLocaleString()}</span>` : ''}
          </div>
        ` : ''}
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${comparisonUrl}" class="cta-button">
          View Full Comparison & Details
        </a>
      </div>
      
        <p style="color: #666; font-size: 14px; text-align: center;">
          💡 AI Shopper Discount: Save 20% on All Premium Mattresses
        </p>
    </div>
    
    <div class="footer">
      <p>This comparison was created by ${senderName} using our mattress recommendation tool.</p>
      <p style="margin-top: 10px;">
        <a href="${comparisonUrl}" style="color: #667eea;">View Comparison</a>
      </p>
    </div>
  </div>
</body>
</html>
    `.trim();

    // Send via SendGrid
    const sendGridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: recipientEmail }],
            subject: `🛏️ ${senderName} shared mattress recommendations with you!`,
          },
        ],
        from: {
          email: FROM_EMAIL,
          name: 'Mattress Wizard',
        },
        content: [
          {
            type: 'text/html',
            value: htmlContent,
          },
        ],
      }),
    });

    if (!sendGridResponse.ok) {
      const error = await sendGridResponse.text();
      console.error('SendGrid error:', error);
      throw new Error('Failed to send email');
    }

    console.log('Email sent successfully');

    return new Response(
      JSON.stringify({ success: true, comparisonUrl }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in send-comparison-email:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send email' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
