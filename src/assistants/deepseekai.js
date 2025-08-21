export class Assistant {
  #apiKey;
  #model;

  constructor(model = "deepseek/deepseek-chat") {
    this.#apiKey = import.meta.env.VITE_DEEPSEEK_AI_API_KEY;
    this.#model = model;
  }

  async chat(content, history = []) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.#apiKey}`,
        },
        body: JSON.stringify({
          model: this.#model,
          messages: [
            { role: "system", content: "You are a helpful AI assistant. Keep answers concise and relevant to the user input." },
            ...history,
            { role: "user", content },
          ],
        }),
      });

      const result = await response.json();
      return result.choices?.[0]?.message?.content || "";
    } catch (error) {
      console.error("DeepSeek Chat Error:", error);
      throw error;
    }
  }

  async *chatStream(content, history = []) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.#apiKey}`,
      },
      body: JSON.stringify({
        model: this.#model,
        messages: [
          { role: "system", content: "You are a helpful AI assistant. Keep answers concise and relevant to the user input." },
          ...history,
          { role: "user", content },
        ],
        stream: true,
      }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter(l => l.trim().startsWith("data:"));
      for (const line of lines) {
        if (line.includes("[DONE]")) break;
        try {
          const json = JSON.parse(line.replace("data:", "").trim());
          yield json.choices?.[0]?.delta?.content || "";
        } catch (e) {
          console.error("DeepSeek Stream Parse Error:", e);
        }
      }
    }
  }
}
