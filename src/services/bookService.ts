import { GoogleGenAI, Type } from "@google/genai";
import { Book } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getBookSuggestions(interest: string, timeInMinutes: number): Promise<Book[]> {
  const prompt = `Suggest 10 books for someone interested in "${interest}" who has about ${timeInMinutes} minutes to read. 
  Provide books that can be read in chunks or are short enough. 
  For each book, provide: title, author, a brief description, a realistic rating (0-5), and estimated total reading time in minutes.
  Also, provide a thematic "interest" category for each.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              author: { type: Type.STRING },
              description: { type: Type.STRING },
              rating: { type: Type.NUMBER },
              readingTime: { type: Type.NUMBER },
              interest: { type: Type.STRING }
            },
            required: ["title", "author", "description", "rating", "readingTime", "interest"]
          }
        }
      }
    });

    const suggestions = JSON.parse(response.text || "[]");
    
    return suggestions.map((s: any, index: number) => ({
      id: `gemini-${index}-${Date.now()}`,
      ...s,
      // Fallback cover image using picsum with a book-related seed
      coverUrl: `https://picsum.photos/seed/${encodeURIComponent(s.title)}/400/600`
    }));
  } catch (error) {
    console.error("Error fetching book suggestions:", error);
    return [];
  }
}

export async function getTrendingBooks(): Promise<Book[]> {
  const prompt = `Suggest 10 trending books across various genres. 
  For each book, provide: title, author, a brief description, a realistic rating (0-5), and estimated total reading time in minutes.
  Also, provide a thematic "interest" category for each.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              author: { type: Type.STRING },
              description: { type: Type.STRING },
              rating: { type: Type.NUMBER },
              readingTime: { type: Type.NUMBER },
              interest: { type: Type.STRING }
            },
            required: ["title", "author", "description", "rating", "readingTime", "interest"]
          }
        }
      }
    });

    const suggestions = JSON.parse(response.text || "[]");
    
    return suggestions.map((s: any, index: number) => ({
      id: `trending-${index}-${Date.now()}`,
      ...s,
      coverUrl: `https://picsum.photos/seed/${encodeURIComponent(s.title)}/400/600`
    }));
  } catch (error) {
    console.error("Error fetching trending books:", error);
    return [];
  }
}
