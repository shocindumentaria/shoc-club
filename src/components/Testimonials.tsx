import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Martín Rodriguez",
      location: "Jujuy, Argentina",
      rating: 5,
      comment: "La calidad de las prendas es increíble. Cada drop me sorprende más, definitivamente vale cada peso invertido.",
      avatar: "MR",
      verified: true,
    },
    {
      id: 3,
      name: "Diego Morales",
      location: "Tucumán, Argentina",
      rating: 5,
      comment: "Soy miembro desde el beta y no puedo estar más contento. El servicio al cliente es excelente y siempre innovan.",
      avatar: "DM",
      verified: true,
    },
    {
      id: 4,
      name: "Camila Torres",
      location: "Jujuy, Argentina",
      rating: 5,
      comment: "Las sorpresas mensuales siempre me emocionan. Es como recibir un regalo de cumpleaños cada mes.",
      avatar: "CT",
      verified: false,
    },
  ];

  const stats = [
    { number: "80+", label: "En lista de espera" },
    { number: "4.9", label: "Calificación promedio" },
    { number: "98%", label: "Satisfacción" },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-card/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="badge-exclusive mb-6">Testimonios</Badge>
          <h2 className="heading-section mb-6">
            Lo que dice nuestra
            <span className="text-primary"> comunidad</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Más de 250 personas ya confían en SHOC para sus experiencias exclusivas.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-16">
          {stats.map((stat, index) => (
            <div 
              key={stat.label} 
              className="text-center animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-3xl md:text-4xl font-bold font-montserrat text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.slice(0, 5).map((testimonial, index) => (
            <Card 
              key={testimonial.id}
              className="card-premium relative animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-20">
                <Quote className="w-8 h-8 text-primary" />
              </div>

              <div className="relative">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center font-semibold text-sm font-montserrat">
                    {testimonial.avatar}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm">{testimonial.name}</h4>
                      {testimonial.verified && (
                        <div className="w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                          <div className="w-2 h-2 bg-background rounded-full" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  "{testimonial.comment}"
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full text-sm">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span>
              <strong>4.9/5</strong> • Basado en +150 reseñas verificadas
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;