"use client";

import { useState } from "react";
import { validateAudioFile } from "../../lib/audioValidation";

export default function AudioUploader({
  onAudioSelected,
  onAudioCleared,
  disabled = false,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  async function handleFileChange(event) {
    const file = event.target.files?.[0];

    setError("");
    setSelectedFile(null);
    setDuration(0);

    if (!file) {
      return;
    }

    setIsChecking(true);

    try {
      const result = await validateAudioFile(file);

      if (!result.valid) {
        setError(result.message);
        return;
      }

      setSelectedFile(file);
      setDuration(result.duration);
      onAudioSelected(file);
    } catch (error) {
      console.error("Could not validate audio file:", error);

      setError(
        "We couldn't read this audio file. Please try another file."
      );
    } finally {
      setIsChecking(false);
    }
  }

  function handleClear() {
    setSelectedFile(null);
    setDuration(0);
    setError("");
    onAudioCleared();
  }

  function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }

  return (
    <div>
      <label htmlFor="audio-upload">Choose an audio file</label>

      <input
        id="audio-upload"
        type="file"
        accept=".mp3,.wav,.m4a,.aac,.ogg,.webm,.flac,audio/*"
        onChange={handleFileChange}
        disabled={disabled || isChecking}
      />

      {isChecking && <p>Checking audio file...</p>}

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      {selectedFile && (
        <div>
          <p>Selected: {selectedFile.name}</p>

          <p>
            Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
          </p>

          <p>
            Duration: {formatDuration(duration)}
          </p>

          <button type="button" onClick={handleClear}>
            Remove
          </button>
        </div>
      )}
    </div>
  );
}