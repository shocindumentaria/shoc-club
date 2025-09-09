import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  province?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, city, province }: WelcomeEmailRequest = await req.json();

    console.log("Sending welcome email to:", email);

    const emailResponse = await resend.emails.send({
      from: "SHOC <shocindumentaria@gmail.com>",
      to: [email],
      subject: "¡Bienvenido al Club SHOC! Tu lugar está reservado",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bienvenido al Club SHOC</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #0B0B0C; background-color: #F7F7F5; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(11, 11, 12, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #FFD33D 0%, #FFF 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #0B0B0C; font-size: 32px; font-weight: bold; margin: 0 0 10px 0; letter-spacing: -1px;">SHOC</h1>
              <p style="color: #2B2B2E; font-size: 16px; margin: 0;">Siempre Hay Otro Camino</p>
            </div>

            <!-- Main Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #0B0B0C; font-size: 24px; font-weight: bold; margin: 0 0 20px 0;">¡Hola ${name}! 👋</h2>
              
              <p style="color: #2B2B2E; font-size: 16px; margin: 0 0 25px 0;">
                <strong>¡Tu lugar en el Club SHOC está oficialmente reservado!</strong> Gracias por unirte a nuestra comunidad exclusiva.
              </p>

              <div style="background-color: #F7F7F5; border-radius: 12px; padding: 25px; margin: 25px 0;">
                <h3 style="color: #0B0B0C; font-size: 18px; font-weight: bold; margin: 0 0 15px 0;">🎁 ¿Qué sigue?</h3>
                <ul style="color: #2B2B2E; margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 8px;">Te contactaremos pronto con detalles del lanzamiento</li>
                  <li style="margin-bottom: 8px;">Acceso anticipado a colecciones limitadas</li>
                  <li style="margin-bottom: 8px;">Ediciones exclusivas solo para miembros</li>
                  <li style="margin-bottom: 0;">Hub de experiencias digitales SHOC</li>
                </ul>
              </div>

              ${city && province ? `
              <p style="color: #2B2B2E; font-size: 14px; margin: 20px 0;">
                📍 Registrado desde: ${city}, ${province}
              </p>
              ` : ''}

              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://wa.me/5493885123456?text=Hola%2C%20acabo%20de%20unirme%20al%20Club%20SHOC.%20¿Cuándo%20inicia%20la%20primera%20cohorte%3F" 
                   style="background-color: #FFD33D; color: #0B0B0C; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: bold; font-size: 16px; display: inline-block; transition: all 0.3s ease;">
                  Contactar por WhatsApp
                </a>
              </div>

              <div style="border-top: 1px solid #E5E5E5; padding-top: 25px; margin-top: 30px;">
                <p style="color: #888888; font-size: 14px; margin: 0 0 10px 0;">
                  Seguinos en nuestras redes:
                </p>
                <p style="margin: 0;">
                  <a href="https://instagram.com/shoc.indumentaria" style="color: #FFD33D; text-decoration: none; font-weight: 500;">
                    @shoc.indumentaria
                  </a>
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #0B0B0C; color: #F7F7F5; padding: 25px 30px; text-align: center;">
              <p style="margin: 0; font-size: 14px; opacity: 0.8;">
                © 2025 SHOC. Siempre Hay Otro Camino.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, messageId: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);