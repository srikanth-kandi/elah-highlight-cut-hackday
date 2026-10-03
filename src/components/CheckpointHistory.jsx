import React from "react";

export function CheckpointHistory({ history, currentIndex, onRevertTo, onRevertToOriginal }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="panel checkpoint-panel">
      <div className="section-title">
        <h3>📜 Revision Checkpoint History & One-Click Revert</h3>
        {currentIndex > 0 && (
          <button className="secondary danger-btn" onClick={onRevertToOriginal}>
            ↺ Complete Start Revert
          </button>
        )}
      </div>

      <div className="checkpoint-timeline-list">
        {history.map((cp, idx) => {
          const isActive = idx === currentIndex;
          const isPast = idx < currentIndex;

          return (
            <div
              key={cp.id}
              className={`checkpoint-item ${isActive ? "active" : ""} ${isPast ? "past" : ""}`}
              onClick={() => onRevertTo(idx)}
              title="Click to revert video state to this checkpoint"
            >
              <div className="checkpoint-marker">
                <span className="node-dot"></span>
              </div>
              <div className="checkpoint-details">
                <div className="cp-header">
                  <strong>{cp.title}</strong>
                  <span className="cp-time">{cp.timestamp}</span>
                </div>
                <p className="cp-prompt">"{cp.prompt}"</p>
                {isActive && <span className="active-tag">Active State</span>}
              </div>
              {!isActive && (
                <button className="btn-rollback" onClick={(e) => { e.stopPropagation(); onRevertTo(idx); }}>
                  Revert Here
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
