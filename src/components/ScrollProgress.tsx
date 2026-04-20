import { useScroll, useSpring, motion } from "framer-motion";

export function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 120,
        damping: 20,
        restDelta: 0.001,
    });

    return (
        <motion.div
            className="pointer-events-none fixed left-0 top-0 z-[9998] h-[2px] w-full origin-left"
            style={{
                scaleX,
                background: "oklch(0.82 0.14 78)",
                transformOrigin: "left",
            }}
        />
    );
}
