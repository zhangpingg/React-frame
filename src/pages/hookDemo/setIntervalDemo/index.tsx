import React, { useCallback, useEffect } from 'react';
import { Button } from 'antd'
import useSetInterval from '../../../hooks/useSetInterval'

const SetIntervalDemo = () => {
  const fn1 = useCallback(() => {
    console.log('定时获取数据')
  }, []);

  const { startInterval, endInterval } = useSetInterval({ callback: fn1 })

  /** 开始 */
  const startFn = useCallback(() => {
    startInterval();
  }, [])
  /** 停止 */
  const endFn = useCallback(() => {
    endInterval();
  }, [])

  useEffect(() => {

  }, [])

  return (
    <div>
      <Button onClick={startFn}>开始</Button>
      <Button onClick={endFn}>停止</Button>
    </div>
  )
}

export default SetIntervalDemo;
