// googleai.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_API_KEY);

export class Assistant {
  #model;
  #modelType;
  name = "googleai";

  constructor(model = "gemini-2.0-flash", modelType = "text") {
    console.log(`Initializing model: ${model}, type: ${modelType}`);
    this.#model = genAI.getGenerativeModel({ model });
    this.#modelType = modelType;
  }

  // Method for streaming text responses (no changes here)
  async *#chatStreamText(content) {
    const stream = await this.#model.generateContentStream(content);
    for await (const chunk of stream.stream) {
      const chunkText = chunk.text();
      yield chunkText;
    }
  }

  // Method for generating images (no changes here)
  async *#generateImage(content) {
  console.log("Using image generation logic...");

  const prompt = `Generate an image of: ${content}`;

  try {
    const result = await this.#model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"]
      }
    });

    const response = await result.response;
    console.log("Full image generation response:", response);

    const parts = response.candidates?.[0]?.content?.parts || [];
    let output = "";

    for (const part of parts) {
      if (part.text) {
        output += part.text + "\n\n";
      }
      if (part.inlineData?.mimeType?.startsWith("image/") && part.inlineData.data) {
        // Inline base64 image
        output += `![Generated Image](data:${part.inlineData.mimeType};base64,${part.inlineData.data})\n\n`;
      }
      if (part.fileData?.fileUri) {
        // URL to image
        output += `![Generated Image](${part.fileData.fileUri})\n\n`;
      }
    }

    yield output.trim();
  } catch (err) {
    console.error("Image generation error:", err);
    throw err;
  }
}



  // Main stream method that routes to the correct logic (no changes here)
  async *chatStream(content) {
    try {
      if (this.#modelType === "image") {
        yield* this.#generateImage(content);
      } else {
        yield* this.#chatStreamText(content);
      }
    } catch (error) {
      console.error("Error in chatStream:", error);
      throw error;
    }
  }

  #parseError(error) {
    try {
      // Extract and parse the outer error JSON from the message string
      const [, outerErrorJSON] = error?.message?.split(" . ");
      const outerErrorObject = JSON.parse(outerErrorJSON);

      // Parse the nested stringified JSON from the outer error
      const innerErrorObject = JSON.parse(outerErrorObject?.error?.message);

      return innerErrorObject?.error;
    } catch (parseError) {
      return error;
    }
  }
}
