import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const audio = formData.get("audio");

    if (!audio) {
      return Response.json(
        {
          error: "No audio file was provided.",
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await audio.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString("base64");

    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: [
        {
          type: "text",
          text: "Transcribe this audio accurately. Return only the transcript.",
        },
        {
          type: "audio",
          data: base64Audio,
          mime_type: audio.type,
        },
      ],
    });

    return Response.json({
      transcript: interaction.output_text,
    });
  } catch (error) {
    console.error("Audio analysis failed:", error);

    return Response.json(
      {
        error: "Could not analyze the audio.",
      },
      { status: 500 }
    );
  }
}