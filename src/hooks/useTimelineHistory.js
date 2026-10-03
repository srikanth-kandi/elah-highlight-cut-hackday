import { useState, useCallback } from "react";

export function useTimelineHistory(initialDuration = 60) {
  const initialCheckpoint = {
    id: "checkpoint-0",
    index: 0,
    title: "Original Video",
    timestamp: new Date().toLocaleTimeString(),
    prompt: "Initial state prior to AI editing",
    plan: null,
    compiledTimeline: {
      activeIntervals: [{ start: 0, end: initialDuration, label: "Full Uncut Video" }],
      activeDuration: initialDuration,
      originalDuration: initialDuration,
      titleCards: [],
      captions: []
    }
  };

  const [history, setHistory] = useState([initialCheckpoint]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const addCheckpoint = useCallback((plan, compiledTimeline, promptText) => {
    const nextIndex = history.length;
    const newCheckpoint = {
      id: `checkpoint-${nextIndex}`,
      index: nextIndex,
      title: `Checkpoint ${nextIndex}: ${plan.summary || "AI Edit"}`,
      timestamp: new Date().toLocaleTimeString(),
      prompt: promptText,
      plan,
      compiledTimeline
    };

    setHistory(prev => [...prev.slice(0, currentIndex + 1), newCheckpoint]);
    setCurrentIndex(nextIndex);
  }, [history.length, currentIndex]);

  const revertTo = useCallback((targetIndex) => {
    if (targetIndex >= 0 && targetIndex < history.length) {
      setCurrentIndex(targetIndex);
    }
  }, [history.length]);

  const revertToOriginal = useCallback(() => {
    setCurrentIndex(0);
  }, []);

  const resetHistoryWithNewVideo = useCallback((newDuration) => {
    const newInitial = {
      id: "checkpoint-0",
      index: 0,
      title: "Original Video",
      timestamp: new Date().toLocaleTimeString(),
      prompt: "Initial state prior to AI editing",
      plan: null,
      compiledTimeline: {
        activeIntervals: [{ start: 0, end: newDuration, label: "Full Uncut Video" }],
        activeDuration: newDuration,
        originalDuration: newDuration,
        titleCards: [],
        captions: []
      }
    };
    setHistory([newInitial]);
    setCurrentIndex(0);
  }, []);

  return {
    history,
    currentIndex,
    currentCheckpoint: history[currentIndex] || initialCheckpoint,
    addCheckpoint,
    revertTo,
    revertToOriginal,
    resetHistoryWithNewVideo
  };
}
