import { motion } from "framer-motion";
import { TrendingUp, Award, Users, Briefcase } from "lucide-react";
import { fadeUp, scaleIn, staggerContainer, viewport } from "@/lib/motion";
import { useState } from "react";

const items = [
  { icon: TrendingUp, title: "Viral Growth", text: "Multiple viral Instagram videos in 2024 reaching millions of viewers." },
  { icon: Users, title: "Engaged Community", text: "A loyal audience growing daily across reels, stories, and collaborations." },
  { icon: Award, title: "Multi-Genre Creator", text: "Recognized for versatility across acting, comedy, music, and humanity content." },
  { icon: Briefcase, title: "Fashion Entrepreneur", text: "Founder of VAT's — building two successful clothing brands in under a year." },
];

const orbitKeyframes = {
  x: [0, 3, 0, -3, 0],
  y: [0, -3, 0, 3, 0],
};

export function Achievements() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section id="achievements" className="relative py-32">
      <div className="container mx-auto px-6">
        <motion.div
          className="mb-16 text-center"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-primary">Highlights</p>
          <h2 className="font-display text-4xl font-bold sm:text-5xl lg:text-6xl">
            <span className="text-gold italic">Achievements</span>
          </h2>
        </motion.div>

        <motion.div
          className="grid gap-4 sm:grid-cols-2"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {items.map((item, i) => {
            const Icon = item.icon;
            const isHovered = hoveredIdx === i;

            return (
              <motion.div
                key={item.title}
                variants={scaleIn}
                whileHover={{
                  y: -4,
                  borderColor: "oklch(0.82 0.14 78 / 50%)",
                  backgroundColor: "oklch(0.18 0.012 60 / 70%)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onHoverStart={() => setHoveredIdx(i)}
                onHoverEnd={() => setHoveredIdx(null)}
                className="group flex cursor-default gap-5 rounded-2xl border border-border/60 bg-card/40 p-6"
              >
                {/* Orbit animation on hover */}
                <motion.div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
                  animate={isHovered ? orbitKeyframes : { x: 0, y: 0 }}
                  transition={
                    isHovered
                      ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
                      : { duration: 0.3 }
                  }
                >
                  <Icon className="h-6 w-6" />
                </motion.div>

                <div>
                  <h3 className="font-display text-xl font-bold">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
