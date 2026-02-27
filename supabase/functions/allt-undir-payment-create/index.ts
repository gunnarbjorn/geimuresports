import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ENTRY_FEE_ISK = 3057;

function generateOrderId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "ALU";
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
    const { fullName, kennitala, fortniteName, gmail, date, baseUrl } = await req.json();

    // Validate required fields
    if (!fullName?.trim() || !kennitala?.trim() || !fortniteName?.trim() || !gmail?.trim() || !date?.trim()) {
      return new Response(JSON.stringify({ error: "Ógild gögn — öll svæði eru nauðsynleg" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate kennitala (10 digits)
    const kt = kennitala.replace(/[\s-]/g, "");
    if (kt.length !== 10 || !/^\d{10}$/.test(kt)) {
      return new Response(JSON.stringify({ error: "Kennitala verður að vera 10 tölustafir" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(gmail.trim())) {
      return new Response(JSON.stringify({ error: "Ógilt netfang" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate date format
    const validDates = ["2026-03-05", "2026-03-12", "2026-03-19", "2026-03-26"];
    if (!validDates.includes(date)) {
      return new Response(JSON.stringify({ error: "Ógild dagsetning" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const MERCHANT_ID = Deno.env.get("TEYA_MERCHANT_ID")!;
    const GATEWAY_ID = Deno.env.get("TEYA_PAYMENT_GATEWAY_ID")!;
    const SECRET_KEY = Deno.env.get("TEYA_SECRET_KEY")!;
    const PAYMENT_URL = Deno.env.get("TEYA_PAYMENT_URL")!;
    const FALLBACK_BASE_URL = Deno.env.get("APP_BASE_URL")!;
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Determine client base URL for redirects
    let clientBaseUrl = FALLBACK_BASE_URL;
    try {
      if (typeof baseUrl === "string" && baseUrl) clientBaseUrl = new URL(baseUrl).origin;
    } catch {
      clientBaseUrl = FALLBACK_BASE_URL;
    }

    const orderId = generateOrderId();
    const amount = ENTRY_FEE_ISK;
    const amountFormatted = amount.toFixed(2);

    // Insert registration with verified=false (pending payment)
    const { error: insertError } = await supabase.from("registrations").insert({
      type: `allt-undir-${date}`,
      verified: false,
      data: {
        fullName: fullName.trim(),
        kennitala: kt,
        fortniteName: fortniteName.trim(),
        gmail: gmail.trim(),
        date,
        orderId,
        amount,
      },
    });

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(JSON.stringify({ error: "Villa við skráningu" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build return URLs
    const fnBase = `${SUPABASE_URL}/functions/v1/allt-undir-payment-callback`;
    const baseParam = encodeURIComponent(clientBaseUrl);
    const dateParam = encodeURIComponent(date);
    const returnurlsuccess = `${fnBase}?type=success&base=${baseParam}&date=${dateParam}`;
    const returnurlsuccessserver = `${fnBase}?type=success-server`;
    const returnurlcancel = `${fnBase}?type=cancel&base=${baseParam}&date=${dateParam}`;
    const returnurlerror = `${fnBase}?type=error&base=${baseParam}&date=${dateParam}`;

    // Compute checkhash
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
      buyeremail: gmail.trim(),
      returnurlsuccess,
      returnurlsuccessserver,
      returnurlcancel,
      returnurlerror,
      itemdescription_0: "Allt Undir – Solo mót",
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
