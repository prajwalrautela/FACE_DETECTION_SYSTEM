import { useRef, useEffect, useState } from "react";
import { FACSUnit } from "../types/fer";
import { Grid, Eye, Compass, Activity } from "lucide-react";

interface BiometricFaceMeshProps {
  actionUnits?: FACSUnit[];
  primaryEmotion?: string;
  symmetryScore?: number;
}

export function BiometricFaceMesh({
  actionUnits = [],
  primaryEmotion = "Neutral",
  symmetryScore = 96.5,
}: BiometricFaceMeshProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [viewMode, setViewMode] = useState<"wireframe" | "constellation" | "vectors">("wireframe");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    // Detect intensities of key action units
    const au12 = actionUnits.find((u) => u.code === "AU12" || u.code === "AU06")?.intensity || 0;
    const au04 = actionUnits.find((u) => u.code === "AU04")?.intensity || 0;
    const au01 = actionUnits.find((u) => u.code === "AU01" || u.code === "AU02")?.intensity || 0;
    const au26 = actionUnits.find((u) => u.code === "AU26" || u.code === "AU25")?.intensity || 0;

    const render = (timeMs: number) => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const t = timeMs * 0.002;
      const cx = width / 2;
      const cy = height / 2 - 10;

      // Base proportions with Action Unit dynamics
      const smileOffset = (au12 / 5) * 22; // lifts mouth corners
      const browFurrow = (au04 / 5) * 12; // lowers and draws together brows
      const browLift = (au01 / 5) * 18;   // lifts forehead brows
      const jawDrop = (au26 / 5) * 25;    // drops chin and opens mouth

      // 68 Base Landmark definitions centered at (cx, cy)
      // Jawline (0-16)
      const jawPoints: [number, number][] = [];
      for (let i = 0; i <= 16; i++) {
        const angle = Math.PI * (0.85 + (i / 16) * 1.3);
        const rx = 105;
        const ry = 135 + jawDrop * (1 - Math.abs(i - 8) / 8);
        jawPoints.push([cx + Math.cos(angle) * rx, cy + Math.sin(angle) * ry + 15]);
      }

      // Left Eyebrow (17-21)
      const leftBrow: [number, number][] = [
        [cx - 75, cy - 55 - browLift + browFurrow * 0.5],
        [cx - 60, cy - 68 - browLift],
        [cx - 42, cy - 72 - browLift],
        [cx - 24, cy - 65 - browLift + browFurrow],
        [cx - 10, cy - 56 - browLift + browFurrow * 1.5],
      ];

      // Right Eyebrow (22-26)
      const rightBrow: [number, number][] = [
        [cx + 10, cy - 56 - browLift + browFurrow * 1.5],
        [cx + 24, cy - 65 - browLift + browFurrow],
        [cx + 42, cy - 72 - browLift],
        [cx + 60, cy - 68 - browLift],
        [cx + 75, cy - 55 - browLift + browFurrow * 0.5],
      ];

      // Nose bridge and tip (27-35)
      const noseBridge: [number, number][] = [
        [cx, cy - 45],
        [cx, cy - 25],
        [cx, cy - 5],
        [cx, cy + 15],
      ];
      const noseTip: [number, number][] = [
        [cx - 20, cy + 24],
        [cx - 10, cy + 28],
        [cx, cy + 30],
        [cx + 10, cy + 28],
        [cx + 20, cy + 24],
      ];

      // Left Eye (36-41)
      const eyeSquint = (au12 / 5) * 4;
      const leftEye: [number, number][] = [
        [cx - 65, cy - 30],
        [cx - 52, cy - 38 + eyeSquint],
        [cx - 36, cy - 38 + eyeSquint],
        [cx - 25, cy - 30],
        [cx - 36, cy - 22 - eyeSquint],
        [cx - 52, cy - 22 - eyeSquint],
      ];

      // Right Eye (42-47)
      const rightEye: [number, number][] = [
        [cx + 25, cy - 30],
        [cx + 36, cy - 38 + eyeSquint],
        [cx + 52, cy - 38 + eyeSquint],
        [cx + 65, cy - 30],
        [cx + 52, cy - 22 - eyeSquint],
        [cx + 36, cy - 22 - eyeSquint],
      ];

      // Outer Lips (48-59)
      const outerLips: [number, number][] = [
        [cx - 48, cy + 62 - smileOffset],
        [cx - 30, cy + 54 - smileOffset * 0.5],
        [cx - 12, cy + 52],
        [cx, cy + 54],
        [cx + 12, cy + 52],
        [cx + 30, cy + 54 - smileOffset * 0.5],
        [cx + 48, cy + 62 - smileOffset],
        [cx + 30, cy + 74 + jawDrop * 0.4],
        [cx + 12, cy + 78 + jawDrop * 0.5],
        [cx, cy + 79 + jawDrop * 0.5],
        [cx - 12, cy + 78 + jawDrop * 0.5],
        [cx - 30, cy + 74 + jawDrop * 0.4],
      ];

      // Inner Lips (60-67)
      const innerLips: [number, number][] = [
        [cx - 38, cy + 63 - smileOffset * 0.7],
        [cx - 12, cy + 58],
        [cx, cy + 60],
        [cx + 12, cy + 58],
        [cx + 38, cy + 63 - smileOffset * 0.7],
        [cx + 12, cy + 68 + jawDrop * 0.3],
        [cx, cy + 69 + jawDrop * 0.3],
        [cx - 12, cy + 68 + jawDrop * 0.3],
      ];

      const allGroups = [jawPoints, leftBrow, rightBrow, noseBridge, noseTip, leftEye, rightEye, outerLips, innerLips];

      // 1. Draw Mesh Lines / Wireframe
      if (viewMode === "wireframe") {
        ctx.strokeStyle = "rgba(6, 182, 212, 0.45)";
        ctx.lineWidth = 1.2;

        // Group contours
        allGroups.forEach((group) => {
          ctx.beginPath();
          group.forEach(([x, y], idx) => {
            if (idx === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          if (group === leftEye || group === rightEye || group === outerLips || group === innerLips) {
            ctx.closePath();
          }
          ctx.stroke();
        });

        // Inter-facial triangulation tessellation (connecting nose to cheeks and brows)
        ctx.strokeStyle = "rgba(6, 182, 212, 0.18)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        // Brow to nose bridge
        ctx.moveTo(leftBrow[4][0], leftBrow[4][1]);
        ctx.lineTo(noseBridge[0][0], noseBridge[0][1]);
        ctx.lineTo(rightBrow[0][0], rightBrow[0][1]);
        // Eyes to nose
        ctx.moveTo(leftEye[3][0], leftEye[3][1]);
        ctx.lineTo(noseBridge[2][0], noseBridge[2][1]);
        ctx.lineTo(rightEye[0][0], rightEye[0][1]);
        // Nose to mouth
        ctx.moveTo(noseTip[0][0], noseTip[0][1]);
        ctx.lineTo(outerLips[0][0], outerLips[0][1]);
        ctx.moveTo(noseTip[4][0], noseTip[4][1]);
        ctx.lineTo(outerLips[6][0], outerLips[6][1]);
        ctx.stroke();
      }

      // 2. Draw Landmark Constellation Nodes
      ctx.fillStyle = "#38bdf8";
      allGroups.forEach((group) => {
        group.forEach(([x, y]) => {
          ctx.beginPath();
          ctx.arc(x, y, viewMode === "constellation" ? 2.5 : 1.6, 0, Math.PI * 2);
          ctx.fill();
        });
      });

      // 3. Action Unit Vector Overlay Arrows
      if (viewMode === "vectors" || au12 > 0 || au04 > 0) {
        ctx.strokeStyle = "#f59e0b"; // amber vector arrow
        ctx.fillStyle = "#f59e0b";
        ctx.lineWidth = 2;

        // AU12 vectors at mouth corners
        if (au12 > 0) {
          [outerLips[0], outerLips[6]].forEach(([mx, my], idx) => {
            const dirX = idx === 0 ? -16 : 16;
            const dirY = -18;
            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(mx + dirX, my + dirY);
            ctx.stroke();

            // Arrow head
            ctx.beginPath();
            ctx.arc(mx + dirX, my + dirY, 3, 0, Math.PI * 2);
            ctx.fill();
          });
        }

        // AU04 vectors at eyebrows
        if (au04 > 0) {
          ctx.strokeStyle = "#ef4444"; // red corrugator
          ctx.fillStyle = "#ef4444";
          // Left brow inward down
          ctx.beginPath();
          ctx.moveTo(leftBrow[4][0], leftBrow[4][1]);
          ctx.lineTo(leftBrow[4][0] + 12, leftBrow[4][1] + 14);
          ctx.stroke();
          // Right brow inward down
          ctx.beginPath();
          ctx.moveTo(rightBrow[0][0], rightBrow[0][1]);
          ctx.lineTo(rightBrow[0][0] - 12, rightBrow[0][1] + 14);
          ctx.stroke();
        }
      }

      // Vertical Bilateral Symmetry Axis
      ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(cx, cy - 110);
      ctx.lineTo(cx, cy + 160);
      ctx.stroke();
      ctx.setLineDash([]);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [actionUnits, viewMode]);

  return (
    <div className="w-full bg-slate-900/80 border border-cyan-900/50 rounded-2xl p-4 backdrop-blur-md shadow-xl flex flex-col">
      <div className="flex items-center justify-between pb-3 border-b border-cyan-950/80 mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="font-tech text-sm tracking-wider uppercase text-cyan-200 font-bold">
            68-Point Facial Topology Mesh
          </h3>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1 text-[11px] font-mono-code bg-slate-950 p-0.5 rounded border border-slate-800">
          <button
            onClick={() => setViewMode("wireframe")}
            className={`px-2 py-1 rounded transition-colors ${
              viewMode === "wireframe" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-400"
            }`}
          >
            Mesh
          </button>
          <button
            onClick={() => setViewMode("constellation")}
            className={`px-2 py-1 rounded transition-colors ${
              viewMode === "constellation" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-400"
            }`}
          >
            Nodes
          </button>
          <button
            onClick={() => setViewMode("vectors")}
            className={`px-2 py-1 rounded transition-colors ${
              viewMode === "vectors" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-400"
            }`}
          >
            AU Vectors
          </button>
        </div>
      </div>

      {/* Canvas viewport */}
      <div className="relative w-full aspect-[4/3] bg-slate-950/80 rounded-xl overflow-hidden border border-cyan-950 flex items-center justify-center">
        <div className="absolute inset-0 cyber-grid-dense opacity-20 pointer-events-none" />
        <canvas
          ref={canvasRef}
          width={360}
          height={280}
          className="w-full h-full max-w-[360px] max-h-[280px]"
        />

        {/* Telemetry overlay tags */}
        <div className="absolute top-2.5 left-2.5 text-[10px] font-mono-code text-cyan-400/80 bg-slate-900/80 px-2 py-0.5 rounded border border-cyan-900/50">
          SYMMETRY: {symmetryScore.toFixed(1)}%
        </div>
        <div className="absolute top-2.5 right-2.5 text-[10px] font-mono-code text-teal-400/90 bg-slate-900/80 px-2 py-0.5 rounded border border-teal-900/50">
          AFFECT: {primaryEmotion.toUpperCase()}
        </div>
      </div>

      {/* Legend & Action Unit Feedback */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] font-mono-code text-slate-400">
        <div>
          <span className="text-slate-500 block">TOPOLOGY STANDARD:</span>
          <span className="text-cyan-300">Dlib / MediaPipe 68-pt</span>
        </div>
        <div>
          <span className="text-slate-500 block">DYNAMIC MUSCLE UNITS:</span>
          <span className="text-cyan-300">{actionUnits.length} active AUs</span>
        </div>
      </div>
    </div>
  );
}
