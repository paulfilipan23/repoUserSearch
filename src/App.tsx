import React from "react";
import "./App.css";
import Autocomplete from "./Autocomplete";

function App() {
  return (
    <div className="App">
      <Autocomplete placeholder="Search for repository or user" />
    </div>
  );
}

export default App;
