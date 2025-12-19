
export interface ResumeSection {
  title: string;
  originalText: string;
  feedback: string;
  suggestedRewrite: string;
  score: number;
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

export type AppView = 'landing' | 'analyzing' | 'results' | 'pricing' | 'payment_pending' | 'full-rewrite';

export enum Plan {
  FREE = 'FREE',
  BASIC = 'BASIC',
  UNLIMITED = 'UNLIMITED',
  SUPER_PREMIUM = 'SUPER_PREMIUM'
}

export interface StructuredResume {
  header: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    website?: string;
  };
  summary: string;
  experience: Array<{
    company: string;
    position: string;
    dateRange: string;
    location: string;
    bullets: string[];
  }>;
  education: Array<{
    school: string;
    degree: string;
    dateRange: string;
    location: string;
  }>;
  skills: Array<{
    category: string;
    items: string[];
  }>;
}

export interface FullRewriteResponse {
  content: StructuredResume;
}
