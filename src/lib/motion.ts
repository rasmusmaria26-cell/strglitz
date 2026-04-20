import { Variants } from "framer-motion";

// ─── Entry Variants ────────────────────────────────────────────────────────

export const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
};

export const fadeLeft: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
};

export const fadeRight: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
};

export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
    },
};

// ─── Stagger Containers ────────────────────────────────────────────────────

export const staggerContainer: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.05,
        },
    },
};

export const staggerContainerFast: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.07,
            delayChildren: 0.05,
        },
    },
};

// ─── NEW — Clip-path wipe (bottom-to-top reveal) ───────────────────────────

export const clipWipe: Variants = {
    hidden: { clipPath: "inset(100% 0 0 0)", opacity: 0 },
    visible: {
        clipPath: "inset(0% 0 0 0)",
        opacity: 1,
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    },
};

// ─── NEW — 3D rotateY flips ────────────────────────────────────────────────

export const flipLeft: Variants = {
    hidden: { rotateY: -90, opacity: 0 },
    visible: {
        rotateY: 0,
        opacity: 1,
        transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
    },
};

export const flipRight: Variants = {
    hidden: { rotateY: 90, opacity: 0 },
    visible: {
        rotateY: 0,
        opacity: 1,
        transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
    },
};

// ─── NEW — Scramble config ─────────────────────────────────────────────────

export const scrambleConfig = {
    chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    interval: 40,   // ms between each glyph swap
    staggerMs: 60,  // ms delay per character index
    cycles: 6,      // how many random glyphs before settling
} as const;

// ─── Viewport ─────────────────────────────────────────────────────────────

/** Common viewport config — fires once when 15 % of element is visible */
export const viewport = { once: true, amount: 0.15 } as const;
