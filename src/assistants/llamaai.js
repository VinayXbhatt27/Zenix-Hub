import OpenAI  from 'openai';

export class Assistant {
  #model;
  #apiUrl;
  #apiKey;

  constructor(model = "meta-llama/llama-3.3-70b-instruct") {
    this.#model = model;
    this.#apiUrl = "https://openrouter.ai/api/v1/chat/completions";
    this.#apiKey = import.meta.env.VITE_LLAMA_AI_API_KEY;
  }

  async chat(content, history) {
    try {
      const res = await fetch(this.#apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.#apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.#model,
          messages: [...history, { role: "user", content }],
        }),
      });

      if (!res.ok) {
        const errMsg = await res.text().catch(() => res.statusText);
        throw new Error(`HTTP ${res.status}: ${errMsg}`);
      }

      const data = await res.json();
      return data.choices?.[0]?.message?.content || "";
    } catch (error) {
      throw error;
    }
  }

  async *chatStream(content, history) {
    let res;
    try {
      res = await fetch(this.#apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.#apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.#model,
          messages: [...history, { role: "user", content }],
          stream: true,
        }),
      });

      if (!res.ok) {
        const errMsg = await res.text().catch(() => res.statusText);
        throw new Error(`HTTP ${res.status}: ${errMsg}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter(line => line.trim());

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.replace("data: ", "");
            if (data === "[DONE]") return;

            try {
              const json = JSON.parse(data);
              const text =
                json.choices?.[0]?.delta?.content ||
                json.choices?.[0]?.message?.content ||
                "";
              if (text && !text.toUpperCase().includes("OPENROUTER PROCESSING")) {
                yield text;
              }
            } catch {
              continue;
            }
          }
        }
      }
    } catch (error) {
      throw error;
    }
  }
}
