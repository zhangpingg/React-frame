
/**
 * @description 监听 dom 大小改变，返回当前元素本身
 */

import React, { useEffect } from 'react';

const useDomChangeSize = (sizeRef: any, cb: (v: any) => void) => {

  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      cb?.(entry.target);
    }
  });
  
  useEffect(() => {
    if (sizeRef?.current) {
      resizeObserver.observe(sizeRef.current);    // 开始观察元素
    }
    return () => resizeObserver.disconnect();     // 取消对元素的观察
  }, [sizeRef]);

  return null;
};

export default useDomChangeSize;
