import React from 'react';
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

import Form from './pages/antd/form'
import SearchFrom from './pages/search-form'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchFrom />} />
        <Route path="/form" element={<Form />} />
        <Route path="/searchFrom" element={<SearchFrom />} />
      </Routes>
    </Router>

  );
}

export default App;
