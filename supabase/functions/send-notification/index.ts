import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.25.76";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const NOTIFICATION_EMAIL = "rafgeimur@gmail.com";
const FROM_EMAIL = "Geimur <no-reply@geimuresports.is>";

// Server-side validation schemas
const trainingSchema = z.object({
  fullName: z.string().trim().min(2, "Nafn verður að vera að minnsta kosti 2 stafir").max(100),
  age: z.number().min(6).max(99),
  email: z.string().trim().email("Ógilt netfang").max(255),
  phone: z.string().trim().min(7).max(20),
  group: z.string().trim().min(1).max(120),
  message: z.string().trim().max(500).optional().default(""),
});

const tournamentSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  epicName: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(20),
  tournament: z.string().trim().min(1).max(120),
  tournamentDate: z.string().trim().min(1).max(120),
  category: z.string().trim().min(1).max(120),
  teammates: z.string().trim().max(500).optional().default(""),
});

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().min(3).max(200),
  message: z.string().trim().min(10).max(500),
});

type TrainingData = z.infer<typeof trainingSchema>;
type TournamentData = z.infer<typeof tournamentSchema>;
type ContactData = z.infer<typeof contactSchema>;

// HTML escape function to prevent XSS in email templates
function escapeHtml(str: unknown): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return String(str ?? '').replace(/[&<>"']/g, (m) => map[m]);
}

interface NotificationRequest {
  type: "training" | "tournament" | "contact";
  data: Record<string, unknown>;
}

function formatTrainingEmail(data: TrainingData): string {
  return `
    <h1>Ný æfingaskráning</h1>
    <p><strong>Nafn:</strong> ${escapeHtml(data.fullName)}</p>
    <p><strong>Aldur:</strong> ${escapeHtml(data.age)}</p>
    <p><strong>Netfang:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Símanúmer:</strong> ${escapeHtml(data.phone)}</p>
    <p><strong>Æfingahópur:</strong> ${escapeHtml(data.group)}</p>
    ${data.message ? `<p><strong>Skilaboð:</strong> ${escapeHtml(data.message)}</p>` : ""}
  `;
}

function formatTournamentEmail(data: TournamentData): string {
  return `
    <h1>Ný mótsskráning</h1>
    <p><strong>Nafn:</strong> ${escapeHtml(data.fullName)}</p>
    <p><strong>Epic nafn:</strong> ${escapeHtml(data.epicName)}</p>
    <p><strong>Netfang:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Símanúmer:</strong> ${escapeHtml(data.phone)}</p>
    <p><strong>Mót:</strong> ${escapeHtml(data.tournament)}</p>
    <p><strong>Dagsetning:</strong> ${escapeHtml(data.tournamentDate)}</p>
    <p><strong>Flokkur:</strong> ${escapeHtml(data.category)}</p>
    ${data.teammates ? `<p><strong>Liðsfélagar:</strong> ${escapeHtml(data.teammates)}</p>` : ""}
  `;
}

function formatContactEmail(data: ContactData): string {
  return `
    <h1>Ný fyrirspurn</h1>
    <p><strong>Nafn:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Netfang:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Efni:</strong> ${escapeHtml(data.subject)}</p>
    <p><strong>Skilaboð:</strong></p>
    <p>${escapeHtml(data.message)}</p>
  `;
}

// Confirmation emails for registrants
function formatTrainingConfirmation(data: TrainingData): string {
  return `
    <h1>Takk fyrir skráninguna!</h1>
    <p>Hæ ${escapeHtml(data.fullName)},</p>
    <p>Við höfum móttekið skráningu þína í æfingar hjá Geimur Esports.</p>
    <p><strong>Æfingahópur:</strong> ${escapeHtml(data.group)}</p>
    <p>Við munum hafa samband fljótlega með frekari upplýsingar.</p>
    <br>
    <p>Kveðja,<br>Geimur Esports</p>
  `;
}

function formatTournamentConfirmation(data: TournamentData): string {
  return `
    <h1>Skráning móttekin!</h1>
    <p>Hæ ${escapeHtml(data.fullName)},</p>
    <p>Þú ert nú skráð/ur í mótið <strong>${escapeHtml(data.tournament)}</strong>.</p>
    <p><strong>Dagsetning:</strong> ${escapeHtml(data.tournamentDate)}</p>
    <p><strong>Flokkur:</strong> ${escapeHtml(data.category)}</p>
    <p><strong>Epic nafn:</strong> ${escapeHtml(data.epicName)}</p>
    ${data.teammates ? `<p><strong>Liðsfélagar:</strong> ${escapeHtml(data.teammates)}</p>` : ""}
    <p>Við munum senda þér frekari upplýsingar um mótið nær því.</p>
    <br>
    <p>Gangi þér vel!<br>Geimur Esports</p>
  `;
}

function formatContactConfirmation(data: ContactData): string {
  return `
    <h1>Takk fyrir fyrirspurnina!</h1>
    <p>Hæ ${escapeHtml(data.name)},</p>
    <p>Við höfum móttekið fyrirspurn þína og munum svara eins fljótt og auðið er.</p>
    <p><strong>Efni:</strong> ${escapeHtml(data.subject)}</p>
    <br>
    <p>Kveðja,<br>Geimur Esports</p>
  `;
}

function getSubject(type: string, data: TrainingData | TournamentData | ContactData): string {
  switch (type) {
    case "training":
      return `Ný æfingaskráning: ${(data as TrainingData).fullName}`;
    case "tournament":
      return `Ný mótsskráning: ${(data as TournamentData).fullName} - ${(data as TournamentData).tournament}`;
    case "contact":
      return `Fyrirspurn: ${(data as ContactData).subject}`;
    default:
      return "Ný skráning";
  }
}

function getConfirmationSubject(type: string, data: TrainingData | TournamentData | ContactData): string {
  switch (type) {
    case "training":
      return `Staðfesting: Skráning í æfingar - Geimur Esports`;
    case "tournament":
      return `Staðfesting: ${(data as TournamentData).tournament} - Geimur Esports`;
    case "contact":
      return `Staðfesting: Fyrirspurn móttekin - Geimur Esports`;
    default:
      return "Staðfesting - Geimur Esports";
  }
}

// Validates and sanitizes data based on type, throws ZodError on failure
function validateAndSanitizeData(type: string, data: Record<string, unknown>): TrainingData | TournamentData | ContactData {
  switch (type) {
    case "training":
      return trainingSchema.parse(data);
    case "tournament":
      return tournamentSchema.parse(data);
    case "contact":
      return contactSchema.parse(data);
    default:
      throw new Error("Ógild tegund skráningar");
  }
}

// Rate limiting settings
const RATE_LIMIT_MAX = 5; // Max submissions per time window
const RATE_LIMIT_WINDOW_MINUTES = 60; // Time window in minutes

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { type, data: rawData }: NotificationRequest = await req.json();
    console.log(`Processing ${type} notification`);

    // Validate required fields
    if (!type || !rawData) {
      return new Response(
        JSON.stringify({ error: "Vantar nauðsynleg gögn" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate type
    if (!["training", "tournament", "contact"].includes(type)) {
      return new Response(
        JSON.stringify({ error: "Ógild tegund skráningar" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Server-side validation and sanitization
    let validatedData: TrainingData | TournamentData | ContactData;
    try {
      validatedData = validateAndSanitizeData(type, rawData);
    } catch (validationError) {
      console.error("Validation error:", validationError);
      // Return generic validation error to client (don't expose details)
      return new Response(
        JSON.stringify({ error: "Ógild gögn. Vinsamlegast athugaðu alla reiti." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Supabase client with service role for database operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get client IP for rate limiting
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("cf-connecting-ip") || 
                     "unknown";
    
    // Check rate limit - count recent submissions from this IP
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();
    
    const { count, error: countError } = await supabase
      .from("registrations")
      .select("*", { count: "exact", head: true })
      .gte("created_at", windowStart)
      .eq("data->>client_ip", clientIp);

    if (countError) {
      console.error("Rate limit check error:", countError);
      // Continue anyway - don't block legitimate users due to rate limit check failure
    } else if (count !== null && count >= RATE_LIMIT_MAX) {
      console.warn(`Rate limit exceeded for IP: ${clientIp} (${count} submissions in ${RATE_LIMIT_WINDOW_MINUTES} min)`);
      return new Response(
        JSON.stringify({ 
          error: "Of margar skráningar. Vinsamlegast reyndu aftur síðar.",
          code: "RATE_LIMIT_EXCEEDED"
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Add client IP to data for rate limiting tracking
    const dataWithIp = { ...validatedData, client_ip: clientIp };

    // Save to database
    const { error: dbError } = await supabase
      .from("registrations")
      .insert({ type, data: dataWithIp });

    if (dbError) {
      console.error("Database insert error:", dbError);
      // Return generic error to client
      return new Response(
        JSON.stringify({ error: "Villa við vistun. Vinsamlegast reyndu aftur." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    console.log("Registration saved to database");

    // Format email based on type
    let html: string;
    let confirmationHtml: string;
    switch (type) {
      case "training":
        html = formatTrainingEmail(validatedData as TrainingData);
        confirmationHtml = formatTrainingConfirmation(validatedData as TrainingData);
        break;
      case "tournament":
        html = formatTournamentEmail(validatedData as TournamentData);
        confirmationHtml = formatTournamentConfirmation(validatedData as TournamentData);
        break;
      case "contact":
        html = formatContactEmail(validatedData as ContactData);
        confirmationHtml = formatContactConfirmation(validatedData as ContactData);
        break;
      default:
        html = `<pre>${escapeHtml(JSON.stringify(validatedData, null, 2))}</pre>`;
        confirmationHtml = html;
    }

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: FROM_EMAIL,
      to: [NOTIFICATION_EMAIL],
      subject: getSubject(type, validatedData),
      html,
    });

    console.log("Admin email sent:", adminEmailResponse);

    if (adminEmailResponse?.error) {
      console.error("Admin email send error:", adminEmailResponse.error);
      return new Response(
        JSON.stringify({ error: "Villa við sendingu. Vinsamlegast reyndu aftur." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Send confirmation email to registrant
    const registrantEmail = 'email' in validatedData ? validatedData.email : null;
    let confirmationResponse = null;
    
    if (registrantEmail) {
      confirmationResponse = await resend.emails.send({
        from: FROM_EMAIL,
        to: [registrantEmail],
        subject: getConfirmationSubject(type, validatedData),
        html: confirmationHtml,
      });
      console.log("Confirmation email sent to registrant:", confirmationResponse);

      if (confirmationResponse?.error) {
        console.error("Confirmation email send error:", confirmationResponse.error);
        // Don't fail the whole request if confirmation email fails
        console.warn("Continuing despite confirmation email failure");
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
    // Log detailed error server-side only
    console.error("Error in send-notification function:", error);
    
    // Return generic error to client (no internal details)
    return new Response(
      JSON.stringify({ error: "Villa kom upp. Vinsamlegast reyndu aftur síðar." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

Deno.serve(handler);
