import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer, Users, Zap } from "lucide-react";
import ShocCountdown from "./ShocCountdown";

interface FinalCTAProps {
  onJoinClick: () => void;
}

const FinalCTA = ({ onJoinClick }: FinalCTAProps) => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-card/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Urgency Indicators */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge className="badge-limited animate-pulse">
              <Timer className="w-4 h-4 mr-2" />
              Cupos limitados
            </Badge>
            <Badge className="badge-exclusive">
              <Users className="w-4 h-4 mr-2" />
              Solo 100 lugares
            </Badge>
            <Badge className="badge-exclusive">
              <Zap className="w-4 h-4 mr-2" />
              Siguente cohorte
            </Badge>
          </div>

          {/* Main Heading */}
          <h2 className="heading-hero mb-8">
            Sumate a la siguiente
            <br />
            <span className="text-transparent bg-gradient-to-r from-primary via-primary to-accent bg-clip-text">
              cohorte del Club SHOC
            </span>
          </h2>

          {/* Description */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Cerramos inscripciones cuando se complete el cupo. 
            <br className="hidden md:block" />
            <strong className="text-foreground">No te quedes afuera</strong> de esta experiencia única.
          </p>

          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto mb-12">
          <ShocCountdown
            targetISO="2025-09-21T08:00:00-03:00"
            progressStartISO="2025-09-07T00:00:00-03:00" // opcional: inicio de la preventa para la barra
            onFinish={() => {
              // Podés deshabilitar el botón o abrir modal de “Cerrado”
              // document.dispatchEvent(new CustomEvent("shoc:countdown-finished"));
            }}
          />  
          </div>

          {/* CTA Button */}
          <div className="space-y-6">
            <Button 
              size="lg" 
              className="btn-hero text-xl px-16 py-8 animate-glow" 
              onClick={onJoinClick}
            >
              Quiero estar adentro
            </Button>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <span>Proceso 100% seguro</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span>Confirmación inmediata</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <span>Soporte 24/7</span>
              </div>
            </div>
          </div>

          {/* Risk Reversal */}
          {/* <div className="mt-16 p-6 bg-gradient-to-r from-card/50 to-secondary/20 border border-border rounded-2xl backdrop-blur-sm max-w-2xl mx-auto">
            <h3 className="font-semibold font-montserrat mb-3">
              🛡️ Garantía de satisfacción
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Si en los primeros 7 días no estás completamente satisfecho con tu bienvenida al Club SHOC, 
              te devolvemos el 100% de tu inversión sin preguntas.
            </p>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;