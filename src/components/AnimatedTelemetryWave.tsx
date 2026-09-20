import { useEffect, useRef } from "react";

interface AnimatedTelemetryWaveProps {
  arousal?: number;
  valence?: number;
  primaryEmotion?: string;
}

export function AnimatedTelemetryWave({
  arousal = 0.2,
  valence = 0.1,
  primaryEmotion = "Neutral",
}: AnimatedTelemetryWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.04;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Color choice
      let strokeColor = "#06b6d4"; // cyan
      if (primaryEmotion.includes("Joy") || valence > 0.3) {
        strokeColor = "#10b981"; // emerald
      } else if (primaryEmotion.includes("Anger") || valence < -0.3) {
        strokeColor = "#f43f5e"; // rose
      } else if (primaryEmotion.includes("Surprise")) {
        strokeColor = "#38bdf8"; // sky
      }

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();

      const centerY = h / 2;
      const speed = 1 + Math.max(0, arousal) * 2;
      const amp = 6 + Math.abs(arousal) * 10;

      for (let x = 0; x < w; x++) {
        // Biometric rhythm + harmonic wave
        const wave1 = Math.sin(x * 0.05 + t * speed);
        const wave2 = Math.sin(x * 0.12 - t * 0.8) * 0.5;
        // Simulated heartbeat pulse spike every ~80px
        const pulseCycle = (x + t * 40) % 120;
        let spike = 0;
        if (pulseCycle > 55 && pulseCycle < 65) {
          spike = Math.sin((pulseCycle - 55) * Math.PI * 0.1) * (amp * 1.6);
        }

        const y = centerY + (wave1 + wave2) * amp - spike;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();

      // Glowing dot at the leading head of the wave
      const leadX = (t * 40) % w;
      const leadY = centerY + Math.sin(leadX * 0.05 + t * speed) * amp;
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = strokeColor;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(leadX, leadY, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [arousal, valence, primaryEmotion]);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-cyan-900/40">
      <span className="text-[10px] font-mono-code text-cyan-400 font-bold uppercase tracking-wider shrink-0 hidden sm:inline">
        NEURAL FLUX:
      </span>
      <canvas ref={canvasRef} width={140} height={24} className="w-[110px] sm:w-[140px] h-[22px]" />
    </div>
  );
}
