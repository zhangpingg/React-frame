import React from 'react'
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <Link to="/form">form</Link>: form表单 <br />
      <Link to="/editCell">editCell</Link>: 编辑单元格 <br />
      <Link to="/mergeEditCell">mergeEditCell</Link>: 合并编辑单元格 <br />
      <Link to="/searchFrom">searchFrom</Link>: 筛选条件 (公共组件), table, 分页 <br />
      <Link to="/parentToChildFn">parentToChildFn</Link>: 父组件调用子组件方法 <br />
      <Link to="/dragList">dragList</Link>: 拖拽排序 <br />
    </div>
  )
}

export default Home;
