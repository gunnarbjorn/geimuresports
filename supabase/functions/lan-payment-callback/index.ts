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

      // Case-insensitive comparison for status and step
      if (status.toLowerCase() === "ok" && step.toLowerCase() === "payment") {
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
          else console.log(`[success-server] Order ${orderid} marked PAID`);

          // Send confirmation email
          try {
            const { data: orderData } = await supabase
              .from("lan_tournament_orders")
              .select("team_name, player1, player2, email, amount")
              .eq("order_id", orderid)
              .single();

              if (orderData?.email) {
                const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
                if (RESEND_API_KEY) {
                  // Send confirmation to registrant
                  await fetch("https://api.resend.com/emails", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${RESEND_API_KEY}`,
                    },
                    body: JSON.stringify({
                      from: "Geimur Esports <no-reply@geimuresports.is>",
                      to: [orderData.email],
                      subject: "Skráning staðfest – Fortnite Duos LAN ✅",
                      html: `
                        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px;">
                          <h1 style="color:#22c55e;">Skráning staðfest! ✅</h1>
                          <p>Liðið <strong>${orderData.team_name}</strong> er skráð á <strong>Fortnite Duos LAN</strong> mótið.</p>
                          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
                            <tr><td style="padding:8px;color:#888;">Leikmaður 1:</td><td style="padding:8px;">${orderData.player1}</td></tr>
                            <tr><td style="padding:8px;color:#888;">Leikmaður 2:</td><td style="padding:8px;">${orderData.player2}</td></tr>
                            <tr><td style="padding:8px;color:#888;">Pöntun:</td><td style="padding:8px;font-family:monospace;">${orderid}</td></tr>
                            <tr><td style="padding:8px;color:#888;">Upphæð:</td><td style="padding:8px;">${orderData.amount.toLocaleString("is-IS")} kr</td></tr>
                          </table>
                          <p style="color:#888;font-size:14px;">Sjáumst á mótinu! 🎮</p>
                          <hr style="border:none;border-top:1px solid #333;margin:20px 0;">
                          <p style="color:#666;font-size:12px;">Geimur Esports · geimuresports.is</p>
                        </div>
                      `,
                    }),
                  });
                  console.log(`[success-server] Confirmation email sent to ${orderData.email}`);

                  // Send admin notification to club email
                  await fetch("https://api.resend.com/emails", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${RESEND_API_KEY}`,
                    },
                    body: JSON.stringify({
                      from: "Geimur Esports <no-reply@geimuresports.is>",
                      to: ["rafgeimur@gmail.com"],
                      subject: `🎮 Ný DUO LAN skráning: ${orderData.team_name}`,
                      html: `
                        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px;">
                          <h1 style="color:#22c55e;">Ný greidd skráning!</h1>
                          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
                            <tr><td style="padding:8px;color:#888;">Lið:</td><td style="padding:8px;"><strong>${orderData.team_name}</strong></td></tr>
                            <tr><td style="padding:8px;color:#888;">Leikmaður 1:</td><td style="padding:8px;">${orderData.player1}</td></tr>
                            <tr><td style="padding:8px;color:#888;">Leikmaður 2:</td><td style="padding:8px;">${orderData.player2}</td></tr>
                            <tr><td style="padding:8px;color:#888;">Netfang:</td><td style="padding:8px;">${orderData.email}</td></tr>
                            <tr><td style="padding:8px;color:#888;">Pöntun:</td><td style="padding:8px;font-family:monospace;">${orderid}</td></tr>
                            <tr><td style="padding:8px;color:#888;">Upphæð:</td><td style="padding:8px;">${orderData.amount.toLocaleString("is-IS")} kr</td></tr>
                          </table>
                          <p style="color:#666;font-size:12px;">Geimur Esports · geimuresports.is</p>
                        </div>
                      `,
                    }),
                  });
                  console.log(`[success-server] Admin notification sent to rafgeimur@gmail.com`);
                }
              }
          } catch (emailErr) {
            console.error("Email send error:", emailErr);
          }
        } else {
          console.error(`[success-server] Hash mismatch for ${orderid}: expected=${expectedHash} got=${orderhash}`);
        }
      }

      return new Response(
        `<PaymentNotification>Accepted</PaymentNotification>`,
        { status: 200, headers: { "Content-Type": "application/xml" } }
      );
    }

    if (type === "success") {
      const base = url.searchParams.get("base") || APP_BASE_URL;
      const redirectUrl = `${base}/lan-mot/stadfesting?orderid=${encodeURIComponent(orderid)}`;
      return new Response(null, { status: 302, headers: { Location: redirectUrl } });
    }

    if (type === "cancel") {
      if (orderid) {
        await supabase.from("lan_tournament_orders").update({ status: "CANCELED" }).eq("order_id", orderid);
      }
      const base = url.searchParams.get("base") || APP_BASE_URL;
      return new Response(null, { status: 302, headers: { Location: `${base}/keppa/arena-lan?status=cancelled` } });
    }

    if (type === "error") {
      if (orderid) {
        await supabase.from("lan_tournament_orders").update({ status: "ERROR" }).eq("order_id", orderid);
      }
      const base = url.searchParams.get("base") || APP_BASE_URL;
      return new Response(null, { status: 302, headers: { Location: `${base}/keppa/arena-lan?status=error` } });
    }

    return new Response("Unknown callback type", { status: 400 });
  } catch (err) {
    console.error("Callback error:", err);
    return new Response("Internal error", { status: 500 });
  }
});
