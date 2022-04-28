import React, { useState, useCallback, useEffect, useReducer } from 'react';
import { Input, Button, Select, DatePicker, Checkbox, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useUpdateEffect } from 'ahooks';
import debounce from 'lodash/debounce';
import './style.less';


export interface IItems {
  type?: 'input' | 'select' | 'datePicker' | 'checkbox'
  label?: string
  propKey: string
  placeholder?: string
  options?: Array<{ value: any, label: string }>
  /** 自定义组件 */
  component?: React.ElementType,
  /** 自定义属性 */
  props?: any,
  /** select下拉label截取的长度 */
  selectLablelLength?: number,
}
interface IProps {
  items: IItems[]
  /** 更新查询条件 */
  onUpdateScreen: (data: object) => void
  /** 查询 */
  onSearch: (data: object) => void
  /** 重置 */
  onReset?: () => void
  /** 默认参数 */
  defaultParams?: object
  /** 左右分布情况 */
  col?: number[]
  /** reset按钮加载 */
  resetLoading?: boolean
  /** search按钮加载 */
  searchLoading?: boolean
}

const Index: React.FC<IProps> = (props) => {
  const { onSearch, onReset } = props;
  const [isHasReset, setIsHasReset] = useState<boolean>(false);
  const { defaultParams = {}, col = [6, 6], resetLoading = false, searchLoading = false } = props;
  const [formData, dispatch] = useReducer((prev: any, data: any) => (data ? { ...prev, ...data } : defaultParams), defaultParams);
  const [searchData, setSearchData] = useReducer(
    (prev: any, data: any) => (data ? { ...prev, ...data } : props.onUpdateScreen(defaultParams)),
    props.onUpdateScreen(defaultParams),
  )

  /** formData 数据改变时，修改真正筛选条件字段 */
  useUpdateEffect(() => {
    setSearchData(isHasReset ? null : props.onUpdateScreen(formData));
  }, [formData, isHasReset]);
  /** 查询 */
  const search = useCallback(() => {
    setIsHasReset(false);
    onSearch(searchData)
  }, [searchData, onSearch])
  /** 重置 */
  const reset = useCallback(() => {
    setIsHasReset(true);
    dispatch(null)
    onReset?.();
  }, [onReset])

  useEffect(() => {
    search();
  }, [search])

  return (
    <div className='SF'>
      <Row>
        {
          props.items && props.items.map((item) => {
            if (item.component) {
              const Type = item.component;
              return (
                <Col span={col[0]} className="SF-item" key={item.propKey}>
                  <span className="SF-item-label">{item.label}</span>
                  <div className="SF-item-mode">
                    <Type
                      placeholder={item.placeholder}
                      {...item.props}
                      value={formData[item.propKey]}
                      onChange={(v: any) => dispatch({ [item.propKey]: v })}
                    />
                  </div>
                </Col>
              );
            }
            switch (item.type) {
              case 'input':
                return (
                  <Col span={col[0]} className="SF-item" key={item.propKey}>
                    <span className="SF-item-label">{item.label}</span>
                    <Input
                      allowClear
                      placeholder={item.placeholder}
                      value={formData?.[item.propKey]}
                      onChange={(e) => dispatch({ [item.propKey]: e.target.value })}
                      className="SF-item-mode"
                      suffix={<SearchOutlined style={{ color: 'rgba(0,0,0,.45)' }} />}
                    />
                  </Col>
                );
              case 'select':
                return (
                  <Col span={col[0]} className="SF-item" key={item.propKey}>
                    <span className="SF-item-label">{item.label}</span>
                    <Select
                      allowClear
                      placeholder={item.placeholder}
                      value={formData?.[item.propKey]}
                      {...item.props}
                      onChange={(v) => dispatch({ [item.propKey]: v })}
                      className="SF-item-mode"
                      optionLabelProp="label"
                      filterOption={(input, option: any) => (option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0)}
                    >
                      {item.options?.map((c) => (
                        <Select.Option label={c.label.substring(0, item.selectLablelLength || 4)} value={c.value} key={c.value}>{c.label}</Select.Option>
                      ))}
                    </Select>
                  </Col>
                );
              case 'datePicker':
                return (
                  <Col span={col[0]} className="SF-item" key={item.propKey}>
                    <span className="SF-item-label">{item.label}</span>
                    <DatePicker
                      allowClear
                      placeholder={item.placeholder}
                      value={formData?.[item.propKey]}
                      onChange={(v) => dispatch({ [item.propKey]: v })}
                      format="YYYY-MM-DD"
                      className="SF-item-mode"
                    />
                  </Col>
                );
              case 'checkbox':
                return (
                  <Col span={col[0]} className="SF-item" key={item.propKey}>
                    <span className="SF-item-label">{item.label}</span>
                    <Checkbox.Group
                      value={formData?.[item.propKey]}
                      options={item.options}
                      onChange={(v) => dispatch({ [item.propKey]: v })}
                      className="SF-item-mode SF-item-modeCheckbox"
                    />
                  </Col>
                );
              default:
                break;
            }
            return '默认值';
          })
        }
        <Col span={col[1]} className="SF-itemBtns">
          <Button type="primary" loading={searchLoading} onClick={debounce(search, 300)}>查询</Button>
          <Button className="SF-itemBtns-reset" loading={resetLoading} onClick={debounce(reset, 300)}>重置</Button>
        </Col>
      </Row>
    </div>
  )
}

export default Index