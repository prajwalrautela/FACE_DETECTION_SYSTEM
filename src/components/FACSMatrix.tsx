import { FACSUnit, SecondaryEmotion } from "../types/fer";
import { Activity, ShieldAlert, CheckCircle, BarChart3 } from "lucide-react";

interface FACSMatrixProps {
  actionUnits: FACSUnit[];
  secondaryEmotions: SecondaryEmotion[];
  primaryEmotion: string;
  confidence: number;
}

export function FACSMatrix({
  actionUnits,
  secondaryEmotions,
  primaryEmotion,
  confidence,
}: FACSMatrixProps) {
  return (
    <div className="w-full bg-slate-900/80 border border-cyan-900/50 rounded-2xl p-4 backdrop-blur-md shadow-xl flex flex-col space-y-5">
      {/* Primary Emotion Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950/80 border border-cyan-900/60">
        <div>
          <span className="text-[10px] font-mono-code text-cyan-400 uppercase tracking-widest block">
            CLASSIFIED AFFECTIVE STATE
          </span>
          <h2 className="font-tech text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-teal-300 uppercase">
            {primaryEmotion}
          </h2>
        </div>

        <div className="text-right sm:text-right">
          <span className="text-[10px] font-mono-code text-slate-400 uppercase tracking-wider block">
            NEURAL CONFIDENCE
          </span>
          <span className="font-tech text-2xl font-bold text-cyan-300">
            {confidence.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Secondary Emotion Probability Breakdown */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <h4 className="font-tech text-xs tracking-wider uppercase text-cyan-200 font-bold">
            Secondary Affect Probabilities
          </h4>
        </div>

        <div className="space-y-2">
          {secondaryEmotions.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-mono-code">
                <span className="text-slate-300">{item.emotion}</span>
                <span className="text-cyan-300">{item.score.toFixed(1)}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-600 to-teal-400 rounded-full"
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FACS Action Units Table */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h4 className="font-tech text-xs tracking-wider uppercase text-cyan-200 font-bold">
              Ekman FACS Action Units (Active)
            </h4>
          </div>
          <span className="text-[10px] font-mono-code text-slate-500">
            INTENSITY: 1 - 5 (MAX)
          </span>
        </div>

        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {actionUnits.map((au, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-lg bg-slate-950/70 border border-cyan-950 hover:border-cyan-800/60 transition-colors text-xs font-mono-code"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/80 font-bold text-[10px]">
                    {au.code}
                  </span>
                  <span className="text-slate-200 font-medium">{au.name}</span>
                </div>

                {/* 5-Segment LED Bar */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((seg) => (
                    <span
                      key={seg}
                      className={`w-2.5 h-2 rounded-xs transition-colors ${
                        seg <= au.intensity
                          ? "bg-cyan-400 shadow-[0_0_6px_#06b6d4]"
                          : "bg-slate-800"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="text-[11px] text-teal-400/90 italic mb-1">
                Anatomy: {au.muscle}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {au.description}
              </p>
            </div>
          ))}

          {actionUnits.length === 0 && (
            <div className="p-4 text-center font-mono-code text-xs text-slate-500 bg-slate-950/40 rounded-lg">
              No isolated Action Unit contractions active (Basal equilibrium).
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
