import { useEffect, useRef } from "react";

interface CyberParticleBackgroundProps {
  primaryEmotion?: string;
  valence?: number;
}

export function CyberParticleBackground({
  primaryEmotion = "Neutral",
  valence = 0,
}: CyberParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle nodes array
    const nodeCount = Math.min(45, Math.floor(width / 35));
    const nodes: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      pulse: number;
      pulseSpeed: number;
    }[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 1.8 + 0.8,
        pulse: Math.random() * Math.PI,
        pulseSpeed: 0.02 + Math.random() * 0.03,
      });
    }

    // Color theme based on valence / emotion
    let baseR = 6;
    let baseG = 182;
    let baseB = 212; // Cyan

    if (primaryEmotion.includes("Joy") || valence > 0.4) {
      baseR = 16;
      baseG = 185;
      baseB = 129; // Emerald
    } else if (primaryEmotion.includes("Anger") || valence < -0.4) {
      baseR = 244;
      baseG = 63;
      baseB = 94; // Rose
    } else if (primaryEmotion.includes("Surprise") || primaryEmotion.includes("Astonishment")) {
      baseR = 56;
      baseG = 189;
      baseB = 248; // Sky Blue
    } else if (primaryEmotion.includes("Sadness")) {
      baseR = 245;
      baseG = 158;
      baseB = 11; // Amber
    }

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle moving horizontal telemetry grid lines
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = `rgba(${baseR}, ${baseG}, ${baseB}, 0.03)`;
      const gridSpacing = 40;
      const offset = (frame * 0.3) % gridSpacing;
      for (let y = offset; y < height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update and draw synaptic neural nodes
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentR = p.radius + Math.sin(p.pulse) * 0.6;
        ctx.fillStyle = `rgba(${baseR}, ${baseG}, ${baseB}, 0.55)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.4, currentR), 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby nodes with synaptic data threads
        for (let j = i + 1; j < nodes.length; j++) {
          const p2 = nodes[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 130;

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.18;
            ctx.strokeStyle = `rgba(${baseR}, ${baseG}, ${baseB}, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [primaryEmotion, valence]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-70"
    />
  );
}
