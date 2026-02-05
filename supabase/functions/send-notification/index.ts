// Geimur Esports - Send Notification Edge Function v4
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3.25.76";

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

const elkoTournamentSchema = z.object({
  teamName: z.string().trim().min(2).max(50),
  player1Name: z.string().trim().min(2).max(50),
  player2Name: z.string().trim().min(2).max(50),
  email: z.string().trim().email("Ógilt netfang").max(255),
  orderId: z.string().trim().min(5).max(50),
  tournamentDate: z.string().trim().min(1).max(50),
  tournamentName: z.string().trim().min(1).max(100),
});

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().min(3).max(200),
  message: z.string().trim().min(10).max(500),
});

type TrainingData = z.infer<typeof trainingSchema>;
type TournamentData = z.infer<typeof tournamentSchema>;
type ElkoTournamentData = z.infer<typeof elkoTournamentSchema>;
type ContactData = z.infer<typeof contactSchema>;

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
  type: "training" | "tournament" | "elko-tournament" | "contact";
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

function formatElkoTournamentEmail(data: ElkoTournamentData): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #22c55e; border-bottom: 2px solid #22c55e; padding-bottom: 10px;">
        🎮 Ný liðsskráning – ${escapeHtml(data.tournamentName)}
      </h1>
      <h2 style="color: #333; margin-top: 20px;">Liðsupplýsingar</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Nafn liðs:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(data.teamName)}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Spilari 1:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(data.player1Name)}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Spilari 2:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(data.player2Name)}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Netfang:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(data.email)}</td></tr>
      </table>
      <h2 style="color: #333; margin-top: 20px;">Mót</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Mót:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(data.tournamentName)}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Dagsetning:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(data.tournamentDate)}</td></tr>
      </table>
      <h2 style="color: #333; margin-top: 20px;">Greiðsla</h2>
      <p style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
        <strong>Order ID:</strong> ${escapeHtml(data.orderId)}
      </p>
    </div>
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

function formatElkoTournamentConfirmation(data: ElkoTournamentData): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 30px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #22c55e; margin: 0;">🎮 Liðið þitt er skráð!</h1>
        <p style="color: #888; margin-top: 10px;">${escapeHtml(data.tournamentName)} · ${escapeHtml(data.tournamentDate)}</p>
      </div>
      <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0; color: #ccc;"><strong style="color: #22c55e;">Nafn liðs:</strong> ${escapeHtml(data.teamName)}</p>
        <p style="margin: 5px 0; color: #ccc;"><strong style="color: #22c55e;">Spilari 1:</strong> ${escapeHtml(data.player1Name)}</p>
        <p style="margin: 5px 0; color: #ccc;"><strong style="color: #22c55e;">Spilari 2:</strong> ${escapeHtml(data.player2Name)}</p>
        <p style="margin: 5px 0; color: #ccc;"><strong style="color: #22c55e;">Order ID:</strong> ${escapeHtml(data.orderId)}</p>
      </div>
      <h2 style="color: #22c55e; border-bottom: 1px solid #333; padding-bottom: 10px;">📋 Næstu skref</h2>
      <ol style="color: #ccc; line-height: 1.8;">
        <li>Liðið þitt birtist nú í listanum yfir skráð lið á vefsíðunni</li>
        <li>Mætið í Arena <strong>20–30 mín fyrir fyrsta leik</strong> – keppnin hefst kl. 11:00</li>
        <li>Keppnin verður sýnd live á skjám í Arena</li>
        <li>Vertu með gott viðhorf og skemmtu þér!</li>
      </ol>
      <div style="background: #1a1a1a; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: center;">
        <p style="color: #888; margin: 0; font-size: 14px;">
          Ef þú hefur spurningar, hafðu samband á Discord eða sendu okkur email.
        </p>
      </div>
      <p style="color: #888; margin-top: 30px; text-align: center;">
        Gangi þér vel!<br>
        <strong style="color: #22c55e;">Geimur Esports</strong>
      </p>
    </div>
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

function getSubject(type: string, data: TrainingData | TournamentData | ElkoTournamentData | ContactData): string {
  switch (type) {
    case "training":
      return `Ný æfingaskráning: ${(data as TrainingData).fullName}`;
    case "tournament":
      return `Ný mótsskráning: ${(data as TournamentData).fullName} - ${(data as TournamentData).tournament}`;
    case "elko-tournament":
      return `🎮 ${(data as ElkoTournamentData).tournamentName}: ${(data as ElkoTournamentData).teamName}`;
    case "contact":
      return `Fyrirspurn: ${(data as ContactData).subject}`;
    default:
      return "Ný skráning";
  }
}

