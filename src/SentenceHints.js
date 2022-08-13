import "./SentenceHints.css";

function createHintsPieces(sentence) {
  const shownFull = sentence.translated;
  const shownMap = sentence.map.map(m => m.translated);
  const hintsMap = sentence.map.map(m => m.original);

  const pieces = [];
  let lastCharIndex = 0;
  shownMap.forEach((m, i) => {
    const start = m.range[0];
    const end = m.range[1];

    if (start > lastCharIndex) { // add gap
      const sub = shownFull.substring(lastCharIndex, start);
      pieces.push({ text: sub });
    }
    const sub = shownFull.substring(start, end);
    pieces.push({ text: sub, word: m.word, hint: hintsMap[i].word });

    lastCharIndex = end;
  });

  if (lastCharIndex < shownFull.length) {
    const finalPiece = shownFull.substring(lastCharIndex);
    pieces.push({ text: finalPiece });
  }

  return pieces;
}

const Hint = ({ piece }) => (
  <span className="Hint">
    {piece.text}
    <div className="popup">
      {piece.word} <br /> {piece.hint}
    </div>
  </span>
);

const SentenceHints = ({ sentence }) => {
  return (
    <div className="SentenceHints">
      {createHintsPieces(sentence).map((p, i) =>
        p.hint ? <Hint piece={p} key={i} /> : <span key={i}>{p.text}</span>
      )}
    </div>
  );
};

export default SentenceHints;
