import { useState } from "react";
import { AuthenticatedOperative } from "../types/auth";
import { 
  ShieldCheck, 
  Lock, 
  RefreshCw, 
  LogOut, 
  User, 
  Sparkles, 
  Fingerprint,
  Calendar,
  X
} from "lucide-react";
import { clearStoredOperative } from "../utils/authStorage";
import { roboticVoice } from "../utils/roboticVoice";

interface OperativeProfileBadgeProps {
  operative: AuthenticatedOperative;
  onReauthenticate: () => void;
  onLogout: () => void;
}

export function OperativeProfileBadge({
  operative,
  onReauthenticate,
  onLogout,
}: OperativeProfileBadgeProps) {
  const [showIdCard, setShowIdCard] = useState(false);

  const handleSignOut = () => {
    clearStoredOperative();
    roboticVoice.playBootSound();
    roboticVoice.speakRobotic("Console locked. Operative session terminated.");
    onLogout();
  };

  return (
    <>
      {/* Top Bar Operative Pill */}
      <div className="flex items-center gap-2 bg-slate-900/90 border border-cyan-900/70 pl-1.5 pr-2.5 py-1 rounded-xl shadow-[0_0_12px_rgba(6,182,212,0.15)]">
        <button
          onClick={() => setShowIdCard(true)}
          className="relative group cursor-pointer flex items-center gap-2 text-left"
          title="Click to inspect Biometric Security ID Card"
        >
          {/* User's Enrolled Biometric Face Image */}
          <div className="relative w-7 h-7 rounded-full overflow-hidden border border-emerald-400/80 shadow-[0_0_8px_rgba(16,185,129,0.4)] shrink-0">
            <img
              src={operative.photoDataUrl}
              alt={operative.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-slate-950" />
          </div>

          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-[11px] font-mono-code font-bold text-slate-100 uppercase truncate max-w-[110px]">
                {operative.name}
              </span>
              <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
            </div>
            <div className="text-[9px] font-mono-code text-cyan-400/90 tracking-wider">
              AUTH: VERIFIED HUMAN
            </div>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-1 border-l border-slate-800 pl-1.5 ml-1">
          <button
            onClick={onReauthenticate}
            className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition-colors cursor-pointer"
            title="Re-authenticate or switch biometric identity"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleSignOut}
            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors cursor-pointer"
            title="Lock console & clear biometric authentication"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Futuristic Operative Security ID Modal */}
      {showIdCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 border border-cyan-500/60 rounded-2xl p-6 shadow-[0_0_40px_rgba(6,182,212,0.3)] space-y-4">
            {/* Close Button */}
            <button
              onClick={() => setShowIdCard(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 border-b border-cyan-950 pb-3">
              <Fingerprint className="w-6 h-6 text-cyan-400" />
              <div>
                <h3 className="font-tech text-base font-bold text-slate-100 uppercase tracking-wider">
                  BIOMETRIC SECURITY CREDENTIAL
                </h3>
                <p className="text-[10px] font-mono-code text-cyan-400/80">
                  ID: {operative.id} // ANTI-BOT CLEARANCE
                </p>
              </div>
            </div>

            {/* Identity Card Content */}
            <div className="flex items-start gap-4 bg-slate-950/80 p-4 rounded-xl border border-cyan-900/60">
              <div className="relative w-24 h-28 rounded-lg overflow-hidden border border-cyan-400/80 shrink-0 shadow-lg">
                <img
                  src={operative.photoDataUrl}
                  alt={operative.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-cyan-500/10 pointer-events-none" />
                <div className="absolute bottom-1 left-1 right-1 bg-slate-950/90 py-0.5 text-center text-[8px] font-mono-code text-emerald-400 border border-emerald-500/40 rounded">
                  VERIFIED HUMAN
                </div>
              </div>

              <div className="space-y-2 text-xs font-mono-code text-slate-300">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Operative Name:</span>
                  <span className="font-bold text-cyan-300 text-sm">{operative.name}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Security Level:</span>
                  <span className="text-teal-300">{operative.securityClearance}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Anti-Bot Rating:</span>
                  <span className="text-emerald-400 font-bold">{operative.antiBotScore}% (PASS)</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Token Signature:</span>
                  <span className="text-slate-400 text-[10px] font-mono-code truncate block max-w-[180px]">
                    {operative.token}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-between gap-3 text-xs font-mono-code">
              <button
                onClick={() => {
                  setShowIdCard(false);
                  onReauthenticate();
                }}
                className="flex-1 py-2 px-3 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>RE-ENROLL FACE</span>
              </button>

              <button
                onClick={() => {
                  setShowIdCard(false);
                  handleSignOut();
                }}
                className="py-2 px-3 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/60 text-rose-300 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span>LOCK CONSOLE</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
