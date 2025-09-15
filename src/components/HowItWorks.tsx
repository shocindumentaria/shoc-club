import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  Gift, 
  Sparkles, 
  Crown, 
  Calendar, 
  Shield, 
  Ticket, 
  Heart 
} from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      title: "Unite",
      description: "Preinscribite hoy. Cupos limitados por cohorte.",
      icon: UserPlus,
    },
    {
      step: "02", 
      title: "Acceso",
      description: "Recibí tu welcome pack digital con calendario y sorpresas.",
      icon: Gift,
    },
    {
      step: "03",
      title: "Disfrutá",
      description: "Drops mensuales, eventos y beneficios exclusivos.",
      icon: Sparkles,
    },
  ];

  const features = [
    {
      icon: Crown,
      title: "Ediciones limitadas",
      description: "Prendas numeradas y certificadas",
    },
    {
      icon: Calendar,
      title: "Acceso anticipado",
      description: "Siguente oportunidad a colecciones limitadas",
    },
    {
      icon: Gift,
      title: "Regalos sorpresa",
      description: "Cajas temáticas mensuales",
    },
    {
      icon: Ticket,
      title: "Early access",
      description: "Descuentos y acceso anticipado",
    },
    {
      icon: Shield,
      title: "Soporte prioritario",
      description: "Atención personalizada 24/7",
    },
    {
      icon: Heart,
      title: "Sorteos exclusivos",
      description: "Solo para miembros del club",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-card/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="badge-exclusive mb-6">¿Cómo funciona?</Badge>
          <h2 className="heading-section mb-6">
            Tu membresía en 
            <span className="text-primary"> 3 pasos</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Un proceso simple para acceder a beneficios reales y experiencias únicas.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {steps.map((step, index) => (
            <div 
              key={step.step} 
              className="relative text-center animate-fade-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="card-premium relative overflow-hidden group">
                {/* Step Number */}
                <div className="absolute top-4 right-4 text-6xl font-bold text-primary/20 font-montserrat">
                  {step.step}
                </div>
                
                {/* Icon */}
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                </div>

                <h3 className="text-2xl font-semibold font-montserrat mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-primary/50 to-transparent" />
              )}
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="card-feature animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold font-montserrat mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;