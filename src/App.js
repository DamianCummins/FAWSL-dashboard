import React from 'react';
import FilterForm from "./components/FilterForm";
import DashboardContainer from "./components/DashboardContainer";
import './App.css';

function App() {
  return (
    <div className="App">
      <FilterForm />
      <DashboardContainer />
    </div>
  );
}

export default App;
