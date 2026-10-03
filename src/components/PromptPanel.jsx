import React, { useState } from "react";

const PRESET_PROMPTS = [
  {
    label: "✂️ Highlight Cut",
    prompt: "Trim the intro, keep the key answer, and add a title card at the start."
  },
  {
    label: "💡 Add Captions",
    prompt: "Shorten the video by trimming start and end, and add a key takeaway caption."
  },
  {
    label: "⚠️ Test Invalid Request",
    prompt: "Add 3D laser explosions, face swap effects, and background music replacement."
  }
];

export function PromptPanel({ onSubmitPrompt, isGenerating }) {
  const [promptText, setPromptText] = useState(PRESET_PROMPTS[0].prompt);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (promptText.trim() && !isGenerating) {
      onSubmitPrompt(promptText.trim());
    }
  };

  return (
    <section className="panel request-panel">
      <div className="section-title">
        <label htmlFor="request">✨ Natural Language Edit Request</label>
        <span className="info-tag">Elah AI Engine</span>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          id="request"
          rows={3}
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          placeholder="Describe your desired highlight cut in plain English..."
          disabled={isGenerating}
        />

        <div className="preset-bar">
          <span className="preset-label">Quick Presets:</span>
          {PRESET_PROMPTS.map((item, idx) => (
            <button
              key={idx}
              type="button"
              className="preset-chip"
              onClick={() => setPromptText(item.prompt)}
              disabled={isGenerating}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="prompt-actions">
          <button type="submit" disabled={isGenerating || !promptText.trim()} className="btn-generate">
            {isGenerating ? (
              <span className="loading-spinner-inline">Analyzing & Generating Plan...</span>
            ) : (
              "⚡ Generate Structured Edit Plan"
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
