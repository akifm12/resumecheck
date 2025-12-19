
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeAnalysis, FullRewriteResponse } from "../types";

// The API key is injected via environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Performs a comprehensive resume health check.
 */
export const analyzeResume = async (resumeText: string): Promise<ResumeAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `You are an elite executive career coach and ATS expert. Analyze the following resume text for a "Professional Health Check".
      
      CRITERIA:
      1. IMPACT: Look for quantifiable metrics.
      2. VERBS: Replace weak verbs with power verbs.
      3. ATS: Identify missing industry keywords.
      
      Resume:
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

    const result = JSON.parse(response.text || "{}");
    
    // Logic: First section is always free for the user to see the quality.
    if (result.sections && result.sections.length > 0) {
      result.sections = result.sections.map((s: any, idx: number) => ({
        ...s,
        isFree: idx === 0
      }));
    }
    
    return result;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("AI analysis failed. Please try again.");
  }
};

/**
 * Performs a complete, professional resume rewrite.
 */
export const fullRewriteResume = async (resumeText: string): Promise<FullRewriteResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `ACT AS A TOP-TIER WORLD-CLASS RESUME WRITER. 
      Completely rewrite the following resume into a professional, modern, high-impact version. 
      
      INSTRUCTIONS:
      1. Use the "Action-Result" bullet point format. 
      2. Integrate quantifiable metrics (%, $, time) for every achievement. 
      3. Ensure the tone is sophisticated and executive-ready.
      4. Structure the document with clear headings: Contact Info (Placeholder), Summary, Professional Experience, Education, Skills.
      
      Original Resume Data:
      """
      ${resumeText}
      """`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING, description: "The full text of the rewritten resume" }
          },
          required: ["content"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Rewrite Error:", error);
    throw new Error("Failed to generate a full rewrite.");
  }
};