function getConfirmationSubject(type: string, data: TrainingData | TournamentData | ElkoTournamentData | ContactData): string {
  switch (type) {
    case "training":
      return `Staðfesting: Skráning í æfingar - Geimur Esports`;
    case "tournament":
      return `Staðfesting: ${(data as TournamentData).tournament} - Geimur Esports`;
    case "elko-tournament":
      return `🎮 Staðfesting: ${(data as ElkoTournamentData).tournamentName} - Geimur Esports`;
    case "contact":
      return `Staðfesting: Fyrirspurn móttekin - Geimur Esports`;
    default:
      return "Staðfesting - Geimur Esports";
  }
}

function validateAndSanitizeData(type: string, data: Record<string, unknown>): TrainingData | TournamentData | ElkoTournamentData | ContactData {
  console.log("v4 validateAndSanitizeData - type:", type, "keys:", Object.keys(data));
  switch (type) {
    case "training":
      return trainingSchema.parse(data);
    case "tournament":
      return tournamentSchema.parse(data);
    case "elko-tournament":
      console.log("v4 Using elkoTournamentSchema");
      return elkoTournamentSchema.parse(data);
    case "contact":
      return contactSchema.parse(data);
    default:
      throw new Error("Ógild tegund skráningar");
  }
}

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MINUTES = 60;

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { type, data: rawData } = await req.json();
    console.log(`v6 Processing ${type} notification`);

    if (!type || !rawData) {
      return new Response(
        JSON.stringify({ error: "Vantar nauðsynleg gögn" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!["training", "tournament", "elko-tournament", "contact"].includes(type)) {
      return new Response(
        JSON.stringify({ error: "Ógild tegund skráningar" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    let validatedData: TrainingData | TournamentData | ElkoTournamentData | ContactData;
    try {
      validatedData = validateAndSanitizeData(type, rawData);
    } catch (validationError) {
      console.error("v4 Validation error:", validationError);
      return new Response(
        JSON.stringify({ error: "Ógild gögn. Vinsamlegast athugaðu alla reiti." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("cf-connecting-ip") || 
                     "unknown";
    
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();
    
    const { count, error: countError } = await supabase
      .from("registrations")
      .select("*", { count: "exact", head: true })
      .gte("created_at", windowStart)
      .eq("data->>client_ip", clientIp);

    if (countError) {
      console.error("Rate limit check error:", countError);
    } else if (count !== null && count >= RATE_LIMIT_MAX) {
      console.warn(`Rate limit exceeded for IP: ${clientIp} (${count} submissions in ${RATE_LIMIT_WINDOW_MINUTES} min)`);
      return new Response(
        JSON.stringify({ 
          error: "Of margar skráningar. Vinsamlegast reyndu aftur síðar.",
          code: "RATE_LIMIT_EXCEEDED"
        }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Duplicate order ID check for tournament registrations
    if (type === "elko-tournament") {
      const elkoData = validatedData as ElkoTournamentData;
      const { count: existingCount, error: dupError } = await supabase
        .from("registrations")
        .select("*", { count: "exact", head: true })
        .eq("type", "elko-tournament")
        .contains("data", { orderId: elkoData.orderId });

      if (!dupError && existingCount && existingCount > 0) {
        console.warn(`Duplicate order ID attempted: ${elkoData.orderId}`);
        return new Response(
          JSON.stringify({ error: "Þessi pöntunarnúmer er þegar skráð." }),
          { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    const dataWithIp = { ...validatedData, client_ip: clientIp };

    const { error: dbError } = await supabase
      .from("registrations")
      .insert({ type, data: dataWithIp });

    if (dbError) {
      console.error("Database insert error:", dbError);
      return new Response(
        JSON.stringify({ error: "Villa við vistun. Vinsamlegast reyndu aftur." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    console.log("Registration saved to database");

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
      case "elko-tournament":
        html = formatElkoTournamentEmail(validatedData as ElkoTournamentData);
        confirmationHtml = formatElkoTournamentConfirmation(validatedData as ElkoTournamentData);
        break;
      case "contact":
        html = formatContactEmail(validatedData as ContactData);
        confirmationHtml = formatContactConfirmation(validatedData as ContactData);
        break;
      default:
        html = `<pre>${escapeHtml(JSON.stringify(validatedData, null, 2))}</pre>`;
        confirmationHtml = html;
    }

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
        console.warn("Continuing despite confirmation email failure");
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        adminEmailId: adminEmailResponse.data?.id,
        confirmationEmailId: confirmationResponse?.data?.id 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: unknown) {
    console.error("Error in send-notification function:", error);
    return new Response(
      JSON.stringify({ error: "Villa kom upp. Vinsamlegast reyndu aftur síðar." }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

Deno.serve(handler);
