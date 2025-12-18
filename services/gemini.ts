
import { ResumeAnalysis } from "../types";

/**
 * Calls the local secure backend proxy to perform the resume analysis.
 * This keeps the API_KEY hidden on the server.
 */
export const analyzeResume = async (resumeText: string): Promise<ResumeAnalysis> => {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ resumeText }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Analysis failed");
  }

  const result = await response.json();
  
  // Logic: First section is always free for the user to see the quality.
  if (result.sections && result.sections.length > 0) {
    result.sections = result.sections.map((s: any, idx: number) => ({
      ...s,
      isFree: idx === 0
    }));
  }
  
  return result;
};
