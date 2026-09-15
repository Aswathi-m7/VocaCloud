"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";
import AudioRecorder from "./components/AudioRecorder";
import AudioUploader from "./components/AudioUploader";
import WordCloud from "./components/WordCloud";

export default function Home() {

  const [selectedAudio, setSelectedAudio] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  try {
    const formData = new FormData();

    formData.append("audio", selectedAudio, "recording.webm");

    const response = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Analysis failed.");
    }

    setAnalysisResult(data);
  } catch (error) {
    console.error("Analysis failed:", error);
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