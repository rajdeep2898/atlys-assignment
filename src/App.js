import { useEffect, useState, useRef } from 'react';
import './App.css';
import FunctionCard from './components/FunctionCard'
function App() {
  const [initialValue, setInitialValue] = useState(2);
  const [finalOutput, setFinalOutput] = useState(0);
  const [equations, setEquations] = useState([
    "x^2",
    "2x+4",
    "x^2+20",
    "x-2",
    "x/2",
  ]);
  const containerRef = useRef(null);
  const pathRefs = useRef([]);
  const inputOutputPathRefs = useRef([]);


  const inputOutputLines = [
    0, 1
  ]
  const inputBoxes = [
    { label: "InputBox 1", id: 0, style: { top: "50px", left: "100px" } },
    { label: "InputBox 2", id: 1, style: { top: "150px", left: "200px" } },
    { label: "InputBox 4", id: 2, style: { top: "350px", left: "400px" } },
    { label: "InputBox 5", id: 3, style: { top: "350px", left: "400px" } },
    { label: "InputBox 3", id: 4, style: { top: "250px", left: "300px" } },
  ];

  const calculateChain = () => {
    let value = initialValue;
    const functions = [
      (x) => eval(equations[0].replace(/\^/g, "**").replace(/(\d)(x)/g, "$1*$2").replace(/x/g, x.toString())),
      (x) => eval(equations[1].replace(/\^/g, "**").replace(/(\d)(x)/g, "$1*$2").replace(/x/g, x.toString())),
      (x) => eval(equations[3].replace(/\^/g, "**").replace(/(\d)(x)/g, "$1*$2").replace(/x/g, x.toString())),
      (x) => eval(equations[4].replace(/\^/g, "**").replace(/(\d)(x)/g, "$1*$2").replace(/x/g, x.toString())),
      (x) => eval(equations[2].replace(/\^/g, "**").replace(/(\d)(x)/g, "$1*$2").replace(/x/g, x.toString())),
    ];
    functions.forEach((func) => {
      value = func(value);
      console.log("value", func, value)
    });
    setFinalOutput(value);
  };

  useEffect(() => {
    const connectDivs = (div1, div2, path) => {
      const rect1 = div1.getBoundingClientRect();
      const rect2 = div2.getBoundingClientRect();

      console.log("rect1 rect2", rect1, rect2)
      const startX = rect1.left + 4 - 215;
      const startY = rect1.bottom - 40 - 8;
      const endX = rect2.left + rect2.width - 20 + 8 - 215;
      const endY = rect2.bottom - 40 - 8;

      let controlX1 = startX;
      let controlY1 = (startY + endY) / 2;
      if(startY==endY) controlY1-=50
      let controlX2 = endX;
      let controlY2 = (startY + endY) / 2;
      if(startY==endY) controlY2-=50

      const curve = `M ${startX},${startY} C ${controlX1},${controlY1} ${controlX2},${controlY2} ${endX},${endY}`;
      path.setAttribute("d", curve);
    };

    if (containerRef.current && pathRefs.current) {
      const container = containerRef.current;

      const inputdDivs = document.getElementsByClassName("circle-input")
      const outputDivs = document.getElementsByClassName("circle-output")

      let arr = [0, 1, 3, 4, 2]
      arr.forEach(index => {
        if (index < outputDivs.length - 1) {
          const nextDiv = inputdDivs[arr[index + 1]];
          const path = pathRefs.current[index];
          connectDivs(outputDivs[arr[index]], nextDiv, path);
        }
      })
    }
    const connectInputOutput = (div1, div2, path) => {
      const rect1 = div1.getBoundingClientRect();
      const rect2 = div2.getBoundingClientRect();
      const startX = rect1.left + rect1.width / 2-40;
      const startY = rect1.bottom -rect1.width/2-40;
      const endX = rect2.left + rect2.width / 2 - 40;
      const endY = rect2.bottom -rect2.width/2 - 40 ;

      const controlX1 = startX;
      const controlY1 = (startY + endY) / 2;
      const controlX2 = endX;
      const controlY2 = (startY + endY) / 2;

      const curve = `M ${startX},${startY} C ${controlX1},${controlY1} ${controlX2},${controlY2} ${endX},${endY}`;
      path.setAttribute("d", curve);
    }

    if (inputOutputPathRefs.current) {
      let inputDiv = document.getElementsByClassName("circle-start")
      let outputDiv = document.getElementsByClassName("circle-input")
      let path = inputOutputPathRefs.current[0]
      connectInputOutput(inputDiv[0], outputDiv[0], path)
      inputDiv = document.getElementsByClassName("circle-output")
      outputDiv = document.getElementsByClassName("circle-end")
      path = inputOutputPathRefs.current[1]
      connectInputOutput(inputDiv[2], outputDiv[0], path)
    }
  }, [inputBoxes]);

  useEffect(() => {
    try {
      calculateChain();
    } catch {
      console.log("wrong")
    }
  }, [initialValue, equations]);
  const refs = useRef([]);

  return (
    <div className="app">
      <div className="function-container">
        <svg className="curve-line" xmlns="http://www.w3.org/2000/svg">
          {inputOutputLines.map((_, index) => (
            <path
              key={index}
              ref={(el) => (inputOutputPathRefs.current[index] = el)}
              fill="none"
              stroke="#ADD8E6"
              strokeWidth="5"
            />
          ))}
        </svg>
        <div className='input-box'>
          <div className='input-box-field'>
            <input
              type="number"
              value={initialValue}
              className="input-field"

              onChange={(e) => setInitialValue(Number(e.target.value))}
            />
          </div>
          <div className="circle-start"></div>
        </div>
        <div className="function-grid" ref={containerRef}>

          {inputBoxes.map((name, index) => (
            <div
              key={index}
              id={`box${index}`}
              className="function-wrapper"
            >
              <FunctionCard
                id={index + 1}
                equation={equations[index]}
                setEquation={(eq) => {
                  const newEquations = [...equations];
                  newEquations[index] = eq;
                  setEquations(newEquations);
                }}
                nextFunction={
                  index !=2 ? `Function ${[2, 4, 1, 5, 3][index]}` : "Final Output"
                }
              />
            </div>
          ))}
          <svg className="curve-line" xmlns="http://www.w3.org/2000/svg">
            {inputBoxes.slice(0, -1).map((_, index) => (
              <path
                key={index}
                ref={(el) => (pathRefs.current[index] = el)}
                fill="none"
                stroke="#ADD8E6"
                strokeWidth="5"
              />
            ))}
          </svg>
        </div>
        <div className='output-box'>
          <div className="circle-end"></div>

          <div className='output-box-field'>{finalOutput}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
