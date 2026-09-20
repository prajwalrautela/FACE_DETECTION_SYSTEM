export interface FACSUnit {
  code: string;
  name: string;
  muscle: string;
  intensity: number; // 1 to 5
  description: string;
}

export interface SecondaryEmotion {
  emotion: string;
  score: number; // 0 to 100
}

export interface LandmarkAnalysis {
  eyeOpenness: string;
  eyebrowPosition: string;
  mouthShape: string;
  microExpressionDetected: boolean;
  microExpressionNotes: string;
}

export interface ComputerVisionMetrics {
  detectedFaceBox: {
    x: number; // 0-100 percentage
    y: number;
    width: number;
    height: number;
  };
  symmetryScore: number; // 0-100
  textureVariation: string;
  estimatedAgeRange: string;
  estimatedHeadPose: {
    pitch: number;
    yaw: number;
    roll: number;
  };
}

export interface InterdisciplinaryContext {
  psychology: string;
  computerVision: string;
  machineLearning: string;
}

export interface FERAnalysisResult {
  source?: string;
  primaryEmotion: string;
  confidence: number;
  valence: number; // -1 to 1
  arousal: number; // -1 to 1
  secondaryEmotions: SecondaryEmotion[];
  facialActionUnits: FACSUnit[];
  landmarkAnalysis: LandmarkAnalysis;
  psychologicalAnalysis: string;
  computerVisionMetrics: ComputerVisionMetrics;
  interdisciplinaryContext: InterdisciplinaryContext;
  roboticVoiceTranscript?: string;
  timestamp?: string;
}

export interface FERPreset {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  analysis: FERAnalysisResult;
}

export interface MorphParameters {
  browHeight: number; // -50 to 50
  browFurrow: number; // 0 to 100
  eyeOpenness: number; // -50 to 50
  squint: number; // 0 to 100
  smileIntensity: number; // -100 (frown) to 100 (grin)
  mouthOpen: number; // 0 to 100
  jawDrop: number; // 0 to 100
  headTilt: number; // -20 to 20
}
