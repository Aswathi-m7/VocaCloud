"use client";

import { useEffect, useRef, useState } from "react";
import { MAX_RECORDING_SECONDS } from "../../lib/constants";

export default function AudioRecorder({
  onAudioSelected,
  onAudioCleared,
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [error, setError] = useState("");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    if (!isRecording) {
      return;
    }

    const timer = setInterval(() => {
      setRecordingSeconds((seconds) => {
        const nextSeconds = seconds + 1;

        if (nextSeconds >= MAX_RECORDING_SECONDS) {
          const recorder = mediaRecorderRef.current;

          if (recorder && recorder.state === "recording") {
            recorder.stop();
          }

          setIsRecording(false);
          setError("The recording reached the 10-minute maximum.");

          return MAX_RECORDING_SECONDS;
        }

        return nextSeconds;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [isRecording]);

  async function startRecording() {
    setError("");

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Microphone access is not supported by this browser.");
      }

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

        onAudioSelected(audioBlob);

        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        stream.getTracks().forEach((track) => track.stop());
      };

      setRecordingSeconds(0);

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Could not access microphone:", error);

      setError(
        "We couldn't access your microphone. Check your browser permissions and try again."
      );
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
    onAudioCleared();
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
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

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