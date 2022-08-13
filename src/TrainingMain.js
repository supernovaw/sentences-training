import { useState } from "react";
import Diff from "./Diff";
import SentencePrompt from "./SentencePrompt";
import "./TrainingMain.css";


const TrainingMain = ({ text, goBack }) => {
  const [completedDiffs, setCompletedDiffs] = useState([]);
  const onComplete = diff => setCompletedDiffs(prev => [...prev, diff]);
  const finished = completedDiffs.length === text.length;

  return (
    <div className="TrainingMain">
      {completedDiffs.map((diff, i) => <Diff diff={diff} key={i} />)}
      {finished || <SentencePrompt sentence={text[completedDiffs.length]} onComplete={onComplete} />}
      {finished && <div className="finished">
        <div>All done!</div>
        <button onClick={goBack}>Back to Sentence Selection</button>
      </div>}
    </div>
  )
};

export default TrainingMain;