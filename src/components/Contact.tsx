import { motion } from "framer-motion";
import { Instagram, Mail, Handshake, Youtube } from "lucide-react";
import { fadeUp, scaleIn, staggerContainer, viewport, scrambleConfig } from "@/lib/motion";
import { useEffect, useState, useRef } from "react";

// ─── Scramble hook (same pattern as Hero) ─────────────────────────────────

function useScramble(text: string, active: boolean) {
  const [displayed, setDisplayed] = useState(text);

  useEffect(() => {
    if (!active) return;
    const { chars, cycles, interval, staggerMs } = scrambleConfig;
    const timers: ReturnType<typeof setTimeout>[] = [];

    text.split("").forEach((finalChar, charIdx) => {
      let count = 0;
      const start = setTimeout(() => {
        const tick = setInterval(() => {
          setDisplayed((prev) => {
            const arr = prev.split("");
            arr[charIdx] =
              count < cycles
                ? chars[Math.floor(Math.random() * chars.length)]
                : finalChar;
            return arr.join("");
          });
          count++;
          if (count > cycles) clearInterval(tick);
        }, interval);
        timers.push(tick as unknown as ReturnType<typeof setTimeout>);
      }, charIdx * staggerMs);
      timers.push(start);
    });

    return () => timers.forEach(clearTimeout);
  }, [active, text]);

  return displayed;
}

// ─── Scramble Headline ────────────────────────────────────────────────────

function ScrambleWord({ word }: { word: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(false);
  const displayed = useScramble(word, active);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { setActive(true); obs.disconnect(); }
      },
      { threshold: 0.8 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return <span ref={ref} className="text-gold italic">{displayed}</span>;
}

const links = [
  { href: "https://instagram.com/itzz_abbu", icon: Instagram, label: "@itzz_abbu", primary: true },
  { href: "https://youtube.com/@strglitz", icon: Youtube, label: "STR Glitz", primary: false },
  { href: "mailto:contact@strglitz.com", icon: Mail, label: "contact@strglitz.com", primary: false },
];

export function Contact() {
  return (
    <section id="contact" className="relative py-32">
      <div className="container mx-auto max-w-4xl px-6">
        <motion.div
          className="glass-card relative overflow-hidden rounded-3xl p-10 sm:p-16"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <motion.div
            className="absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative text-center">
            <motion.p variants={fadeUp} className="mb-3 text-xs uppercase tracking-[0.3em] text-primary">
              Let's Connect
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-display text-4xl font-bold sm:text-5xl lg:text-6xl"
            >
              Open for <ScrambleWord word="Collaborations" />
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto mt-5 max-w-xl text-muted-foreground">
              Brand partnerships, promotions, or just a hello — reach out through any of the channels below.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              {links.map(({ href, icon: Icon, label, primary }) => (
                <motion.a
                  key={href}
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noreferrer"
                  variants={scaleIn}
                  whileHover={{
                    scale: 1.07,
                    boxShadow: primary ? "0 0 30px oklch(0.82 0.14 78 / 40%)" : undefined,
                  }}
                  whileTap={{ scale: 0.96 }}
                  className={`inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-semibold transition-colors ${primary
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                      : "border border-border hover:border-primary hover:text-primary"
                    }`}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </motion.a>
              ))}
            </motion.div>

            <motion.div
              className="mt-12 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-xs uppercase tracking-wider text-primary"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <motion.span
                animate={{ rotate: [0, 15, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Handshake className="h-4 w-4" />
              </motion.span>
              Available for Brand Partnerships
            </motion.div>
          </div>
        </motion.div>

        <footer className="mt-16 text-center">
          <p className="font-display text-sm italic text-muted-foreground">
            "Make it simple. But significant."
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Abdullah · Strglitz. All rights reserved.
          </p>
        </footer>
      </div>
    </section>
  );
}
