import { useState } from "react";
import { 
  InterdisciplinaryContext, 
  ComputerVisionMetrics, 
  LandmarkAnalysis 
} from "../types/fer";
import { 
  Eye, 
  BrainCircuit, 
  HeartHandshake, 
  Car, 
  Stethoscope, 
  Bot, 
  GraduationCap,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

interface InterdisciplinaryMatrixProps {
  context: InterdisciplinaryContext;
  cvMetrics: ComputerVisionMetrics;
  landmarkAnalysis: LandmarkAnalysis;
  psychologicalAnalysis: string;
}

export function InterdisciplinaryMatrix({
  context,
  cvMetrics,
  landmarkAnalysis,
  psychologicalAnalysis,
}: InterdisciplinaryMatrixProps) {
  const [activeTab, setActiveTab] = useState<"psychology" | "computervision" | "machinelearning" | "applications">("psychology");

  return (
    <div className="w-full bg-slate-900/80 border border-cyan-900/50 rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-cyan-950/80 mb-4">
        <div>
          <span className="text-[10px] font-mono-code text-cyan-400 uppercase tracking-widest block">
            INTERDISCIPLINARY COGNITIVE ARCHITECTURE
          </span>
          <h3 className="font-tech text-lg font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
            <span>The Science of Facial Emotion Recognition</span>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono-code">
              CV + ML + PSYCH
            </span>
          </h3>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab("psychology")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-code transition-all cursor-pointer ${
              activeTab === "psychology"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5 text-cyan-400" />
            <span>Psychology</span>
          </button>

          <button
            onClick={() => setActiveTab("computervision")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-code transition-all cursor-pointer ${
              activeTab === "computervision"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Computer Vision</span>
          </button>

          <button
            onClick={() => setActiveTab("machinelearning")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-code transition-all cursor-pointer ${
              activeTab === "machinelearning"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
            <span>Machine Learning</span>
          </button>

          <button
            onClick={() => setActiveTab("applications")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-code transition-all cursor-pointer ${
              activeTab === "applications"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span>Real Applications</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {/* 1. PSYCHOLOGY TAB */}
        {activeTab === "psychology" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-cyan-950">
              <h4 className="font-tech text-sm font-bold text-cyan-200 uppercase tracking-wider mb-2 flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-cyan-400" />
                <span>Affective Psychology & Cognitive Appraisal</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {context.psychology ||
                  "Facial expressions are evolutionary signaling systems rooted in Darwin's 1872 observations and formalized by Paul Ekman's universal emotion taxonomy (Joy, Sadness, Anger, Fear, Surprise, Disgust, Contempt). Affective appraisal theory states emotions prepare organisms for adaptive motor responses."}
              </p>
            </div>

            {/* Subject Specific Psychological Diagnosis */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-900/60">
              <span className="text-[10px] font-mono-code text-cyan-400 tracking-wider uppercase block mb-1">
                CURRENT SUBJECT AFFECTIVE EVALUATION
              </span>
              <p className="text-xs text-slate-200 leading-relaxed italic">
                "{psychologicalAnalysis}"
              </p>

              <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono-code">
                <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">MICRO-EXPRESSION STATUS:</span>
                  <span className={`font-bold ${landmarkAnalysis.microExpressionDetected ? "text-amber-300" : "text-slate-300"}`}>
                    {landmarkAnalysis.microExpressionDetected ? "Micro-Expression Detected (<200ms)" : "No involuntary leakage detected"}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {landmarkAnalysis.microExpressionNotes}
                  </p>
                </div>

                <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">OCULAR & PERIORBITAL TONUS:</span>
                  <span className="text-cyan-300 font-bold">{landmarkAnalysis.eyeOpenness}</span>
                  <span className="text-slate-500 block text-[10px] mt-2">MANDIBULAR & LIP CONTOUR:</span>
                  <span className="text-cyan-300 font-bold">{landmarkAnalysis.mouthShape}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. COMPUTER VISION TAB */}
        {activeTab === "computervision" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-cyan-950">
              <h4 className="font-tech text-sm font-bold text-cyan-200 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>Computer Vision Feature Extraction</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {context.computerVision ||
                  "Computer Vision translates pixel matrices into spatial coordinate topologies. Methods span classical Viola-Jones Haar cascades, Gabor wavelet multi-scale frequency filters, Histogram of Oriented Gradients (HOG), and modern dense landmark regression (Dlib 68-pt, MediaPipe 468-pt mesh)."}
              </p>
            </div>

            {/* Subject Specific CV Telemetry */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-900/60">
              <span className="text-[10px] font-mono-code text-cyan-400 tracking-wider uppercase block mb-2">
                SPATIAL METRICS & BOUNDING GEOMETRY
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono-code">
                <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">BILATERAL SYMMETRY:</span>
                  <span className="text-cyan-300 font-bold text-base">{cvMetrics.symmetryScore.toFixed(1)}%</span>
                </div>

                <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">EST. HEAD POSE (P/Y/R):</span>
                  <span className="text-cyan-300 font-bold">
                    {cvMetrics.estimatedHeadPose.pitch}° / {cvMetrics.estimatedHeadPose.yaw}° / {cvMetrics.estimatedHeadPose.roll}°
                  </span>
                </div>

                <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">ESTIMATED AGE COHORT:</span>
                  <span className="text-teal-300 font-bold">{cvMetrics.estimatedAgeRange || "Adult"}</span>
                </div>

                <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">FRAME ILLUMINATION:</span>
                  <span className="text-slate-300 font-bold">{cvMetrics.textureVariation || "Optimal ambient"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. MACHINE LEARNING TAB */}
        {activeTab === "machinelearning" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-cyan-950">
              <h4 className="font-tech text-sm font-bold text-cyan-200 uppercase tracking-wider mb-2 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-cyan-400" />
                <span>Deep Learning & Multimodal Foundation Models</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {context.machineLearning ||
                  "Modern FER pairs Deep Convolutional Networks (ResNet, EfficientNet) and Vision Transformers (ViT) with temporal attention (LSTMs or spatial-temporal graph neural networks). Models are trained on millions of annotated facial images from datasets like AffectNet, RAF-DB, and CK+ using multi-task loss functions balancing discrete categorization with continuous valence-arousal regression."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono-code">
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-cyan-400 font-bold block mb-1">VISION TRANSFORMERS (ViT)</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Self-attention patches capture long-range spatial dependencies between ocular aperture and mouth corners simultaneously.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-cyan-400 font-bold block mb-1">TEMPORAL RECURRENT NETWORKS</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Tracks onset, apex, and offset micro-expression trajectories, distinguishing posed smiles from spontaneous joy.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-cyan-400 font-bold block mb-1">MULTIMODAL EMBEDDINGS</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Gemini multimodal vision maps pixel features directly into affective hyperspheres with psychological grounding.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 4. REAL-WORLD APPLICATIONS TAB */}
        {activeTab === "applications" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-cyan-950">
              <div className="flex items-center gap-2 mb-1.5">
                <Stethoscope className="w-4 h-4 text-rose-400" />
                <h5 className="font-tech text-xs font-bold text-slate-200 uppercase">
                  Clinical Diagnosis & Mental Health
                </h5>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Objective screening for Major Depressive Disorder (MDD), psychomotor retardation, autism spectrum condition, and neurological facial paralysis rehabilitation.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-cyan-950">
              <div className="flex items-center gap-2 mb-1.5">
                <Car className="w-4 h-4 text-amber-400" />
                <h5 className="font-tech text-xs font-bold text-slate-200 uppercase">
                  Driver Fatigue & Safety Monitoring
                </h5>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automotive infrared camera systems tracking eye closure duration (PERCLOS), yawning frequency (AU26), and road rage tension indicators to trigger driver warnings.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-cyan-950">
              <div className="flex items-center gap-2 mb-1.5">
                <Bot className="w-4 h-4 text-cyan-400" />
                <h5 className="font-tech text-xs font-bold text-slate-200 uppercase">
                  Empathetic Robotics & HRI
                </h5>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Human-Robot Interaction (HRI) enabling companion robots and AI customer support to adjust tone, pace, and empathy based on detected frustration or confusion.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-cyan-950">
              <div className="flex items-center gap-2 mb-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <h5 className="font-tech text-xs font-bold text-slate-200 uppercase">
                  Adaptive Pedagogy & Education
                </h5>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Intelligent tutoring systems detecting cognitive disengagement, confusion, or boredom to dynamically adjust curriculum complexity in real time.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
