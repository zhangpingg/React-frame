import React from 'react'
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={{paddingLeft:'10px'}}>
      <Link to="/test">test</Link>: 测试 <br />
      <Link to="/form">form</Link>: form表单 <br />
      <Link to="/editCell">editCell</Link>: 编辑单元格 <br />
      <Link to="/editCellSelect">editCellSelect</Link>: 编辑单元格select <br />
      <Link to="/mergeEditCell">mergeEditCell</Link>: 合并编辑单元格 <br />
      <Link to="/uploadFile">uploadFile</Link>: 上传文件 <br />
      <Link to="/pageSelect">pageSelect</Link>: 分页滚动加载数据 <br />
      <Link to="/searchFrom">searchFrom</Link>: 筛选条件 (公共组件), table, 分页 <br />
      <Link to="/dragList">dragList</Link>: 拖拽排序 <br />
      <Link to="/domSize">domSize</Link>: useDomChangeSize 使用 <br />
      <Link to="/setIntervalDemo">setIntervalDemo</Link>: useSetInterval 使用 <br />
    </div>
  )
}

export default Home;
