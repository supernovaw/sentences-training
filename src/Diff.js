import { useEffect, useState } from "react";
import "./Diff.css";

const Diff = ({ diff }) => {
  const [diffToken, setDiffToken] = useState(0);
  useEffect(() => setDiffToken(Math.random()), [diff]);

  const piece = ({ "0": type, "1": text }, i) => (
    <span type={type} key={i + diffToken}>
      {text}
    </span>
  );

  return (
    <div className="Diff">
      {!!diff && diff.map(piece)}
    </div>
  );
};

export default Diff;
