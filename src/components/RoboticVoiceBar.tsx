import { useState, useEffect } from "react";
import { roboticVoice } from "../utils/roboticVoice";
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Square, 
  Sliders, 
  Radio, 
  Sparkles,
  Bot
} from "lucide-react";

interface RoboticVoiceBarProps {
  currentEmotionText?: string;
  roboticTranscript?: string;
}

export function RoboticVoiceBar({ currentEmotionText, roboticTranscript }: RoboticVoiceBarProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [pitch, setPitch] = useState(0.82);
  const [rate, setRate] = useState(0.95);
  const [showSettings, setShowSettings] = useState(false);
  const [lastSpokenText, setLastSpokenText] = useState(
    "AURA Affective Core online. Facial Emotion Recognition protocol active."
  );

  useEffect(() => {
    roboticVoice.setSpeakingListener((speaking) => {
      setIsSpeaking(speaking);
    });
  }, []);

  const handleSpeakCurrent = () => {
    const speechText = roboticTranscript || 
      (currentEmotionText 
        ? `Biometric scan complete. Subject demonstrates primary emotional state: ${currentEmotionText}. Action units and circumplex alignment verified.`
        : "AURA Affective Core ready. Please initiate optical camera feed or select a benchmark facial expression.");
    
    setLastSpokenText(speechText);
    roboticVoice.playScanSound();
    setTimeout(() => {
      roboticVoice.speakRobotic(speechText, { pitch, rate });
    }, 150);
  };

  const handleReplayWelcome = () => {
    const welcome = "Aura Affective Core online. Facial Emotion Recognition protocol initialized. Computer vision sensory grid active. Facial Action Coding System synchronized. Calibrating human emotion matrix. Welcome, Operative.";
    setLastSpokenText(welcome);
    roboticVoice.playBootSound();
    setTimeout(() => {
      roboticVoice.speakRobotic(welcome, { pitch, rate });
    }, 200);
  };

  const handleStop = () => {
    roboticVoice.stopSpeaking();
  };

  return (
    <div className="w-full bg-slate-900/90 border border-cyan-900/50 rounded-xl p-3.5 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Left: Robotic Avatar & Speaking Waves */}
        <div className="flex items-center gap-3">
          <div className={`relative flex items-center justify-center w-10 h-10 rounded-lg border transition-all ${
            isSpeaking 
              ? "bg-cyan-950/80 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.6)]" 
              : "bg-slate-800/80 border-slate-700"
          }`}>
            <Bot className={`w-5 h-5 ${isSpeaking ? "text-cyan-300 animate-pulse" : "text-slate-400"}`} />
            {isSpeaking && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-tech text-xs tracking-wider text-cyan-300 font-bold uppercase">
                Robotic Voice Synthesizer
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono-code ${
                isSpeaking 
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" 
                  : "bg-slate-800 text-slate-400"
              }`}>
                {isSpeaking ? "SYNTHESIZING AUDIO..." : "IDLE / READY"}
              </span>
            </div>
            
            {/* Animated Audio Frequency Bars */}
            <div className="flex items-center gap-1 mt-1.5 h-3">
              {[6, 12, 18, 10, 24, 16, 8, 20, 14, 22, 9, 15].map((h, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isSpeaking 
                      ? "bg-gradient-to-t from-cyan-500 to-teal-300" 
                      : "bg-slate-800 h-1"
                  }`}
                  style={{
                    height: isSpeaking ? `${Math.max(3, (h * (Math.sin(Date.now() / 150 + i) * 0.5 + 0.6)))}px` : "3px"
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Center: Realtime Robotic Transcript */}
        <div className="hidden lg:flex flex-1 mx-4 px-3 py-1.5 rounded-lg bg-slate-950/70 border border-cyan-950 font-mono-code text-[11px] text-slate-300 items-center gap-2 overflow-hidden">
          <Radio className="w-3.5 h-3.5 text-cyan-400 shrink-0 animate-pulse" />
          <span className="truncate italic text-cyan-200/90">
            "{lastSpokenText}"
          </span>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {isSpeaking ? (
            <button
              id="stop-robotic-speech-btn"
              onClick={handleStop}
              className="px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-700/50 text-rose-200 text-xs font-mono-code flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-rose-300" />
              <span>STOP</span>
            </button>
          ) : (
            <button
              id="speak-emotion-analysis-btn"
              onClick={handleSpeakCurrent}
              className="px-3 py-1.5 rounded-lg bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-200 text-xs font-mono-code flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(6,182,212,0.2)] cursor-pointer"
              title="Speak current facial emotion diagnostics"
            >
              <Play className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
              <span>SPEAK ANALYSIS</span>
            </button>
          )}

          <button
            id="replay-welcome-voice-btn"
            onClick={handleReplayWelcome}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono-code flex items-center gap-1 transition-colors cursor-pointer"
            title="Replay system boot welcome speech"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span className="hidden md:inline">WELCOME</span>
          </button>

          <button
            id="voice-modulation-settings-btn"
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              showSettings 
                ? "bg-cyan-950 border-cyan-400 text-cyan-300" 
                : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
            }`}
            title="Configure Robotic Voice Parameters"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Voice Modulator Drawer */}
      {showSettings && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono-code text-slate-300">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-400">ROBOTIC PITCH MODULATION:</span>
              <span className="text-cyan-300">{pitch.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="1.4"
              step="0.05"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-400">SYNTHETIC SPEECH CADENCE:</span>
              <span className="text-cyan-300">{rate.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.6"
              max="1.5"
              step="0.05"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
