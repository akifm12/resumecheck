
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeAnalysis, FullRewriteResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Rapid Health Check using Flash for responsiveness.
 */
export const analyzeResume = async (resumeText: string): Promise<ResumeAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Flash for fast initial scan
      contents: `Analyze this resume text. Act as a high-level ATS auditor.
      
      Resume Content:
      "${resumeText}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            impactMetricsScore: { type: Type.NUMBER },
            keywordsMissing: { type: Type.ARRAY, items: { type: Type.STRING } },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  originalText: { type: Type.STRING },
                  feedback: { type: Type.STRING },
                  suggestedRewrite: { type: Type.STRING },
                  score: { type: Type.NUMBER }
                },
                required: ["title", "originalText", "feedback", "suggestedRewrite", "score"]
              }
            }
          },
          required: ["overallScore", "summary", "sections", "keywordsMissing", "impactMetricsScore"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    if (parsed.sections) {
      parsed.sections = parsed.sections.map((s: any, i: number) => ({ ...s, isFree: i === 0 }));
    }
    return parsed;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw error;
  }
};

/**
 * Deep, high-quality rewrite using Pro.
 */
export const fullRewriteResume = async (resumeText: string): Promise<FullRewriteResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", // Pro for superior writing quality
      contents: `ACT AS AN EXECUTIVE RESUME WRITER. 
      Completely reconstruct the following resume into a professional, modern, high-impact document using Action-Result bullets and quantifiable metrics.
      
      Resume Data:
      "${resumeText}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING }
          },
          required: ["content"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Rewrite Error:", error);
    throw error;
  }
};
