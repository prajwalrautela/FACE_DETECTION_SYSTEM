// Robotic Voice & Futuristic Web Audio Synthesizer

class RoboticAudioEngine {
  private audioCtx: AudioContext | null = null;
  private isSpeaking = false;
  private onSpeakingStateChange?: (speaking: boolean) => void;

  constructor() {
    // AudioContext will be initialized on first user interaction or trigger
  }

  private initAudio() {
    if (!this.audioCtx && typeof window !== "undefined") {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  public setSpeakingListener(listener: (speaking: boolean) => void) {
    this.onSpeakingStateChange = listener;
  }

  // Futuristic Sound Effect: System Boot / Startup Surge
  public playBootSound() {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      
      // Sub-bass sweep
      const subOsc = this.audioCtx.createOscillator();
      const subGain = this.audioCtx.createGain();
      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(60, now);
      subOsc.frequency.exponentialRampToValueAtTime(320, now + 0.6);
      subGain.gain.setValueAtTime(0.3, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      subOsc.connect(subGain);
      subGain.connect(this.audioCtx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.9);

      // Cybernetic chime chord
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + 0.1 * i);
        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0.08, now + 0.1 * i);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8 + 0.1 * i);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now + 0.1 * i);
        osc.stop(now + 1.2);
      });
    } catch (e) {
      console.warn("AudioContext error:", e);
    }
  }

  // Futuristic Sound Effect: Biometric Scanning Chirp
  public playScanSound() {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.linearRampToValueAtTime(2400, now + 0.15);
      osc.frequency.linearRampToValueAtTime(1200, now + 0.3);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      // Lowpass filter for smooth synthetic sound
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1600, now);
      filter.Q.setValueAtTime(4, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      console.warn("AudioContext error:", e);
    }
  }

  // Futuristic Sound Effect: Target Locked / Detection Success
  public playLockSound() {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      [880, 1760].forEach((freq, idx) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.04, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.15);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.18);
      });
    } catch (e) {
      console.warn("AudioContext error:", e);
    }
  }

  // Robotic Voice Speech Synthesis via Web Speech API
  public speakRobotic(
    text: string,
    options?: { pitch?: number; rate?: number; onEnd?: () => void }
  ): boolean {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      console.warn("SpeechSynthesis not supported in this environment.");
      return false;
    }

    try {
      this.initAudio();
      window.speechSynthesis.cancel(); // Stop any pending speech

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Robotic configuration: lower pitch, calibrated rate, mechanical tone
      utterance.pitch = options?.pitch ?? 0.82;
      utterance.rate = options?.rate ?? 0.94;
      utterance.volume = 1.0;

      // Select robotic / crisp synth voice if available
      const voices = window.speechSynthesis.getVoices();
      const roboticVoice = voices.find(
        (v) =>
          v.name.includes("Zarvox") ||
          v.name.includes("Google US English") ||
          v.name.includes("Samantha") ||
          v.name.includes("Daniel") ||
          (v.lang.startsWith("en") && !v.name.includes("Natural"))
      ) || voices.find((v) => v.lang.startsWith("en")) || voices[0];

      if (roboticVoice) {
        utterance.voice = roboticVoice;
      }

      this.isSpeaking = true;
      this.onSpeakingStateChange?.(true);

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.onSpeakingStateChange?.(true);
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.onSpeakingStateChange?.(false);
        options?.onEnd?.();
      };

      utterance.onerror = (e) => {
        console.warn("SpeechSynthesis utterance error:", e);
        this.isSpeaking = false;
        this.onSpeakingStateChange?.(false);
      };

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err) {
      console.warn("Error running robotic speech synthesis:", err);
      this.isSpeaking = false;
      this.onSpeakingStateChange?.(false);
      return false;
    }
  }

  public stopSpeaking() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.onSpeakingStateChange?.(false);
    }
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
}

export const roboticVoice = new RoboticAudioEngine();
