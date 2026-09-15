"use client";

import styles from "../page.module.css";

export default function WordCloud({ terms }) {
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

    const ratio = (count - minCount) / (maxCount - minCount);

    return minSize + ratio * (maxSize - minSize);
  }

  return (
    <div className={styles["word-cloud"]} aria-label="Word cloud">
      {terms.map((term) => (
        <span
          key={term.word}
          className={styles["word-cloud-term"]}
          style={{ fontSize: `${getFontSize(term.count)}px` }}
        >
          {term.word}
        </span>
      ))}
    </div>
  );
}