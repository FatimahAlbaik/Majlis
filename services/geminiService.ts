import { GoogleGenAI, Type } from '@google/genai';
import { Difficulty, MCQ } from '../types.ts';

const MAX_TEXT_LENGTH = 1_000_000; // A safe limit for the text to avoid overly large requests

export async function generateMcqs(
  text: string,
  topic: string,
  difficulty: Difficulty,
  count: number
): Promise<MCQ[]> {
  if (!process.env.API_KEY) {
    throw new Error('API_KEY environment variable is not set.');
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const truncatedText = text.length > MAX_TEXT_LENGTH ? text.substring(0, MAX_TEXT_LENGTH) : text;

  const prompt = `
    You are an expert in creating educational material. Based on the following text from a document, please generate ${count} multiple-choice questions (MCQs) about the topic of "${topic}". The difficulty level should be "${difficulty}".

    Each question must have exactly 4 options, and only one option can be correct. The correct answer must be one of the provided options. Ensure the entire response is only the JSON array, with no additional text, explanations, or markdown formatting.

    The text from the document is as follows:
    ---
    ${truncatedText}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: {
                type: Type.STRING,
                description: 'The question text.',
              },
              options: {
                type: Type.ARRAY,
                description: 'An array of 4 possible answers.',
                items: {
                  type: Type.STRING,
                },
              },
              answer: {
                type: Type.STRING,
                description: 'The correct answer, which must match one of the items in the options array.',
              },
            },
            required: ['question', 'options', 'answer'],
          },
        },
      },
    });

    const jsonString = response.text.trim();
    const generatedMcqs = JSON.parse(jsonString) as MCQ[];
    
    // Validate the response from the AI
    if (!Array.isArray(generatedMcqs)) {
      throw new Error("AI response is not a valid array.");
    }

    return generatedMcqs.map(mcq => {
      if (mcq.options.length !== 4 || !mcq.options.includes(mcq.answer)) {
        console.warn("Received a malformed MCQ from AI, skipping:", mcq);
        return null;
      }
      return mcq;
    }).filter((mcq): mcq is MCQ => mcq !== null);


  } catch (error) {
    console.error('Error generating MCQs:', error);
    throw new Error('Failed to generate MCQs. The AI model may have returned an invalid format.');
  }
}