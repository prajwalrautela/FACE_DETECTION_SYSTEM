import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FuturisticLoadingScreen } from "./components/FuturisticLoadingScreen";
import { LiveCameraHUD } from "./components/LiveCameraHUD";
import { RoboticVoiceBar } from "./components/RoboticVoiceBar";
import { FACSMatrix } from "./components/FACSMatrix";
import { BiometricFaceMesh } from "./components/BiometricFaceMesh";
import { CircumplexPlot } from "./components/CircumplexPlot";
import { EmotionSimulator } from "./components/EmotionSimulator";
import { InterdisciplinaryMatrix } from "./components/InterdisciplinaryMatrix";
import { CyberParticleBackground } from "./components/CyberParticleBackground";
import { AnimatedTelemetryWave } from "./components/AnimatedTelemetryWave";
import { CyberTelemetryTicker } from "./components/CyberTelemetryTicker";
import { BiometricAuthGate } from "./components/BiometricAuthGate";
import { OperativeProfileBadge } from "./components/OperativeProfileBadge";
import { FER_PRESETS } from "./data/ferPresets";
import { FERAnalysisResult, FERPreset } from "./types/fer";
import { AuthenticatedOperative } from "./types/auth";
import { getStoredOperative } from "./utils/authStorage";
import { 
  ShieldCheck, 
  Cpu, 
  Activity, 
  Sparkles, 
  Binary, 
  Scan, 
  Layers, 
  Volume2,
  Info
} from "lucide-react";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [authenticatedOperative, setAuthenticatedOperative] = useState<AuthenticatedOperative | null>(() => getStoredOperative());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activePreset, setActivePreset] = useState<FERPreset>(FER_PRESETS[0]);
  const [currentAnalysis, setCurrentAnalysis] = useState<FERAnalysisResult>(FER_PRESETS[0].analysis);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<"analysis" | "simulator" | "theory">("analysis");

  // Handle analysis update from webcam capture, real-time CV loop, or image scan
  const handleAnalysisComplete = (result: FERAnalysisResult, _imageSource: string) => {
    setIsAnalyzing(false);
    setCurrentAnalysis(result);
  };

  const handleSelectPreset = (preset: FERPreset) => {
    setActivePreset(preset);
    setCurrentAnalysis(preset.analysis);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 cyber-grid relative selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      {/* Animated Synaptic Particle Background on Main Screen */}
      <CyberParticleBackground
        primaryEmotion={currentAnalysis.primaryEmotion}
        valence={currentAnalysis.valence}
      />

      {/* Futuristic Scanline Layer */}
      <div className="fixed inset-0 scanline-overlay pointer-events-none opacity-25 z-40" />

      {/* Futuristic Loading Screen & Cinematic Boot Sequence */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <FuturisticLoadingScreen
            onComplete={() => {
              setIsLoading(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Main Dashboard Application */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 flex flex-col min-h-screen"
        >
          {/* Main Top Navigation / Header */}
          <header className="sticky top-0 z-30 w-full bg-slate-950/90 border-b border-cyan-900/40 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                <Scan className="w-5 h-5 text-cyan-300" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-tech text-base sm:text-lg font-bold tracking-wider text-slate-100 uppercase">
                    AURA-FER
                  </h1>
                  <span className="text-[10px] font-mono-code text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60">
                    v4.9 NEURAL
                  </span>
                </div>
                <p className="text-[10px] font-mono-code text-slate-400 tracking-wider uppercase hidden sm:block">
                  Facial Emotion Recognition // CV · ML · Psychology
                </p>
              </div>
            </div>

            {/* Header Telemetry Wave Visualizer */}
            <div className="hidden md:flex items-center">
              <AnimatedTelemetryWave
                arousal={currentAnalysis.arousal}
                valence={currentAnalysis.valence}
                primaryEmotion={currentAnalysis.primaryEmotion}
              />
            </div>

            {/* Navigation Tabs & Operative Profile */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-cyan-950">
                <button
                  id="tab-biometric-analysis-btn"
                  onClick={() => setActiveTab("analysis")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono-code transition-all cursor-pointer ${
                    activeTab === "analysis"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  HUD Dashboard
                </button>
                <button
                  id="tab-emotion-simulator-btn"
                  onClick={() => setActiveTab("simulator")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono-code transition-all cursor-pointer ${
                    activeTab === "simulator"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Morph Simulator
                </button>
                <button
                  id="tab-science-theory-btn"
                  onClick={() => setActiveTab("theory")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono-code transition-all cursor-pointer ${
                    activeTab === "theory"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Science & Theory
                </button>
              </div>

              {/* Authenticated Operative Identity Badge & Anti-Bot Clearance */}
              {authenticatedOperative ? (
                <OperativeProfileBadge
                  operative={authenticatedOperative}
                  onReauthenticate={() => setIsAuthModalOpen(true)}
                  onLogout={() => {
                    setAuthenticatedOperative(null);
                    setIsAuthModalOpen(true);
                  }}
                />
              ) : (
                <button
                  id="header-biometric-auth-btn"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 text-xs font-mono-code hover:bg-cyan-500/30 cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>BIOMETRIC AUTH</span>
                </button>
              )}
            </div>
          </header>

          {/* Biometric Security Authentication Gate (Locks console until webcam photo is saved) */}
          {(!authenticatedOperative || isAuthModalOpen) && (
            <BiometricAuthGate
              onAuthenticated={(operative) => {
                setAuthenticatedOperative(operative);
                setIsAuthModalOpen(false);
              }}
              onCancel={() => {
                if (authenticatedOperative) {
                  setIsAuthModalOpen(false);
                }
              }}
              isReauthenticating={!!authenticatedOperative && isAuthModalOpen}
            />
          )}

          {/* Main Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-5">
            {/* Prominent Robotic Voice Audio HUD Controller */}
            <RoboticVoiceBar
              currentEmotionText={currentAnalysis.primaryEmotion}
              roboticTranscript={currentAnalysis.roboticVoiceTranscript}
            />

            {/* Dynamic Animated Telemetry Ticker */}
            <CyberTelemetryTicker
              primaryEmotion={currentAnalysis.primaryEmotion}
              valence={currentAnalysis.valence}
              arousal={currentAnalysis.arousal}
              symmetryScore={currentAnalysis.computerVisionMetrics.symmetryScore}
            />

            {/* TAB 1: PRIMARY BIOMETRIC HUD ANALYSIS DASHBOARD */}
            {activeTab === "analysis" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Live Camera Feed & Benchmark Switcher */}
                  <div className="lg:col-span-6 space-y-6">
                    <LiveCameraHUD
                      onAnalysisComplete={handleAnalysisComplete}
                      isAnalyzing={isAnalyzing}
                      activePresetId={activePreset.id}
                      onSelectPreset={handleSelectPreset}
                    />

                    {/* Quick Diagnostic Insights Banner */}
                    <div className="p-4 rounded-2xl bg-slate-900/70 border border-cyan-950 flex items-start gap-3 text-xs font-mono-code backdrop-blur-sm">
                      <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-cyan-300 font-bold block mb-1">
                          COGNITIVE INTERPRETATION PROTOCOL
                        </span>
                        <p className="text-slate-400 leading-relaxed">
                          Facial Action Coding System (FACS) maps subtle contraction vectors in facial muscles. 
                          Valence measures psychological pleasantness (+1.0 to -1.0) while Arousal gauges nervous system activation.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: FACS Action Units & Biometric Topology */}
                  <div className="lg:col-span-6 space-y-6">
                    {/* Primary Emotion Banner & FACS Action Units Table */}
                    <FACSMatrix
                      primaryEmotion={currentAnalysis.primaryEmotion}
                      confidence={currentAnalysis.confidence}
                      secondaryEmotions={currentAnalysis.secondaryEmotions}
                      actionUnits={currentAnalysis.facialActionUnits}
                    />

                    {/* Split 2-Column: 68-Point Mesh & 2D Circumplex Plot */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <BiometricFaceMesh
                        actionUnits={currentAnalysis.facialActionUnits}
                        primaryEmotion={currentAnalysis.primaryEmotion}
                        symmetryScore={currentAnalysis.computerVisionMetrics.symmetryScore}
                      />

                      <CircumplexPlot
                        valence={currentAnalysis.valence}
                        arousal={currentAnalysis.arousal}
                        primaryEmotion={currentAnalysis.primaryEmotion}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Interdisciplinary Insight Section */}
                <InterdisciplinaryMatrix
                  context={currentAnalysis.interdisciplinaryContext}
                  cvMetrics={currentAnalysis.computerVisionMetrics}
                  landmarkAnalysis={currentAnalysis.landmarkAnalysis}
                  psychologicalAnalysis={currentAnalysis.psychologicalAnalysis}
                />
              </div>
            )}

            {/* TAB 2: INTERACTIVE EMOTION SIMULATOR */}
            {activeTab === "simulator" && (
              <div className="space-y-6">
                <EmotionSimulator />
                <InterdisciplinaryMatrix
                  context={currentAnalysis.interdisciplinaryContext}
                  cvMetrics={currentAnalysis.computerVisionMetrics}
                  landmarkAnalysis={currentAnalysis.landmarkAnalysis}
                  psychologicalAnalysis={currentAnalysis.psychologicalAnalysis}
                />
              </div>
            )}

            {/* TAB 3: SCIENCE & THEORETICAL FOUNDATION */}
            {activeTab === "theory" && (
              <div className="space-y-6">
                <InterdisciplinaryMatrix
                  context={currentAnalysis.interdisciplinaryContext}
                  cvMetrics={currentAnalysis.computerVisionMetrics}
                  landmarkAnalysis={currentAnalysis.landmarkAnalysis}
                  psychologicalAnalysis={currentAnalysis.psychologicalAnalysis}
                />
                <EmotionSimulator />
              </div>
            )}
          </main>

          {/* Futuristic Telemetry Footer */}
          <footer className="w-full bg-slate-950/95 border-t border-cyan-950 px-6 py-4 mt-auto text-[11px] font-mono-code text-slate-500">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  AURA-FER AFFECT ENGINE
                </span>
                <span>FACS TAXONOMY: PAUL EKMAN & WALLACE FRIESEN</span>
                <span className="hidden md:inline">CIRCUMPLEX: JAMES RUSSELL (1980)</span>
              </div>
              <div className="text-slate-400 text-center sm:text-right">
                Computer Vision · Machine Learning · Affective Psychology
              </div>
            </div>
          </footer>
        </motion.div>
      )}
    </div>
  );
}
