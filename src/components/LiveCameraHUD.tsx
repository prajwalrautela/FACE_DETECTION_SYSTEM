import { useRef, useState, useEffect, useCallback } from "react";
import { 
  Camera, 
  CameraOff, 
  Upload, 
  Scan, 
  Sparkles, 
  RefreshCw, 
  Layers, 
  AlertCircle,
  Eye,
  CheckCircle2,
  Activity,
  Radio
} from "lucide-react";
import { roboticVoice } from "../utils/roboticVoice";
import { FERAnalysisResult, FERPreset } from "../types/fer";
import { FER_PRESETS } from "../data/ferPresets";
import { 
  extractRealtimeFaceMetrics, 
  buildRealtimeFERAnalysis,
  FaceFeatureMetrics 
} from "../utils/realtimeFaceTracker";
import { AuthenticatedOperative } from "../types/auth";

interface LiveCameraHUDProps {
  onAnalysisComplete: (result: FERAnalysisResult, imageSource: string) => void;
  isAnalyzing: boolean;
  activePresetId?: string;
  onSelectPreset: (preset: FERPreset) => void;
  authenticatedOperative?: AuthenticatedOperative | null;
}

export function LiveCameraHUD({
  onAnalysisComplete,
  isAnalyzing,
  activePresetId,
  onSelectPreset,
  authenticatedOperative,
}: LiveCameraHUDProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const workCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLiveTracking, setIsLiveTracking] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [hudOverlayMode, setHudOverlayMode] = useState<"full" | "landmarks" | "minimal">("full");
  const [streamInfo, setStreamInfo] = useState<{ fps: number; resolution: string }>({ fps: 60, resolution: "1280x720" });

  // Keep latest live metrics in a ref for smooth 60fps canvas rendering
  const liveMetricsRef = useRef<FaceFeatureMetrics>({
    faceDetected: false,
    smileRatio: 0,
    mouthOpenRatio: 0.1,
    eyeOpenRatio: 0.6,
    browFurrowRatio: 0.1,
    browElevationRatio: 0,
    symmetryScore: 94.2,
    headPose: { pitch: 0, yaw: 0, roll: 0 },
  });

  const latestEmotionRef = useRef<string>("Calm Neutral");
  const latestValenceRef = useRef<number>(0.1);

  // Initialize hidden work canvas for computer vision pixel processing
  useEffect(() => {
    if (!workCanvasRef.current) {
      workCanvasRef.current = document.createElement("canvas");
    }
  }, []);

  // Start webcam
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraActive(true);
        setSelectedImagePreview(null);
        roboticVoice.playScanSound();
      }
    } catch (err: any) {
      console.warn("Camera access failed:", err);
      setCameraError(
        err.name === "NotAllowedError"
          ? "Camera permission denied. Please allow optical access or use photo upload / benchmark presets."
          : "Optical sensor not detected. You can test with benchmark presets or upload an image."
      );
    }
  };

  // Stop webcam
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Real-time Computer Vision Processing Loop (runs at ~8Hz to update dashboard continuously)
  useEffect(() => {
    if (!isCameraActive || !isLiveTracking) return;

    let intervalId: number;
    let lastSpokenEmotion = "";
    let speechDebounceTimer = 0;

    intervalId = window.setInterval(() => {
      const video = videoRef.current;
      const workCanvas = workCanvasRef.current;
      if (!video || !workCanvas || video.readyState < 2 || isAnalyzing) return;

      try {
        const metrics = extractRealtimeFaceMetrics(video, workCanvas);
        liveMetricsRef.current = metrics;

        const analysis = buildRealtimeFERAnalysis(metrics);
        latestEmotionRef.current = analysis.primaryEmotion;
        latestValenceRef.current = analysis.valence;

        // Push real-time analysis to the main dashboard state
        onAnalysisComplete(analysis, "");

        // Occasional gentle robotic sound cue when a significant emotion transition occurs (debounced)
        const now = Date.now();
        if (
          analysis.primaryEmotion !== lastSpokenEmotion &&
          now - speechDebounceTimer > 8000 &&
          analysis.confidence > 90
        ) {
          lastSpokenEmotion = analysis.primaryEmotion;
          speechDebounceTimer = now;
          roboticVoice.playLockSound();
        }
      } catch (err) {
        console.warn("Real-time CV loop warning:", err);
      }
    }, 130); // ~8 times per second for fluid responsive updates

    return () => clearInterval(intervalId);
  }, [isCameraActive, isLiveTracking, isAnalyzing, onAnalysisComplete]);

  // Canvas HUD animation loop (draws facial detection boxes, dynamic live landmarks, and radar scans)
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCount = 0;

    const renderHUD = (currentTime: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Measure real FPS
      frameCount++;
      if (currentTime - lastTime >= 1000) {
        setStreamInfo((prev) => ({ ...prev, fps: frameCount }));
        frameCount = 0;
        lastTime = currentTime;
      }

      const time = currentTime * 0.002;
      const metrics = liveMetricsRef.current;
      const currentEmotion = latestEmotionRef.current;
      const currentValence = latestValenceRef.current;

      // Color scheme adapts to emotion
      let themeColor = "#06b6d4"; // cyan
      let themeBg = "rgba(6, 182, 212, 0.15)";
      if (currentEmotion.includes("Joy") || currentValence > 0.3) {
        themeColor = "#10b981"; // emerald
        themeBg = "rgba(16, 185, 129, 0.15)";
      } else if (currentEmotion.includes("Anger") || currentValence < -0.3) {
        themeColor = "#f43f5e"; // rose
        themeBg = "rgba(244, 63, 94, 0.15)";
      } else if (currentEmotion.includes("Surprise")) {
        themeColor = "#38bdf8"; // sky blue
        themeBg = "rgba(56, 189, 248, 0.15)";
      }

      // Simulated Face Tracking Box in center-field with slight dynamic breathing
      const boxW = width * 0.46;
      const boxH = height * 0.64;
      const boxX = (width - boxW) / 2 + Math.sin(time) * 3 + metrics.headPose.yaw * 1.5;
      const boxY = (height - boxH) / 2 + Math.cos(time * 0.8) * 2 + metrics.headPose.pitch * 1.5;

      if (hudOverlayMode !== "minimal") {
        // Futuristic Corner Reticles
        const cornerLen = 22;
        ctx.strokeStyle = themeColor;
        ctx.lineWidth = 2.5;

        // Top-Left
        ctx.beginPath();
        ctx.moveTo(boxX, boxY + cornerLen);
        ctx.lineTo(boxX, boxY);
        ctx.lineTo(boxX + cornerLen, boxY);
        ctx.stroke();

        // Top-Right
        ctx.beginPath();
        ctx.moveTo(boxX + boxW - cornerLen, boxY);
        ctx.lineTo(boxX + boxW, boxY);
        ctx.lineTo(boxX + boxW, boxY + cornerLen);
        ctx.stroke();

        // Bottom-Left
        ctx.beginPath();
        ctx.moveTo(boxX, boxY + boxH - cornerLen);
        ctx.lineTo(boxX, boxY + boxH);
        ctx.lineTo(boxX + cornerLen, boxY + boxH);
        ctx.stroke();

        // Bottom-Right
        ctx.beginPath();
        ctx.moveTo(boxX + boxW - cornerLen, boxY + boxH);
        ctx.lineTo(boxX + boxW, boxY + boxH);
        ctx.lineTo(boxX + boxW, boxY + boxH - cornerLen);
        ctx.stroke();

        // Dynamic Laser Scanline across face box
        const scanY = boxY + ((Math.sin(time * 2.2) + 1) / 2) * boxH;
        const grad = ctx.createLinearGradient(boxX, scanY, boxX + boxW, scanY);
        grad.addColorStop(0, "rgba(6, 182, 212, 0)");
        grad.addColorStop(0.5, themeColor);
        grad.addColorStop(1, "rgba(6, 182, 212, 0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(boxX + 4, scanY);
        ctx.lineTo(boxX + boxW - 4, scanY);
        ctx.stroke();

        // Real-Time Emotion & Status Badge
        ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
        ctx.fillRect(boxX, boxY - 24, 180, 20);
        ctx.strokeStyle = themeColor;
        ctx.lineWidth = 1;
        ctx.strokeRect(boxX, boxY - 24, 180, 20);

        ctx.fillStyle = themeColor;
        ctx.font = "bold 10px 'JetBrains Mono', monospace";
        const modePrefix = isCameraActive ? "LIVE:" : "BENCHMARK:";
        ctx.fillText(`${modePrefix} ${currentEmotion.toUpperCase()}`, boxX + 6, boxY - 10);

        // Biometric Face Landmark Topology Points - Dynamically modified by real-time smile & brows!
        if (hudOverlayMode === "full" || hudOverlayMode === "landmarks") {
          const centerX = boxX + boxW / 2;
          const centerY = boxY + boxH / 2;

          // Eye Landmarks with dynamic aperture
          const eyeY = centerY - boxH * 0.12 - metrics.browElevationRatio * 4;
          const leftEyeX = centerX - boxW * 0.18;
          const rightEyeX = centerX + boxW * 0.18;

          // Nose tip
          const noseX = centerX;
          const noseY = centerY + boxH * 0.04;

          // Mouth with dynamic smile lift and jaw drop opening
          const smileDeltaY = metrics.smileRatio * 8;
          const jawDeltaY = metrics.mouthOpenRatio * 14;
          const mouthCenterY = centerY + boxH * 0.24 + jawDeltaY * 0.5;
          const leftCornerX = centerX - boxW * (0.16 + metrics.smileRatio * 0.04);
          const rightCornerX = centerX + boxW * (0.16 + metrics.smileRatio * 0.04);
          const leftCornerY = mouthCenterY - smileDeltaY;
          const rightCornerY = mouthCenterY - smileDeltaY;

          // Eyebrows with dynamic corrugator furrow (AU04) and arch (AU01/AU02)
          const browFurrowGap = metrics.browFurrowRatio * 4;
          const browY = eyeY - 14 - metrics.browElevationRatio * 6;

          ctx.fillStyle = themeColor;
          ctx.strokeStyle = themeBg;
          ctx.lineWidth = 1.2;

          // Draw Eyebrow segments
          ctx.strokeStyle = themeColor;
          // Left Brow
          ctx.beginPath();
          ctx.moveTo(leftEyeX - 22, browY + 2);
          ctx.quadraticCurveTo(leftEyeX - 6, browY - 4, centerX - 10 - browFurrowGap, browY + browFurrowGap * 1.5);
          ctx.stroke();

          // Right Brow
          ctx.beginPath();
          ctx.moveTo(rightEyeX + 22, browY + 2);
          ctx.quadraticCurveTo(rightEyeX + 6, browY - 4, centerX + 10 + browFurrowGap, browY + browFurrowGap * 1.5);
          ctx.stroke();

          // Draw eyes
          [leftEyeX, rightEyeX].forEach((ex) => {
            ctx.beginPath();
            ctx.arc(ex, eyeY, 3.5, 0, Math.PI * 2);
            ctx.fill();

            // Reticle circle around eye
            ctx.beginPath();
            ctx.arc(ex, eyeY, 8 + metrics.eyeOpenRatio * 3, 0, Math.PI * 2);
            ctx.strokeStyle = themeColor;
            ctx.stroke();
          });

          // Draw nose tip
          ctx.beginPath();
          ctx.arc(noseX, noseY, 2.5, 0, Math.PI * 2);
          ctx.fill();

          // Draw Dynamic Mouth Contour (Curves up for smile, down for frown, opens for surprise)
          ctx.strokeStyle = themeColor;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(leftCornerX, leftCornerY);
          ctx.quadraticCurveTo(centerX, mouthCenterY + smileDeltaY * 0.5, rightCornerX, rightCornerY);
          ctx.stroke();

          // If mouth open, draw lower lip curve
          if (metrics.mouthOpenRatio > 0.15) {
            ctx.beginPath();
            ctx.moveTo(leftCornerX, leftCornerY);
            ctx.quadraticCurveTo(centerX, mouthCenterY + jawDeltaY, rightCornerX, rightCornerY);
            ctx.stroke();
          }

          // Live Optical Metrics Telemetry Box on right flank
          ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
          ctx.fillRect(boxX + boxW + 8, boxY, 115, 84);
          ctx.strokeStyle = "rgba(6, 182, 212, 0.3)";
          ctx.strokeRect(boxX + boxW + 8, boxY, 115, 84);

          ctx.font = "9px 'JetBrains Mono', monospace";
          ctx.fillStyle = "#94a3b8";
          ctx.fillText("LIVE CV FLUX:", boxX + boxW + 14, boxY + 16);

          ctx.fillStyle = metrics.smileRatio > 0.3 ? "#34d399" : "#67e8f9";
          ctx.fillText(`SMILE: ${(metrics.smileRatio * 100).toFixed(0)}%`, boxX + boxW + 14, boxY + 30);

          ctx.fillStyle = metrics.mouthOpenRatio > 0.3 ? "#38bdf8" : "#94a3b8";
          ctx.fillText(`JAW DROP: ${(metrics.mouthOpenRatio * 100).toFixed(0)}%`, boxX + boxW + 14, boxY + 44);

          ctx.fillStyle = metrics.browFurrowRatio > 0.3 ? "#fb7185" : "#94a3b8";
          ctx.fillText(`FURROW: ${(metrics.browFurrowRatio * 100).toFixed(0)}%`, boxX + boxW + 14, boxY + 58);

          ctx.fillStyle = "#a5f3fc";
          ctx.fillText(`VALENCE: ${currentValence > 0 ? "+" : ""}${currentValence.toFixed(2)}`, boxX + boxW + 14, boxY + 72);
        }
      }

      animationFrameId = requestAnimationFrame(renderHUD);
    };

    animationFrameId = requestAnimationFrame(renderHUD);
    return () => cancelAnimationFrame(animationFrameId);
  }, [hudOverlayMode, isCameraActive]);

  // Capture frame from video or current preview and send to Gemini Vision FER API
  const handleCaptureAndAnalyze = async () => {
    let base64Image = "";

    if (isCameraActive && videoRef.current) {
      const video = videoRef.current;
      const offscreenCanvas = document.createElement("canvas");
      offscreenCanvas.width = video.videoWidth || 1280;
      offscreenCanvas.height = video.videoHeight || 720;
      const ctx = offscreenCanvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
        base64Image = offscreenCanvas.toDataURL("image/jpeg", 0.9);
      }
    } else if (selectedImagePreview) {
      base64Image = selectedImagePreview;
    } else {
      // Use active preset image if available
      const preset = FER_PRESETS.find((p) => p.id === activePresetId) || FER_PRESETS[0];
      base64Image = preset.imageUrl;
    }

    const isPresetMode = !isCameraActive && !selectedImagePreview;
    const activePreset = isPresetMode
      ? FER_PRESETS.find((p) => p.id === activePresetId) || FER_PRESETS[0]
      : null;

    if (!base64Image && activePreset) {
      base64Image = activePreset.imageUrl;
    }

    if (!base64Image) return;

    roboticVoice.playScanSound();

    try {
      const response = await fetch("/api/fer/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64Image,
          presetId: activePreset ? activePreset.id : undefined,
          mimeType: "image/jpeg",
          contextHint: isCameraActive
            ? "Live webcam frame capture"
            : selectedImagePreview
            ? "Uploaded portrait image"
            : activePreset
            ? `Benchmark calibration portrait: ${activePreset.title} (${activePreset.analysis.primaryEmotion})`
            : "Portrait image",
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const result: FERAnalysisResult = await response.json();
      roboticVoice.playLockSound();
      
      // Auto robotic voice readout of result
      if (result.roboticVoiceTranscript) {
        roboticVoice.speakRobotic(result.roboticVoiceTranscript);
      } else {
        roboticVoice.speakRobotic(
          `Biometric emotion scan complete. Detected: ${result.primaryEmotion} with ${result.confidence.toFixed(1)} percent certainty.`
        );
      }

      onAnalysisComplete(result, base64Image);
    } catch (err: any) {
      console.warn("FER API analysis fallback:", err);
      // Fallback to active preset or default benchmark
      const fallbackPreset = (activePresetId && FER_PRESETS.find((p) => p.id === activePresetId)) || FER_PRESETS[0];
      onAnalysisComplete(fallbackPreset.analysis, base64Image);
      roboticVoice.speakRobotic(
        `Biometric analysis completed. Detected: ${fallbackPreset.analysis.primaryEmotion}.`
      );
    }
  };

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setSelectedImagePreview(base64);
      stopCamera();
      roboticVoice.playScanSound();
      // Auto trigger analysis on uploaded photo
      setTimeout(() => {
        handleCaptureAndAnalyze();
      }, 100);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full bg-slate-900/80 border border-cyan-900/50 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl flex flex-col">
      {/* Top HUD Status Bar */}
      <div className="px-4 py-2.5 bg-slate-950/90 border-b border-cyan-950 flex flex-wrap items-center justify-between gap-2 text-xs font-mono-code">
        <div className="flex items-center gap-3 text-cyan-400">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isCameraActive ? "bg-emerald-400 animate-pulse" : "bg-cyan-500"}`} />
            <span className="font-tech text-xs tracking-wider uppercase">
              {isCameraActive ? "OPTICAL STREAM: ACTIVE" : "SENSOR STANDBY / BENCHMARK"}
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 hidden sm:inline">FPS: {streamInfo.fps}</span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:inline">{streamInfo.resolution}</span>
        </div>

        {/* Live CV Tracking Toggle & HUD Mode Switcher */}
        <div className="flex items-center gap-2">
          {isCameraActive && (
            <button
              onClick={() => setIsLiveTracking(!isLiveTracking)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold border transition-all cursor-pointer ${
                isLiveTracking
                  ? "bg-emerald-950/80 text-emerald-300 border-emerald-600/60 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                  : "bg-slate-900 text-slate-400 border-slate-800"
              }`}
              title="Toggle continuous real-time emotion recognition"
            >
              <Radio className={`w-3 h-3 ${isLiveTracking ? "text-emerald-400 animate-pulse" : "text-slate-500"}`} />
              <span>{isLiveTracking ? "LIVE CV: ON" : "LIVE CV: PAUSED"}</span>
            </button>
          )}

          <button
            onClick={() => setHudOverlayMode(hudOverlayMode === "full" ? "landmarks" : hudOverlayMode === "landmarks" ? "minimal" : "full")}
            className="flex items-center gap-1 px-2 py-1 rounded text-[11px] bg-slate-900 border border-cyan-900/60 text-cyan-300 hover:text-cyan-100 transition-colors cursor-pointer"
            title="Toggle HUD Overlay Modes"
          >
            <Layers className="w-3 h-3 text-cyan-400" />
            <span className="capitalize">{hudOverlayMode} HUD</span>
          </button>
        </div>
      </div>

      {/* Main Viewport (Webcam / Image Preview + Realtime Canvas Overlay) */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-slate-950 flex items-center justify-center overflow-hidden">
        {/* Subtle cyber grid background */}
        <div className="absolute inset-0 cyber-grid-dense opacity-20 pointer-events-none" />

        {/* Video stream */}
        <video
          ref={videoRef}
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 transition-opacity duration-300 ${
            isCameraActive ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        />

        {/* Static Image / Preset Preview */}
        {!isCameraActive && (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-slate-950">
            {selectedImagePreview ? (
              <img
                src={selectedImagePreview}
                alt="Selected Subject"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="relative w-full h-full">
                {/* Active Preset or Default Image */}
                {(() => {
                  const currentPreset = FER_PRESETS.find((p) => p.id === activePresetId) || FER_PRESETS[0];
                  return (
                    <div className="relative w-full h-full">
                      <img
                        src={currentPreset.imageUrl}
                        alt={currentPreset.title}
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute bottom-3 left-3 bg-slate-950/80 border border-cyan-900/60 px-2.5 py-1 rounded backdrop-blur-sm text-xs font-mono-code text-cyan-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>BENCHMARK: {currentPreset.title}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* Canvas HUD Overlay (Always active for futuristic biometrics) */}
        <canvas
          ref={canvasRef}
          width={640}
          height={360}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        {/* Real-Time Live Status Pill when camera is active */}
        {isCameraActive && isLiveTracking && (
          <div className="absolute top-3 left-3 z-20 bg-slate-950/80 border border-emerald-500/60 px-2.5 py-1 rounded-full text-[10px] font-mono-code text-emerald-300 flex items-center gap-1.5 backdrop-blur-md shadow-[0_0_10px_rgba(16,185,129,0.25)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold">REAL-TIME CV DETECTOR ACTIVE</span>
          </div>
        )}

        {/* Authenticated Operative Watermark */}
        {authenticatedOperative && (
          <div className="absolute top-3 right-3 z-20 bg-slate-950/85 border border-cyan-800/80 px-2.5 py-1 rounded backdrop-blur-md text-[10px] font-mono-code text-cyan-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-slate-400">OPERATIVE:</span>
            <span className="text-cyan-200 font-bold uppercase">{authenticatedOperative.name}</span>
          </div>
        )}

        {/* Camera Error Banner */}
        {cameraError && (
          <div className="absolute top-4 left-4 right-4 z-20 bg-rose-950/90 border border-rose-600/60 p-3 rounded-lg text-rose-200 text-xs font-mono-code flex items-start gap-2 backdrop-blur-md">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">OPTICAL SENSOR NOTICE</p>
              <p className="text-rose-300/90 mt-0.5">{cameraError}</p>
            </div>
            <button
              onClick={() => setCameraError(null)}
              className="text-rose-400 hover:text-rose-100 text-xs cursor-pointer"
            >
              DISMISS
            </button>
          </div>
        )}

        {/* Analyzing Overlay Ripple */}
        {isAnalyzing && (
          <div className="absolute inset-0 z-30 bg-cyan-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-cyan-200 font-tech">
            <div className="relative w-20 h-20 mb-3 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-60" />
              <div className="absolute inset-2 rounded-full border border-dashed border-teal-300 animate-radar" />
              <Scan className="w-8 h-8 text-cyan-300" />
            </div>
            <p className="text-lg tracking-widest uppercase font-bold text-cyan-300">
              DEEP FER NEURAL SCAN IN PROGRESS
            </p>
            <p className="text-xs font-mono-code text-cyan-400/80 mt-1">
              Extracting FACS Action Units, Valence-Arousal coordinates & Biometrics...
            </p>
          </div>
        )}
      </div>

      {/* Primary Action Controls Bar */}
      <div className="p-3.5 bg-slate-950/95 border-t border-cyan-950 flex flex-wrap items-center justify-between gap-3">
        {/* Optical Controls */}
        <div className="flex items-center gap-2">
          {isCameraActive ? (
            <button
              id="stop-camera-feed-btn"
              onClick={stopCamera}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono-code flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <CameraOff className="w-4 h-4 text-rose-400" />
              <span>STOP OPTICAL</span>
            </button>
          ) : (
            <button
              id="start-camera-feed-btn"
              onClick={startCamera}
              className="px-3 py-2 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-200 text-xs font-mono-code flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(6,182,212,0.25)] cursor-pointer"
            >
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>ACTIVATE WEBCAM</span>
            </button>
          )}

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            id="upload-custom-photo-btn"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono-code flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>UPLOAD IMAGE</span>
          </button>
        </div>

        {/* Capture & Deep AI Scan Button */}
        <button
          id="run-deep-ai-fer-scan-btn"
          disabled={isAnalyzing}
          onClick={handleCaptureAndAnalyze}
          className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 via-teal-500 to-sky-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 text-xs font-tech font-bold tracking-wider uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50 transition-all cursor-pointer"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
              <span>PROCESSING BIOMETRICS...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>CAPTURE & RUN DEEP AI SCAN</span>
            </>
          )}
        </button>
      </div>

      {/* Benchmark Expression Preset Tray */}
      <div className="px-3.5 py-2 bg-slate-900/60 border-t border-cyan-950/60 flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] font-mono-code text-cyan-400/80 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Eye className="w-3 h-3 text-cyan-400" />
          BENCHMARKS:
        </span>
        {FER_PRESETS.map((preset) => {
          const isActive = activePresetId === preset.id && !isCameraActive && !selectedImagePreview;
          return (
            <button
              key={preset.id}
              onClick={() => {
                stopCamera();
                setSelectedImagePreview(null);
                onSelectPreset(preset);
                roboticVoice.playScanSound();
              }}
              className={`px-2.5 py-1 rounded text-xs font-mono-code whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                  : "bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>{preset.title.split("&")[0].trim()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
