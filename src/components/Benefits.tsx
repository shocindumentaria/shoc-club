import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Calendar, 
  Gift, 
  Shield, 
  Users, 
  Zap 
} from "lucide-react";

const Benefits = () => {
  const benefits = [
    {
      icon: Package,
      title: "Drops Mensuales",
      description: "Prendas y accesorios exclusivos, curados y numerados por nuestro equipo de diseño.",
      features: ["Prendas limitadas","Sin restock", "Unicas como vos"],
      gradient: "from-primary/20 to-primary/5",
    },
    {
      icon: Zap,
      title: "Acceso Anticipado a Colecciones Limitadas",
      description: "Siguente oportunidad exclusiva para acceder a nuestras colecciones más limitadas antes que nadie.",
      features: ["Acceso 48h antes", "Colecciones exclusivas", "Stock garantizado"],
      gradient: "from-accent/20 to-accent/5",
    },
    {
      icon: Shield,
      title: "Ediciones Exclusivas Solo para Miembros",
      description: "Piezas únicas diseñadas específicamente para miembros del Club SHOC con numeración especial.",
      features: ["Diseños únicos", "Solo para miembros", "Numeración especial"],
      gradient: "from-secondary/40 to-secondary/10",
    },
    {
      icon: Users,
      title: "Hub Digital de Experiencias SHOC",
      description: "Plataforma digital exclusiva con contenido, experiencias y acceso a la comunidad SHOC.",
      features: ["Contenido exclusivo", "Experiencias digitales", "Comunidad privada"],
      gradient: "from-primary/15 to-transparent",
    },
    {
      icon: Gift,
      title: "Regalos Sorpresa",
      description: "Cajas temáticas trimestrales con productos especiales y códigos de descuento ocultos.",
      features: ["Cajas temáticas", "Productos especiales", "Códigos exclusivos"],
      gradient: "from-accent/15 to-transparent",
    },
    {
      icon: Zap,
      title: "Envío Prioritario Gratuito",
      description: "Tus prendas siempre llegan primero y sin costo adicional, con seguimiento premium.",
      features: ["Sin cargos ocultos", "Entrega más rápida", "Prioridad en envíos"],
      gradient: "from-accent/20 to-transparent",
    },
    
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-card/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="badge-limited mb-6">Beneficios</Badge>
          <h2 className="heading-section mb-6">
            Mucho más que 
            <span className="text-primary"> una membresía</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Acceso a beneficios reales: prendas limitadas, experiencias digitales 
            y sorpresas mensuales que valen la pena.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card 
              key={benefit.title}
              className="relative overflow-hidden border-0 bg-gradient-to-br from-card to-secondary/10 hover:shadow-[var(--shadow-glow)] transition-all duration-500 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-50`} />
              
              <div className="relative p-6">
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
                    <benefit.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold font-montserrat mb-3">
                    {benefit.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {benefit.description}
                </p>

                {/* Features List */}
                <ul className="space-y-2">
                  {benefit.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        {/* <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-medium">
            <Zap className="w-4 h-4" />
            Valor total estimado: +$200.000 por trimestre
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Benefits;