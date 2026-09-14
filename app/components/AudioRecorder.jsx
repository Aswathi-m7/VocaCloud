"use client";

import { useEffect, useRef, useState } from "react";

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  useEffect(() => {
  if (!isRecording) {
    return;
  }

  const timer = setInterval(() => {
    setRecordingSeconds((seconds) => seconds + 1);
  }, 1000);

  return () => {
    clearInterval(timer);
  };
}, [isRecording]);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const recorder = new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType,
        });

        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Could not access microphone:", error);
    }
  }

  function stopRecording() {
    const recorder = mediaRecorderRef.current;

    if (!recorder) {
      return;
    }

    recorder.stop();
    setIsRecording(false);
  }

  function discardRecording() {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    setAudioUrl(null);
    audioChunksRef.current = [];
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
        remainingSeconds
    ).padStart(2, "0")}`;
  }

  return (
    <div>
      {isRecording ? (
        <div>
            <div className="recording-status">
            <span className="recording-dot" />
            <span>Recording</span>
            </div>

            <p className="recording-time">
            {formatTime(recordingSeconds)}
            </p>

            <button type="button" onClick={stopRecording}>
            Stop recording
            </button>
        </div>
      ) : (
        <button type="button" onClick={startRecording}>
          Start recording
        </button>
      )}

      {audioUrl && !isRecording && (
        <div>
          <audio controls src={audioUrl} />

          <button type="button" onClick={discardRecording}>
            Discard
          </button>
        </div>
      )}
    </div>
  );
}