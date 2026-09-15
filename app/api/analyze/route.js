import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST() {
  try {
    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: "Reply with exactly: Gemini connection successful.",
    });

    return Response.json({
      message: interaction.output_text,
    });
  } catch (error) {
    console.error("Gemini request failed:", error);

    return Response.json(
      {
        error: "Could not connect to Gemini.",
      },
      { status: 500 }
    );
  }
}