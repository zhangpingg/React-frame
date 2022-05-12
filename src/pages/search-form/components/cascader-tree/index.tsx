import React from 'react'
import { Cascader } from 'antd';

interface IProps {
  value: []
  placeholder?: string
  onChange: (data: any) => void
}

const Index: React.FC<IProps> = (props) => {
  /** tree数据 */
  const options = [
    {
      value: '1',
      label: '浙江省',
      children: [
        {
          value: '1-2',
          label: '杭州市',
        },
        {
          value: '1-3',
          label: '金华市',
        },
      ],
    },
    {
      value: '2',
      label: '安徽省',
      children: [
        {
          value: '2-1',
          label: '黄山市',
        },
        {
          value: '2-3',
          label: '歙县市',
        },
      ],
    },
  ]
  /** 输入过滤 */
  const filter = (inputValue: string, path: any[]) => (path.some((option) => (option.label.toLowerCase().indexOf(String(inputValue).toLowerCase()) > -1)))

  return (
    <Cascader
      value={props.value}
      //  fieldNames={{ label: 'name', value: 'id', children: 'node' }}
      options={options}
      onChange={(data) => {
        props.onChange?.(data);
      }}
      placeholder={props?.placeholder || '请选择'}
      multiple
      maxTagCount="responsive"
      showSearch={{ filter }}
    />
  )
}

export default Index