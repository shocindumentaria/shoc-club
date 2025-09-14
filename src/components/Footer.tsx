import { Badge } from "@/components/ui/badge";
import { 
  Instagram, 
  Twitter, 
  Mail, 
  MapPin, 
  Phone,
  Shield,
  FileText,
  Users
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com/shoc.official", label: "Instagram" },
    { icon: Twitter, href: "https://twitter.com/shoc_oficial", label: "Twitter" },
    { icon: Mail, href: "mailto:hola@shoc.com.ar", label: "Email" },
  ];

  const legalLinks = [
    { icon: FileText, text: "Términos y Condiciones", href: "#" },
    { icon: Shield, text: "Política de Privacidad", href: "#" },
    { icon: Users, text: "Uso de Datos", href: "#" },
  ];

  return (
    <footer className="bg-gradient-to-b from-card/30 to-background border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-2xl font-bold font-montserrat mb-2">
                SHOC
              </h3>
              <p className="text-sm text-muted-foreground italic">
                Siempre Hay Otro Camino
              </p>
            </div>
            
            <p className="text-muted-foreground mb-6 leading-relaxed max-w-md">
              Creamos experiencias únicas combinando streetwear premium, comunidad 
              y momentos inolvidables. Tu camino hacia lo exclusivo empieza acá.
            </p>

            <div className="flex flex-wrap gap-3">
              <Badge className="badge-exclusive">Premium</Badge>
              <Badge className="badge-limited">Exclusivo</Badge>
              <Badge className="bg-secondary/30 text-secondary-foreground border-secondary/50">NOA</Badge>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold font-montserrat mb-4">Contacto</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>Jujuy, Argentina</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="https://wa.me/5493884136752">+54 9 388-413-6752</a>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:shocindumentaria@gmail.com">shocindumentaria@gmail.com</a>
              </div>
            </div>
          </div>

          {/* Social & Legal */}
          <div>
            <h4 className="font-semibold font-montserrat mb-4">Síguenos</h4>
            <div className="flex gap-3 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-primary/20 hover:border-primary/30 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            <div className="space-y-2">
              {legalLinks.map((link) => (
                <div key={link.text}>
                  <a 
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <link.icon className="w-3 h-3" />
                    {link.text}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © {currentYear} SHOC. Todos los derechos reservados.
            </div>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <a href="/auth" className="hover:text-primary transition-colors">
                Admin Dashboard
              </a>
              <span>•</span>
              <span>Hecho con ❤️ en Argentina</span>
              <div className="w-1 h-1 bg-muted-foreground rounded-full" />
              <span>v1.0.0</span>
            </div>
          </div>
        </div>

        {/* Cookie Notice - Simple */}
        {/* <div className="mt-8 p-4 bg-card/50 border border-border rounded-xl backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              <strong>🍪 Cookies:</strong> Usamos cookies para mejorar tu experiencia. 
              Al continuar navegando, aceptás nuestro uso de cookies.
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors">
                Aceptar
              </button>
              <button className="px-3 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                Más info
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;