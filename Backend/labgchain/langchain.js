// Backend/labgchain/langchain.js
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { HumanMessage } from "@langchain/core/messages";
import fetch from "node-fetch"; // ensure node-fetch is installed if needed

const OLLAMA_BASE = process.env.OLLAMA_BASE || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "mistral";

const chatModel = new ChatOllama({
  baseUrl: OLLAMA_BASE,
  model: OLLAMA_MODEL
});

// simple heuristic fallback if Ollama is not available
const heuristicFallback = (description) => {
  const text = description.toLowerCase();
  const recs = [];
  if (text.includes("fever") || text.includes("cough")) {
    recs.push({ test: "Complete Blood Count (CBC)", reason: "Check for infection/inflammation", accuracy: 60 });
    recs.push({ test: "Malaria Test", reason: "If febrile in endemic region", accuracy: 50 });
  }
  if (text.includes("fatigue") || text.includes("weight") || text.includes("hair loss") || text.includes("cold intolerance")) {
    recs.push({ test: "Thyroid Function Test", reason: "Assess thyroid function", accuracy: 60 });
  }
  if (recs.length === 0) {
    recs.push({ test: "Basic Metabolic Panel", reason: "General health and screening", accuracy: 40 });
  }
  return recs;
};

const isOllamaAlive = async () => {
  try {
    const res = await fetch(`${OLLAMA_BASE}/v1/models`);
    return res.ok;
  } catch (e) {
    return false;
  }
};

const getTestRecommendations = async (description) => {
  // If Ollama is unreachable, return heuristic fallback
  const alive = await isOllamaAlive();
  if (!alive) {
    console.warn("Ollama not reachable at", OLLAMA_BASE, " — returning heuristic fallback");
    return heuristicFallback(description);
  }

  try {
    const prompt = `
    You are a clinical assistant.
    Patient says: "${description}"
    Based on these symptoms, suggest 2-5 relevant diagnostic lab tests and return ONLY valid JSON array, each item with keys: test, reason, accuracy.
    Example:
    [
      { "test": "CBC", "reason": "Check for infection", "accuracy": 91 }
    ]
    `;
    const response = await chatModel.invoke([new HumanMessage(prompt)]);
    // Some Ollama responses wrap content differently; try to parse carefully
    let content = response?.content || response?.text || "";
    // Remove any leading/trailing text to try to find JSON
    const jsonStart = content.indexOf("[");
    const jsonEnd = content.lastIndexOf("]");
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonStr = content.substring(jsonStart, jsonEnd + 1);
      try {
        const parsed = JSON.parse(jsonStr);
        return parsed;
      } catch (parseErr) {
        console.error("Error parsing JSON from Ollama response:", parseErr);
        return heuristicFallback(description);
      }
    } else {
      // can't find JSON — fallback
      return heuristicFallback(description);
    }
  } catch (error) {
    console.error("LangChain/Ollama Error:", error?.message || error);
    return heuristicFallback(description);
  }
};

export default getTestRecommendations;
