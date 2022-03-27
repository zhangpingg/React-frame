import React, { useImperativeHandle } from 'react'


const Child = (props: any) => {
  /** 暴露给父组件 */
  useImperativeHandle(props.onRef, () => ({
    /** 全部已读 */
    setRead: () => {
      return '子组件勾选的数据';
    }
  }));

  return (
    <div>子组件</div>
  )
}

export default Child;
