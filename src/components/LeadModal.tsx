import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Crown, 
  Mail, 
  User, 
  Phone, 
  MapPin, 
  Shield, 
  Loader2,
  CheckCircle 
} from "lucide-react";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeadModal = ({ isOpen, onClose }: LeadModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    province: "",
    emailConsent: false,
    whatsappConsent: false,
    termsAccepted: false,
  });

  const provinces = [
    "Jujuy", "Salta", "Tucumán", "Catamarca", "La Rioja", "Santiago del Estero",
    "Buenos Aires", "CABA", "Córdoba", "Santa Fe", "Entre Ríos", "Corrientes",
    "Misiones", "Formosa", "Chaco", "Mendoza", "San Juan", "San Luis",
    "Neuquén", "Río Negro", "Chubut", "Santa Cruz", "Tierra del Fuego"
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.termsAccepted) {
      toast({
        title: "Términos requeridos",
        description: "Debes aceptar los términos y condiciones para continuar.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically send to your CRM/email service
      console.log("Form submitted:", formData);
      
      toast({
        title: "¡Bienvenido al Club SHOC! 🎉",
        description: "Te confirmamos tu lugar por email. Revisá tu bandeja de entrada.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        city: "",
        province: "",
        emailConsent: false,
        whatsappConsent: false,
        termsAccepted: false,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al procesar tu solicitud. Intentá nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-card to-secondary/20 border border-border">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Crown className="w-8 h-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-montserrat font-bold">
            Unite al Club SHOC
          </DialogTitle>
          <DialogDescription className="text-base">
            Asegurate tu lugar en la primera cohorte exclusiva.
          </DialogDescription>
          <div className="flex justify-center gap-2 mt-4">
            <Badge className="badge-limited">Cupos limitados</Badge>
            <Badge className="badge-exclusive">Primera cohorte</Badge>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Nombre completo *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Tu nombre y apellido"
              required
              className="bg-card/50 border-border focus:border-primary/50"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="tu@email.com"
              required
              className="bg-card/50 border-border focus:border-primary/50"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              WhatsApp (opcional)
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="+54 9 11 1234-5678"
              className="bg-card/50 border-border focus:border-primary/50"
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Ciudad
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="Tu ciudad"
                className="bg-card/50 border-border focus:border-primary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="province">Provincia</Label>
              <Select value={formData.province} onValueChange={(value) => handleInputChange("province", value)}>
                <SelectTrigger className="bg-card/50 border-border focus:border-primary/50">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((province) => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Consents */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="email-consent"
                checked={formData.emailConsent}
                onCheckedChange={(checked) => handleInputChange("emailConsent", checked as boolean)}
              />
              <Label htmlFor="email-consent" className="text-sm leading-relaxed">
                Quiero recibir novedades y ofertas por email
              </Label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="whatsapp-consent"
                checked={formData.whatsappConsent}
                onCheckedChange={(checked) => handleInputChange("whatsappConsent", checked as boolean)}
              />
              <Label htmlFor="whatsapp-consent" className="text-sm leading-relaxed">
                Acepto recibir mensajes por WhatsApp
              </Label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={formData.termsAccepted}
                onCheckedChange={(checked) => handleInputChange("termsAccepted", checked as boolean)}
                required
              />
              <Label htmlFor="terms" className="text-sm leading-relaxed">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Acepto los{" "}
                  <a href="#" className="text-primary hover:underline">
                    Términos y Condiciones
                  </a>{" "}
                  y{" "}
                  <a href="#" className="text-primary hover:underline">
                    Política de Privacidad
                  </a>
                  *
                </span>
              </Label>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full btn-hero py-6 text-lg"
            disabled={isLoading || !formData.termsAccepted}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Confirmar mi lugar
              </>
            )}
          </Button>

          {/* Security Note */}
          <div className="text-center text-xs text-muted-foreground">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Shield className="w-3 h-3" />
              Información 100% segura y confidencial
            </div>
            <p>No compartimos tus datos con terceros</p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeadModal;