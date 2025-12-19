
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeAnalysis, FullRewriteResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeResume = async (resumeText: string): Promise<ResumeAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `ACT AS AN ELITE RECRUITMENT AUDITOR. 
      Analyze the provided resume text. 
      Identify its strengths, weaknesses, and keyword gaps.
      Provide specific, realistic feedback for each section found in the text.
      
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
    if (parsed.sections) {
      parsed.sections = parsed.sections.map((s: any, idx: number) => ({ ...s, isFree: idx === 0 }));
    }
    return parsed;
  } catch (error) {
    console.error("Analysis Error:", error);
    throw new Error("Analysis failed. Please check your text and try again.");
  }
};

export const fullRewriteResume = async (resumeText: string): Promise<FullRewriteResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `ACT AS A WORLD-CLASS EXECUTIVE RESUME WRITER.
      
      YOUR TASK:
      1. Extract ALL factual data from the user's provided resume text (Experience, Education, Skills, Contact info).
      2. Rewrite the content to be high-impact, result-oriented, and sophisticated.
      3. DO NOT MAKE UP FICTIONAL DATA. Use ONLY the facts found in the provided text.
      4. Use the "Action-Result" framework for all bullet points.
      5. Quantify achievements where possible based on the text provided.
      6. Return the data in a structured JSON format.
      
      USER RESUME TEXT:
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
                    title: { type: Type.STRING, description: "Professional title based on current experience" },
                    email: { type: Type.STRING },
                    phone: { type: Type.STRING },
                    location: { type: Type.STRING },
                    linkedin: { type: Type.STRING },
                    website: { type: Type.STRING }
                  },
                  required: ["name", "title", "email", "phone", "location"]
                },
                summary: { type: Type.STRING, description: "A high-impact 3-4 sentence summary of the candidate's career value proposition." },
                experience: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      company: { type: Type.STRING },
                      position: { type: Type.STRING },
                      dateRange: { type: Type.STRING },
                      location: { type: Type.STRING },
                      bullets: { type: Type.ARRAY, items: { type: Type.STRING }, description: "High-impact, result-oriented bullet points." }
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
                      category: { type: Type.STRING, description: "e.g., Technical Skills, Leadership, Soft Skills" },
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

    const result = JSON.parse(response.text || "{}");
    return result;
  } catch (error) {
    console.error("Full Rewrite Error:", error);
    throw new Error("Professional rewrite failed. The model may be busy, please try again.");
  }
};
