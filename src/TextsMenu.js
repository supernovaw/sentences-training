import { useMemo, useRef, useState } from "react";
import "./TextsMenu.css";

function validateMapping(map) {
  function validateEach(m) {
    if (typeof m !== "object") return false;

    if (!Array.isArray(m.range)) return false;
    if (typeof m.range[0] !== "number") return false;
    if (typeof m.range[1] !== "number") return false;
    if (typeof m.word !== "string") return false;
    return true;
  }
  if (!validateEach(map.original)) return false;
  if (!validateEach(map.translated)) return false;
  return true;
}

function validateText(json) {
  try {
    const obj = JSON.parse(json);
    let sentences;
    let title;
    if (Array.isArray(obj)) { // raw sentences array
      sentences = obj;
      title = null;
    } else {
      sentences = obj.sentences;
      if (!Array.isArray(sentences)) return false;
      title = obj.title;
    }
    if (sentences.length < 1) return false;

    // validate each sentence
    for (let i = 0; i < sentences.length; i++) {
      const sen = sentences[i];
      if (typeof sen.original !== "string") return false;
      if (typeof sen.translated !== "string") return false;
      if (!Array.isArray(sen.map)) return false;
      // verify each mapping
      for (let j = 0; j < sen.map.length; j++) if (!validateMapping(sen.map[j])) return false;
    }

    return { title, sentences };
  } catch (e) {
    return false;
  }
}

const parseTexts = () => JSON.parse(localStorage.getItem("sentences-texts") || "[]");
const writeTexts = obj => localStorage.setItem("sentences-texts", JSON.stringify(obj));

const TextsMenu = ({ onDone }) => {
  const setDummy = useState()[1], rerender = () => setDummy(v => v + 1);

  const [state, setState] = useState({ json: null, title: null /*, replaceWarningIssued: true, jsonInvalid: true */ });
  const jsonRef = useRef(), titleRef = useRef();

  let textsRef = useRef(useMemo(parseTexts, []));
  let texts = textsRef.current;

  const proceed = () => {
    if (!state.json) { // process json
      let json = jsonRef.current.value;
      json = validateText(json); // turns string into object OR false if invalid
      if (!json) {
        setState(s => ({ ...s, jsonInvalid: true }));
        return;
      }
      setState({ json, title: json.title });

    } else { // process title and add

      const title = titleRef.current.value;
      if (title.length === 0) return;
      const duplicateFound = !!texts.find(t => t.title === title);
      if (!state.replaceWarningIssued && duplicateFound) {
        setState(s => ({ ...s, replaceWarningIssued: true }));
        return;
      }
      if (duplicateFound) {
        textsRef.current = texts = texts.filter(t => t.title !== title);
      }
      texts.push({ title, sentences: state.json.sentences });
      writeTexts(texts);
      setState({ json: null, title: null });
      onDone();
    }
  };
  const onRemove = title => {
    textsRef.current = texts = texts.filter(t => t.title !== title);
    writeTexts(texts);
    rerender();
  };

  return (
    <div className="TextsMenu">
      {!state.json && <>
        <div>To add a new text, insert JSON in the field below</div>
        <textarea ref={jsonRef} />
        {state.jsonInvalid && <div>An error was encountered in JSON</div>}
      </>}
      {!!state.json && <>
        <div>Choose text title</div>
        <input type="text" ref={titleRef} defaultValue={state.title} />
        {state.replaceWarningIssued && <div>A text with the title {state.title} already exists and will be replaced if you continue</div>}
      </>}
      <div><button onClick={proceed}>Continue</button></div>
      <div className="remove-buttons">
        {texts.map(({ title }) => (
          <button key={title} onClick={() => onRemove(title)}>{`Remove "${title}"`}</button>
        ))}
      </div>
      <button className="exit-btn" onClick={onDone}>Exit</button>
    </div>
  );
}

export default TextsMenu;
