import React, {FC, memo, useState } from 'react';
import { Select } from 'antd';

interface IProps {
  onBlur: (data:any) => void;
}
const ChildSelect:FC<IProps> = (props) => {
  const { onBlur } = props;
  const [options, setOptions] = useState([
    { lable: '选择1', value: '1' },
    { lable: '选择2', value: '2' },
    { lable: '选择3', value: '3' },
    { lable: '选择4', value: '4' },
  ]);
  const [name, setName] = useState<string[]>([]);

  return (
    <div>
      总的选择，这里更改会替换表格中的下拉选中的数据：
      <Select
        mode="tags"
        onChange={(data) => setName(data)}
        onBlur={() => onBlur(name)}
        style={{ width: '400px' }}
      >
        {options.map((item: any) => (
          <Select.Option key={item.lable} value={item.lable}>{item.lable}</Select.Option>
        ))}
      </Select>
    </div>
  )
}

export default memo(ChildSelect);
