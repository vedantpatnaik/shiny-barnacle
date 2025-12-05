const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyB_C0pq7OReUgE-XH82INOmEfpK0mBmiZY';
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash-001';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`;

const callGeminiJson = async (prompt) => {
  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
      },
    }),
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || 'Gemini request failed');
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No content from Gemini');

    let cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    try {
      return JSON.parse(cleanText);
    } catch (err) {
      console.error('JSON Parse Error:', err, 'Raw Text:', text);
      throw new Error('Failed to parse Gemini JSON');
    }
};

export const translateText = async (text) => {
  if (!text) throw new Error('Text is required');
  const prompt = `You are a bilingual engine for English ↔ Mohawk. Detect direction automatically. Return JSON only (no prose) with keys: translation, gloss, explanation. Gloss must be literal. Explanation is a short grammatical cue (succinct, not verbose).
Input: ${text}`;
  return callGeminiJson(prompt);
};

export const learnWord = async (word) => {
  if (!word) throw new Error('Word is required');
  const prompt = `You are a compact lexical explainer for English ↔ Mohawk. Given a word or phrase, return JSON only with keys: definition, gloss, example, morph, pos, variants (array of related forms/stem variants).
Input: ${word}`;
  return callGeminiJson(prompt);
};

export const fetchWordnet = async (word) => {
  if (!word) throw new Error('Word is required');
  const prompt = `You build a small wordnet-like association graph. Return JSON only with keys: nodes (array of {id, value between 0 and 1}) and links (array of {source, target, weight between 0 and 1}). Use the input as the central node with value 1.0.
Input: ${word}`;
  const ensureGraph = (result) => {
    const base = word || 'seed';
    const nodes = Array.isArray(result?.nodes) ? result.nodes : [];
    const links = Array.isArray(result?.links) ? result.links : [];
    if (nodes.length && links.length) return { nodes, links };
    const demoNodes = [
      { id: base, value: 1.0 },
      { id: `${base}-1`, value: 0.8 },
      { id: `${base}-2`, value: 0.72 },
      { id: `${base}-3`, value: 0.65 },
    ];
    const demoLinks = demoNodes.slice(1).map((n) => ({ source: base, target: n.id, weight: n.value }));
    return { nodes: demoNodes, links: demoLinks };
  };

  try {
    const result = await callGeminiJson(prompt);
    return ensureGraph(result);
  } catch (err) {
    console.warn('Wordnet fallback to demo graph:', err?.message || err);
    return ensureGraph(null);
  }
};

