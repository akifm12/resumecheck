
import express from 'express';
import { GoogleGenAI, Type } from "@google/genai";
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

app.post('/api/analyze', async (req, res) => {
  const { resumeText } = req.body;

  if (!resumeText) {
    return res.status(400).json({ error: "Resume text is required" });
  }

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

    res.json(JSON.parse(response.text));
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Failed to analyze resume. Please try again later." });
  }
});

// Serve static files from the Vite build
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for React routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
