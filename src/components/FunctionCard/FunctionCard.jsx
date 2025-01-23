import React from "react";
import './styles.css'
const FunctionCard= ({
  id,
  equation,
  setEquation,
  nextFunction,
}) => {
  return (
    <div className="function-card">
      <h3>Function {id}</h3>
      <div className="field">
        <label>Equation</label>
        <input
          type="text"
          value={equation}
          onChange={(e) => setEquation(e.target.value)}
        />
      </div>
      <div className="field">
        <label>Next function</label>
        <select value={nextFunction} disabled>
          <option>{nextFunction}</option>
        </select>
      </div>
      <div className="connect-section">
        <div className="connect-section-input"><div className="circle-input"></div>Input</div>
        <div className="connect-section-output"><div className="circle-output"></div>Output</div>

      </div>
    </div>
  );
};

export default FunctionCard;
