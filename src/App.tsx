import React from 'react';
import './app.less'
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/home'
import Form from './pages/antd/form'
import EditCell from './pages/antd/editCell'
import SearchFrom from './pages/search-form'
import ParentToChildFn from './pages/parentToChildFn'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<Form />} />
        <Route path="/editCell" element={<EditCell />} />
        <Route path="/searchFrom" element={<SearchFrom />} />
        <Route path="/parentToChildFn" element={<ParentToChildFn />} />
      </Routes>
    </Router>
  );
}

export default App;
