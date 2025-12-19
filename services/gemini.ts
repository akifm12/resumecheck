
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeAnalysis, FullRewriteResponse } from "../types";

// The API key is injected by the environment. 
// For Cloud Run, set this as an environment variable in the GCP Console.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Rapid Health Check using Gemini 3 Flash for speed and reliability.
 */
export const analyzeResume = async (resumeText: string): Promise<ResumeAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `ACT AS AN ELITE RECRUITMENT AUDITOR. 
      Analyze the provided resume text and provide a brutal, realistic health check.
      
      Resume text:
      """
      ${resumeText}
      """`,
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
    
    // Safety check: Ensure at least one section is marked free for the preview
    if (parsed.sections && parsed.sections.length > 0) {
      parsed.sections = parsed.sections.map((s: any, idx: number) => ({
        ...s,
        isFree: idx === 0
      }));
    }
    
    return parsed;
  } catch (error) {
    console.error("Gemini SDK Analysis Error:", error);
    throw new Error("AI analysis timed out. Please try a shorter version of your resume.");
  }
};

/**
 * Executive Rewrite using Gemini 3 Pro for superior writing quality.
 */
export const fullRewriteResume = async (resumeText: string): Promise<FullRewriteResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `ACT AS A WORLD-CLASS EXECUTIVE RESUME WRITER. 
      Completely transform the following resume into a modern, high-impact career document.
      
      GUIDELINES:
      - Use strong action verbs.
      - Focus heavily on quantifiable results (Impact).
      - Ensure professional, executive tone.
      - Output the result as a cleanly formatted text document.
      
      Original Resume:
      """
      ${resumeText}
      """`,
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
    console.error("Gemini SDK Rewrite Error:", error);
    throw new Error("Full rewrite failed. Please check your network and try again.");
  }
};
