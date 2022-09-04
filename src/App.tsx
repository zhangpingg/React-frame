import React from 'react';
import './app.less'
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/home'
import Test from './pages/test'
import Form from './pages/antd/form'
import EditCell from './pages/antd/editCell'
import EditCellSelect from './pages/antd/editCellSelect'
import MergeEditCell from './pages/antd/mergeEditCell'
import UploadFile from './pages/antd/uploadFile'
import PageSelect from './pages/antd/pageSelect'
import SearchFrom from './pages/search-form'
import ParentToChildFn from './pages/parentToChildFn'
import DragList from './pages/dragList'
import DomSize from './pages/hookDemo/domSize'
import SetIntervalDemo from './pages/hookDemo/setIntervalDemo'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<Test />} />
        <Route path="/form" element={<Form />} />
        <Route path="/editCell" element={<EditCell />} />
        <Route path="/editCellSelect" element={<EditCellSelect />} />
        <Route path="/mergeEditCell" element={<MergeEditCell />} />
        <Route path="/uploadFile" element={<UploadFile />} />
        <Route path="/pageSelect" element={<PageSelect />} />
        <Route path="/searchFrom" element={<SearchFrom />} />
        <Route path="/parentToChildFn" element={<ParentToChildFn />} />
        <Route path="/dragList" element={<DragList />} />
        <Route path="/domSize" element={<DomSize />} />
        <Route path="/setIntervalDemo" element={<SetIntervalDemo />} />
      </Routes>
    </Router>
  );
}

export default App;
