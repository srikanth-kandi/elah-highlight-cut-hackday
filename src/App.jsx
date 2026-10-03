import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { ApiKeyModal } from "./components/ApiKeyModal";
import { VideoUploader, SAMPLE_VIDEOS } from "./components/VideoUploader";
import { PromptPanel } from "./components/PromptPanel";
import { PlanFlowViewer } from "./components/PlanFlowViewer";
import { VideoPreviewer } from "./components/VideoPreviewer";
import { CheckpointHistory } from "./components/CheckpointHistory";

import { useTimelineHistory } from "./hooks/useTimelineHistory";
import { generateEditPlan } from "./services/geminiService";
import { validateEditPlan } from "./services/validator";

export default function App() {
  const [currentVideo, setCurrentVideo] = useState(SAMPLE_VIDEOS[0]);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const envKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY || import.meta.env.VITE_ELAH_API_KEY || "";
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("GEMINI_API_KEY") || envKey);
  const [isGenerating, setIsGenerating] = useState(false);
  const [proposedPlan, setProposedPlan] = useState(null);
  const [lastPrompt, setLastPrompt] = useState("");

  const {
    history,
    currentIndex,
    currentCheckpoint,
    addCheckpoint,
    revertTo,
    revertToOriginal,
    resetHistoryWithNewVideo
  } = useTimelineHistory(currentVideo.duration);

  // Handle Video Selection & reset checkpoint timeline
  const handleSelectVideo = (video) => {
    setCurrentVideo(video);
    setProposedPlan(null);
    resetHistoryWithNewVideo(video.duration);
  };

  // Handle Save API key
  const handleSaveApiKey = (newKey) => {
    setApiKey(newKey);
    if (newKey) {
      localStorage.setItem("GEMINI_API_KEY", newKey);
    } else {
      localStorage.removeItem("GEMINI_API_KEY");
    }
  };

  // Step 1: Handle Prompt Submission -> AI Plan Generation & Validation
  const handlePromptSubmit = async (userPrompt) => {
    setIsGenerating(true);
    setProposedPlan(null);
    setLastPrompt(userPrompt);

    try {
      // 1. Call Gemini AI or Smart Fallback Engine
      const rawPlan = await generateEditPlan(userPrompt, currentVideo.duration, apiKey);
      
      // 2. Validate plan against Elah structural video guidelines
      const validatedPlan = validateEditPlan(rawPlan, currentVideo.duration);

      setProposedPlan(validatedPlan);
    } catch (err) {
      console.error("Error generating edit plan:", err);
      alert(`Error generating edit plan: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Step 2: Approve & Apply Plan -> Save to Checkpoint History
  const handleApprovePlan = () => {
    if (!proposedPlan) return;
    addCheckpoint(proposedPlan, proposedPlan.compiledTimeline, lastPrompt);
    setProposedPlan(null);
  };

  // Reject Plan
  const handleRejectPlan = () => {
    setProposedPlan(null);
  };

  return (
    <main className="app-shell">
      <Header
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        isKeySet={Boolean(apiKey)}
        onResetOriginal={revertToOriginal}
        activeCheckpointIndex={currentIndex}
      />

      <div className="layout-grid">
        <div className="left-column">
          {/* Video Selector */}
          <VideoUploader
            currentVideo={currentVideo}
            onSelectVideo={handleSelectVideo}
            onUploadCustom={handleSelectVideo}
          />

          {/* Prompt Input */}
          <PromptPanel
            onSubmitPrompt={handlePromptSubmit}
            isGenerating={isGenerating}
          />

          {/* Proposed AI Plan Flow Viewer (Requires Approval) */}
          {proposedPlan && (
            <PlanFlowViewer
              plan={proposedPlan}
              onApprove={handleApprovePlan}
              onReject={handleRejectPlan}
              onRefine={() => setProposedPlan(null)}
              isApplied={false}
            />
          )}

          {/* Checkpoint History Timeline & Revert System */}
          <CheckpointHistory
            history={history}
            currentIndex={currentIndex}
            onRevertTo={revertTo}
            onRevertToOriginal={revertToOriginal}
          />
        </div>

        <div className="right-column">
          {/* Main Video Player & Visual Timeline */}
          <VideoPreviewer
            videoSource={currentVideo}
            compiledTimeline={currentCheckpoint.compiledTimeline}
          />
        </div>
      </div>

      {/* Gemini API Key Dialog */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSave={handleSaveApiKey}
      />
    </main>
  );
}
