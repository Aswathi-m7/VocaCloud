"use client";

import { useState } from "react";
import { validateAudioFile } from "../../lib/audioValidation";

export default function AudioUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    setError("");
    setSelectedFile(null);

    const result = validateAudioFile(file);

    if (!result.valid) {
      setError(result.message);
      return;
    }

    setSelectedFile(file);
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