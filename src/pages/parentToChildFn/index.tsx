import React, { useCallback, useRef } from 'react'
import { Button } from 'antd'
import Child from './child'

const ParentToChildFn = () => {
  const messagesRef = useRef({ setRead: Function });

  const setRead = useCallback(() => {
    if (messagesRef?.current) {
      console.log(messagesRef?.current?.setRead?.());
    }
  }, [])

  return (
    <div>
      父组件
      <Button type='primary' onClick={setRead}>全部已读</Button> <hr />
      <Child onRef={messagesRef} />
    </div>
  )
}

export default ParentToChildFn;
