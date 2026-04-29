// api.js
// Handles communication with AI APIs (Gemini and Groq).
// Prioritizes Groq if key is present, falls back to Gemini.

const GEMINI_MODEL = "gemini-2.0-flash";
const GROQ_MODEL = "llama-3.3-70b-versatile";

/**
 * Unified function to send messages to the configured AI API.
 */
export async function sendToAI(systemPrompt, messages) {
  const groqKey = process.env.REACT_APP_GROQ_API_KEY;
  const geminiKey = process.env.REACT_APP_GEMINI_API_KEY;

  if (groqKey) {
    return await sendToGroq(systemPrompt, messages, groqKey);
  } else if (geminiKey) {
    return await sendToGemini(systemPrompt, messages, geminiKey);
  } else {
    throw new Error(
      "No API key configured. Please add REACT_APP_GROQ_API_KEY or REACT_APP_GEMINI_API_KEY to your .env file."
    );
  }
}

/**
 * Sends a conversation to the Groq API (OpenAI-compatible).
 */
async function sendToGroq(systemPrompt, messages, apiKey) {
  const url = "https://api.groq.com/openai/v1/chat/completions";

  // Groq uses standard OpenAI format
  const formattedMessages = [
    { role: "system", content: systemPrompt },
    ...messages
  ];

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: formattedMessages,
      temperature: 0.85,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Groq API error ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

/**
 * Sends a conversation to the Gemini API.
 */
async function sendToGemini(systemPrompt, messages, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: { maxOutputTokens: 1024, temperature: 0.85 },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Gemini API error ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    if (data.candidates?.[0]?.finishReason === "SAFETY") {
      throw new Error("Response blocked by Gemini safety filters.");
    }
    throw new Error("Received an empty response from Gemini.");
  }

  return text;
}

