import React from "react";
import Header from "./components/Header";
import DashboardContainer from "./components/DashboardContainer";
import "./App.scss";

function App() {
  return (
    <div className="App">
      <Header />
      <DashboardContainer />
    </div>
  );
}

export default App;
