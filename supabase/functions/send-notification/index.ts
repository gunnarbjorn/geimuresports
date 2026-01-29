import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const NOTIFICATION_EMAIL = "rafgeimur@gmail.com";
const FROM_EMAIL = "Geimur <no-reply@geimuresports.is>";

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

// Confirmation emails for registrants
function formatTrainingConfirmation(data: Record<string, unknown>): string {
  return `
    <h1>Takk fyrir skráninguna!</h1>
    <p>Hæ ${data.fullName},</p>
    <p>Við höfum móttekið skráningu þína í æfingar hjá Geimur Esports.</p>
    <p><strong>Æfingahópur:</strong> ${data.group}</p>
    <p>Við munum hafa samband fljótlega með frekari upplýsingar.</p>
    <br>
    <p>Kveðja,<br>Geimur Esports</p>
  `;
}

function formatTournamentConfirmation(data: Record<string, unknown>): string {
  return `
    <h1>Skráning móttekin!</h1>
    <p>Hæ ${data.fullName},</p>
    <p>Þú ert nú skráð/ur í mótið <strong>${data.tournament}</strong>.</p>
    <p><strong>Dagsetning:</strong> ${data.tournamentDate}</p>
    <p><strong>Flokkur:</strong> ${data.category}</p>
    <p><strong>Epic nafn:</strong> ${data.epicName}</p>
    ${data.teammates ? `<p><strong>Liðsfélagar:</strong> ${data.teammates}</p>` : ""}
    <p>Við munum senda þér frekari upplýsingar um mótið nær því.</p>
    <br>
    <p>Gangi þér vel!<br>Geimur Esports</p>
  `;
}

function formatContactConfirmation(data: Record<string, unknown>): string {
  return `
    <h1>Takk fyrir fyrirspurnina!</h1>
    <p>Hæ ${data.name},</p>
    <p>Við höfum móttekið fyrirspurn þína og munum svara eins fljótt og auðið er.</p>
    <p><strong>Efni:</strong> ${data.subject}</p>
    <br>
    <p>Kveðja,<br>Geimur Esports</p>
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

function getConfirmationSubject(type: string, data: Record<string, unknown>): string {
  switch (type) {
    case "training":
      return `Staðfesting: Skráning í æfingar - Geimur Esports`;
    case "tournament":
      return `Staðfesting: ${data.tournament} - Geimur Esports`;
    case "contact":
      return `Staðfesting: Fyrirspurn móttekin - Geimur Esports`;
    default:
      return "Staðfesting - Geimur Esports";
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
    let confirmationHtml: string;
    switch (type) {
      case "training":
        html = formatTrainingEmail(data);
        confirmationHtml = formatTrainingConfirmation(data);
        break;
      case "tournament":
        html = formatTournamentEmail(data);
        confirmationHtml = formatTournamentConfirmation(data);
        break;
      case "contact":
        html = formatContactEmail(data);
        confirmationHtml = formatContactConfirmation(data);
        break;
      default:
        html = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        confirmationHtml = html;
    }

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: FROM_EMAIL,
      to: [NOTIFICATION_EMAIL],
      subject: getSubject(type, data),
      html,
    });

    console.log("Admin email sent:", adminEmailResponse);

    if (adminEmailResponse?.error) {
      console.error("Admin email send error:", adminEmailResponse.error);
      throw new Error(`Failed to send admin email: ${adminEmailResponse.error.message}`);
    }

    // Send confirmation email to registrant
    const registrantEmail = data.email as string;
    let confirmationResponse = null;
    
    if (registrantEmail) {
      confirmationResponse = await resend.emails.send({
        from: FROM_EMAIL,
        to: [registrantEmail],
        subject: getConfirmationSubject(type, data),
        html: confirmationHtml,
      });
      console.log("Confirmation email sent to registrant:", confirmationResponse);

      if (confirmationResponse?.error) {
        console.error(
          "Confirmation email send error:",
          confirmationResponse.error
        );
        throw new Error(
          `Failed to send confirmation email: ${confirmationResponse.error.message}`
        );
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        adminEmailId: adminEmailResponse.data?.id,
        confirmationEmailId: confirmationResponse?.data?.id 
      }),
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
