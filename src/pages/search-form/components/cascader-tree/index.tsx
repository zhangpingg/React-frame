import React from 'react'
import { Cascader } from 'antd';

interface IProps {
  value: []
  placeholder?: string
  onChange: (data: any) => void
}

const Index: React.FC<IProps> = (props) => {
  const options = [
    {
      value: '1',
      label: '浙江省',
      children: [
        {
          value: '2',
          label: '杭州市',
        },
        {
          value: '3',
          label: '金华市',
        },
      ],
    },
  ]

  return (
    <Cascader
      value={props.value}
      options={options}
      onChange={(data) => {
        props.onChange?.(data);
      }}
      placeholder={props?.placeholder || '请选择'}
    />
  )
}

export default Index