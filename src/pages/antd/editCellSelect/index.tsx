import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { Table, Form, Select, Button } from 'antd';
import { useMemoizedFn } from 'ahooks';
import ChildSelect from './childSelect'

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
  saveTable,
  ...restProps
}: any) => {
  const [options, setOptions] = useState([
    { lable: '选择1', value: '1' },
    { lable: '选择2', value: '2' },
    { lable: '选择3', value: '3' },
    { lable: '选择4', value: '4' },
  ]);
  const form: any = useContext(EditableContext);

  /** 保存单个编辑框 */
  const saveSingle = async () => {
    try {
      const values = await form?.validateFields();
      if(values.name.length > 0){
        saveTable({ ...record, ...values});
      }else{
        saveTable({ ...record, ...values, ...{customA: 0}});
      }
    } catch (errInfo:any) {
      saveTable({ ...record, ...errInfo.values, ...{customA: 0}});
      console.log('Save failed:', errInfo);
    }
  };
  /** 汇总事件前检查 */
  const summaryBefore = useCallback( async() => {
    try {
      await form?.validateFields();
      saveTable({ ...record, ...{customA: 2} });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  }, [record]);

  useEffect(() => {
    if (editable) {
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
      if(record['customA'] === 1){
        summaryBefore();
      }
    }
  }, [dataIndex, editable, JSON.stringify(record)])

  let childNode = children;
  if (editable) {
    childNode = (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[{ required: true, message: '请选择' }]}>
        <Select
          mode="tags"
          onBlur={saveSingle}
        >
          {options.map((item) => (
            <Select.Option key={item.lable} value={item.lable}>{item.lable}</Select.Option>
          ))}
        </Select>
      </Form.Item>
    );
  }

  return (<td {...restProps}>{childNode}</td>)
};


const EditCellSelect = () => {
  const [dataSource, setDataSource] = useState([
    {
      key: '0',
      // name: ['选择1', '11'],
      name: [],
      age: '32',
      address: '上海',
      customA: 0,
    },
    {
      key: '1',
      // name: ['22'],
      name: [],
      age: '32',
      address: '杭州',
      customA: 0,
    },
  ]);
  const [columns, setColumns] = useState<any[]>();

  /** 列表头（初始化） */
  const initColumns = useMemo(() => [
    {
      title: 'name',
      dataIndex: 'name',
      editable: true,
      width: 500,
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
  const saveTable = useMemoizedFn((row) => {
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
            saveTable: saveTable,
          }
        },
      };
    });
    setColumns(columnX);
  }, [initColumns, saveTable]);
  /** 切换所有的选项 */
  const blurChangeAllSelect = useCallback((data) => {
    const newData = [...dataSource].map((item) => {
      item.name = data;
      return item;
    })
    setDataSource(newData);
  }, [dataSource]);
  /** 汇总事件 */
  const summary = useCallback(() => {
    const newData = [...dataSource].map((item:any) => {
      switch(item.customA){
        case 0:
          item.customA = 1;
          break;
      }
      return item;
    })
    console.log(11, newData)
    const _list = newData.filter((item) => item.customA === 0 || item.customA === 1)
    console.log(22, _list)
    if(_list.length > 0){
      setDataSource(newData);
      return;
    }
    console.log('调接口')
  }, [dataSource]);

  useEffect(() => {
    transformColumns();
  }, [])

  return (
    <div>
      <Table
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns}
      />
      <ChildSelect onBlur={blurChangeAllSelect} />
      <Button onClick={summary}>汇总</Button>
    </div>
  )
}

export default EditCellSelect;
