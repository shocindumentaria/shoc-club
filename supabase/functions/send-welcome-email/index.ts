import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY") ?? "FtJVy7IZrNCan1L4";
const SENDER_EMAIL  = Deno.env.get("BREVO_SENDER_EMAIL") ?? "shocindumentaria@gmail.com";
const SENDER_NAME   = Deno.env.get("BREVO_SENDER_NAME") ?? "SHOC";
const BCC_EMAIL     = Deno.env.get("BREVO_BCC_EMAIL") ?? "shocindumentaria@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type WelcomeEmailRequest = {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  province?: string;
};

function buildHtml({ name, phone, city, province }: WelcomeEmailRequest) {
  return `
    <h2>¡Hola ${name}! 👋</h2>
    <p><strong>¡Tu lugar en el Club SHOC está oficialmente reservado!</strong></p>
    <ul>
      <li>Acceso anticipado a colecciones limitadas</li>
      <li>Ediciones exclusivas solo para miembros</li>
      <li>Hub de experiencias digitales SHOC</li>
    </ul>
    ${city && province ? `<p>📍 Registrado desde: ${city}, ${province}</p>` : ""}
    ${phone ? `<p>📞 Tel: ${phone}</p>` : ""}
    <p style="margin-top:16px;">SHOC — Siempre Hay Otro Camino</p>
  `;
}

function buildText({ name, phone, city, province }: WelcomeEmailRequest) {
  return (
    `Hola ${name}!\n\n` +
    `Tu lugar en el Club SHOC está reservado.\n\n` +
    `• Acceso anticipado a colecciones limitadas\n` +
    `• Ediciones exclusivas solo para miembros\n` +
    `• Hub de experiencias digitales SHOC\n` +
    (city && province ? `\nUbicación: ${city}, ${province}` : "") +
    (phone ? `\nTel: ${phone}` : "") +
    `\n\nSHOC — Siempre Hay Otro Camino`
  );
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    if (!BREVO_API_KEY) {
      return new Response(JSON.stringify({ success: false, error: "BREVO_API_KEY missing" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const body = (await req.json()) as WelcomeEmailRequest;
    if (!body?.name || !body?.email) {
      return new Response(JSON.stringify({ error: "Missing 'name' or 'email'" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const brevoPayload = {
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email: body.email, name: body.name }],
      bcc: [{ email: BCC_EMAIL, name: "SHOC" }],
      replyTo: { email: BCC_EMAIL, name: "SHOC" },
      subject: "¡Bienvenido al Club SHOC! Tu lugar está reservado",
      htmlContent: buildHtml(body),
      textContent: buildText(body),
      tags: ["club-shoc", "prelaunch"],
    };

    const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify(brevoPayload),
    });

    const data = await resp.json().catch(() => ({}));

    if (!resp.ok) {
      console.error("[BREVO] send error:", resp.status, data);
      return new Response(JSON.stringify({ success: false, error: data?.message || "Brevo send failed" }), {
        status: 502,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ success: true, messageId: data?.messageId ?? null }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err: any) {
    console.error("[BREVO] Exception:", err);
    return new Response(JSON.stringify({ success: false, error: err?.message ?? "Unknown error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
