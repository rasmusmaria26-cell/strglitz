import { motion } from "framer-motion";
import { Drama, Laugh, Music, Sparkles, Heart } from "lucide-react";
import { fadeUp, scaleIn, staggerContainer, viewport } from "@/lib/motion";
import { useRef } from "react";

const categories = [
  { icon: Drama, title: "Acting", desc: "Short-form performances showcasing emotions, storytelling, and character roles." },
  { icon: Laugh, title: "Spot Comedy", desc: "Relatable and spontaneous humor that resonates with everyday life." },
  { icon: Music, title: "Singing", desc: "Expressive musical content connecting with audience emotions." },
  { icon: Sparkles, title: "Prank Videos", desc: "Light-hearted entertainment with creative twists and surprises." },
  { icon: Heart, title: "Humanity", desc: "Videos that inspire kindness, awareness, and social responsibility." },
];

function SpotlightCard({ cat }: { cat: typeof categories[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = cat.icon;

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--mx", `${mx}%`);
    el.style.setProperty("--my", `${my}%`);
    el.style.setProperty("--spotlight-opacity", "1");
  };

  const handleLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "50%");
    el.style.setProperty("--spotlight-opacity", "0");
  };

  return (
    <motion.div
      ref={cardRef}
      variants={scaleIn}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="group relative cursor-default overflow-hidden rounded-3xl p-8"
      style={
        {
          "--mx": "50%",
          "--my": "50%",
          "--spotlight-opacity": "0",
          background:
            "linear-gradient(oklch(0.16 0.012 60 / 80%), oklch(0.16 0.012 60 / 80%))",
          border: "1px solid oklch(0.3 0.01 60 / 60%)",
        } as React.CSSProperties
      }
    >
      {/* Spotlight layer */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-400"
        style={{
          background:
            "radial-gradient(circle 180px at var(--mx) var(--my), oklch(0.82 0.14 78 / 10%), transparent)",
          opacity: "var(--spotlight-opacity)" as any,
          transition: "opacity 0.4s",
        }}
      />

      <div className="relative">
        <motion.div
          className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 text-primary"
          whileHover={{ rotate: 8, scale: 1.15 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Icon className="h-7 w-7" />
        </motion.div>
        <h3 className="font-display text-2xl font-bold">{cat.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{cat.desc}</p>
      </div>
    </motion.div>
  );
}

export function Categories() {
  return (
    <section id="content" className="relative py-32">
      <div className="container mx-auto px-6">
        <motion.div
          className="mb-16 text-center"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-primary">What I Create</p>
          <h2 className="font-display text-4xl font-bold sm:text-5xl lg:text-6xl">
            Content <span className="text-gold italic">Categories</span>
          </h2>
        </motion.div>

        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {categories.map((cat) => (
            <SpotlightCard key={cat.title} cat={cat} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
