import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LAN_ENTRY_FEE_ISK = 8880; // per team (2 players)

function generateOrderId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "LAN";
  for (let i = 0; i < 9; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function hmacSha256Hex(key: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { teamName, player1, player2, email } = await req.json();

    // Validate
    if (!teamName?.trim() || !player1?.trim() || !player2?.trim() || !email?.trim()) {
      return new Response(JSON.stringify({ error: "Ógild gögn — öll svæði eru nauðsynleg" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return new Response(JSON.stringify({ error: "Ógilt netfang" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const MERCHANT_ID = Deno.env.get("TEYA_MERCHANT_ID")!;
    const GATEWAY_ID = Deno.env.get("TEYA_PAYMENT_GATEWAY_ID")!;
    const SECRET_KEY = Deno.env.get("TEYA_SECRET_KEY")!;
    const PAYMENT_URL = Deno.env.get("TEYA_PAYMENT_URL")!;
    const BASE_URL = Deno.env.get("APP_BASE_URL")!;
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Generate unique order ID (max 12 chars)
    let orderId = generateOrderId();
    let attempts = 0;
    while (attempts < 10) {
      const { data: existing } = await supabase
        .from("lan_tournament_orders")
        .select("id")
        .eq("order_id", orderId)
        .maybeSingle();
      if (!existing) break;
      orderId = generateOrderId();
      attempts++;
    }

    const amount = LAN_ENTRY_FEE_ISK;
    const amountFormatted = amount.toFixed(2); // "8880.00"

    // Insert order
    const { error: insertError } = await supabase.from("lan_tournament_orders").insert({
      order_id: orderId,
      team_name: teamName.trim(),
      player1: player1.trim(),
      player2: player2.trim(),
      email: email.trim(),
      amount,
      currency: "ISK",
      status: "PENDING_PAYMENT",
    });

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(JSON.stringify({ error: "Villa við skráningu" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build return URLs
    const fnBase = `${SUPABASE_URL}/functions/v1/lan-payment-callback`;
    const returnurlsuccess = `${fnBase}?type=success`;
    const returnurlsuccessserver = `${fnBase}?type=success-server`;
    const returnurlcancel = `${fnBase}?type=cancel`;
    const returnurlerror = `${fnBase}?type=error`;

    // Compute checkhash: HMAC SHA256 of "merchantid|returnurlsuccess|returnurlsuccessserver|orderid|amount|currency"
    const hashMessage = `${MERCHANT_ID}|${returnurlsuccess}|${returnurlsuccessserver}|${orderId}|${amountFormatted}|ISK`;
    const checkhash = await hmacSha256Hex(SECRET_KEY, hashMessage);

    const paymentFields = {
      merchantid: MERCHANT_ID,
      paymentgatewayid: GATEWAY_ID,
      checkhash,
      orderid: orderId,
      amount: amountFormatted,
      currency: "ISK",
      language: "IS",
      buyeremail: email.trim(),
      returnurlsuccess,
      returnurlsuccessserver,
      returnurlcancel,
      returnurlerror,
      itemdescription_0: "LAN mót - mótsgjald",
      itemcount_0: "1",
      itemunitamount_0: amountFormatted,
      itemamount_0: amountFormatted,
      skipreceiptpage: "1",
      pagetype: "0",
    };

    return new Response(
      JSON.stringify({ paymentUrl: PAYMENT_URL, fields: paymentFields }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: "Villa á þjóni" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
