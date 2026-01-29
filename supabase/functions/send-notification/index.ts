import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const NOTIFICATION_EMAIL = "rafgeimur@gmail.com";

interface NotificationRequest {
  type: "training" | "tournament" | "contact";
  data: Record<string, unknown>;
}

function formatTrainingEmail(data: Record<string, unknown>): string {
  return `
    <h1>Ný æfingaskráning</h1>
    <p><strong>Nafn:</strong> ${data.fullName}</p>
    <p><strong>Aldur:</strong> ${data.age}</p>
    <p><strong>Netfang:</strong> ${data.email}</p>
    <p><strong>Símanúmer:</strong> ${data.phone}</p>
    <p><strong>Æfingahópur:</strong> ${data.group}</p>
    ${data.message ? `<p><strong>Skilaboð:</strong> ${data.message}</p>` : ""}
  `;
}

function formatTournamentEmail(data: Record<string, unknown>): string {
  return `
    <h1>Ný mótsskráning</h1>
    <p><strong>Nafn:</strong> ${data.fullName}</p>
    <p><strong>Epic nafn:</strong> ${data.epicName}</p>
    <p><strong>Netfang:</strong> ${data.email}</p>
    <p><strong>Símanúmer:</strong> ${data.phone}</p>
    <p><strong>Mót:</strong> ${data.tournament}</p>
    <p><strong>Dagsetning:</strong> ${data.tournamentDate}</p>
    <p><strong>Flokkur:</strong> ${data.category}</p>
    ${data.teammates ? `<p><strong>Liðsfélagar:</strong> ${data.teammates}</p>` : ""}
  `;
}

function formatContactEmail(data: Record<string, unknown>): string {
  return `
    <h1>Ný fyrirspurn</h1>
    <p><strong>Nafn:</strong> ${data.name}</p>
    <p><strong>Netfang:</strong> ${data.email}</p>
    <p><strong>Efni:</strong> ${data.subject}</p>
    <p><strong>Skilaboð:</strong></p>
    <p>${data.message}</p>
  `;
}

function getSubject(type: string, data: Record<string, unknown>): string {
  switch (type) {
    case "training":
      return `Ný æfingaskráning: ${data.fullName}`;
    case "tournament":
      return `Ný mótsskráning: ${data.fullName} - ${data.tournament}`;
    case "contact":
      return `Fyrirspurn: ${data.subject}`;
    default:
      return "Ný skráning";
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { type, data }: NotificationRequest = await req.json();
    console.log(`Processing ${type} notification:`, data);

    // Validate required fields
    if (!type || !data) {
      throw new Error("Missing required fields: type and data");
    }

    // Create Supabase client with service role for database insert
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Save to database
    const { error: dbError } = await supabase
      .from("registrations")
      .insert({ type, data });

    if (dbError) {
      console.error("Database insert error:", dbError);
      throw new Error(`Failed to save registration: ${dbError.message}`);
    }
    console.log("Registration saved to database");

    // Format email based on type
    let html: string;
    switch (type) {
      case "training":
        html = formatTrainingEmail(data);
        break;
      case "tournament":
        html = formatTournamentEmail(data);
        break;
      case "contact":
        html = formatContactEmail(data);
        break;
      default:
        html = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    }

    // Send email notification
    const emailResponse = await resend.emails.send({
      from: "Geimur <onboarding@resend.dev>",
      to: [NOTIFICATION_EMAIL],
      subject: getSubject(type, data),
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, id: emailResponse.data?.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-notification function:", errorMessage);
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

Deno.serve(handler);
