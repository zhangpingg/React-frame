import React, { useCallback, useEffect, useState, useReducer } from 'react';
import { Select } from 'antd';

const defaultPagination = {
  pageIndex: 1,
  pageSize: 20,
  total: 81
}

const PageSelect = () => {
  const [list, setList] = useState<{ label: string, value: string }[]>([])
  const [pagination, dispatchPagination] = useReducer(
    (prev: any, data: any) =>
      data ? { ...prev, ...data } : { ...defaultPagination },
    { ...defaultPagination },
  );

  /** 获取数据 */
  const getList = useCallback((allParams = defaultPagination) => {
    const { pageIndex, pageSize } = allParams;
    let length = pageIndex < 5 ? 20 : (defaultPagination.total - pageSize * (pageIndex - 1))
    let _list: any = [];
    for (let i = 0; i < length; i++) {
      _list.push({ label: `(${pageIndex})_名称${i + 1}`, value: i });
    }
    setList((prev) => ([...prev, ..._list]));
  }, []);
  /** 下拉列表滚动监听 */
  const popupScroll = useCallback((e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    const { pageIndex = 1, pageSize, total = 0 } = pagination;
    if (scrollTop + clientHeight < scrollHeight || pageIndex * pageSize >= total) return;
    const allParams = {
      pageIndex: pageIndex + 1,
      pageSize,
    };
    dispatchPagination({ pageIndex: pageIndex + 1 });
    getList(allParams);
  }, [getList, pagination])

  useEffect(() => {
    getList();
  }, [])

  return (
    <Select style={{ width: '300px' }} onPopupScroll={popupScroll}>
      {list.map((item: any) => (
        <Select.Option value={item.value} key={item.value}>
          {item.label}
        </Select.Option>
      ))}
    </Select>
  )
}

export default PageSelect;
