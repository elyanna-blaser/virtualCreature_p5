import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { ReactP5Wrapper } from "react-p5-wrapper";
import sketch from "./sketches/sketch.js";

function App() {
  const [amplitude, setAmplitude] = useState(0);

  console.log("Attempting to connect to WebSocket");
  const socket = new WebSocket("ws://localhost:3001/");
  socket.onopen = () => {
    console.log("WebSocket connection opened");
  };

  console.log("Amplitude updated:", amplitude);

  socket.onmessage = (event) => {
    console.log("Received WebSocket data:", event.data);
    const newAmplitude = parseFloat(event.data);
    console.log("Parsed amplitude:", newAmplitude);
    setAmplitude(newAmplitude);
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };

  return (
    <div className="App">
      <h1>React and p5.js Integration TEST</h1>
      <p>Current Amplitude: {amplitude}</p>
      <ReactP5Wrapper sketch={sketch} amplitude={amplitude} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));

export default App;