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
      text: `
Transcribe this audio and identify the prominent topics and terms discussed.

Return your response as valid JSON with exactly this structure:

{
  "transcript": "full transcript here",
  "terms": [
    {
      "word": "term or short phrase",
      "count": 1
    }
  ]
}

Rules for terms:
- Remove filler words and common stopwords.
- Prefer meaningful topics, concepts, and phrases.
- Combine obvious variations of the same term where appropriate.
- Keep multi-word phrases when they represent a meaningful concept.
- Count how often each selected term or phrase appears in the transcript.
- Do not include explanations outside the JSON.
      `,
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

    const result = JSON.parse(interaction.output_text);

return Response.json({
  transcript: result.transcript,
  terms: result.terms,
});
  }
}