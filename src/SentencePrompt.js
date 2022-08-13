import { useEffect, useRef, useState } from "react";
import Diff from "./Diff";
import SentenceHints from "./SentenceHints";
import "./SentencePrompt.css";

const computeDiff = (x, y) => window.diff_match_patch.prototype.diff_main(x, y);

const SentencePrompt = ({ sentence, onComplete }) => {
  const textArea = useRef(null);

  const [diffs, setDiffs] = useState({ first: null, last: null });
  const addDiff = d => setDiffs(old => ({ first: old.first || d, last: d }))
  const resetDiffs = () => setDiffs({ first: null, last: null });

  const onEnter = target => {
    const diff = computeDiff(sentence.original, target.value);
    if (sentence.original === target.value) {
      target.value = "";
      onComplete(diffs.first || diff);
      resetDiffs();
    } else addDiff(diff);
  };
  const inputListener = e => { if (e.key === 'Enter') { e.preventDefault(); onEnter(e.target) } };

  useEffect(() => textArea.current.scrollIntoView({ behavior: "smooth" }), [diffs]);

  return (
    <div className="SentencePrompt">
      <SentenceHints sentence={sentence} />
      <Diff diff={diffs.last} />
      <textarea type="text" onKeyDown={inputListener} ref={textArea} />
    </div>
  )
};

export default SentencePrompt;