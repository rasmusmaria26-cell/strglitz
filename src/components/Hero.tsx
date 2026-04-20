import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import heroPortrait from "@/assets/hero-portrait.jpg";

import { Instagram, ArrowDown } from "lucide-react";
import {
  fadeUp,
  fadeRight,
  staggerContainer,
  viewport,
  scrambleConfig,
} from "@/lib/motion";
import { useEffect, useRef, useState, useCallback } from "react";

// ─── Scramble Hook ──────────────────────────────────────────────────────────

function useScramble(text: string, active: boolean) {
  const [displayed, setDisplayed] = useState(text);

  useEffect(() => {
    if (!active) return;
    const chars = scrambleConfig.chars;
    const cycle = scrambleConfig.cycles;
    const interval = scrambleConfig.interval;
    const stagger = scrambleConfig.staggerMs;

    const timers: ReturnType<typeof setTimeout>[] = [];

    text.split("").forEach((finalChar, charIdx) => {
      let count = 0;
      const start = setTimeout(() => {
        const tick = setInterval(() => {
          setDisplayed((prev) => {
            const arr = prev.split("");
            arr[charIdx] =
              count < cycle
                ? chars[Math.floor(Math.random() * chars.length)]
                : finalChar;
            return arr.join("");
          });
          count++;
          if (count > cycle) clearInterval(tick);
        }, interval);
        timers.push(tick as unknown as ReturnType<typeof setTimeout>);
      }, charIdx * stagger);
      timers.push(start);
    });

    return () => timers.forEach(clearTimeout);
  }, [active, text]);

  return displayed;
}

// ─── Magnetic Button ────────────────────────────────────────────────────────

function MagneticButton({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 150, damping: 15 });
  const y = useSpring(rawY, { stiffness: 150, damping: 15 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = Math.max(-10, Math.min(10, e.clientX - cx));
    const dy = Math.max(-10, Math.min(10, e.clientY - cy));
    rawX.set(dx);
    rawY.set(dy);
  }, [rawX, rawY]);

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noreferrer"
      className={className}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.a>
  );
}

// ─── Stat Counter ────────────────────────────────────────────────────────────

function useCountUp(target: number, active: boolean, duration = 1600) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let frame = 0;
    const totalFrames = Math.round(duration / 16);
    const timer = setInterval(() => {
      frame++;
      setCount(Math.round(target * (frame / totalFrames)));
      if (frame === totalFrames) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return count;
}

function Stat({ val, suffix = "", label }: { val: number | string; suffix?: string; label: string }) {
  const [triggered, setTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCountUp(typeof val === "number" ? val : 0, triggered);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTriggered(true); obs.disconnect(); } },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <div className="font-display text-3xl font-bold text-gold">
        {typeof val === "number" ? `${count}${suffix}` : val}
      </div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

// ─── Orbs ───────────────────────────────────────────────────────────────────

const orbs = [
  { size: 240, top: "2%", left: "-5%", color: "oklch(0.82 0.14 78 / 12%)", dur: 10, delay: 0 },
  { size: 200, bottom: "5%", right: "-5%", color: "oklch(0.78 0.15 70 / 10%)", dur: 14, delay: 3 },
  { size: 180, top: "30%", left: "60%", color: "oklch(0.82 0.14 78 / 8%)", dur: 8, delay: 6 },
];

// ─── Hero ────────────────────────────────────────────────────────────────────

export function Hero() {
  const { scrollY } = useScroll();
  const portraitY = useTransform(scrollY, [0, 500], [0, -60]);
  const orbY = useTransform(scrollY, [0, 500], [0, -30]);

  const [scrambleActive, setScrambleActive] = useState(false);
  const displayedTitle = useScramble("Strglitz", scrambleActive);

  // Trigger scramble after stagger intro completes (~0.8s)
  useEffect(() => {
    const t = setTimeout(() => setScrambleActive(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden pt-24">
      {/* Orbs with parallax */}
      <motion.div style={{ y: orbY }} className="pointer-events-none absolute inset-0">
        {orbs.map((o, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              width: o.size, height: o.size,
              background: o.color,
              top: o.top, left: o.left,
              bottom: (o as any).bottom, right: (o as any).right,
            }}
            animate={{ scale: [1, 1.15, 0.92, 1], x: [0, 20, -15, 0], y: [0, -20, 15, 0] }}
            transition={{ duration: o.dur, delay: o.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent" />


      <div className="container relative mx-auto grid items-center gap-12 px-6 lg:grid-cols-2">
        {/* Text block */}
        <motion.div
          className="order-2 lg:order-1"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.p variants={fadeUp}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-primary"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            Digital Creator
          </motion.p>

          {/* H1 with scramble */}
          <motion.h1
            variants={fadeUp}
            className="font-display text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl xl:text-8xl"
          >
            Abdullah
            <br />
            <span className="text-gold italic">{displayedTitle}</span>
          </motion.h1>

          <motion.p variants={fadeUp}
            className="mt-6 max-w-md font-display text-xl italic text-muted-foreground sm:text-2xl"
          >
            "Make it simple. But significant."
          </motion.p>

          <motion.p variants={fadeUp}
            className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground"
          >
            Influencer &amp; storyteller crafting viral moments through acting,
            comedy, music, and meaningful content.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-4">
            {/* Magnetic Instagram CTA */}
            <MagneticButton
              href="https://instagram.com/itzz_abbu"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-primary-foreground"
            >
              <Instagram className="h-4 w-4" />
              Follow on Instagram
            </MagneticButton>

            <motion.a
              href="#about"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground"
              whileHover={{ scale: 1.04, borderColor: "var(--color-primary)" }}
              whileTap={{ scale: 0.97 }}
            >
              Discover More
              <ArrowDown className="h-4 w-4" />
            </motion.a>
          </motion.div>

          <motion.div variants={fadeUp}
            className="mt-12 flex items-center gap-8 border-t border-border/50 pt-8"
          >
            <Stat val={5} suffix="+" label="Content Genres" />
            <div className="h-10 w-px bg-border" />
            <Stat val={2} label="Brands Launched" />
            <div className="h-10 w-px bg-border" />
            <Stat val="∞" label="Stories Told" />
          </motion.div>
        </motion.div>

        {/* Portrait with scroll parallax */}
        <motion.div
          className="order-1 lg:order-2"
          variants={fadeRight}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          style={{ y: portraitY }}
        >
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
            <motion.div
              className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/30 via-transparent to-accent/20 blur-2xl"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative h-full w-full overflow-hidden rounded-3xl border border-primary/20 shadow-[var(--shadow-cinematic)]">
              <motion.img
                src={heroPortrait}
                alt="Abdullah — Strglitz portrait"
                className="h-full w-full object-cover"
                width={1024} height={1280}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 glass-card rounded-2xl p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-primary">@itzz_abbu</p>
                <p className="mt-1 font-display text-lg">Cinematic Creator</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
