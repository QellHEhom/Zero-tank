import React, { useState, useEffect, useContext, useRef, useMemo } from "react";
import { Form, Table, Button, Tag, message } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import ButtonTable from "./twoButton/index";
import { useNavigate } from "react-router";
// content
import TableContent from "../../store/tableContext/index";

const Tables = () => {
  // content
  const { module, TabsData, columns, alter, fn } = useContext(TableContent);
  // 主数据
  // const [data, setData] = useState();
  const data = useRef([]);
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  // 获取当前路由参数
  const navigate = useNavigate();
  // 选中删除
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const hasSelected = selectedRowKeys.length > 0;
  // 表格
  const [form] = Form.useForm();
  // 添加/修改数据--Loding
  // const [changeLoading, setChangeLoading] = useState(false);
  // 全局提示
  const [messageApi, contextHolder] = message.useMessage();

  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.id === editingKey;

  // 新增数据
  const addData = () => {
    let newData = {};
    const msg = data.current[0];
    if (!data.current && data.current.length === 0) return;
    for (let key in msg) {
      newData[key] = null;
      if (key === "id") newData[key] = 0;
    }
    data.current = [newData, ...data.current];
    edit(newData);
  };
  // 表格编辑
  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });

    setEditingKey(record.id);
  };

  // category
  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    let inputNode = alter ? alter(dataIndex, record) : null;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            validateDebounce={1000}
            rules={[
              {
                required: true,
                message: `请输入${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  // 取消操作
  const cancel = () => {
    data.current = data.current.filter((item) => item.id !== 0);
    setEditingKey("");
  };
  // 保存 + 修改数据
  const changeControls = async (id) => {
    try {
      const row = await form.validateFields();
      delete row.picture;
      let n = 0;
      if (!fn.Data) return;
      console.log("row", row);

      Object.keys(row).forEach((key) => {
        fn.Data.forEach((item) => {
          if (key === "title" && row[key] === item.relevance) {
            n += 1;
            return;
          }
          if (item.id !== id && item[key] === row[key]) n += 1;
        });
      });

      if (n > 0) {
        messageApi.open({
          type: "warning",
          content: "数据重复，请重新输入。",
        });
        return;
      }
      if (row.picture) delete row.picture;
      console.log(row);

      if (id !== 0) {
        // 编辑
        (await fn.edit({ id, ...row })) && setEditingKey("");
      } else {
        // 新增
        (await fn.add(row)) && setEditingKey("");
      }
    } catch (err) {
      console.log("err", err);
      messageApi.open({
        type: "warning",
        content: "请输入内容！",
      });
    }
  };

  // 删除数据
  const removeControls = async (id) => {
    let changeKey = [];
    if (Array.isArray(id)) {
      changeKey = id;
    } else {
      changeKey.push(id);
    }
    if (!changeKey) {
      messageApi.open({
        type: "warning",
        content: "请先选择需要删除的数据。",
      });
      return;
    }
    const status = await fn.remove(changeKey);
    status &&
      setSelectedRowKeys(
        selectedRowKeys.filter((item) => !changeKey.includes(item))
      );
  };

  // 选中数据
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };
  // const btn = useMemo(() => {
  //   return;
  // }, [isEditing]);
  // 列名渲染
  const column = [
    ...columns,
    {
      title: "操作",
      dataIndex: "operation",
      align: "center",
      render: (_, record) => {
        const editable = isEditing(record);
        return (
          <>
            {editable ? (
              <>
                <Button
                  size="small"
                  type="primary"
                  icon={<SaveOutlined />}
                  style={{
                    marginInlineEnd: 8,
                  }}
                  onClick={() => changeControls(record.id)}
                >
                  保存
                </Button>
                <Button
                  size="small"
                  color="cyan"
                  variant="solid"
                  icon={<CloseOutlined />}
                  onClick={() => cancel(record.id)}
                >
                  取消
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="small"
                  disabled={editingKey !== ""}
                  type="primary"
                  icon={<EditOutlined />}
                  style={{
                    marginInlineEnd: 8,
                  }}
                  onClick={() => {
                    if (module === "articles" || module === "draft") {
                      navigate(`/articleList/changeArticles/${record.id}`);
                    } else {
                      edit(record);
                    }
                  }}
                >
                  编辑
                </Button>
                <Button
                  size="small"
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeControls(record.id)}
                >
                  删除
                </Button>
              </>
            )}
          </>
        );
      },
    },
  ].map((item) => {
    if (item.dataIndex === "operation") return item;
    return {
      ...item,
      shouldCellUpdate: (record, prevRecord) =>
        record[item.dataIndex] !== prevRecord[item.dataIndex],
    };
  });

  // 表格数据 标签渲染
  const mergedColumns = column.map((col) => {
    col.align = "center";
    if (col.dataIndex === "tag") {
      col.render = (record) => {
        if (!record) return;
        return record.map((item) => {
          return (
            <Tag color="#409eff" key={item}>
              {item}
            </Tag>
          );
        });
      };
    }
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  // 获取数据
  useEffect(() => {
    if (TabsData) {
      data.current = TabsData;
      forceUpdate();
    }
  }, [TabsData]);

  return (
    <>
      {contextHolder}
      <ButtonTable
        module={module}
        addData={addData}
        removeControls={removeControls}
        hasSelected={hasSelected}
        selectedRowKeys={selectedRowKeys}
      />
      <Form form={form} component={false}>
        {data.current && (
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={data.current}
            columns={mergedColumns}
            rowSelection={rowSelection}
            rowClassName="editable-row"
            rowKey={(record) => record.id}
            pagination={{
              onChange: () => {
                setEditingKey("");
              },
            }}
          />
        )}
      </Form>
    </>
  );
};
export default Tables;
