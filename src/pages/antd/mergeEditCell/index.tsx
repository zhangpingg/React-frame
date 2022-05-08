import React, { useEffect, useState, useMemo, useCallback, useRef, useContext } from 'react';
import { Table, Form, InputNumber } from 'antd';
import { useMemoizedFn } from 'ahooks';
import debounce from 'lodash/debounce';

const data = [
  {
    id: 1,
    a1Content: '一级内容1',
    a1Weight: 1,
    a1WeightContent: 0,
    a1WeightContentOld: 0,      // 前端自循环，保存一份旧值，方便提交的时候，比较前后是否修改，下面同理
    b2Content: '二级内容1',
    b2Weight: 2,
    b2WeightContent: 12,
    c3Content: '三级内容1',
    c3Weight: 3,
    c3WeightContent: 13,
    d4Content: '四级内容1',
    d4Weight: 4,
    d4WeightContent: 14,
    edited: false,              // 是否有编辑的权限
    editType: [],               // 哪些列可以编辑，编辑的时候会追加到该字段中
  },
  {
    id: 2,
    a1Content: '一级内容1',
    a1Weight: 1,
    a1WeightContent: 11,
    b2Content: '二级内容1',
    b2Weight: 2,
    b2WeightContent: 12,
    c3Content: '三级内容1',
    c3Weight: 3,
    c3WeightContent: 13,
    d4Content: '四级内容2',
    d4Weight: 5,
    d4WeightContent: 15,
    edited: false,
    editType: [],
  },
  {
    id: 3,
    a1Content: '一级内容1',
    a1Weight: 1,
    a1WeightContent: 11,
    b2Content: '二级内容2',
    b2Weight: 3,
    b2WeightContent: 13,
    c3Content: '三级内容2',
    c3Weight: 4,
    c3WeightContent: 14,
    d4Content: '四级内容3',
    d4Weight: 6,
    d4WeightContent: 16,
    edited: false,
    editType: [],
  },
  {
    id: 4,
    a1Content: '一级内容1',
    a1Weight: 1,
    a1WeightContent: 11,
    b2Content: '二级内容2',
    b2Weight: 3,
    b2WeightContent: 13,
    c3Content: '三级内容3',
    c3Weight: 5,
    c3WeightContent: 15,
    d4Content: '四级内容4',
    d4Weight: 7,
    d4WeightContent: 17,
    edited: false,
    editType: [],
  },
  {
    id: 5,
    a1Content: '一级内容2',
    a1Weight: 2,
    a1WeightContent: 12,
    b2Content: '二级内容3',
    b2Weight: 4,
    b2WeightContent: 14,
    c3Content: '三级内容4',
    c3Weight: 6,
    c3WeightContent: 16,
    d4Content: '四级内容5',
    d4Weight: 8,
    d4WeightContent: 18,
    edited: false,
    editType: [],
  },
  {
    id: 6,
    a1Content: '一级内容2',
    a1Weight: 2,
    a1WeightContent: 12,
    b2Content: '二级内容3',
    b2Weight: 4,
    b2WeightContent: 14,
    c3Content: '三级内容5',
    c3Weight: 7,
    c3WeightContent: 17,
    d4Content: '四级内容6',
    d4Weight: 9,
    d4WeightContent: 19,
    edited: false,
    editType: [],
  }
];

const EditableContext: any = React.createContext(null);

