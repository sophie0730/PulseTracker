// import { useState } from 'react';
// import { Route, Routes } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import Header from './components/header';
import Graph from './components/graph';
import Target from './components/target';
import AlertContainer from './components/alert';
import Dashboard from './components/dashboard';

function App() {

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Graph />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/target" element={<Target />}></Route>
        <Route path="/graph" element={<Graph />}></Route>
        <Route path="/alert" element={<AlertContainer />}></Route>
      </Routes>
    </div>
  );
}

export default App;
