import React from "react";

export const SAMPLE_VIDEOS = [
  {
    id: "sample-tech-demo",
    name: "Tech Demo & Pitch (60s)",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    duration: 60,
    description: "Sample product talk with intro, core pitch, and outro."
  },
  {
    id: "sample-interview",
    name: "Keynote Interview (30s)",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    duration: 30,
    description: "Short talking-head interview segment."
  }
];

export function VideoUploader({ currentVideo, onSelectVideo, onUploadCustom }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      // Determine duration using audio/video metadata loading
      const tempVideo = document.createElement("video");
      tempVideo.src = videoUrl;
      tempVideo.onloadedmetadata = () => {
        onUploadCustom({
          id: `custom-${Date.now()}`,
          name: file.name,
          url: videoUrl,
          duration: Math.round(tempVideo.duration) || 45,
          isCustom: true
        });
      };
    }
  };

  return (
    <div className="panel video-select-panel">
      <div className="section-title">
        <h3>📹 Source Video Selection</h3>
        <span className="source-info">
          {currentVideo ? `${currentVideo.name} (${currentVideo.duration}s)` : "Select Video"}
        </span>
      </div>

      <div className="video-options-grid">
        {SAMPLE_VIDEOS.map((sample) => (
          <button
            key={sample.id}
            className={`sample-card ${currentVideo?.id === sample.id ? "active" : ""}`}
            onClick={() => onSelectVideo(sample)}
          >
            <strong>{sample.name}</strong>
            <span>{sample.description}</span>
          </button>
        ))}

        <label className={`upload-card ${currentVideo?.isCustom ? "active" : ""}`}>
          <input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={handleFileChange} hidden />
          <strong>📁 Upload Custom Video</strong>
          <span>Select local MP4 / WebM video file</span>
        </label>
      </div>
    </div>
  );
}
