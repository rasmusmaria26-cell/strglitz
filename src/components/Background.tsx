import { useEffect, useRef } from "react";

interface Blob {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
    hue: number;      // base hue in oklch-equivalent degrees
    brightness: number;
}

function createBlob(w: number, h: number): Blob {
    const hues = [72, 68, 78, 62]; // gold family
    return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: w * (0.22 + Math.random() * 0.18),
        hue: hues[Math.floor(Math.random() * hues.length)],
        brightness: 0.06 + Math.random() * 0.07,
    };
}

export function Background() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let w = 0;
        let h = 0;

        const resize = () => {
            w = canvas.width = window.innerWidth;
            // Use the document height so background covers below the fold too
            h = canvas.height = Math.max(
                document.documentElement.scrollHeight,
                window.innerHeight,
            );
        };
        resize();
        window.addEventListener("resize", resize);

        // 6 slowly drifting gold blobs
        const blobs: Blob[] = Array.from({ length: 6 }, () => createBlob(w, h));

        let raf: number;
        let frame = 0;

        const draw = () => {
            frame++;
            // Very dark base — near-black
            ctx.fillStyle = "oklch(0.10 0.008 60)";
            ctx.fillRect(0, 0, w, h);

            // Soft radial blobs composited with "lighter" for glow
            ctx.save();
            ctx.globalCompositeOperation = "lighter";

            blobs.forEach((b) => {
                // Slow sine drift so motion feels organic, not jittery
                b.x += b.vx + Math.sin(frame * 0.003 + b.hue) * 0.15;
                b.y += b.vy + Math.cos(frame * 0.004 + b.hue) * 0.15;

                // Wrap around canvas
                if (b.x < -b.r) b.x = w + b.r;
                if (b.x > w + b.r) b.x = -b.r;
                if (b.y < -b.r) b.y = h + b.r;
                if (b.y > h + b.r) b.y = -b.r;

                const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
                const alpha = b.brightness;
                // Gold-warm colour expressed as rgba approximation of oklch(0.82 0.14 78)
                grad.addColorStop(0, `rgba(220, 165, 40, ${alpha})`);
                grad.addColorStop(0.5, `rgba(200, 140, 20, ${alpha * 0.5})`);
                grad.addColorStop(1, `rgba(0, 0, 0, 0)`);

                ctx.beginPath();
                ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();
            });

            ctx.restore();

            // Film grain overlay — subtle noise flicker each frame
            const grain = ctx.createImageData(w, h);
            const grainData = grain.data;
            for (let i = 0; i < grainData.length; i += 4) {
                const v = (Math.random() * 20) | 0;
                grainData[i] = grainData[i + 1] = grainData[i + 2] = v;
                grainData[i + 3] = 8; // very faint
            }
            ctx.putImageData(grain, 0, 0);

            // Dot grid overlay
            ctx.save();
            ctx.globalAlpha = 0.08;
            ctx.fillStyle = "rgba(220, 165, 40, 1)";
            const spacing = 60;
            for (let gx = 0; gx < w; gx += spacing) {
                for (let gy = 0; gy < h; gy += spacing) {
                    ctx.beginPath();
                    ctx.arc(gx, gy, 0.8, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            ctx.restore();

            raf = requestAnimationFrame(draw);
        };

        draw();

        // Re-run resize after fonts/content settle to pick up full page height
        const lateResize = setTimeout(resize, 800);

        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(lateResize);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none fixed inset-0 z-0"
            style={{ opacity: 1 }}
            aria-hidden
        />
    );
}
