import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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

function getParam(params: URLSearchParams, name: string): string {
  // Borgun sends params case-insensitively; try exact then lowercase
  return params.get(name) || params.get(name.toLowerCase()) || "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const type = url.searchParams.get("type") || "";

  const SECRET_KEY = Deno.env.get("TEYA_SECRET_KEY")!;
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const APP_BASE_URL = Deno.env.get("APP_BASE_URL")!;

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Parse body (POST form-encoded from Borgun)
  let params = new URLSearchParams();
  if (req.method === "POST") {
    const body = await req.text();
    params = new URLSearchParams(body);
  }

  const orderid = getParam(params, "orderid") || url.searchParams.get("orderid") || "";

  try {
    if (type === "success-server") {
      // Server-to-server confirmation from Borgun
      const status = getParam(params, "status");
      const step = getParam(params, "step");
      const amount = getParam(params, "amount");
      const currency = getParam(params, "currency");
      const orderhash = getParam(params, "orderhash");
      const authorizationcode = getParam(params, "authorizationcode");
      const creditcardnumber = getParam(params, "creditcardnumber");

      console.log(`[success-server] orderid=${orderid} status=${status} step=${step}`);

      if (status === "Ok" && step === "Payment") {
        // Verify orderhash
        const expectedHash = await hmacSha256Hex(SECRET_KEY, `${orderid}|${amount}|${currency}`);

        if (expectedHash.toLowerCase() === orderhash.toLowerCase()) {
          const { error } = await supabase
            .from("lan_tournament_orders")
            .update({
              status: "PAID",
              paid_at: new Date().toISOString(),
              authorization_code: authorizationcode,
              masked_card: creditcardnumber,
            })
            .eq("order_id", orderid);

          if (error) console.error("Update error:", error);
          console.log(`[success-server] Order ${orderid} marked PAID`);
        } else {
          console.error(`[success-server] Hash mismatch for ${orderid}: expected=${expectedHash} got=${orderhash}`);
        }
      }

      // Respond with XML as Borgun expects
      return new Response(
        `<PaymentNotification>Accepted</PaymentNotification>`,
        {
          status: 200,
          headers: { "Content-Type": "application/xml" },
        }
      );
    }

    if (type === "success") {
      // Browser redirect after successful payment
      const redirectUrl = `${APP_BASE_URL}/lan-mot/stadfesting?orderid=${encodeURIComponent(orderid)}`;
      return new Response(null, {
        status: 302,
        headers: { Location: redirectUrl },
      });
    }

    if (type === "cancel") {
      if (orderid) {
        await supabase
          .from("lan_tournament_orders")
          .update({ status: "CANCELED" })
          .eq("order_id", orderid);
      }
      const redirectUrl = `${APP_BASE_URL}/lan-mot?status=cancelled`;
      return new Response(null, {
        status: 302,
        headers: { Location: redirectUrl },
      });
    }

    if (type === "error") {
      if (orderid) {
        await supabase
          .from("lan_tournament_orders")
          .update({ status: "ERROR" })
          .eq("order_id", orderid);
      }
      const redirectUrl = `${APP_BASE_URL}/lan-mot?status=error`;
      return new Response(null, {
        status: 302,
        headers: { Location: redirectUrl },
      });
    }

    return new Response("Unknown callback type", { status: 400 });
  } catch (err) {
    console.error("Callback error:", err);
    return new Response("Internal error", { status: 500 });
  }
});
