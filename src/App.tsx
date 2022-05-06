import React from 'react';
import './app.less'
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/home'
import Form from './pages/antd/form'
import EditCell from './pages/antd/editCell'
import MergeEditCell from './pages/antd/mergeEditCell'
import SearchFrom from './pages/search-form'
import ParentToChildFn from './pages/parentToChildFn'
import DragList from './pages/dragList'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<Form />} />
        <Route path="/editCell" element={<EditCell />} />
        <Route path="/mergeEditCell" element={<MergeEditCell />} />
        <Route path="/searchFrom" element={<SearchFrom />} />
        <Route path="/parentToChildFn" element={<ParentToChildFn />} />
        <Route path="/dragList" element={<DragList />} />
      </Routes>
    </Router>
  );
}

export default App;
