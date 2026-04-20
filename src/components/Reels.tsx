import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { clipWipe, staggerContainerFast, fadeUp, viewport } from "@/lib/motion";

const reels = [
  { tag: "Acting", id: "mZkXKke6DX4", href: "https://youtube.com/shorts/mZkXKke6DX4" },
  { tag: "Lifestyle", id: "VbGao1d8ATE", href: "https://youtube.com/shorts/VbGao1d8ATE" },
  { tag: "Prank", id: "PUCykOaByCg", href: "https://youtube.com/shorts/PUCykOaByCg" },
  { tag: "Comedy", id: "ipJ2GkMESmM", href: "https://youtube.com/shorts/ipJ2GkMESmM" },
  { tag: "Singing", id: "YJv8jGHQ0hA", href: "https://youtube.com/shorts/YJv8jGHQ0hA" },
  { tag: "Humanity", id: "yLxAwuO_QV8", href: "https://youtube.com/shorts/yLxAwuO_QV8" },
];

// ─── 3D tilt card ───────────────────────────────────────────────────────────

function TiltCard({ reel }: { reel: typeof reels[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const glossX = useMotionValue(50);
  const glossY = useMotionValue(50);

  const rotateX = useSpring(useTransform(rawY, [-1, 1], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(rawX, [-1, 1], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;  // -1 … 1
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    rawX.set(nx);
    rawY.set(ny);
    glossX.set(((e.clientX - rect.left) / rect.width) * 100);
    glossY.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  const handleLeave = () => {
    rawX.set(0);
    rawY.set(0);
    glossX.set(50);
    glossY.set(50);
  };

  return (
    <motion.div
      ref={cardRef}
      variants={clipWipe}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card"
    >
      {/* Tag */}
      <div className="absolute left-3 top-3 z-10 rounded-full bg-background/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground backdrop-blur-md">
        {reel.tag}
      </div>

      {/* Gloss overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 rounded-2xl"
        style={{
          background: useTransform(
            [glossX, glossY],
            ([x, y]) =>
              `radial-gradient(circle 140px at ${x}% ${y}%, oklch(1 0 0 / 6%), transparent)`,
          ),
        }}
      />

      {/* YouTube embed */}
      <div className="aspect-[9/16] w-full">
        <iframe
          src={`https://www.youtube.com/embed/${reel.id}?rel=0&modestbranding=1`}
          title={`${reel.tag} short`}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>

      {/* Watch link */}
      <motion.a
        href={reel.href}
        target="_blank"
        rel="noreferrer"
        className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-1.5 bg-gradient-to-t from-background/90 to-transparent px-3 py-4 text-xs font-semibold text-primary"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      >
        Open on YouTube ↗
      </motion.a>
    </motion.div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────

export function Reels() {
  return (
    <section id="reels" className="relative py-32">
      <div className="container mx-auto px-6">
        <motion.div
          className="mb-16 flex flex-col items-end justify-between gap-4 md:flex-row"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-primary">Follow My Journey</p>
            <h2 className="font-display text-4xl font-bold sm:text-5xl lg:text-6xl">
              Viral <span className="text-gold italic">Shorts</span>
            </h2>
            <p className="mt-3 max-w-md text-muted-foreground">
              Real moments, real reactions — watch the content that connects.
            </p>
          </div>
          <motion.a
            href="https://youtube.com/@strglitz"
            target="_blank" rel="noreferrer"
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
            whileHover={{ x: 4 }}
          >
            View all on YouTube →
          </motion.a>
        </motion.div>

        {/* Clip-wipe stagger grid */}
        <motion.div
          className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3"
          variants={staggerContainerFast}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {reels.map((reel) => (
            <TiltCard key={reel.id} reel={reel} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
