import React from "react";

export function TimelineVisualizer({ compiledTimeline, currentTime, onSeek }) {
  if (!compiledTimeline) return null;

  const { activeIntervals = [], originalDuration = 60, activeDuration = 60, titleCards = [], captions = [] } = compiledTimeline;

  const handleTimelineClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetTime = Math.round(ratio * originalDuration);
    onSeek(targetTime);
  };

  const playheadPercent = (currentTime / originalDuration) * 100;

  return (
    <div className="timeline-visualizer-container">
      <div className="timeline-meta">
        <span className="duration-meta">
          Original: <strong>{originalDuration}s</strong> | Edited Net Duration: <strong>{activeDuration}s</strong>
        </span>
        <span className="scrubber-meta">Current Playhead: <strong>{currentTime.toFixed(1)}s</strong></span>
      </div>

      <div className="timeline-track-wrapper" onClick={handleTimelineClick} title="Click to jump playhead">
        {/* Scrubber Playhead Line */}
        <div className="playhead-line" style={{ left: `${playheadPercent}%` }} />

        {/* Intervals rendering */}
        <div className="timeline-track">
          {activeIntervals.map((inv, idx) => {
            const leftPercent = (inv.start / originalDuration) * 100;
            const widthPercent = ((inv.end - inv.start) / originalDuration) * 100;

            return (
              <div
                key={idx}
                className="timeline-segment active-segment"
                style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
              >
                <span className="segment-label">{inv.label} ({inv.start}s - {inv.end}s)</span>
              </div>
            );
          })}
        </div>

        {/* Overlays track */}
        <div className="overlays-track">
          {titleCards.map((tc, idx) => (
            <div key={`tc-${idx}`} className="overlay-marker title-card-marker" style={{ left: `0%`, width: `10%` }}>
              🎴 Title Card
            </div>
          ))}

          {captions.map((cap, idx) => {
            const leftPercent = (cap.start / originalDuration) * 100;
            const widthPercent = Math.max(5, ((cap.end - cap.start) / originalDuration) * 100);
            return (
              <div
                key={`cap-${idx}`}
                className="overlay-marker caption-marker"
                style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
              >
                💬 Caption
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
