import { Input, Button, Select, DatePicker, Checkbox } from 'antd';
import { useCallback, useEffect, useReducer } from 'react';
import './style.scss';
import { useUpdateEffect, useDebounceFn } from 'ahooks';

export interface IItems {
  type?: 'input' | 'select' | 'datePicker' | 'checkbox'
  propKey: string
  placeholder?: string
  options?: Array<{ value: any, label: string }>
  component?: React.ElementType,
  props?: any
}
interface IProps {
  items: IItems[]
  onUpdateScreen: (data: object) => void
  onSearch: (data: object) => void
  onReset?: () => void
  defaultParams?: object
}

const Index: React.FC<IProps> = (props) => {
  const { defaultParams = {} } = props
  const [formData, dispatch] = useReducer((prev: any, data: any) => (data ? { ...prev, ...data } : defaultParams), defaultParams);
  const [searchData, setSearchData] = useReducer(
    (prev: any, data: any) => (data ? { ...prev, ...data } : props.onUpdateScreen(defaultParams)),
    props.onUpdateScreen(defaultParams),
  )

  /** formData 数据改变时，修改真正筛选条件字段 */
  useUpdateEffect(() => {
    setSearchData(props.onUpdateScreen(formData))
  }, [formData]);
  /** 查询 */
  const search = useCallback(() => {
    props.onSearch(searchData)
  }, [searchData])
  /** 重置 */
  const reset = useCallback(() => {
    dispatch(null)
    props?.onReset?.();
  }, [])

  useEffect(() => {
    search();
  }, [])

  return (
    <div className='search'>
      {
        props.items.map((item) => {
          if (item.component) {
            const Type = item.component;
            return (
              <div className="search-item" key={item.propKey}>
                <Type
                  placeholder={item.placeholder}
                  {...item.props}
                  value={formData[item.propKey]}
                  onChange={(v: any) => dispatch({ [item.propKey]: v })}
                />
              </div>
            )
          }
          switch (item.type) {
            case 'input':
              return (
                <div className='search-item' key={item.propKey}>
                  <Input
                    placeholder={item.placeholder}
                    value={formData?.[item.propKey]}
                    onChange={(e) => dispatch({ [item.propKey]: e.target.value })} />
                </div>
              )
            case 'select':
              return (
                <div className='search-item' key={item.propKey}>
                  <Select
                    placeholder={item.placeholder}
                    value={formData?.[item.propKey]}
                    onChange={(v) => dispatch({ [item.propKey]: v })}>
                    {item.options?.map((c) => (
                      <Select.Option value={c.value} key={c.value}>{c.label}</Select.Option>
                    ))}
                  </Select>
                </div>
              )
            case 'datePicker':
              return (
                <div className='search-item' key={item.propKey}>
                  <DatePicker
                    placeholder={item.placeholder}
                    value={formData?.[item.propKey]}
                    onChange={(v) => dispatch({ [item.propKey]: v })}
                    format='YYYY-MM-DD'
                  />
                </div>
              )
            case 'checkbox':
              return (
                <div className='search-item' key={item.propKey}>
                  <Checkbox.Group
                    options={item.options}
                    value={formData?.[item.propKey]}
                    onChange={(v) => dispatch({ [item.propKey]: v })}
                  />
                </div>
              )
          }
        })
      }
      <Button type="primary" onClick={search}>查询</Button>
      <Button onClick={reset}>重置</Button>
    </div>
  )
}

export default Index