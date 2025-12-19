
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeAnalysis, FullRewriteResponse } from "../types";

// Initialize AI with the environment key
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
      1. IMPACT: Look for quantifiable metrics (percentages, dollar amounts, time saved).
      2. VERBS: Replace weak, passive verbs with strong action verbs.
      3. ATS: Identify missing high-value industry keywords.
      
      Resume Data:
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
    
    // Safety check for free previews
    if (result.sections && result.sections.length > 0) {
      result.sections = result.sections.map((s: any, idx: number) => ({
        ...s,
        isFree: idx === 0
      }));
    }
    
    return result;
  } catch (error) {
    console.error("Gemini Health Check Error:", error);
    throw new Error("Failed to analyze resume. Please try again.");
  }
};

/**
 * Performs a complete, professional, executive-level resume rewrite.
 */
export const fullRewriteResume = async (resumeText: string): Promise<FullRewriteResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `ACT AS A WORLD-CLASS EXECUTIVE RESUME WRITER. 
      Completely reconstruct the provided resume into a high-impact, modern document.
      
      RULES:
      1. Use the "Action-Result" bullet point framework. 
      2. Every single achievement MUST include a quantifiable metric.
      3. Use sophisticated, industry-specific vocabulary.
      4. Format it as a clear text document with professional headings.
      
      Original Resume:
      """
      ${resumeText}
      """`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING, description: "The full, perfectly formatted text of the new resume" }
          },
          required: ["content"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Full Rewrite Error:", error);
    throw new Error("The AI writer encountered an error. Please try again.");
  }
};
