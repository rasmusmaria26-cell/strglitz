import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function Intro() {
    const [visible, setVisible] = useState(false);
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        if (!sessionStorage.getItem("intro_seen")) {
            setVisible(true);
            const hold = setTimeout(() => setExiting(true), 1400);
            return () => clearTimeout(hold);
        }
    }, []);

    const easing: [number, number, number, number] = [0.76, 0, 0.24, 1];

    return (
        <AnimatePresence>
            {visible && (
                <>
                    {/* Top half */}
                    <motion.div
                        key="intro-top"
                        className="pointer-events-none fixed inset-x-0 top-0 z-[9999] flex items-end justify-center"
                        style={{ height: "50vh", background: "oklch(0.12 0.01 60)" }}
                        animate={exiting ? { y: "-100%" } : { y: 0 }}
                        transition={exiting ? { duration: 0.7, ease: easing } : { duration: 0 }}
                        onAnimationComplete={() => {
                            if (exiting) {
                                setVisible(false);
                                sessionStorage.setItem("intro_seen", "true");
                            }
                        }}
                    >
                        <div className="pb-0 text-center">
                            <p
                                className="font-display text-[clamp(3rem,10vw,7rem)] font-bold leading-none text-gold"
                                style={{ letterSpacing: "0.18em" }}
                            >
                                STRGLITZ
                            </p>
                            {/* Gold line fades in after 0.4s */}
                            <motion.div
                                className="mx-auto mt-3"
                                style={{
                                    width: 120,
                                    height: 1,
                                    background: "oklch(0.82 0.14 78)",
                                }}
                                initial={{ opacity: 0, scaleX: 0 }}
                                animate={{ opacity: 1, scaleX: 1 }}
                                transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
                            />
                        </div>
                    </motion.div>

                    {/* Bottom half */}
                    <motion.div
                        key="intro-bottom"
                        className="pointer-events-none fixed inset-x-0 bottom-0 z-[9999]"
                        style={{ height: "50vh", background: "oklch(0.12 0.01 60)" }}
                        animate={exiting ? { y: "100%" } : { y: 0 }}
                        transition={exiting ? { duration: 0.7, ease: easing } : { duration: 0 }}
                    />
                </>
            )}
        </AnimatePresence>
    );
}
