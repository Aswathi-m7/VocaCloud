"use client";

import { useState } from "react";
import { validateAudioFile } from "../../lib/audioValidation";

export default function AudioUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  async function handleFileChange(event) {
  const file = event.target.files?.[0];

  setError("");
  setSelectedFile(null);

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
  } catch (error) {
    console.error("Could not validate audio file:", error);

    setError("We couldn't read this audio file. Please try another file.");
  } finally {
    setIsChecking(false);
  }
}

  return (
    <div>
      <label htmlFor="audio-upload">Choose an audio file</label>

      <input
        id="audio-upload"
        type="file"
        accept=".mp3,.wav,.m4a,audio/mpeg,audio/wav,audio/mp4"
        onChange={handleFileChange}
      />

      {isChecking && <p>Checking audio file...</p>}

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      {selectedFile && (
        <p>
          Selected: {selectedFile.name}
        </p>
      )}
    </div>
  );
}