import React, { useCallback, useEffect, useState } from 'react';
import { Input, InputNumber } from 'antd';
import './styles.less';

interface IProps {
  value: [0, 100],
  placeholder?: string,
  onChange: (data: any) => void,
}

const SectionFraction = (props: IProps) => {
  const [startScore, setStartScore] = useState<number>();
  const [endScore, setEndScore] = useState<number>();

  /** 改变开始分数 */
  const changeStartScore = useCallback((value) => {
    setStartScore(value);
    props.onChange?.([value, endScore]);
  }, [endScore, props]);
  /** 改变结束分数 */
  const changeEndScore = useCallback((value) => {
    setEndScore(value);
    props.onChange?.([startScore, value]);
  }, [startScore, props]);

  useEffect(() => {
    setStartScore(props.value?.[0]);
    setEndScore(props.value?.[1]);
  }, [props]);

  return (
    <div className='F'>
      <Input.Group compact className='F_wrap'>
        <InputNumber
          className='F_startScore'
          min={0}
          max={100}
          placeholder="0"
          value={startScore}
          onChange={changeStartScore}
        />
        <Input className='F_center' placeholder="~" disabled />
        <InputNumber
          className='F_endScore'
          min={0}
          max={100}
          placeholder="100"
          value={endScore}
          onChange={changeEndScore}
        />
      </Input.Group>
    </div>
  );
};

export default SectionFraction;
