import React from "react";

export const SAMPLE_VIDEOS = [
  {
    id: "sample-bunny-local",
    name: "Big Buck Bunny Short (33s)",
    url: "/sample-bunny.mp4",
    duration: 33,
    description: "Bundled local HD animated video clip.",
    samplePrompts: [
      "Trim the first 5s intro, keep key comedy action, and add title card 'Big Buck Bunny Cut'.",
      "Shorten intro and outro by 3 seconds, and add key takeaway caption."
    ]
  },
  {
    id: "sample-nature-local",
    name: "Nature Flower (5s)",
    url: "/sample-nature.mp4",
    duration: 5,
    description: "Bundled local flower blooming video.",
    samplePrompts: [
      "Trim 1s from start, keep flower bloom, and add caption 'Nature Highlight'.",
      "Trim 1s end, add title card 'Nature Clip'."
    ]
  },
  {
    id: "sample-ocean",
    name: "Ocean Exploration (46s)",
    url: "https://vjs.zencdn.net/v/oceans.mp4",
    duration: 46,
    description: "Ocean documentary clip (VideoJS CDN).",
    samplePrompts: [
      "Trim 5s intro, keep deep ocean sequence, and add title card 'Ocean Wonders'.",
      "Cut end section by 5s and add subtitle caption 'Marine Life'."
    ]
  },
  {
    id: "sample-sintel",
    name: "Sintel Action Reel (52s)",
    url: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
    duration: 52,
    description: "Open fantasy action trailer (W3C CDN).",
    samplePrompts: [
      "Trim 5s intro, remove filler section, add caption 'Cinematic Action', and trim ending credits.",
      "Create a highlight cut: trim intro, add title card 'Sintel Reel', and add caption."
    ]
  },
  {
    id: "sample-tears-long",
    name: "Tears of Steel Movie (12m 14s)",
    url: "https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4",
    duration: 734,
    description: "Full open sci-fi film (720p, Internet Archive CDN).",
    samplePrompts: [
      "Trim intro to start at 45s, remove dialogue filler from 180s to 300s, and add title card 'Tears of Steel Feature'.",
      "Create a 45-second high-energy action cut from 120s to 165s with title card 'Action Highlight'."
    ]
  },
  {
    id: "sample-bunny-long",
    name: "Big Buck Bunny Full (9m 56s)",
    url: "https://media.w3.org/2010/05/bunny/movie.mp4",
    duration: 596,
    description: "Full open animation feature film (W3C CDN).",
    samplePrompts: [
      "Trim 30s opening credits, keep main action segment from 30s to 300s, and add title card 'Big Buck Bunny Feature Cut'.",
      "Extract a 60-second highlight reel starting from 60s, add caption 'Core Highlights', and trim end credits."
    ]
  },
  {
    id: "sample-store-long",
    name: "Store Motion Footage (2m 00s)",
    url: "https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/store-aisle-detection.mp4",
    duration: 120,
    description: "2-minute store walking motion footage (GitHub CDN).",
    samplePrompts: [
      "Trim the first 10s setup, keep main aisle walking sequence from 10s to 90s, and add caption 'Customer Flow Analysis'.",
      "Shorten intro and trailing 15s, and add title card 'Store Footage Sample'."
    ]
  }
];

export function VideoUploader({ currentVideo, onSelectVideo, onUploadCustom }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
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
