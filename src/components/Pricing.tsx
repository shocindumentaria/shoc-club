import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Crown, 
  Calendar,
  Gift,
  Users,
  Zap,
  CreditCard,
  Wallet
} from "lucide-react";

interface PricingProps {
  onJoinClick: () => void;
}

const Pricing = ({ onJoinClick }: PricingProps) => {
  const includedFeatures = [
    { icon: Crown, text: "1 prenda limitada por mes" },
    { icon: Gift, text: "1 accesorio sorpresa mensual" },
    { icon: Calendar, text: "Acceso a eventos privados" },
    { icon: Zap, text: "Descuentos exclusivos hasta 40%" },
    { icon: Users, text: "Comunidad privada de miembros" },
    { icon: Check, text: "Certificación digital de autenticidad" },
    { icon: Check, text: "Soporte prioritario 24/7" },
    { icon: Check, text: "Early access a nuevos drops" },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-card/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="badge-exclusive mb-6">Membresía</Badge>
          <h2 className="heading-section mb-6">
            Club SHOC
            <span className="text-primary"> — Trimestral</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tres meses de beneficios exclusivos. Cupos limitados por cohorte.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-card via-secondary/20 to-card shadow-[var(--shadow-premium)] animate-glow">
            {/* Premium Badge */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Badge className="bg-primary text-primary-foreground px-6 py-2 text-sm font-semibold">
                PRELANZAMIENTO
              </Badge>
            </div>

            <div className="p-8 md:p-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Pricing Info */}
                <div className="text-center lg:text-left">
                  <h3 className="text-3xl font-bold font-montserrat mb-6">
                    Membresía Trimestral
                  </h3>
                  
                  {/* Pricing Options */}
                  <div className="space-y-6 mb-8">
                    {/* Card Payment */}
                    <div className="border border-primary/30 rounded-2xl p-6 bg-primary/5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-primary" />
                          <span className="font-semibold">Tarjeta de crédito</span>
                        </div>
                        <Badge variant="outline" className="text-xs">HASTA 3 CUOTAS</Badge>
                      </div>
                      <div className="text-2xl font-bold font-montserrat">
                        $126.000
                      </div>
                      <div className="text-sm text-muted-foreground">
                        3 cuotas sin interés de $42.000
                      </div>
                    </div>

                    {/* Cash Payment */}
                    <div className="border border-accent/30 rounded-2xl p-6 bg-accent/5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Wallet className="w-5 h-5 text-accent" />
                          <span className="font-semibold">Efectivo / Transferencia</span>
                        </div>
                        <Badge className="bg-accent/20 text-accent border-accent/30">10% OFF</Badge>
                      </div>
                      <div className="text-2xl font-bold font-montserrat">
                        $113.400
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Equivale a $37.800/mes
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button 
                    size="lg" 
                    className="btn-hero w-full lg:w-auto px-12 py-6 text-lg"
                    onClick={onJoinClick}
                  >
                    Reservar mi lugar
                  </Button>

                  {/* Legal Note */}
                  <p className="text-xs text-muted-foreground mt-4 opacity-70">
                    *Precios referenciales sujetos a cambio al lanzamiento oficial
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold font-montserrat mb-6">
                    ¿Qué incluye tu membresía?
                  </h4>
                  
                  {includedFeatures.map((feature, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/20 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-foreground">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Additional Info */}
          <div className="text-center mt-12 space-y-4">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full" />
                <span>Sin permanencia</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>Cancelación flexible</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full" />
                <span>Transferencia permitida</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;