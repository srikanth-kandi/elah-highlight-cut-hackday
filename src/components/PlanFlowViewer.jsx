import React from "react";

export function PlanFlowViewer({ plan, onApprove, onReject, onRefine, isApplied }) {
  if (!plan) return null;

  const { operations = [], stats = {}, summary, isValid, source } = plan;

  return (
    <div className={`panel plan-flow-panel ${isApplied ? "applied" : "pending-approval"}`}>
      <div className="flow-header">
        <div>
          <span className={`source-badge ${source === "gemini_api" ? "api" : "fallback"}`}>
            {source === "gemini_api" ? "Gemini 1.5 Flash Output" : "Elah Smart Engine Output"}
          </span>
          <h2>AI Edit Plan & Proposed Flow</h2>
          <p className="flow-summary">{summary}</p>
        </div>

        <div className="stats-badges">
          <span className="badge-stat valid">{stats.valid || 0} Valid Ops</span>
          {stats.warning > 0 && <span className="badge-stat warning">{stats.warning} Warnings</span>}
          {stats.invalid > 0 && <span className="badge-stat invalid">{stats.invalid} Unsupported</span>}
        </div>
      </div>

      <div className="plan-steps-container">
        <h3>Step-by-Step Execution Operations</h3>
        <ul className="plan-list">
          {operations.map((op) => (
            <li key={op.id} className={`plan-item ${op.status}`}>
              <div className="op-main">
                <div className="op-title">
                  <span className="op-number">#{op.id}</span>
                  <strong className="op-action">{op.action}</strong>
                  <span className={`status-pill ${op.status}`}>{op.status.toUpperCase()}</span>
                </div>
                <div className="op-explanation">{op.explanation}</div>
                {op.error && <div className="op-error">❌ {op.error}</div>}
                {op.warning && <div className="op-warning">⚠️ {op.warning}</div>}
              </div>

              <div className="op-params">
                <code>{JSON.stringify(op.params)}</code>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {!isApplied ? (
        <div className="approval-bar">
          <div className="approval-text">
            {isValid ? (
              <span>✅ All operations validated cleanly against Elah editing standards. Review and approve to apply to video timeline.</span>
            ) : (
              <span>⚠️ Plan contains unsupported operations. Only valid structural cut operations will be applied if approved.</span>
            )}
          </div>
          <div className="approval-actions">
            <button className="secondary danger" onClick={onReject}>
              ❌ Reject & Clear
            </button>
            <button className="secondary" onClick={onRefine}>
              ✏️ Refine Prompt
            </button>
            <button className="btn-approve" onClick={onApprove} disabled={stats.valid === 0}>
              ✅ Approve & Apply Edit Plan
            </button>
          </div>
        </div>
      ) : (
        <div className="applied-notice">
          <span>✓ This edit plan is currently applied to the video preview timeline.</span>
        </div>
      )}
    </div>
  );
}
