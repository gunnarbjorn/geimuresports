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

  // Parse POST body (form-encoded from Borgun)
  let params = new URLSearchParams();
  if (req.method === "POST") {
    const body = await req.text();
    params = new URLSearchParams(body);
  }

  const orderid = getParam(params, "orderid") || url.searchParams.get("orderid") || "";

  try {
    if (type === "success-server") {
      const status = getParam(params, "status");
      const step = getParam(params, "step");
      const amount = getParam(params, "amount");
      const currency = getParam(params, "currency");
      const orderhash = getParam(params, "orderhash");

      console.log(`[allt-undir-callback] orderid=${orderid} status=${status} step=${step}`);

      if (status.toLowerCase() === "ok" && step.toLowerCase() === "payment") {
        // Verify orderhash
        const expectedHash = await hmacSha256Hex(SECRET_KEY, `${orderid}|${amount}|${currency}`);

        if (expectedHash.toLowerCase() === orderhash.toLowerCase()) {
          // Find the registration with this orderId and mark as verified
          // We need to search registrations where data->>'orderId' matches
          const { data: registrations, error: fetchError } = await supabase
            .from("registrations")
            .select("id, data, type")
            .eq("verified", false)
            .like("type", "allt-undir-%");

          if (fetchError) {
            console.error("Fetch error:", fetchError);
          } else if (registrations) {
            const match = registrations.find(
              (r: any) => (r.data as any)?.orderId === orderid
            );

            if (match) {
              const { error: updateError } = await supabase
                .from("registrations")
                .update({ verified: true })
                .eq("id", match.id);

              if (updateError) console.error("Update error:", updateError);
              else console.log(`[allt-undir-callback] Registration ${match.id} marked verified (paid)`);

              // Send confirmation email
              try {
                const regData = match.data as any;
                const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
                if (RESEND_API_KEY && regData?.gmail) {
                  await fetch("https://api.resend.com/emails", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${RESEND_API_KEY}`,
                    },
                    body: JSON.stringify({
                      from: "Geimur Esports <no-reply@geimuresports.is>",
                      to: [regData.gmail],
                      subject: "Skráning staðfest – Allt Undir ✅",
                      html: `
                        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px;">
                          <h1 style="color:#22c55e;">Skráning staðfest! ✅</h1>
                          <p><strong>${regData.fortniteName}</strong> er skráð(ur) á <strong>Allt Undir</strong> mótið.</p>
                          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
                            <tr><td style="padding:8px;color:#888;">Dagsetning:</td><td style="padding:8px;">${regData.date}</td></tr>
                            <tr><td style="padding:8px;color:#888;">Fortnite nafn:</td><td style="padding:8px;">${regData.fortniteName}</td></tr>
                            <tr><td style="padding:8px;color:#888;">Pöntun:</td><td style="padding:8px;font-family:monospace;">${orderid}</td></tr>
                          </table>
                          <p style="color:#888;font-size:14px;">Custom matchmaking key verður deilt í Geimur Discord fyrir kl. 18:00.</p>
                          <hr style="border:none;border-top:1px solid #333;margin:20px 0;">
                          <p style="color:#666;font-size:12px;">Geimur Esports · geimuresports.is</p>
                        </div>
                      `,
                    }),
                  });
                  console.log(`[allt-undir-callback] Confirmation email sent to ${regData.gmail}`);

                  // Admin notification
                  await fetch("https://api.resend.com/emails", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${RESEND_API_KEY}`,
                    },
                    body: JSON.stringify({
                      from: "Geimur Esports <no-reply@geimuresports.is>",
                      to: ["rafgeimur@gmail.com"],
                      subject: `🎮 Allt Undir skráning: ${regData.fortniteName} (${regData.date})`,
                      html: `
                        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px;">
                          <h1 style="color:#22c55e;">Ný greidd skráning – Allt Undir</h1>
                          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
                            <tr><td style="padding:8px;color:#888;">Nafn:</td><td style="padding:8px;">${regData.fullName}</td></tr>
                            <tr><td style="padding:8px;color:#888;">Fortnite:</td><td style="padding:8px;">${regData.fortniteName}</td></tr>
                            <tr><td style="padding:8px;color:#888;">Gmail:</td><td style="padding:8px;">${regData.gmail}</td></tr>
                            <tr><td style="padding:8px;color:#888;">Dagsetning:</td><td style="padding:8px;">${regData.date}</td></tr>
                            <tr><td style="padding:8px;color:#888;">Pöntun:</td><td style="padding:8px;font-family:monospace;">${orderid}</td></tr>
                          </table>
                          <p style="color:#666;font-size:12px;">Geimur Esports · geimuresports.is</p>
                        </div>
                      `,
                    }),
                  });
                }
              } catch (emailErr) {
                console.error("Email error:", emailErr);
              }
            } else {
              console.error(`[allt-undir-callback] No matching registration for order ${orderid}`);
            }
          }
        } else {
          console.error(`[allt-undir-callback] Hash mismatch for ${orderid}`);
        }
      }

      return new Response(
        `<PaymentNotification>Accepted</PaymentNotification>`,
        { status: 200, headers: { "Content-Type": "application/xml" } }
      );
    }

    if (type === "success") {
      const base = url.searchParams.get("base") || APP_BASE_URL;
      const date = url.searchParams.get("date") || "";
      const redirectUrl = `${base}/keppa/allt-undir?status=success&date=${encodeURIComponent(date)}`;
      return new Response(null, { status: 302, headers: { Location: redirectUrl } });
    }

    if (type === "cancel") {
      const base = url.searchParams.get("base") || APP_BASE_URL;
      return new Response(null, { status: 302, headers: { Location: `${base}/keppa/allt-undir?status=cancelled` } });
    }

    if (type === "error") {
      const base = url.searchParams.get("base") || APP_BASE_URL;
      return new Response(null, { status: 302, headers: { Location: `${base}/keppa/allt-undir?status=error` } });
    }

    return new Response("Unknown callback type", { status: 400 });
  } catch (err) {
    console.error("Callback error:", err);
    return new Response("Internal error", { status: 500 });
  }
});
