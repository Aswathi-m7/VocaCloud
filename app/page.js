"use client";

import styles from "./page.module.css";
import { useState } from "react";
import AudioRecorder from "./components/AudioRecorder";
import AudioUploader from "./components/AudioUploader";
import WordCloud from "./components/WordCloud";

export default function Home() {

  const [selectedAudio, setSelectedAudio] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisError, setAnalysisError] = useState("");

  function handleAudioSelected(audio) {
  setSelectedAudio(audio);
}

function handleAudioCleared() {
  setSelectedAudio(null);
}

async function handleAnalyze() {
  if (!selectedAudio) {
    return;
  }

  setIsAnalyzing(true);
  setUploadProgress(0);
  setAnalysisError("");

  try {
    const formData = new FormData();

    formData.append("audio", selectedAudio, "recording.webm");

    const data = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open("POST", "/api/analyze");

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round(
            (event.loaded / event.total) * 100
          );

          setUploadProgress(progress);
        }
      };

      xhr.onload = () => {
        try {
          const responseData = JSON.parse(xhr.responseText);

          if (xhr.status < 200 || xhr.status >= 300) {
            reject(
              new Error(
                responseData.error || "Analysis failed."
              )
            );
            return;
          }

          resolve(responseData);
        } catch {
          reject(new Error("Invalid response from the server."));
        }
      };

      xhr.onerror = () => {
        reject(new Error("Could not connect to the analysis server."));
      };

      xhr.send(formData);
    });

    setUploadProgress(100);
    setAnalysisResult(data);
  } catch (error) {
    console.error("Analysis failed:", error);

    setAnalysisError(
    error.message ||
      "We couldn't analyze the audio. Please try again."
    );
  } finally {
    setIsAnalyzing(false);
  }
}
  return (
    <main className={styles.page}>
      <section className={styles.intro}>
        <p className="eyebrow">Mentorship session tool</p>

        <h1>VocaCloud</h1>

        <p className="description">
          Record or upload a conversation and turn it into a visual summary.
        </p>
      </section>

      <section className={styles["audio-section"]}>
        <h2>Add your audio</h2>

        <div className={styles["input-options"]}>
          <AudioRecorder
            onAudioSelected={handleAudioSelected}
            onAudioCleared={handleAudioCleared}
            disabled={selectedAudio !== null || isAnalyzing}
          />

          <span>or</span>

          <AudioUploader
            onAudioSelected={handleAudioSelected}
            onAudioCleared={handleAudioCleared}
            disabled={selectedAudio !== null || isAnalyzing}
          />
        </div>
      </section>
      {selectedAudio && (
      <p>
        Audio is ready for analysis.
      </p>
    )}

     {selectedAudio && (
      <button
        type="button"
        onClick={handleAnalyze}
        disabled={isAnalyzing}
      >
        {isAnalyzing ? "Analyzing..." : "Analyze audio"}
      </button>
  
    )}
    {isAnalyzing && (
      <p>
        Uploading and analyzing: {uploadProgress}%
      </p>
    )}

    {analysisError && (
      <p className="error-message" role="alert">
        {analysisError}
      </p>
    )}

    {analysisResult && (
      <section className={styles.results}>
        <h2>Transcript</h2>
        <p>{analysisResult.transcript}</p>
      </section>
    )}
    {analysisResult && (
      <section className={styles.results}>
        <h2>Word cloud</h2>

        <WordCloud terms={analysisResult.terms} />
      </section>
    )}
    </main>
  );
}