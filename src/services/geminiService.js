/**
 * Gemini AI Service for Elah Highlight Cut Studio
 * Supports Google Gemini API (v1beta) with structured JSON format & smart fallback engine.
 */

const SYSTEM_INSTRUCTIONS = `
You are an AI video editing assistant for Elah Highlight Cut Studio.
Your job is to convert natural language video editing requests into a structured JSON edit plan.

ALLOWED OPERATIONS:
1. "trimStart": Trim the beginning of the video. Params: { "seconds": number }
2. "trimEnd": Trim the end of the video. Params: { "seconds": number }
3. "keepRange": Keep a specific segment of the video. Params: { "start": number, "end": number, "label": string }
4. "removeSection": Remove a specific segment. Params: { "start": number, "end": number, "reason": string }
5. "addTitleCard": Add a text overlay title card at the start. Params: { "text": string, "duration": number }
6. "addCaption": Add a caption text overlay over a time range. Params: { "text": string, "start": number, "end": number }

CRITICAL RULES:
- Return ONLY a JSON object with this exact schema:
{
  "summary": "Brief summary of the edit plan",
  "operations": [
    {
      "action": "trimStart" | "trimEnd" | "keepRange" | "removeSection" | "addTitleCard" | "addCaption" | "unsupportedAction",
      "params": { ... },
      "explanation": "Why this action is performed"
    }
  ]
}
- If the user asks for unsupported operations (e.g., "add 3D explosions", "change color grading", "face swap"), include an operation with action "unsupportedAction" and explain why it is not supported in the params or explanation.
- Keep timestamp parameters within reasonable bounds based on video duration provided in prompt.
`;

export async function generateEditPlan(userPrompt, videoDuration = 60, apiKey = "") {
  const envKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY || import.meta.env.VITE_ELAH_API_KEY;
  const cleanKey = apiKey?.trim() || localStorage.getItem("GEMINI_API_KEY")?.trim() || envKey?.trim();

  if (cleanKey) {
    try {
      return await fetchFromGemini(userPrompt, videoDuration, cleanKey);
    } catch (err) {
      console.warn("Gemini API call failed, using intelligent fallback engine:", err);
      return fallbackEngine(userPrompt, videoDuration, `API Notice: ${err.message}. Used fallback.`);
    }
  }

  return fallbackEngine(userPrompt, videoDuration);
}

async function fetchFromGemini(userPrompt, videoDuration, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const promptContent = `
Video total duration: ${videoDuration} seconds.
User Editing Request: "${userPrompt}"

Generate a structured edit plan in JSON following the system instructions.
`;

  const requestBody = {
    contents: [
      {
        parts: [
          { text: SYSTEM_INSTRUCTIONS },
          { text: promptContent }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json"
    }
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textOutput) {
    throw new Error("No text response received from Gemini API");
  }

  const parsed = JSON.parse(textOutput);
  return {
    source: "gemini_api",
    summary: parsed.summary || "AI Generated Edit Plan",
    operations: parsed.operations || []
  };
}

/**
 * Fallback engine for guaranteed reliable hackathon demos even offline or without API key.
 */
function fallbackEngine(userPrompt, videoDuration, note = null) {
  const lower = userPrompt.toLowerCase();
  const operations = [];
  let summary = "Structured edit plan generated based on request analysis.";

  const hasExplosionOrUnsupported = lower.includes("explosion") || lower.includes("3d") || lower.includes("face swap") || lower.includes("laser");
  
  if (hasExplosionOrUnsupported) {
    summary = "Edit request contains unsupported operations. Valid parts extracted.";
    operations.push({
      action: "unsupportedAction",
      params: { requested: "VFX / 3D effects", limit: "Elah Hackday scope is focused on safe structural video cuts and captions." },
      explanation: "VFX / direct pixel manipulation is out of scope for browser structured editing."
    });
  }

  // Check for intro trim
  if (lower.includes("trim") || lower.includes("intro") || lower.includes("shorten") || lower.includes("cut start")) {
    const trimAmount = Math.min(10, Math.round(videoDuration * 0.15));
    operations.push({
      action: "trimStart",
      params: { seconds: trimAmount },
      explanation: `Trimming ${trimAmount}s off the intro for a faster hook.`
    });
  }

  // Check for title card
  if (lower.includes("title") || lower.includes("card") || lower.includes("header") || lower.includes("beginning")) {
    operations.push({
      action: "addTitleCard",
      params: { text: "Highlight Reel: Key Insights", duration: 3 },
      explanation: "Adding an engaging title card overlay at the beginning."
    });
  }

  // Check for keep main section
  const startKeep = operations.some(o => o.action === "trimStart") ? 10 : 0;
  const endKeep = Math.round(videoDuration * 0.75);
  operations.push({
    action: "keepRange",
    params: { start: startKeep, end: endKeep, label: "Core Key Takeaways" },
    explanation: `Preserving core content segment from ${startKeep}s to ${endKeep}s.`
  });

  // Check for captions
  if (lower.includes("caption") || lower.includes("subtitle") || lower.includes("takeaway") || lower.includes("text")) {
    operations.push({
      action: "addCaption",
      params: { text: "💡 Key takeaway: Safe, structured AI video editing", start: startKeep + 5, end: startKeep + 15 },
      explanation: "Inserting key takeaway text caption overlay."
    });
  }

  // Check for outro trim
  if (lower.includes("outro") || lower.includes("end") || lower.includes("trim end")) {
    const endTrim = Math.min(8, Math.round(videoDuration * 0.1));
    operations.push({
      action: "trimEnd",
      params: { seconds: endTrim },
      explanation: `Removing the trailing ${endTrim}s dead space at the end.`
    });
  }

  return {
    source: note ? "gemini_fallback" : "local_smart_engine",
    note,
    summary,
    operations
  };
}
