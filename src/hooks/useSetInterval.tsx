import { useCallback, useEffect, useRef, useState } from 'react';

interface IProps {
  callback: () => void;
  delay?: number;
}

const useSetInterval = ({ callback, delay = 1000 }: IProps) => {
  const timer: any = useRef();
  const [flagStart, setFlagStart] = useState<boolean>(false)

  /** 开始定时器执行 */
  const startInterval = useCallback(() => {
    setFlagStart(true);
  }, [])
  /** 结束定时器执行 */
  const endInterval = useCallback(() => {
    setFlagStart(false);
    clearInterval(timer.current);
    timer.current = null!;
  }, [])

  useEffect(() => {
    if (flagStart) {
      timer.current = setInterval(() => {
        callback?.()
      }, delay)
    }
  }, [flagStart])

  return { startInterval, endInterval }
}

export default useSetInterval;
