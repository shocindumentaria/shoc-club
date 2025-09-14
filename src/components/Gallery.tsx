import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Eye, Heart, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-shoc.jpg";
import dropBox from "@/assets/hero-grid2.png";
import eventSpace from "@/assets/event-space.jpg";
import accessories from "@/assets/accessories.jpg";

// --- (Opcional) Supabase: persistencia global
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

type Metrics = Record<number, { likes: number; views: number }>;

const Gallery = () => {
  const { toast } = useToast();

  const galleryItems = useMemo(() => ([
    { id: 1, image: dropBox,     title: "Drop Box Exclusivo", description: "Packaging premium para cada entrega mensual", category: "Packaging", featured: true },
    { id: 2, image: eventSpace,  title: "Hub Digital SHOC",   description: "Plataforma exclusiva con experiencias digitales", category: "Digital",   featured: false },
    { id: 3, image: accessories, title: "Accesorios Premium", description: "Colección de accesorios exclusivos", category: "Productos", featured: true },
    { id: 4, image: heroImage,   title: "Streetwear Premium", description: "Prendas de edición limitada", category: "Ropa", featured: false },
  ]), []);

  // Estado de métricas y likes locales (anti doble-like por navegador)
  const [metrics, setMetrics] = useState<Metrics>(() =>
    Object.fromEntries(galleryItems.map(i => [i.id, { likes: 0, views: 0 }]))
  );
  const [liked, setLiked] = useState<Record<number, boolean>>(() => {
    try {
      const raw = localStorage.getItem("shoc_liked_items");
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  });

  // Cargar métricas desde Supabase (si está configurado)
  useEffect(() => {
    const load = async () => {
      if (!supabase) return; // sin persistencia, queda local
      const ids = galleryItems.map(i => i.id);
      const { data, error } = await supabase
        .from("gallery_metrics")
        .select("item_id, likes, views")
        .in("item_id", ids);

      if (!error && data) {
        setMetrics(prev => {
          const next = { ...prev };
          data.forEach((row: any) => {
            next[row.item_id] = { likes: row.likes ?? 0, views: row.views ?? 0 };
          });
          return next;
        });
      }
    };
    load();
    // Opcional: realtime (si querés live updates)
    // const channel = supabase?.channel('realtime:gallery_metrics')
    // ...
  }, [galleryItems]);

  const persistLiked = (obj: Record<number, boolean>) => {
    setLiked(obj);
    try { localStorage.setItem("shoc_liked_items", JSON.stringify(obj)); } catch {}
  };

  const handleLike = async (itemId: number) => {
    // Evitar doble-like en este navegador
    if (liked[itemId]) {
      toast({ title: "Ya te gusta", description: "Ya registraste tu MG para este item." });
      return;
    }

    // Optimista UI
    setMetrics(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], likes: (prev[itemId]?.likes ?? 0) + 1 },
    }));
    persistLiked({ ...liked, [itemId]: true });

    // Persistir en Supabase si está disponible
    if (supabase) {
      const { error } = await supabase.rpc("increment_like", { p_item_id: itemId });
      if (error) {
        // revertir si falla
        setMetrics(prev => ({
          ...prev,
          [itemId]: { ...prev[itemId], likes: Math.max((prev[itemId]?.likes ?? 1) - 1, 0) },
        }));
        const nextLiked = { ...liked }; delete nextLiked[itemId]; persistLiked(nextLiked);
        toast({ title: "Error", description: "No pudimos registrar tu MG. Intenta de nuevo.", variant: "destructive" });
      }
    }
  };

  const handleView = async (itemId: number) => {
    // Sumamos una vista al hacer clic en “ver” (sólo optimista)
    setMetrics(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], views: (prev[itemId]?.views ?? 0) + 1 },
    }));
    if (supabase) {
      await supabase.rpc("increment_view", { p_item_id: itemId });
    }
  };

  const handleShare = async (itemId: number) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#item-${itemId}`;
    const item = galleryItems.find(i => i.id === itemId);

    try {
      if (navigator.share) {
        await navigator.share({
          title: item?.title ?? "SHOC",
          text: item?.description ?? "Mirá este drop de SHOC",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({ title: "Enlace copiado", description: "Link listo para pegar y compartir." });
      }
    } catch {
      await navigator.clipboard.writeText(shareUrl);
      toast({ title: "Enlace copiado", description: "Link listo para pegar y compartir." });
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-card/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="badge-limited mb-6">Preview</Badge>
          <h2 className="heading-section mb-6">
            Un vistazo a lo que <span className="text-primary"> te espera</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Cada drop es una experiencia cuidadosamente curada para sorprenderte.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {galleryItems.map((item, index) => (
            <Card
              key={item.id}
              id={`item-${item.id}`}
              className={`group relative overflow-hidden border-0 bg-gradient-to-br from-card to-secondary/10 hover:shadow-[var(--shadow-glow)] transition-all duration-500 animate-scale-in ${
                item.featured ? "lg:row-span-1" : ""
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
                    <Badge className="badge-exclusive">Exclusivo</Badge>
                  </div>
                )}

                {/* Hover Actions */}
                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {/* Ver */}
                  <button
                    onClick={() => handleView(item.id)}
                    className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-primary/20 hover:border-primary/30 transition-colors"
                    aria-label="Ver"
                    title="Ver"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* MG */}
                  <button
                    onClick={() => handleLike(item.id)}
                    className={`w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center transition-colors
                      ${liked[item.id] ? "bg-accent/30 border-accent/50" : "hover:bg-accent/20 hover:border-accent/30"}`}
                    aria-label="Me gusta"
                    title="Me gusta"
                  >
                    <Heart className={`w-4 h-4 ${liked[item.id] ? "fill-current" : ""}`} />
                  </button>

                  {/* Compartir */}
                  <button
                    onClick={() => handleShare(item.id)}
                    className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-secondary/40 hover:border-secondary transition-colors"
                    aria-label="Compartir"
                    title="Compartir"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Contadores visibles */}
                <div className="absolute bottom-4 left-4 flex gap-3">
                  <div className="px-2 py-1 rounded-full bg-card/80 backdrop-blur-sm border border-border text-xs flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {metrics[item.id]?.likes ?? 0}
                  </div>
                  <div className="px-2 py-1 rounded-full bg-card/80 backdrop-blur-sm border border-border text-xs flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {metrics[item.id]?.views ?? 0}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold font-montserrat mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-full">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm font-medium">Próximo drop: Septiembre 2025</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
