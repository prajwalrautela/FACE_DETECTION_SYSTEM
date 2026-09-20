import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { roboticVoice } from "../utils/roboticVoice";
import { 
  ShieldCheck, 
  Cpu, 
  Eye, 
  Binary, 
  Activity, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ChevronRight,
  Scan,
  FastForward
} from "lucide-react";

interface FuturisticLoadingScreenProps {
  onComplete: () => void;
}

export function FuturisticLoadingScreen({ onComplete }: FuturisticLoadingScreenProps) {
  const [progress, setProgress] = useState(15);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isReadyToEnter, setIsReadyToEnter] = useState(false);
  const [systemLogs, setSystemLogs] = useState<string>([
    "BOOTING AURA-FER KERNEL v4.9.2...",
  ][0]);

  const bootSteps = [
    { text: "OPTICAL MATRIX CALIBRATION", icon: Eye, status: "READY" },
    { text: "68-POINT FACIAL TOPOLOGY MAPPING", icon: Scan, status: "LOCKED" },
    { text: "EKMAN FACS ACTION UNIT ENGINE", icon: Activity, status: "ONLINE" },
    { text: "CIRCUMPLEX 2D AFFECT SYNCHRONIZER", icon: Binary, status: "SYNCED" },
  ];

  useEffect(() => {
    // Smooth progress increment
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsReadyToEnter(true);
          return 100;
        }
        const increment = Math.floor(Math.random() * 9) + 7;
        const next = Math.min(100, prev + increment);

        if (next > 35 && currentStepIndex < 1) {
          setCurrentStepIndex(1);
          setSystemLogs("68 FACIAL TOPOLOGY MESH: LOCKED (0.012ms)");
          roboticVoice.playScanSound();
        } else if (next > 65 && currentStepIndex < 2) {
          setCurrentStepIndex(2);
          setSystemLogs("FACS TAXONOMY LOADED: AU01-AU46 ACTIVE");
          roboticVoice.playScanSound();
        } else if (next > 88 && currentStepIndex < 3) {
          setCurrentStepIndex(3);
          setSystemLogs("VALENCE / AROUSAL HYPERSPHERE COORD: [0, 0]");
          roboticVoice.playScanSound();
        } else if (next >= 100) {
          setSystemLogs("AURA COGNITIVE FER ENGINE: FULL OPERATIONAL STATUS");
          roboticVoice.playLockSound();
        }
        return next;
      });
    }, 110);

    return () => clearInterval(interval);
  }, [currentStepIndex]);

  const handleLaunch = () => {
    if (audioEnabled) {
      roboticVoice.playBootSound();
      roboticVoice.speakRobotic(
        "Aura Affective Core online. Facial Emotion Recognition protocol initialized. Optical sensory grid active. Welcome, Operative."
      );
    }
    onComplete();
  };

  return (
    <motion.div
      id="futuristic-loading-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02, filter: "blur(6px)" }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-50 h-[100dvh] max-h-[100dvh] w-screen flex flex-col justify-between p-3 sm:p-6 bg-slate-950 text-slate-100 cyber-grid overflow-hidden select-none"
    >
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-radial from-cyan-950/40 via-slate-950/90 to-slate-950 pointer-events-none" />
      <div className="absolute inset-0 scanline-overlay pointer-events-none opacity-30" />

      {/* Top Telemetry Header */}
      <header className="relative z-10 flex items-center justify-between border-b border-cyan-900/40 pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
          </div>
          <span className="font-tech text-xs tracking-wider text-cyan-300 font-semibold uppercase">
            AURA-FER // INITIALIZATION SEQUENCE
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="toggle-loading-audio-btn"
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="flex items-center gap-1.5 text-[11px] font-mono-code text-cyan-300 px-2.5 py-1 rounded bg-slate-900/90 border border-cyan-800/50 hover:bg-slate-800 transition-colors cursor-pointer"
            title={audioEnabled ? "Robotic voice active" : "Sound muted"}
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
            <span className="hidden sm:inline">{audioEnabled ? "AUDIO ON" : "MUTED"}</span>
          </button>

          <button
            id="skip-loading-btn"
            onClick={handleLaunch}
            className="flex items-center gap-1 text-[11px] font-mono-code text-slate-400 hover:text-cyan-200 px-2 py-1 rounded bg-slate-900/60 border border-slate-800 hover:border-cyan-800 transition-colors cursor-pointer"
            title="Skip loading screen directly to HUD"
          >
            <span>Skip</span>
            <FastForward className="w-3 h-3 text-cyan-400" />
          </button>
        </div>
      </header>

      {/* Center Biometric Hologram Target - Scaled to never cause scroll */}
      <main className="relative z-10 flex flex-col items-center justify-center max-w-lg w-full mx-auto my-auto py-2">
        {/* Concentric HUD Reticles */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center mb-3">
          {/* Outer Rotating Radar Ring */}
          <div className="absolute inset-0 rounded-full border border-cyan-500/25 border-dashed animate-radar" />
          {/* Middle Ring with Notch Marks */}
          <div className="absolute inset-2.5 rounded-full border border-cyan-500/35">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_6px_#06b6d4]" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_6px_#06b6d4]" />
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_6px_#06b6d4]" />
            <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_6px_#06b6d4]" />
          </div>

          {/* Inner Target Crosshairs & Hologram Face */}
          <div className="absolute inset-6 rounded-full border border-cyan-400/40 bg-cyan-950/30 backdrop-blur-xs flex items-center justify-center">
            {/* SVG Biometric Face Wireframe Silhouette */}
            <svg viewBox="0 0 100 100" className="w-20 h-20 sm:w-24 sm:h-24 text-cyan-400/85 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">
              <ellipse cx="50" cy="50" rx="32" ry="42" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" />
              <line x1="50" y1="15" x2="50" y2="85" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
              <line x1="20" y1="46" x2="80" y2="46" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
              <path d="M30,38 Q38,34 46,38" fill="none" stroke="currentColor" strokeWidth="1.3" />
              <path d="M54,38 Q62,34 70,38" fill="none" stroke="currentColor" strokeWidth="1.3" />
              <ellipse cx="38" cy="46" rx="5" ry="3" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="38" cy="46" r="1.5" fill="#38bdf8" />
              <ellipse cx="62" cy="46" rx="5" ry="3" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="62" cy="46" r="1.5" fill="#38bdf8" />
              <path d="M50,44 L48,58 L53,58" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M36,70 Q50,78 64,70" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="22" cy="38" r="1" fill="#06b6d4" />
              <circle cx="78" cy="38" r="1" fill="#06b6d4" />
              <circle cx="26" cy="62" r="1" fill="#06b6d4" />
              <circle cx="74" cy="62" r="1" fill="#06b6d4" />
              <circle cx="50" cy="88" r="1.5" fill="#06b6d4" />
            </svg>

            {/* Scanning Laser Line */}
            <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-laser shadow-[0_0_10px_#38bdf8]" />
          </div>

          {/* Corner Brackets */}
          <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
          <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
          <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
        </div>

        {/* Title and High-Tech Subheading */}
        <div className="text-center mb-3">
          <h1 className="font-tech text-2xl sm:text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-sky-300 to-teal-200 uppercase">
            Facial Emotion Recognition
          </h1>
          <p className="font-mono-code text-[11px] text-cyan-400/80 mt-0.5 tracking-wider uppercase">
            Computer Vision · Machine Learning · Affective Psychology
          </p>
        </div>

        {/* Progress Bar & Percentage Counter */}
        <div className="w-full mb-3">
          <div className="flex justify-between items-center text-[11px] font-mono-code mb-1">
            <span className="text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              NEURAL OPTICAL CALIBRATION
            </span>
            <span className="text-cyan-300 font-bold tracking-widest">{progress}%</span>
          </div>

          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-cyan-900/60">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-600 via-teal-400 to-cyan-300 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Compact Diagnostic Milestone Checks */}
        <div className="w-full bg-slate-900/70 border border-cyan-900/40 rounded-lg p-2.5 mb-3 backdrop-blur-sm space-y-1.5">
          {bootSteps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className={`flex items-center justify-between text-[10px] sm:text-[11px] font-mono-code transition-all duration-200 ${
                  isCompleted ? "text-cyan-200 opacity-100" : "text-slate-500 opacity-40"
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Icon className={`w-3 h-3 shrink-0 ${isCompleted ? "text-cyan-400" : "text-slate-600"}`} />
                  <span className="truncate">{step.text}</span>
                </div>
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold shrink-0 ${
                  isCompleted ? "bg-cyan-950 text-cyan-300 border border-cyan-800/60" : "bg-slate-800 text-slate-500"
                }`}>
                  {isCompleted ? step.status : "PENDING"}
                </span>
              </div>
            );
          })}
        </div>

        {/* Action Button: Enter Core */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {isReadyToEnter ? (
              <motion.button
                id="enter-fer-core-btn"
                key="ready-btn"
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLaunch}
                className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-tech font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-slate-950" />
                <span>INITIALIZE NEURAL INTERFACE</span>
                <ChevronRight className="w-4 h-4 text-slate-950" />
              </motion.button>
            ) : (
              <div
                key="calibrating-status"
                className="text-center font-mono-code text-[11px] text-cyan-400/80 flex items-center justify-center gap-2 py-1.5"
              >
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                CALIBRATING BIOMETRIC FACIAL MATRICES...
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Terminal Telemetry Logs */}
      <footer className="relative z-10 flex items-center justify-between text-[10px] font-mono-code text-slate-500 border-t border-slate-900 pt-2">
        <div className="flex items-center gap-3">
          <span className="text-cyan-500/80">LATENCY: 12ms</span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline">60 FPS</span>
        </div>
        <div className="text-right text-cyan-500/80 truncate max-w-xs sm:max-w-md">
          {systemLogs}
        </div>
      </footer>
    </motion.div>
  );
}
