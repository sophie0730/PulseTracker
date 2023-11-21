// import { useState } from 'react';
// import { Route, Routes } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import Header from './components/header';
import Graph from './components/graph';

function App() {
  // const [count, setCount] = useState(0);

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/graph" element={<Graph />}></Route>
      </Routes>
    </div>
  );
}

export default App;
