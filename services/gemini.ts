
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeAnalysis, FullRewriteResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeResume = async (resumeText: string): Promise<ResumeAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `ACT AS AN ELITE RECRUITMENT AUDITOR. Analyze the following resume:
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
    if (parsed.sections) {
      parsed.sections = parsed.sections.map((s: any, idx: number) => ({ ...s, isFree: idx === 0 }));
    }
    return parsed;
  } catch (error) {
    console.error("Analysis Error:", error);
    throw new Error("Analysis failed. Please try again.");
  }
};

export const fullRewriteResume = async (resumeText: string): Promise<FullRewriteResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `ACT AS A TOP-TIER EXECUTIVE RESUME WRITER. 
      Completely transform this resume into a professional, structured document using the Action-Result framework.
      
      Resume text to rewrite:
      """
      ${resumeText}
      """`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: {
              type: Type.OBJECT,
              properties: {
                header: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    title: { type: Type.STRING },
                    email: { type: Type.STRING },
                    phone: { type: Type.STRING },
                    location: { type: Type.STRING },
                    linkedin: { type: Type.STRING },
                    website: { type: Type.STRING }
                  },
                  required: ["name", "title", "email", "phone", "location"]
                },
                summary: { type: Type.STRING },
                experience: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      company: { type: Type.STRING },
                      position: { type: Type.STRING },
                      dateRange: { type: Type.STRING },
                      location: { type: Type.STRING },
                      bullets: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["company", "position", "dateRange", "location", "bullets"]
                  }
                },
                education: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      school: { type: Type.STRING },
                      degree: { type: Type.STRING },
                      dateRange: { type: Type.STRING },
                      location: { type: Type.STRING }
                    },
                    required: ["school", "degree", "dateRange", "location"]
                  }
                },
                skills: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      category: { type: Type.STRING },
                      items: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["category", "items"]
                  }
                }
              },
              required: ["header", "summary", "experience", "education", "skills"]
            }
          },
          required: ["content"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Rewrite Error:", error);
    throw new Error("Full rewrite failed.");
  }
};
