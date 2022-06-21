import React, { useRef, useState } from 'react'
import _ from 'lodash';
import useDomChangeSize from '../../../hooks/useDomChangeSize'
import { Button } from 'antd';
import styles from './index.module.less';

const DomSize = () => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const [isScreen, setIsScreen] = useState<boolean>(false)

  useDomChangeSize(divRef, (dom) => {
    console.log(22, dom.clientHeight)   // 可以控制table滚动高度
  })

  return (
    <div className={styles.t}>
      <div className={styles.t_header}>
        标题
        <Button onClick={() => setIsScreen(!isScreen)}>展开/隐藏</Button>
        {isScreen && <div>筛选条件<br /><br /></div>}
      </div>
      <div className={styles.t_main} ref={divRef}>
        <div className={styles.t_main_table}>列表</div>
      </div>
    </div>
  )
}

export default DomSize;
