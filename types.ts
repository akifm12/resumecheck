
export interface ResumeSection {
  title: string;
  originalText: string;
  feedback: string;
  suggestedRewrite: string;
  score: number; // 0-100
  isFree: boolean;
}

export interface ResumeAnalysis {
  overallScore: number;
  summary: string;
  sections: ResumeSection[];
  keywordsMissing: string[];
  impactMetricsScore: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export type AppView = 'landing' | 'analyzing' | 'results' | 'pricing' | 'payment_pending';

export enum Plan {
  FREE = 'FREE',
  BASIC = 'BASIC',
  UNLIMITED = 'UNLIMITED',
  SUPER_PREMIUM = 'SUPER_PREMIUM'
}
