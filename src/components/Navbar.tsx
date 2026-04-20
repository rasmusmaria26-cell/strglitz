import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#about", label: "About" },
  { href: "#content", label: "Content" },
  { href: "#reels", label: "Reels" },
  { href: "#business", label: "Business" },
  { href: "#contact", label: "Contact" },
];

const sectionIds = ["about", "content", "reels", "business", "contact"];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // ── Scroll collapse ───────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Active section via IntersectionObserver ───────────────────────────
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.4 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 flex justify-center transition-all duration-500 ${scrolled ? "py-4" : "py-6"
          }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className={`flex w-full items-center justify-between px-6 transition-all duration-500 ${scrolled ? "glass-card mx-4 max-w-5xl rounded-full py-2.5" : "container mx-auto"
            }`}
        >
          {/* Logo */}
          <a href="#top" className="font-display text-xl font-bold tracking-wider">
            <motion.span
              className="text-gold"
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              STRGLITZ
            </motion.span>
          </a>

          {/* Desktop nav with sliding pill */}
          <nav className="relative hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const isActive = activeSection === l.href.slice(1);
              return (
                <a
                  key={l.href}
                  href={l.href}
                  className="relative px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "oklch(0.82 0.14 78 / 12%)",
                        border: "1px solid oklch(0.82 0.14 78 / 30%)",
                      }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{l.label}</span>
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <motion.a
              href="https://instagram.com/itzz_abbu"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
            >
              Follow
            </motion.a>

            {/* Hamburger */}
            <motion.button
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground md:hidden"
              onClick={() => setOpen((o) => !o)}
              whileTap={{ scale: 0.88 }}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? "x" : "menu"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-10 bg-background/95 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {links.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-display text-4xl font-bold text-foreground"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
                whileHover={{ x: 10, color: "oklch(0.82 0.14 78)" }}
              >
                {l.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
