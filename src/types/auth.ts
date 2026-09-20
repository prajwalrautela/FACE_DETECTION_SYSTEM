export interface AuthenticatedOperative {
  id: string;
  name: string;
  photoDataUrl: string;
  enrolledAt: string;
  isHumanVerified: boolean;
  livenessMethod: string;
  securityClearance: string;
  token: string;
  antiBotScore: number;
}
