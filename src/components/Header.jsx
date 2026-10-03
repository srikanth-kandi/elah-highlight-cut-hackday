import React from "react";

export function Header({ onOpenApiKeyModal, isKeySet, onResetOriginal, activeCheckpointIndex }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="badge">Elah Hack Day</span>
        <h1>Highlight Cut Studio</h1>
      </div>
      <div className="topbar-actions">
        <button
          className={`btn-api-key ${isKeySet ? "key-active" : "key-inactive"}`}
          onClick={onOpenApiKeyModal}
          title="Configure Google Gemini API Key"
        >
          <span className="dot"></span>
          {isKeySet ? "Gemini API Connected" : "Set Gemini API Key"}
        </button>
        {activeCheckpointIndex > 0 && (
          <button className="secondary" onClick={onResetOriginal} title="Revert all changes to original start">
            ↺ Revert to Original
          </button>
        )}
      </div>
    </header>
  );
}
