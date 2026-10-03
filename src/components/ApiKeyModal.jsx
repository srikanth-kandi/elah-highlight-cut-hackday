import React, { useState, useEffect } from "react";

export function ApiKeyModal({ isOpen, onClose, onSave }) {
  const [keyInput, setKeyInput] = useState("");

  useEffect(() => {
    if (isOpen) {
      setKeyInput(localStorage.getItem("GEMINI_API_KEY") || "");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSave(keyInput.trim());
    onClose();
  };

  const handleClear = () => {
    onSave("");
    setKeyInput("");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content panel" onClick={(e) => e.stopPropagation()}>
        <h2>Google Gemini API Integration</h2>
        <p className="modal-desc">
          Enter your <strong>Google Gemini API Key</strong> to send natural-language video edit prompts directly to <code>gemini-1.5-flash</code>.
        </p>

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="apiKey">Gemini API Key</label>
            <input
              id="apiKey"
              type="password"
              placeholder="AIzaSy..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="key-input"
              autoFocus
            />
          </div>

          <div className="modal-info">
            <span>ℹ️ If left blank, the studio automatically runs the local smart engine fallback for instant demo testing.</span>
          </div>

          <div className="modal-actions">
            {keyInput && (
              <button type="button" className="secondary danger" onClick={handleClear}>
                Remove Key
              </button>
            )}
            <button type="button" className="secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Save & Connect</button>
          </div>
        </form>
      </div>
    </div>
  );
}
