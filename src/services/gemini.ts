import { GoogleGenAI, Type } from "@google/genai";
import { Lawyer, ContractAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const geminiService = {
  async findLawyers(jurisdiction: string, postalCode: string): Promise<Lawyer[]> {
    const model = "gemini-3-flash-preview";
    const prompt = `Find and vet top-rated local probate lawyers in ${jurisdiction}, specifically near postal code ${postalCode}. 
    Filter for lawyers who:
    - Have assisted over 100 clients (or are highly experienced)
    - Have cross-border specialty
    - Have a rating > 4.0
    
    Return a list of 3 lawyers with their name, firm, rating, specialty, contact info, location, a brief description, and a pre-drafted inquiry email in the local language of ${jurisdiction}.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              firm: { type: Type.STRING },
              rating: { type: Type.NUMBER },
              specialty: { type: Type.STRING },
              contact: { type: Type.STRING },
              location: { type: Type.STRING },
              description: { type: Type.STRING },
              emailDraft: { type: Type.STRING },
            },
            required: ["name", "firm", "rating", "specialty", "contact", "location", "description", "emailDraft"],
          },
        },
      },
    });

    try {
      return JSON.parse(response.text || "[]");
    } catch (e) {
      console.error("Failed to parse lawyers", e);
      return [];
    }
  },

  async generateListing(description: string, images: string[], targetCountry: string): Promise<string> {
    const model = "gemini-3-flash-preview";
    const prompt = `Convert the following property description and images into a high-end, localized real estate listing for ${targetCountry}.
    Adjust the tone based on local market norms (e.g., formal for Germany, lifestyle-focused for Italy).
    
    Description: ${description}`;

    const parts = [
      { text: prompt },
      ...images.map(img => ({
        inlineData: {
          mimeType: "image/jpeg",
          data: img.split(",")[1]
        }
      }))
    ];

    const response = await ai.models.generateContent({
      model,
      contents: { parts },
    });

    return response.text || "Failed to generate listing.";
  },

  async analyzeContract(fileData: string): Promise<ContractAnalysis> {
    const model = "gemini-3-flash-preview";
    const prompt = `Analyze this legal document (likely a property contract or "Arras"). 
    Specifically flag:
    - Seller Liabilities
    - Tax Withholding
    - Commission Percentages
    - Any other Red Flags
    
    Provide a summary and lists for each category in plain English.`;

    const mimeType = fileData.split(";")[0].split(":")[1] || "image/jpeg";
    const base64Data = fileData.split(",")[1];

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType,
              data: base64Data
            }
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            liabilities: { type: Type.ARRAY, items: { type: Type.STRING } },
            taxes: { type: Type.ARRAY, items: { type: Type.STRING } },
            commissions: { type: Type.ARRAY, items: { type: Type.STRING } },
            redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["summary", "liabilities", "taxes", "commissions", "redFlags"],
        },
      },
    });

    try {
      return JSON.parse(response.text || "{}");
    } catch (e) {
      console.error("Failed to parse contract analysis", e);
      return {
        summary: "Error analyzing contract.",
        liabilities: [],
        taxes: [],
        commissions: [],
        redFlags: []
      };
    }
  }
};
