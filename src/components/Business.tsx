import { motion } from "framer-motion";
import { Crown, Shirt } from "lucide-react";
import { flipLeft, flipRight, fadeUp, viewport } from "@/lib/motion";

export function Business() {
  return (
    <section id="business" className="relative py-32">
      <div className="container mx-auto px-6">
        <motion.div
          className="mb-16 text-center"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-primary">Entrepreneurial Journey</p>
          <h2 className="font-display text-4xl font-bold sm:text-5xl lg:text-6xl">
            Building <span className="text-gold italic">VAT's</span>
          </h2>
        </motion.div>

        {/* Perspective wrapper for 3D flip depth */}
        <div style={{ perspective: "1200px" }} className="grid gap-6 lg:grid-cols-2">
          {/* VAT's Men Wear – flip from left */}
          <motion.div
            className="group glass-card relative overflow-hidden rounded-3xl p-10"
            variants={flipLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            style={{ transformOrigin: "right center" }}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
          >
            <motion.div
              className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative">
              <div className="flex items-center justify-between">
                <Shirt className="h-10 w-10 text-primary" />
                <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Live</span>
              </div>
              <h3 className="mt-6 font-display text-3xl font-bold sm:text-4xl">VAT's Men Wear</h3>
              <p className="mt-2 text-sm uppercase tracking-wider text-muted-foreground">Launched 2024</p>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                A modern menswear label crafted for the bold and confident.
                Premium fabrics, sharp silhouettes, and pieces that feel as good as they look.
              </p>
              <div className="mt-8 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              <p className="mt-6 font-display italic text-gold">"Style that speaks before you do."</p>
            </div>
          </motion.div>

          {/* VAT's Queen – flip from right */}
          <motion.div
            className="group glass-card relative overflow-hidden rounded-3xl p-10"
            variants={flipRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            style={{ transformOrigin: "left center" }}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
          >
            <motion.div
              className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/15 blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <div className="relative">
              <div className="flex items-center justify-between">
                <Crown className="h-10 w-10 text-accent" />
                <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">Coming Soon</span>
              </div>
              <h3 className="mt-6 font-display text-3xl font-bold sm:text-4xl">VAT's Queen</h3>
              <p className="mt-2 text-sm uppercase tracking-wider text-muted-foreground">Launching Soon</p>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                A celebration of feminine power and elegance. The next chapter
                of the VAT's family — designed for queens who own every room they walk into.
              </p>
              <div className="mt-8 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
              <p className="mt-6 font-display italic text-gold">"Every woman deserves a crown."</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
