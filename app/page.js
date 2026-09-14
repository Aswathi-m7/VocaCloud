import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";
import AudioRecorder from "./components/AudioRecorder";
import AudioUploader from "./components/AudioUploader";

export default function Home() {

  const [selectedAudio, setSelectedAudio] = useState(null);

  function handleAudioSelected(audio) {
  setSelectedAudio(audio);
}
  return (
    <main className="app">
      <section className="intro">
        <p className="eyebrow">Mentorship session tool</p>

        <h1>Audio Word Cloud</h1>

        <p className="description">
          Record or upload a conversation and turn it into a visual summary.
        </p>
      </section>

      <section className="audio-section">
        <h2>Add your audio</h2>

        <div className="input-options">
          <AudioRecorder onAudioSelected={handleAudioSelected} />

          <span>or</span>

          <AudioUploader onAudioSelected={handleAudioSelected} />
        </div>
      </section>
      {selectedAudio && (
      <p>
        Audio is ready for analysis.
      </p>
    )}
    </main>
  );
}