const EditableRow = ({ ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}: any) => {
  const [editing, setEditing] = useState(false);
  const inputRef: any = useRef(null);
  const form: any = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef?.current?.focus();
    }
  }, [editing]);
  /** 切换编辑状态 */
  const toggleEdit = () => {
    setEditing(!editing);
    form?.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  /** 保存 */
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      // 数据不变，不变色
      if (record[Object.keys(values)[0]] === values[Object.keys(values)[0]]) return;
      if (!record.editType.includes(Object.keys(values)[0])) {
        record.editType.push(Object.keys(values)[0]);
      }
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('错误:', errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item style={{ margin: 0 }} name={dataIndex}>
        <InputNumber
          min={0}
          max={100}
          size="small"
          // formatter={value => `${value}%`}
          // parser={value => value.replace('%', '')}
          ref={inputRef}
          onPressEnter={save}
          onBlur={save}
        />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" role="button" tabIndex={0} onKeyDown={toggleEdit} onClick={toggleEdit} style={{ height: '24px', lineHeight: '24px' }}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const MergeEditCell = () => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [bodyHeight, setBodyHeight] = useState(document.body.clientHeight);
  const [columns, setColumns] = useState<any[]>();

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  /** 列头 */
  const initColumns = useMemo(() => [
    {
      title: '一级标题',
      key: 'a1Content',
      dataIndex: 'a1Content',
      onCell: (record: any) => ({
        rowSpan: record.rowSpana1Weight,
      }),
      render: (text: string) => (<span>{text}</span>),
    },
    {
      title: '一级指标权重',
      key: 'a1Weight',
      dataIndex: 'a1WeightContent',
      editable: true,
    },
    {
      title: '二级标题',
      key: 'b2Content',
      dataIndex: 'b2Content',
      onCell: (record: any) => ({
        rowSpan: record.rowSpanb2Weight,
      }),
      render: (text: string) => (<span>{text}</span>)
    },
    {
      title: '二级指标权重',
      key: 'b2Weight',
      dataIndex: 'b2WeightContent',
      editable: true,
    },
    {
      title: '三级标题',
      key: 'c3Content',
      dataIndex: 'c3Content',
      onCell: (record: any) => ({
        rowSpan: record.rowSpanc3Weight,
      }),
      render: (text: string) => (<span>{text}</span>)
    },
    {
      title: '三级指标权重',
      key: 'c3Weight',
      dataIndex: 'c3WeightContent',
      editable: true,
    },
    {
      title: '四级标题',
      key: 'd4Content',
      dataIndex: 'd4Content',
      onCell: (record: any) => ({
        rowSpan: record.rowSpand4Weight,
      }),
      render: (text: string) => (<span>{text}</span>)
    },
    {
      title: '四级指标权重',
      key: 'd4Weight',
      dataIndex: 'd4WeightContent',
      editable: true,
    },
  ], []);
  /** 合并单元格 */
  const mergeCell = useMemoizedFn((cellList: any[], mergeType: string) => {
    const mergeTypeMap = cellList.reduce((prev: any, curr: any) => {
      const prevX = { ...prev };
      if (prevX[curr[mergeType]]) {
        prevX[curr[mergeType]].count += 1;
      } else {
        prevX[curr[mergeType]] = {
          count: 1,
          selected: false,
        };
      }
      return prevX;
    }, {});
    const newList = cellList.map((item: any) => {
      if (mergeTypeMap[item[mergeType]].selected) {
        return {
          ...item,
          [`rowSpan${mergeType}`]: 0,
        };
      }
      mergeTypeMap[item[mergeType]].selected = true;
      return {
        ...item,
        [`rowSpan${mergeType}`]: mergeTypeMap[item[mergeType]].count,
      };
    }, []);
    return newList;
  });
  /** 转换数据格式 */
  const transFormData = useCallback((dataList: any[], strList: string[]) => {
    let dataX = [...dataList];
    strList.forEach((item: any) => {
      dataX = mergeCell(dataX, item);
    });
    return dataX;
  }, [mergeCell]);
  /** 屏幕缩放 */
  const setScroll = useCallback(() => {
    setBodyHeight(document.body.clientHeight);
  }, []);
  /** 编辑后保存 */
  const handleSave = useMemoizedFn((row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row, ...{ edited: true } });
    setDataSource(newData);
  });
  /** 转换columns */
  const transformColumns = useCallback(() => {
    const columnX = initColumns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: any) => ({
          record,
          rowSpan: record[`rowSpan${col.key}`],
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave,
        }),
        render: (text: string, record: any) => (
          <span style={{ color: record.edited && record.editType.includes(col.dataIndex) ? '#f00' : '' }}>
            {text || 0}
            %
          </span>
        )
      };
    });
    setColumns(columnX);
  }, [initColumns, handleSave]);

  useEffect(() => {
    setDataSource(transFormData(data, ['a1Weight', 'b2Weight', 'c3Weight', 'd4Weight']));
    window.addEventListener('resize', debounce(setScroll, 300));
    setScroll();
    transformColumns();
    return () => {
      window.removeEventListener('resize', setScroll);
    };
  }, [setScroll, transFormData, transformColumns]);

  return (
    <div style={{ height: bodyHeight - 177 }}>
      <Table
        rowKey="id"
        components={components}
        rowClassName={() => 'editable-row'}
        columns={columns}
        dataSource={dataSource}
        bordered
        pagination={false}
        scroll={{
          y: bodyHeight - 222,
          // x: 1500
        }}
      />
    </div>
  );
};

export default MergeEditCell;
