import React, { useEffect, useMemo, useState } from "react";
import Card from "../../../components/Card/index";
import { Input, Form, Button } from "antd";
import { SearchOutlined, UndoOutlined } from "@ant-design/icons";
import TagsCss from "./index.module.css";
import Table from "../../../components/Table/index";
// content
import TableContent from "../../../store/tableContext/index";
// api
import {
  getTagList,
  addTag,
  removeTag,
  editTag,
  filterTag,
} from "../../../api/articles/index";
// 自定义hooks
import { useApi } from "../../../utils/useApi";
// 表格列
const columns = [
  {
    title: "名称",
    dataIndex: "name",
    width: "40%",
    align: "center",
    editable: true,
  },
  {
    title: "数量",
    dataIndex: "quantity",
    width: "20%",
    align: "center",
    sorter: (a, b) => a.quantity - b.quantity,
  },
  {
    title: "创建时间",
    dataIndex: "create_time",
    width: "20%",
    align: "center",
  },
];

//内置编辑渲染组件
const alter = (dataIndex, record) => {
  return <Input />;
};
export default function Tags() {
  const [form] = Form.useForm();
  const [TagsData, setTagsData] = useState([]);
  // 自定义hooks
  const { sendRequest, verifyRequest } = useApi();
  const getTagListData = async () => {
    const data = await sendRequest(getTagList);
    setTagsData(data);
  };

  const fn = useMemo(
    () => ({
      Data: TagsData,
      add: async (data) => {
        return await verifyRequest(addTag, data, "确认添加？", getTagListData);
      },
      remove: async (id) => {
        return await verifyRequest(
          removeTag,
          id,
          `确定要删除这 ${id.length} 项吗？`,
          getTagListData
        );
      },
      edit: async (data) => {
        return await verifyRequest(
          editTag,
          data,
          "确定要修改吗？",
          getTagListData
        );
      },
    }),
    [TagsData]
  );
  // 数据
  useEffect(() => {
    getTagListData();
  }, []);
  const onSubmit = async () => {
    const data = await form.getFieldsValue();
    const filter = await sendRequest(filterTag, data);
    setTagsData(filter);
  };
  return (
    <>
      <TableContent.Provider
        value={{
          module: "Tags",
          columns,
          TabsData: TagsData,
          alter,
          fn: fn,
        }}
      >
        <Card className={TagsCss.Classify}>
          <Form form={form} layout="inline" className="Author-form">
            <Form.Item name="name" label="名称">
              <Input placeholder="请输入标签名称" />
            </Form.Item>
          </Form>
          <Button
            onClick={onSubmit}
            size="middle"
            type="primary"
            icon={<SearchOutlined />}
          >
            搜索
          </Button>
          <Button
            style={{ marginLeft: "30px" }}
            size="middle"
            type="dashed"
            icon={<UndoOutlined />}
            onClick={async () => {
              await getTagListData();
              form.resetFields();
            }}
          >
            重置
          </Button>
        </Card>
        <Table columns={columns} TabsData={TagsData} alter={alter} />
      </TableContent.Provider>
    </>
  );
}
