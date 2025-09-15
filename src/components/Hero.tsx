import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Zap, Calendar } from "lucide-react";
import heroImage from "@/assets/hero-grid2.png";

interface HeroProps {
  onJoinClick: () => void;
  onWhatsAppClick: () => void;
}

const Hero = ({ onJoinClick, onWhatsAppClick }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="SHOC Premium Collection" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/95" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-up">
          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge className="badge-limited">
              <Gift className="w-4 h-4 mr-2" />
              Cupos limitados
            </Badge>
            <Badge className="badge-exclusive">
              <Calendar className="w-4 h-4 mr-2" />
              Acceso anticipado
            </Badge>
            <Badge className="badge-exclusive">
              <Zap className="w-4 h-4 mr-2" />
              Ediciones certificadas
            </Badge>
          </div>

          {/* Main Heading */}
          <h1 className="heading-hero">
            El camino exclusivo
            <br />
            <span className="text-transparent bg-gradient-to-r from-primary to-primary/70 bg-clip-text">
              empieza acá
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Suscribite al prelanzamiento y asegurá tu lugar en la membresía trimestral 
            con drops, regalos y entradas a eventos exclusivos.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              size="lg" 
              className="btn-hero text-lg px-12 py-6 min-w-[240px]" 
              onClick={onJoinClick}
            >
              Sumarme al Club
            </Button>
            {/* <Button 
              variant="outline" 
              size="lg" 
              className="btn-secondary text-lg px-8 py-6 min-w-[240px]"
              onClick={onWhatsAppClick}
            >
              Quiero info por WhatsApp
            </Button> */}
          </div>

          {/* Social Proof */}
          <div className="pt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span>+250 en lista de espera</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span>Siguente cohorte: Septiembre 2025</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;