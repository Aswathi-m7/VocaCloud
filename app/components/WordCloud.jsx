"use client";

import { useRef } from "react";
import { toPng } from "html-to-image";
import styles from "../page.module.css";

export default function WordCloud({ terms }) {
  const wordCloudRef = useRef(null);

  if (!terms || terms.length === 0) {
    return <p>No prominent terms were found.</p>;
  }

  const maxCount = Math.max(...terms.map((term) => term.count));
  const minCount = Math.min(...terms.map((term) => term.count));

  function getFontSize(count) {
    if (maxCount === minCount) {
      return 32;
    }

    const minSize = 20;
    const maxSize = 56;

    const minLog = Math.log(minCount);
    const maxLog = Math.log(maxCount);
    const countLog = Math.log(count);

    const ratio =
      (countLog - minLog) / (maxLog - minLog);

    return minSize + ratio * (maxSize - minSize);
  }

  async function handleDownload() {
    if (!wordCloudRef.current) {
      return;
    }

    try {
      const dataUrl = await toPng(wordCloudRef.current, {
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.download = "vocacloud-word-cloud.png";
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Could not download word cloud:", error);
    }
  }

  return (
    <div>
      <div
        ref={wordCloudRef}
        className={styles["word-cloud"]}
        aria-label="Word cloud"
      >
        {terms.map((term) => (
          <span
            key={term.word}
            className={styles["word-cloud-term"]}
            style={{
              fontSize: `${getFontSize(term.count)}px`,
            }}
          >
            {term.word}
          </span>
        ))}
      </div>

      <button type="button" onClick={handleDownload}>
        Download PNG
      </button>
    </div>
  );
}