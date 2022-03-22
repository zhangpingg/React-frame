import { useCallback, useEffect, useMemo, useState } from 'react';
import { Table, Pagination } from 'antd';
import debounce from 'lodash/debounce';
import SearchForm, { IItems } from './search-form'
import CascaderTree from './components/cascader-tree'

interface IListItem {
  id: number
  a: string
  b: string
}

const Index = () => {
  const defaultParams = {b: 'success'};
  const [loading, setLoading] = useState<boolean>(false)
  const [params, setParams] = useState({})
  const [pageNo, setPageNo] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [list, setList] = useState<IListItem[]>([])
  const [total, setTotal] = useState<number>(0);
  const [bodyHeight, setBodyHeight] = useState<number>(document.body.clientHeight)

  /** 筛选条件 */
  const items: IItems[] = useMemo(() => {
    return [
      {
        type: 'input',
        propKey: 'a',
        placeholder: '名称1',
      },
      {
        type: 'select',
        propKey: 'b',
        placeholder: '类型',
        options: [
          { label: '失败', value: 'fail' },
          { label: '成功', value: 'success' },
        ],
      },
      {
        component: CascaderTree,
        propKey: 'c',
        placeholder: '客户类型',
      },
      {
        type: 'datePicker',
        propKey: 'd',
        placeholder: '名称d',
      },
      {
        type: 'checkbox',
        propKey: 'e',
        options: [
          { label: '未做', value: '0' },
          { label: '已完成', value: '1' },
        ],
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
    setLoading(true)
    console.log('params:', params)
    let data = [
      { id: 1, a: '张三', b: 'success' },
      { id: 2, a: '李四', b: 'fail' },
      { id: 3, a: '王五', b: 'success' }
    ]
    setList(data)
    setTotal(100)
    setLoading(false)
  }, [])
  /** 修改筛选条件 */
  const updateScreen = useCallback((data) => {
    const { x, ...lastProps } = data;
    return {
      // a: a ? a + '——字段若是数组对象等，可取中某个值' : '',
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
    setPageNo(1);
    setPageSize(10);
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
  }, [])

  useEffect(() => {
    windowScroll()
    window.addEventListener('resize', debounce(windowScroll, 500))
    return () => {
      window.removeEventListener('resize', windowScroll)
    }
  }, [])

  return (
    <div>
      <h2>动态筛选条件</h2>
      <SearchForm
        items={items}
        onUpdateScreen={updateScreen}
        onSearch={search}
        onReset={reset}
        defaultParams={defaultParams}
      />
      <div style={{ height: bodyHeight - 150, border: '1px solid #f00' }}>
        <Table
          rowKey='id'
          columns={columns}
          dataSource={list}
          pagination={false}
          loading={loading}
          scroll={{
            y: bodyHeight - 216
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