import { useState, useRef, useEffect } from "react";
import { MorphParameters } from "../types/fer";
import { roboticVoice } from "../utils/roboticVoice";
import { Sliders, Sparkles, RefreshCw, Volume2, Smile, Frown, Compass } from "lucide-react";

export function EmotionSimulator() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [params, setParams] = useState<MorphParameters>({
    browHeight: 0,
    browFurrow: 0,
    eyeOpenness: 0,
    squint: 0,
    smileIntensity: 50,
    mouthOpen: 10,
    jawDrop: 5,
    headTilt: 0,
  });

  // Calculate real-time predicted emotion from physical facial sliders
  const calculateEmotion = (p: MorphParameters) => {
    // Valence score (-1 to 1) primarily driven by smile vs frown, mitigated by brow furrow
    const rawValence = (p.smileIntensity / 100) - (p.browFurrow / 150);
    const valence = Math.max(-1, Math.min(1, rawValence));

    // Arousal score (-1 to 1) driven by jaw drop, eye openness, brow height, and smile
    const rawArousal = (p.jawDrop / 100) * 0.5 + (p.eyeOpenness / 100) * 0.4 + (Math.abs(p.smileIntensity) / 100) * 0.3 + (p.browFurrow / 100) * 0.3 - 0.3;
    const arousal = Math.max(-1, Math.min(1, rawArousal));

    let emotionName = "Neutral Balance";
    let activeAUs: string[] = [];

    if (p.smileIntensity > 40 && p.squint > 20) {
      emotionName = "Duchenne Joy";
      activeAUs = ["AU06 (Cheek Raiser)", "AU12 (Lip Corner Puller)", "AU25 (Lips Part)"];
    } else if (p.browHeight > 30 && p.jawDrop > 40) {
      emotionName = "High Surprise / Awe";
      activeAUs = ["AU01 (Inner Brow Raiser)", "AU02 (Outer Brow)", "AU05 (Lid Raiser)", "AU26 (Jaw Drop)"];
    } else if (p.browFurrow > 40 && p.smileIntensity < -20) {
      emotionName = "Anger / Contention";
      activeAUs = ["AU04 (Brow Lowerer)", "AU07 (Lid Tightener)", "AU24 (Lip Pressor)"];
    } else if (p.smileIntensity < -40 && p.browHeight > 20) {
      emotionName = "Sorrow / Sadness";
      activeAUs = ["AU01 (Inner Brow Raiser)", "AU15 (Depressor Anguli Oris)"];
    } else if (p.smileIntensity > 20 && p.headTilt !== 0) {
      emotionName = "Skeptical Amusement";
      activeAUs = ["AU14 (Dimpler)", "AU12 (Unilateral Pull)"];
    } else if (Math.abs(p.smileIntensity) <= 20 && p.browFurrow < 20) {
      emotionName = "Neutral Serenity";
      activeAUs = ["AU00 (Basal Equilibrium)"];
    } else {
      emotionName = "Cognitive Appraisal";
      activeAUs = ["AU01 (Inner Brow)", "AU04 (Focus Furrow)"];
    }

    return { emotionName, valence, arousal, activeAUs };
  };

  const { emotionName, valence, arousal, activeAUs } = calculateEmotion(params);

  // Dynamic Morphing Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2 - 10;

      // Apply head tilt
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((params.headTilt * Math.PI) / 180);
      ctx.translate(-cx, -cy);

      // Morph offsets
      const browY = cy - 45 - params.browHeight * 0.5;
      const furrow = params.browFurrow * 0.25;
      const eyeH = 12 + params.eyeOpenness * 0.2 - params.squint * 0.15;
      const smileY = params.smileIntensity * 0.4;
      const jawY = params.jawDrop * 0.5;
      const mouthOpenH = params.mouthOpen * 0.35 + jawY * 0.3;

      // Face Oval Outline
      ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(cx, cy + jawY * 0.2, 85, 115 + jawY * 0.3, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Eyebrows
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2.5;

      // Left Eyebrow
      ctx.beginPath();
      ctx.moveTo(cx - 58, browY + 6 - furrow * 0.5);
      ctx.quadraticCurveTo(cx - 38, browY - 8, cx - 14, browY + furrow);
      ctx.stroke();

      // Right Eyebrow
      ctx.beginPath();
      ctx.moveTo(cx + 14, browY + furrow);
      ctx.quadraticCurveTo(cx + 38, browY - 8, cx + 58, browY + 6 - furrow * 0.5);
      ctx.stroke();

      // Eyes
      ctx.fillStyle = "#22d3ee";
      ctx.strokeStyle = "#06b6d4";
      ctx.lineWidth = 1.2;

      // Left Eye
      ctx.beginPath();
      ctx.ellipse(cx - 36, cy - 20, 16, Math.max(2, eyeH), 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx - 36, cy - 20, Math.min(5, eyeH * 0.5), 0, Math.PI * 2);
      ctx.fill();

      // Right Eye
      ctx.beginPath();
      ctx.ellipse(cx + 36, cy - 20, 16, Math.max(2, eyeH), 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + 36, cy - 20, Math.min(5, eyeH * 0.5), 0, Math.PI * 2);
      ctx.fill();

      // Nose
      ctx.strokeStyle = "rgba(6, 182, 212, 0.6)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 20);
      ctx.lineTo(cx, cy + 18);
      ctx.lineTo(cx + 8, cy + 18);
      ctx.stroke();

      // Mouth
      const mouthY = cy + 52 + jawY * 0.4;
      ctx.strokeStyle = params.smileIntensity >= 0 ? "#10b981" : "#f43f5e";
      ctx.lineWidth = 2.2;

      // Upper lip
      ctx.beginPath();
      ctx.moveTo(cx - 40, mouthY - smileY);
      ctx.quadraticCurveTo(cx, mouthY - mouthOpenH * 0.5, cx + 40, mouthY - smileY);
      ctx.stroke();

      // Lower lip
      ctx.beginPath();
      ctx.moveTo(cx - 40, mouthY - smileY);
      ctx.quadraticCurveTo(cx, mouthY + mouthOpenH + 4, cx + 40, mouthY - smileY);
      ctx.stroke();

      // Oral cavity interior if open
      if (mouthOpenH > 4) {
        ctx.fillStyle = "rgba(15, 23, 42, 0.7)";
        ctx.beginPath();
        ctx.moveTo(cx - 40, mouthY - smileY);
        ctx.quadraticCurveTo(cx, mouthY - mouthOpenH * 0.5, cx + 40, mouthY - smileY);
        ctx.quadraticCurveTo(cx, mouthY + mouthOpenH + 4, cx - 40, mouthY - smileY);
        ctx.fill();
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [params]);

  // Preset Morph buttons
  const applyPreset = (presetName: string) => {
    roboticVoice.playScanSound();
    switch (presetName) {
      case "joy":
        setParams({
          browHeight: 10,
          browFurrow: 0,
          eyeOpenness: -10,
          squint: 60,
          smileIntensity: 85,
          mouthOpen: 30,
          jawDrop: 20,
          headTilt: 0,
        });
        break;
      case "surprise":
        setParams({
          browHeight: 50,
          browFurrow: 0,
          eyeOpenness: 45,
          squint: 0,
          smileIntensity: 10,
          mouthOpen: 70,
          jawDrop: 60,
          headTilt: 0,
        });
        break;
      case "anger":
        setParams({
          browHeight: -25,
          browFurrow: 75,
          eyeOpenness: -15,
          squint: 40,
          smileIntensity: -60,
          mouthOpen: 0,
          jawDrop: 10,
          headTilt: 0,
        });
        break;
      case "smirk":
        setParams({
          browHeight: 15,
          browFurrow: 10,
          eyeOpenness: 5,
          squint: 25,
          smileIntensity: 45,
          mouthOpen: 0,
          jawDrop: 0,
          headTilt: 8,
        });
        break;
      case "neutral":
      default:
        setParams({
          browHeight: 0,
          browFurrow: 0,
          eyeOpenness: 0,
          squint: 0,
          smileIntensity: 0,
          mouthOpen: 0,
          jawDrop: 0,
          headTilt: 0,
        });
        break;
    }
  };

  const handleSpeakMorphed = () => {
    roboticVoice.playScanSound();
    setTimeout(() => {
      roboticVoice.speakRobotic(
        `Synthetic morph identified. Predicted emotional state is ${emotionName}. Valence is ${valence > 0 ? "positive" : "negative"} ${Math.abs(valence).toFixed(2)}. Arousal index is ${arousal.toFixed(2)}.`
      );
    }, 150);
  };

  return (
    <div className="w-full bg-slate-900/80 border border-cyan-900/50 rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-cyan-950/80 mb-4">
        <div>
          <span className="text-[10px] font-mono-code text-cyan-400 uppercase tracking-widest block">
            AFFECTIVE SYNTHESIS & MORPH LAB
          </span>
          <h3 className="font-tech text-lg font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
            <span>Synthetic Facial Expression Generator</span>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono-code">
              REAL-TIME SIMULATION
            </span>
          </h3>
        </div>

        {/* Quick Morph Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => applyPreset("joy")}
            className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-emerald-300 text-xs font-mono-code transition-colors cursor-pointer"
          >
            Joy
          </button>
          <button
            onClick={() => applyPreset("surprise")}
            className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-sky-300 text-xs font-mono-code transition-colors cursor-pointer"
          >
            Surprise
          </button>
          <button
            onClick={() => applyPreset("anger")}
            className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-rose-300 text-xs font-mono-code transition-colors cursor-pointer"
          >
            Anger
          </button>
          <button
            onClick={() => applyPreset("smirk")}
            className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-amber-300 text-xs font-mono-code transition-colors cursor-pointer"
          >
            Smirk
          </button>
          <button
            onClick={() => applyPreset("neutral")}
            className="px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 text-xs font-mono-code transition-colors cursor-pointer"
            title="Reset to Neutral"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Sandbox Grid: Left Canvas + Right Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Morph Canvas & Live Prediction HUD */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full aspect-square max-w-[280px] bg-slate-950 rounded-xl border border-cyan-950 p-2 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 cyber-grid-dense opacity-20 pointer-events-none" />
            <canvas ref={canvasRef} width={280} height={280} className="w-full h-full" />

            {/* Target Reticle Brackets */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-cyan-400" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-cyan-400" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-cyan-400" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-cyan-400" />
          </div>

          {/* Real-time Computed Emotion Result Card */}
          <div className="w-full mt-3 p-3 rounded-xl bg-slate-950/80 border border-cyan-900/60 text-center">
            <span className="text-[10px] font-mono-code text-cyan-400 tracking-wider uppercase block">
              PREDICTED EMOTIONAL STATE
            </span>
            <span className="font-tech text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-teal-300 to-sky-200 uppercase">
              {emotionName}
            </span>

            <div className="flex items-center justify-center gap-4 text-xs font-mono-code mt-1.5 text-slate-300">
              <span>Valence: <strong className={valence >= 0 ? "text-emerald-300" : "text-rose-300"}>{valence > 0 ? `+${valence.toFixed(2)}` : valence.toFixed(2)}</strong></span>
              <span>Arousal: <strong className={arousal >= 0 ? "text-cyan-300" : "text-amber-300"}>{arousal > 0 ? `+${arousal.toFixed(2)}` : arousal.toFixed(2)}</strong></span>
            </div>

            {/* Spoken Action Button */}
            <button
              onClick={handleSpeakMorphed}
              className="mt-2.5 w-full py-1.5 px-3 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 text-xs font-mono-code flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>ROBOTIC VOICE ANNOUNCE</span>
            </button>
          </div>
        </div>

        {/* Right: Fine-Grained Anatomical Sliders */}
        <div className="lg:col-span-7 space-y-3.5 text-xs font-mono-code">
          {/* Smile Intensity */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5 text-emerald-400" />
                LIP CORNER PULL (AU12 Zygomaticus):
              </span>
              <span className="text-cyan-300 font-bold">{params.smileIntensity > 0 ? `+${params.smileIntensity}` : params.smileIntensity}</span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              value={params.smileIntensity}
              onChange={(e) => setParams({ ...params, smileIntensity: parseInt(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Brow Height */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-300">BROW ELEVATION (AU01/02 Frontalis):</span>
              <span className="text-cyan-300 font-bold">{params.browHeight > 0 ? `+${params.browHeight}` : params.browHeight}</span>
            </div>
            <input
              type="range"
              min="-40"
              max="60"
              value={params.browHeight}
              onChange={(e) => setParams({ ...params, browHeight: parseInt(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Brow Furrow */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-300">CORRUGATOR FURROW (AU04 Brow Lowerer):</span>
              <span className="text-rose-300 font-bold">{params.browFurrow}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={params.browFurrow}
              onChange={(e) => setParams({ ...params, browFurrow: parseInt(e.target.value) })}
              className="w-full accent-rose-400 cursor-pointer"
            />
          </div>

          {/* Eye Aperture & Squint */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-400">EYE APERTURE:</span>
                <span className="text-cyan-300 font-bold">{params.eyeOpenness}</span>
              </div>
              <input
                type="range"
                min="-30"
                max="50"
                value={params.eyeOpenness}
                onChange={(e) => setParams({ ...params, eyeOpenness: parseInt(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-400">CHEEK SQUINT (AU06):</span>
                <span className="text-cyan-300 font-bold">{params.squint}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={params.squint}
                onChange={(e) => setParams({ ...params, squint: parseInt(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Mouth Openness & Jaw Drop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-400">LIP SEPARATION:</span>
                <span className="text-cyan-300 font-bold">{params.mouthOpen}</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={params.mouthOpen}
                onChange={(e) => setParams({ ...params, mouthOpen: parseInt(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-400">JAW DROP (AU26):</span>
                <span className="text-cyan-300 font-bold">{params.jawDrop}</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={params.jawDrop}
                onChange={(e) => setParams({ ...params, jawDrop: parseInt(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Active Synthetic Action Units Badge List */}
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px]">
            <span className="text-slate-500 block mb-1">TRIGGERED FACS ACTION UNITS:</span>
            <div className="flex flex-wrap gap-1.5">
              {activeAUs.map((au, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold">
                  {au}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
