import { useState } from "react";
import "./App.css";
import TextsMenu from "./TextsMenu";
import TrainingMain from "./TrainingMain";

const parseTexts = () => JSON.parse(localStorage.getItem("sentences-texts") || "[]");

const TextSelection = ({ onSelected }) => {
  const localTexts = parseTexts();

  const [textsMenuState, setTextsMenuState] = useState(false);
  if (textsMenuState) return (
    <div className="TextSelection">
      <TextsMenu onDone={() => setTextsMenuState(false)} />
    </div>
  );

  return (
    <div className="TextSelection">
      {!localTexts.length && <h2>
        There are no locally saved texts yet
      </h2>}
      {localTexts.map(t => (
        <button key={t.title} className="option" onClick={() => onSelected(t.sentences)}>{t.title}</button>
      ))}
      <button className="option" onClick={() => setTextsMenuState(true)}>Add or remove…</button>
    </div>
  );
};

const App = () => {
  const [text, setText] = useState(null);

  return (
    <div className="App">
      {!text && <TextSelection onSelected={setText} />}
      {!text || <TrainingMain text={text} goBack={() => setText(null)} />}
    </div>
  );
}

export default App;
