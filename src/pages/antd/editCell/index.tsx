import React, { useState, useRef, useContext, useEffect, useCallback, useMemo } from 'react';
import { Table, Form, InputNumber } from 'antd';
import { useMemoizedFn } from 'ahooks';

const EditableContext: any = React.createContext(null);

const EditableRow = ({ ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false} >
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
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  /** 保存 */
  const save = async () => {
    try {
      const values = await form?.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item style={{ margin: 0 }
      } name={dataIndex} >
        <InputNumber
          min={0}
          max={100}
          // formatter={value => `${value}%`}
          // parser={value => value.replace('%', '')}
          ref={inputRef}
          onPressEnter={save}
          onBlur={save}
        />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" onClick={toggleEdit} >
        {children[1] ? children : 0} %
      </div>
    );
  }

  return <td {...restProps} > {childNode} </td>;
};


const CustomWeight = () => {
  const [dataSource, setDataSource] = useState([
    {
      key: '0',
      name: 1,
      age: '32',
      address: 'London, Park Lane no. 0',
    },
    {
      key: '1',
      name: 2,
      age: '32',
      address: 'London, Park Lane no. 1',
    },
  ]);
  const [columns, setColumns] = useState<any[]>();

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  /** 列表头（初始化） */
  const initColumns = useMemo(() => [
    {
      title: 'name',
      dataIndex: 'name',
      editable: true,
    },
    {
      title: 'age',
      dataIndex: 'age',
    },
    {
      title: 'address',
      dataIndex: 'address',
    },
  ], []);
  /** 编辑后保存 */
  const handleSave = useMemoizedFn((row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData)
  });
  /** 转换columns */
  const transformColumns = useCallback(() => {
    let columnX = initColumns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: any) => {
          return {
            record,
            editable: col.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave: handleSave,
          }
        },
      };
    });
    setColumns(columnX);
  }, [initColumns, handleSave]);

  useEffect(() => {
    transformColumns();
  }, [transformColumns])

  return (
    <div>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns}
      />
    </div>
  )
}

export default CustomWeight;
