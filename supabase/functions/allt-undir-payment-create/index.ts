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
    const body = await req.json();
    const { fullName, kennitala, fortniteName, gmail, baseUrl } = body;
    
    // Support both single date (legacy) and multiple dates
    let dates: string[] = [];
    if (body.dates && Array.isArray(body.dates)) {
      dates = body.dates;
    } else if (body.date) {
      dates = [body.date];
    }

    // Validate required fields
    if (!fullName?.trim() || !kennitala?.trim() || !fortniteName?.trim() || !gmail?.trim() || dates.length === 0) {
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
    const validDates = ["2026-03-06", "2026-03-13", "2026-03-20", "2026-03-27"];
    for (const date of dates) {
      if (!validDates.includes(date)) {
        return new Response(JSON.stringify({ error: `Ógild dagsetning: ${date}` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
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
    const amount = ENTRY_FEE_ISK * dates.length;
    const amountFormatted = amount.toFixed(2);

    // Insert a registration for each selected date, all sharing the same orderId
    for (const date of dates) {
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
          amount: ENTRY_FEE_ISK,
          allDates: dates,
        },
      });

      if (insertError) {
        console.error("Insert error:", insertError);
        return new Response(JSON.stringify({ error: "Villa við skráningu" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Build return URLs
    const fnBase = `${SUPABASE_URL}/functions/v1/allt-undir-payment-callback`;
    const baseParam = encodeURIComponent(clientBaseUrl);
    const returnurlsuccess = `${fnBase}?type=success&base=${baseParam}`;
    const returnurlsuccessserver = `${fnBase}?type=success-server`;
    const returnurlcancel = `${fnBase}?type=cancel&base=${baseParam}`;
    const returnurlerror = `${fnBase}?type=error&base=${baseParam}`;

    // Compute checkhash
    const hashMessage = `${MERCHANT_ID}|${returnurlsuccess}|${returnurlsuccessserver}|${orderId}|${amountFormatted}|ISK`;
    const checkhash = await hmacSha256Hex(SECRET_KEY, hashMessage);

    const dateLabel = dates.length === 1 
      ? dates[0] 
      : `${dates.length} dagar`;

    const paymentFields: Record<string, string> = {
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
      itemdescription_0: `ALLT UNDIR – Solo mót (${dateLabel})`,
      itemcount_0: String(dates.length),
      itemunitamount_0: ENTRY_FEE_ISK.toFixed(2),
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
