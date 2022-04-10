import { useCallback, useEffect, useMemo, useState, useRef, useReducer } from 'react';
import { Table, Pagination } from 'antd';
import debounce from 'lodash/debounce';
import SearchForm, { IItems } from './search-form'
import CascaderTree from './components/cascader-tree'
import { ILoadings } from './interface'
import { STATUS, TASK_STATUS } from './const'

interface IListItem {
  id: number
  a: string
  b: string
}
// interface IFlags {
//   a: boolean
//   b: boolean
// }


const Index = () => {
  const defaultParams = { b: [1] }
  const screenRef = useRef<HTMLDivElement | null>(null)
  // const [flags, dispatchFlags] = useReducer((prev: IFlags, data: IFlags) => ({ ...prev, ...data }), {
  //   a: false,
  //   b: false,
  // })
  const [loadings, dispatchLoadings] = useReducer((prev: ILoadings, data: ILoadings) => ({ ...prev, ...data }), {
    table: false,
    reset: false,
    search: false,
  })
  const [params, setParams] = useState({})
  const [pageNo, setPageNo] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [list, setList] = useState<IListItem[]>([])
  const [total, setTotal] = useState<number>(0);
  const [bodyHeight, setBodyHeight] = useState<number>(document.body.clientHeight)
  const [screenHeight, setScreenHeight] = useState(screenRef?.current?.clientHeight || 0);

  /** 筛选条件 */
  const items: IItems[] = useMemo(() => {
    return [
      {
        type: 'input',
        label: '名称',
        propKey: 'a',
        placeholder: '请输入',
      },
      {
        type: 'select',
        label: '状态',
        propKey: 'b',
        placeholder: '请选择',
        options: STATUS,
        selectLablelLength: 3,
        props: {
          mode: 'multiple',
          maxTagCount: 1
        }
      },
      {
        component: CascaderTree,
        label: '市级',
        propKey: 'c',
        placeholder: '请选择',
      },
      {
        type: 'datePicker',
        label: '日期',
        propKey: 'd',
        placeholder: '请选择',
      },
      {
        type: 'checkbox',
        propKey: 'e',
        options: TASK_STATUS,
      },
    ]
  }, [])
  /** table 列头 */
  const columns = useMemo(() => {
    return [
      {
        dataIndex: 'a',
        title: '名称',
      },
      {
        dataIndex: 'b',
        title: '类型',
      }
    ]
  }, [])
  /** 获取数据 */
  const getList = useCallback((params) => {
    dispatchLoadings({ table: true })
    setTimeout(() => {
      console.log('params:', params)
      let data = [
        { id: 1, a: '张三', b: 'success' },
        { id: 2, a: '李四', b: 'fail' },
        { id: 3, a: '王五', b: 'success' }
      ]
      setList(data)
      setTotal(100)
      dispatchLoadings({ table: false, reset: false, search: false, })
    }, 1000)
  }, [])
  /** 修改筛选条件 */
  const updateScreen = useCallback((data) => {
    const { x, ...lastProps } = data;
    return {
      // a: a ? a + ':字段若是数组对象等，可取中某个值' : '',
      x: 1,
      ...lastProps
    }
  }, [])
  /** 切换页数*/
  const changePageNo = useCallback((index, size) => {
    setPageNo(index)
    let _params = {
      pageNo: index,
      pageSize: size,
      ...params
    }
    getList(_params)
  }, [pageSize, params])
  /** 更新页码 */
  const changePageSize1 = useCallback((index, size) => {
    setPageNo(index)
    setPageSize(size)
  }, [params])
  /** 查询 */
  const search = useCallback(async (data) => {
    dispatchLoadings({ search: true })
    setParams(data);
    setPageNo(1)
    setPageSize(10)
    let _params = {
      pageNo: 1,
      pageSize: 10,
      ...data
    }
    getList(_params)
  }, [pageNo, pageSize]);
  /** 重置 */
  const reset = useCallback(() => {
    dispatchLoadings({ reset: true })
    setPageNo(1);
    setPageSize(10);
    setParams(defaultParams);
    let _params = {
      pageNo: 1,
      pageSize: 10,
      ...defaultParams
    }
    getList(_params)
  }, []);
  /** 屏幕缩放 */
  const windowScroll = useCallback(() => {
    setBodyHeight(document.body.clientHeight)
    if (screenRef?.current) {
      setScreenHeight(screenRef?.current?.clientHeight)
    }
  }, [])

  useEffect(() => {
    console.log(11, STATUS)
    windowScroll()
    window.addEventListener('resize', debounce(windowScroll, 300))
    return () => {
      window.removeEventListener('resize', windowScroll)
    }
  }, [])

  return (
    <div>
      <div ref={screenRef}>
        <SearchForm
          items={items}
          defaultParams={defaultParams}
          resetLoading={loadings.reset}
          searchLoading={loadings.search}
          col={[6, 18]}
          onUpdateScreen={updateScreen}
          onSearch={search}
          onReset={reset}
        />
      </div>
      <div style={{ height: bodyHeight - screenHeight - 60, border: '1px solid #f00' }}>
        <Table
          rowKey='id'
          columns={columns}
          dataSource={list}
          pagination={false}
          loading={loadings.table}
          scroll={{
            y: bodyHeight - screenHeight - 125
          }}
        />
      </div>
      <Pagination
        current={pageNo}
        pageSize={pageSize}
        total={total}
        showTotal={() => `共 ${total} 条`}
        showSizeChanger
        showQuickJumper
        pageSizeOptions={[10, 20, 30, 40, 50]}
        onChange={changePageNo}
        onShowSizeChange={changePageSize1}
      />
    </div>
  )
}

export default Index;