import { useEffect, useState } from "react";
import { Activity, Cpu, Gauge, Zap, Radio } from "lucide-react";

interface CyberTelemetryTickerProps {
  primaryEmotion: string;
  valence: number;
  arousal: number;
  symmetryScore: number;
}

export function CyberTelemetryTicker({
  primaryEmotion,
  valence,
  arousal,
  symmetryScore,
}: CyberTelemetryTickerProps) {
  const [entropy, setEntropy] = useState("0.142");
  const [opticalFlux, setOpticalFlux] = useState("98.4%");
  const [jitter, setJitter] = useState("0.4ms");

  useEffect(() => {
    const interval = setInterval(() => {
      // Subtle realistic micro-fluctuations in telemetry metrics
      const newEntropy = (0.12 + Math.random() * 0.05).toFixed(3);
      const newFlux = (97.8 + Math.random() * 1.8).toFixed(1) + "%";
      const newJitter = (0.3 + Math.random() * 0.3).toFixed(1) + "ms";
      setEntropy(newEntropy);
      setOpticalFlux(newFlux);
      setJitter(newJitter);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-slate-950/80 border border-cyan-950 px-4 py-2 rounded-xl backdrop-blur-md flex items-center justify-between overflow-x-auto text-[11px] font-mono-code text-slate-400 gap-4">
      <div className="flex items-center gap-2 text-cyan-400 font-bold shrink-0">
        <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span className="uppercase tracking-wider">AURA TELEMETRY:</span>
      </div>

      <div className="flex items-center gap-4 sm:gap-6 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">STATE:</span>
          <span className="text-cyan-300 font-bold uppercase">{primaryEmotion}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">VALENCE:</span>
          <span className={`font-bold ${valence >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {valence > 0 ? "+" : ""}{valence.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">AROUSAL:</span>
          <span className={`font-bold ${arousal >= 0 ? "text-sky-400" : "text-amber-400"}`}>
            {arousal > 0 ? "+" : ""}{arousal.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 hidden md:flex">
          <span className="text-slate-500">SYMMETRY:</span>
          <span className="text-teal-300 font-bold">{symmetryScore}%</span>
        </div>

        <div className="flex items-center gap-1.5 hidden lg:flex">
          <span className="text-slate-500">OPTICAL FLUX:</span>
          <span className="text-cyan-400">{opticalFlux}</span>
        </div>

        <div className="flex items-center gap-1.5 hidden lg:flex">
          <span className="text-slate-500">ENTROPY:</span>
          <span className="text-slate-300">{entropy}</span>
        </div>

        <div className="flex items-center gap-1.5 hidden sm:flex">
          <span className="text-slate-500">JITTER:</span>
          <span className="text-emerald-400">{jitter}</span>
        </div>
      </div>
    </div>
  );
}
