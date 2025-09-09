import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "¿Qué incluye exactamente la membresía Club SHOC?",
      answer: "Tu membresía incluye beneficios mensuales como prendas de edición limitada, accesorios exclusivos, acceso anticipado a colecciones limitadas, descuentos especiales, certificaciones digitales de autenticidad, y acceso al Hub Digital con experiencias exclusivas y comunidad privada donde podrás votar por futuros diseños."
    },
    {
      question: "¿Cuánto dura la membresía y puedo renovarla?",
      answer: "La membresía tiene duración fija de 3 meses (trimestre). Al finalizar tu período, tendrás la opción de renovar para la siguiente cohorte. Los miembros actuales tienen prioridad en las renovaciones."
    },
    {
      question: "¿Puedo regalar una membresía a alguien más?",
      answer: "¡Sí! Ofrecemos tarjetas regalo digitales para membresías completas. La persona beneficiaria podrá activar su membresía cuando guste, siempre que haya cupos disponibles en la cohorte que elija."
    },
    {
      question: "¿Hay política de reembolsos o devoluciones?",
      answer: "Debido a la naturaleza exclusiva y limitada de nuestros productos, no ofrecemos reembolsos una vez iniciada la membresía. Sin embargo, puedes transferir tu lugar a otra persona antes del inicio de tu cohorte sin costo adicional."
    },
    {
      question: "¿Cómo funciona el acceso anticipado a colecciones?",
      answer: "Los miembros del Club SHOC reciben acceso exclusivo 48 horas antes del lanzamiento público de nuevas colecciones limitadas, garantizando disponibilidad de stock y la primera oportunidad de conseguir las piezas más buscadas."
    },
    {
      question: "¿Cómo puedo contactar al soporte si tengo problemas?",
      answer: "Ofrecemos soporte prioritario 24/7 para miembros a través de WhatsApp y email. También tienes acceso directo a nuestro equipo en la comunidad privada para consultas rápidas y feedback."
    },
    {
      question: "¿Qué pasa si no me gusta algún producto del drop mensual?",
      answer: "Cada drop es cuidadosamente curado por nuestro equipo de diseño. Aunque no ofrecemos cambios individuales, tu feedback es muy valioso para mejorar futuras selecciones. Los miembros participan activamente en las decisiones de diseño."
    },
    {
      question: "¿Cómo funciona la certificación digital de autenticidad?",
      answer: "Cada prenda incluye un código QR único que te lleva a un certificado digital con información completa: número de serie, fecha de producción, autenticidad verificada y trazabilidad completa del producto."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-card/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="badge-limited mb-6">FAQ</Badge>
          <h2 className="heading-section mb-6">
            Preguntas
            <span className="text-primary"> frecuentes</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Todo lo que necesitás saber sobre tu membresía Club SHOC.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-border rounded-2xl px-6 bg-gradient-to-r from-card/50 to-secondary/10 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6 font-montserrat font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact Support */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl backdrop-blur-sm">
            <div>
              <h3 className="font-semibold font-montserrat mb-1">¿No encontraste tu respuesta?</h3>
              <p className="text-sm text-muted-foreground">Nuestro equipo está disponible para ayudarte</p>
            </div>
            <div className="flex gap-3">
              <a 
                href="mailto:shocindumentaria@gmail.com" 
                className="px-4 py-2 bg-card border border-border rounded-xl hover:bg-secondary/20 transition-colors text-sm font-medium"
              >
                Email
              </a>
              <a 
                href="https://wa.me/5493885123456?text=Tengo%20una%20consulta%20sobre%20Club%20SHOC" 
                className="px-4 py-2 bg-accent/20 text-accent border border-accent/30 rounded-xl hover:bg-accent/30 transition-colors text-sm font-medium"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;