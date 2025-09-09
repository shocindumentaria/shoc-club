import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Eye, Heart, Share2 } from "lucide-react";
import heroImage from "@/assets/hero-shoc.jpg";
import dropBox from "@/assets/drop-box.jpg";
import eventSpace from "@/assets/event-space.jpg";
import accessories from "@/assets/accessories.jpg";

const Gallery = () => {
  const galleryItems = [
    {
      id: 1,
      image: dropBox,
      title: "Drop Box Exclusivo",
      description: "Packaging premium para cada entrega mensual",
      category: "Packaging",
      featured: true,
    },
    {
      id: 2,
      image: eventSpace,
      title: "Hub Digital SHOC",
      description: "Plataforma exclusiva con experiencias digitales",
      category: "Digital",
      featured: false,
    },
    {
      id: 3,
      image: accessories,
      title: "Accesorios Premium",
      description: "Colección de accesorios exclusivos",
      category: "Productos",
      featured: true,
    },
    {
      id: 4,
      image: heroImage,
      title: "Streetwear Premium",
      description: "Prendas de edición limitada",
      category: "Ropa",
      featured: false,
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-card/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="badge-limited mb-6">Preview</Badge>
          <h2 className="heading-section mb-6">
            Un vistazo a lo que
            <span className="text-primary"> te espera</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Cada drop es una experiencia cuidadosamente curada para sorprenderte.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {galleryItems.map((item, index) => (
            <Card 
              key={item.id}
              className={`group relative overflow-hidden border-0 bg-gradient-to-br from-card to-secondary/10 hover:shadow-[var(--shadow-glow)] transition-all duration-500 animate-scale-in ${
                item.featured ? 'lg:row-span-1' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-card/80 backdrop-blur-sm text-foreground border-border">
                    {item.category}
                  </Badge>
                </div>

                {/* Featured Badge */}
                {item.featured && (
                  <div className="absolute top-4 right-4">
                    <Badge className="badge-exclusive">
                      Exclusivo
                    </Badge>
                  </div>
                )}

                {/* Hover Actions */}
                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-primary/20 hover:border-primary/30 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-accent/20 hover:border-accent/30 transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-secondary/40 hover:border-secondary transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold font-montserrat mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-full">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm font-medium">Próximo drop: Febrero 2025</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;