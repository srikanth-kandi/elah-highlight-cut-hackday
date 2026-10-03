import React, { useRef, useState, useEffect } from "react";
import { TimelineVisualizer } from "./TimelineVisualizer";

export function VideoPreviewer({ videoSource, compiledTimeline }) {
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTitleCard, setActiveTitleCard] = useState(null);
  const [activeCaption, setActiveCaption] = useState(null);

  const { activeIntervals = [], titleCards = [], captions = [], originalDuration = 60 } = compiledTimeline || {};

  // Track video playback time & auto-skip trimmed out sections
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    setCurrentTime(time);

    // Check if time falls into any active interval
    if (activeIntervals.length > 0) {
      const inActiveRange = activeIntervals.some(inv => time >= inv.start && time <= inv.end);
      
      if (!inActiveRange) {
        // Find next active interval after current time
        const nextInv = activeIntervals.find(inv => inv.start > time);
        if (nextInv) {
          videoRef.current.currentTime = nextInv.start;
        } else if (time >= originalDuration - 1 || time > activeIntervals[activeIntervals.length - 1].end) {
          // Reached end of edited timeline
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }
    }

    // Check title cards
    if (titleCards.length > 0 && time <= (titleCards[0].duration || 3)) {
      setActiveTitleCard(titleCards[0].text);
    } else {
      setActiveTitleCard(null);
    }

    // Check captions
    const matchedCaption = captions.find(cap => time >= cap.start && time <= cap.end);
    setActiveCaption(matchedCaption ? matchedCaption.text : null);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      // If at end, loop to start of first active interval
      if (activeIntervals.length > 0 && currentTime >= activeIntervals[activeIntervals.length - 1].end) {
        videoRef.current.currentTime = activeIntervals[0].start;
      }
      videoRef.current.play().catch(e => console.warn("Playback error:", e));
      setIsPlaying(true);
    }
  };

  const handleSeek = (targetTime) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  return (
    <div className="panel video-preview-panel">
      <div className="section-title">
        <h2>🎬 Edited Highlight Video Preview</h2>
        <span className="preview-status">{isPlaying ? "▶ Playing Preview" : "⏸ Paused"}</span>
      </div>

      <div className="video-player-frame">
        {/* Title Card Overlay */}
        {activeTitleCard && (
          <div className="video-overlay title-card-overlay">
            <div className="title-card-content">
              <h3>{activeTitleCard}</h3>
            </div>
          </div>
        )}

        {/* Caption Overlay */}
        {activeCaption && (
          <div className="video-overlay caption-overlay">
            <div className="caption-box">{activeCaption}</div>
          </div>
        )}

        <video
          ref={videoRef}
          src={videoSource?.url}
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          playsInline
          className="main-video-element"
        />
      </div>

      {/* Control Buttons */}
      <div className="preview-controls">
        <button onClick={togglePlay} className="btn-play">
          {isPlaying ? "⏸ Pause Preview" : "▶ Play Highlight Preview"}
        </button>
        <button className="secondary" onClick={() => handleSeek(activeIntervals[0]?.start || 0)}>
          ⏮ Jump to Highlight Start
        </button>
      </div>

      {/* Graphical Timeline Visualizer */}
      <TimelineVisualizer
        compiledTimeline={compiledTimeline}
        currentTime={currentTime}
        onSeek={handleSeek}
      />
    </div>
  );
}
