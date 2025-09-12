import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
const SENDER_EMAIL  = Deno.env.get("BREVO_SENDER_EMAIL");
const SENDER_NAME   = Deno.env.get("BREVO_SENDER_NAME");
const BCC_EMAIL     = Deno.env.get("BREVO_BCC_EMAIL");

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


serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
  
  // validar envs
  const missing = [
    !BREVO_API_KEY && "BREVO_API_KEY",
    !SENDER_EMAIL && "BREVO_SENDER_EMAIL",
    !SENDER_NAME && "BREVO_SENDER_NAME",
    !BCC_EMAIL && "BREVO_BCC_EMAIL",
  ].filter(Boolean);
  if (missing.length) {
    return new Response(JSON.stringify({ success:false, error:`Missing env: ${missing.join(", ")}` }), {
      status: 500, headers: { "Content-Type":"application/json", ...corsHeaders },
    });
  }
  
  try {
    const body = await req.json();
    if (!body?.name || !body?.email) {
      return new Response(JSON.stringify({ error: "Missing 'name' or 'email'" }), {
        status: 400, headers: { "Content-Type":"application/json", ...corsHeaders },
      });
    }

    const brevoPayload = {
      sender: { name: SENDER_NAME!, email: SENDER_EMAIL! },
      to: [{ email: body.email, name: body.name }],
      bcc: [{ email: BCC_EMAIL!, name: "SHOC" }],
      replyTo: { email: BCC_EMAIL!, name: "SHOC" },
      subject: "¡Bienvenido al Club SHOC! Tu lugar está reservado",
      htmlContent: buildHtml(body),
      textContent: buildText(body),
      tags: ["club-shoc", "prelaunch"],
    };

    const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": BREVO_API_KEY!,
      },
      body: JSON.stringify(brevoPayload),
    });
    
    const text = await resp.text();
    let data: any = {};
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!resp.ok) {
      console.error("[BREVO] send error:", resp.status, data);
      return new Response(JSON.stringify({
        success:false,
        error: data?.message || data?.error || `Brevo send failed (${resp.status})`,
      }), { status: 502, headers: { "Content-Type":"application/json", ...corsHeaders }});
    }

    return new Response(JSON.stringify({ success:true, messageId: data?.messageId ?? null }), {
      status: 200, headers: { "Content-Type":"application/json", ...corsHeaders },
    });

  } catch (err: any) {
    console.error("[BREVO] Exception:", err);
    return new Response(JSON.stringify({ success:false, error: err?.message ?? "Unknown error" }), {
      status: 500, headers: { "Content-Type":"application/json", ...corsHeaders },
    });
  }
});
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