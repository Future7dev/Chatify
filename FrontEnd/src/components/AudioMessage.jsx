import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Play, Pause } from "lucide-react";

export default function AudioMessage({ audioUrl, isMe }) {
  const waveformRef = useRef(null);
  const waveSurfer = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState("0:00");

  useEffect(() => {
    waveSurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: isMe ? "#bfdbfe" : "#d1d5db",
      progressColor: isMe ? "#1d4ed8" : "#374151",
      height: 40,
      barWidth: 2,
      cursorWidth: 0,
      responsive: true,
    });

    waveSurfer.current.load(audioUrl);

    waveSurfer.current.on("ready", () => {
      const d = waveSurfer.current.getDuration();
      setDuration(formatTime(d));
    });

    waveSurfer.current.on("finish", () => setPlaying(false));

    return () => waveSurfer.current.destroy();
  }, [audioUrl, isMe]);

  const togglePlay = () => {
    waveSurfer.current.playPause();
    setPlaying(prev => !prev);
  };

  const formatTime = secs => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="d-flex align-items-center gap-2 px-3 py-2 rounded"
      style={{
        background: isMe ? "#e0ecff" : "#f3f4f6",
        minWidth: "260px",
      }}
    >
      <button onClick={togglePlay} className="btn btn-light btn-sm">
        {playing ? <Pause size={16} /> : <Play size={16} />}
      </button>

      <div ref={waveformRef} style={{ width: "160px" }} />

      <small className="text-muted">{duration}</small>
    </div>
  );
}
