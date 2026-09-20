import { motion } from "motion/react";
import { Compass, Sparkles } from "lucide-react";

interface CircumplexPlotProps {
  valence: number; // -1 to 1
  arousal: number; // -1 to 1
  primaryEmotion: string;
}

export function CircumplexPlot({ valence, arousal, primaryEmotion }: CircumplexPlotProps) {
  // Clamp between -1 and 1
  const clampedValence = Math.max(-1, Math.min(1, valence));
  const clampedArousal = Math.max(-1, Math.min(1, arousal));

  // Convert -1..1 to percentage coordinates (0% to 100%)
  // Note: arousal +1 is top (y = 0%), -1 is bottom (y = 100%)
  const posX = ((clampedValence + 1) / 2) * 100;
  const posY = ((1 - clampedArousal) / 2) * 100;

  // Determine quadrant
  let quadrantLabel = "Equilibrium / Neutral";
  let quadrantColor = "text-cyan-400";
  if (clampedValence >= 0 && clampedArousal >= 0) {
    quadrantLabel = "Q1: High Energy Positive (Joy / Elation)";
    quadrantColor = "text-emerald-400";
  } else if (clampedValence < 0 && clampedArousal >= 0) {
    quadrantLabel = "Q2: High Energy Negative (Tension / Anger)";
    quadrantColor = "text-rose-400";
  } else if (clampedValence < 0 && clampedArousal < 0) {
    quadrantLabel = "Q3: Low Energy Negative (Melancholy / Fatigue)";
    quadrantColor = "text-amber-400";
  } else {
    quadrantLabel = "Q4: Low Energy Positive (Serenity / Calm)";
    quadrantColor = "text-teal-400";
  }

  return (
    <div className="w-full bg-slate-900/80 border border-cyan-900/50 rounded-2xl p-4 backdrop-blur-md shadow-xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-cyan-950/80 mb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          <h3 className="font-tech text-sm tracking-wider uppercase text-cyan-200 font-bold">
            Russell's Affective Circumplex (2D)
          </h3>
        </div>
        <span className="text-[10px] font-mono-code text-slate-400">
          VALENCE vs AROUSAL
        </span>
      </div>

      {/* 2D Coordinate Canvas Box */}
      <div className="relative w-full aspect-square max-w-[340px] mx-auto bg-slate-950/90 rounded-xl border border-cyan-900/60 p-4 overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 cyber-grid-dense opacity-20 pointer-events-none" />

        {/* Concentric Polar Circles */}
        <div className="absolute inset-6 rounded-full border border-cyan-500/10 pointer-events-none" />
        <div className="absolute inset-16 rounded-full border border-cyan-500/15 pointer-events-none" />
        <div className="absolute inset-26 rounded-full border border-cyan-500/20 pointer-events-none" />

        {/* X and Y Axes */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-cyan-500/40" />
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-cyan-500/40" />

        {/* Axis Labels */}
        <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-mono-code text-cyan-400 font-bold bg-slate-950/80 px-1.5 py-0.5 rounded border border-cyan-900/50">
          + AROUSAL (ACTIVATION)
        </span>
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono-code text-slate-500 bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800">
          - DEACTIVATION (CALM)
        </span>
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-mono-code text-rose-400/90 bg-slate-950/80 px-1.5 py-0.5 rounded border border-rose-950">
          - DISPLEASURE
        </span>
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-mono-code text-emerald-400/90 bg-slate-950/80 px-1.5 py-0.5 rounded border border-emerald-950">
          + PLEASURE
        </span>

        {/* Quadrant Watermark Anchors */}
        <span className="absolute top-8 right-8 text-[9px] font-mono-code text-emerald-400/40 select-none">
          EXCITED / JOY
        </span>
        <span className="absolute top-8 left-8 text-[9px] font-mono-code text-rose-400/40 select-none">
          ALARMED / ANGRY
        </span>
        <span className="absolute bottom-8 left-8 text-[9px] font-mono-code text-amber-400/40 select-none">
          SAD / DEPRESSED
        </span>
        <span className="absolute bottom-8 right-8 text-[9px] font-mono-code text-teal-400/40 select-none">
          SERENE / CALM
        </span>

        {/* Animated Target Coordinate Beacon */}
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
          style={{ left: `${posX}%`, top: `${posY}%` }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        >
          {/* Radar Ring */}
          <div className="relative flex items-center justify-center">
            <span className="absolute w-8 h-8 rounded-full bg-cyan-400/30 animate-ping" />
            <span className="absolute w-5 h-5 rounded-full border border-cyan-300" />
            <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#38bdf8]" />
          </div>

          {/* Coordinate Tooltip */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-950/95 border border-cyan-400 px-2 py-0.5 rounded text-[10px] font-mono-code text-cyan-200 shadow-lg">
            {primaryEmotion}: ({clampedValence > 0 ? `+${clampedValence.toFixed(2)}` : clampedValence.toFixed(2)}, {clampedArousal > 0 ? `+${clampedArousal.toFixed(2)}` : clampedArousal.toFixed(2)})
          </div>
        </motion.div>
      </div>

      {/* Diagnostics Readout */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1.5 text-xs font-mono-code">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">VALENCE (PLEASANTNESS):</span>
          <span className={`font-bold ${clampedValence >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
            {clampedValence > 0 ? `+${clampedValence.toFixed(2)}` : clampedValence.toFixed(2)} / 1.00
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">AROUSAL (ACTIVATION):</span>
          <span className={`font-bold ${clampedArousal >= 0 ? "text-cyan-300" : "text-amber-300"}`}>
            {clampedArousal > 0 ? `+${clampedArousal.toFixed(2)}` : clampedArousal.toFixed(2)} / 1.00
          </span>
        </div>
        <div className="flex justify-between items-center pt-1 border-t border-slate-800/60 text-[11px]">
          <span className="text-slate-500">AFFECT QUADRANT:</span>
          <span className={`font-semibold ${quadrantColor}`}>{quadrantLabel.split(":")[0]}</span>
        </div>
      </div>
    </div>
  );
}
