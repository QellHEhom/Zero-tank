import React, { useState, useEffect, useRef, useMemo } from "react";
import Card from "../../../components/Card/index";
import { Input, Button, Form, message } from "antd";
import { SearchOutlined, UndoOutlined } from "@ant-design/icons";
import CategoryCss from "./index.module.css";
import Table from "../../../components/Table";

// content
import TableContent from "../../../store/tableContext/index";
// 自定义hooks
import { useApi } from "../../../utils/useApi";
// api
import {
  getCategoryList,
  addCategory,
  removeCategory,
  editCategory,
  filterCategory,
} from "../../../api/articles/index";

import "antd/dist/reset.css";
import { Modal, Space } from "antd";

// 表格列
const columns = [
  {
    title: "名称",
    dataIndex: "name",
    width: "40%",
    align: "center",
    editable: true,
    shouldCellUpdate: (record, prevRecord) => record.name !== prevRecord.name,
  },
  {
    title: "数量",
    dataIndex: "quantity",
    width: "20%",
    align: "center",
    sorter: (a, b) => a.classifynum - b.classifynum,
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

export default function Category() {
  const [form] = Form.useForm();
  const [CategoryData, setCategoryData] = useState();
  // const CategoryData = useRef([]);
  // 自定义hooks
  const { sendRequest, verifyRequest } = useApi();
  const getCategoryListData = async () => {
    // 获取数据
    const res = await sendRequest(getCategoryList);
    setCategoryData(res);
  };

  // 方法
  const fn = useMemo(
    () => ({
      Data: CategoryData,
      add: async (data) => {
        return await verifyRequest(
          addCategory,
          data,
          "确定添加？",
          getCategoryListData
        );
      },
      remove: async (id) => {
        return await verifyRequest(
          removeCategory,
          id,
          `确定要删除这 ${id.length} 项吗？`,
          getCategoryListData
        );
      },
      edit: async (data) => {
        return await verifyRequest(
          editCategory,
          data,
          "确定修改？",
          getCategoryListData
        );
      },
    }),
    [CategoryData]
  );
  // 数据初始更新
  useEffect(() => {
    getCategoryListData();
  }, []);
  const onSubmit = async () => {
    const data = await form.getFieldsValue();
    const filter = await sendRequest(filterCategory, data);
    setCategoryData(filter);
  };
  return (
    <>
      <TableContent.Provider
        value={{
          columns,
          TabsData: CategoryData,
          alter,
          fn,
        }}
      >
        <Card className={CategoryCss.Classify}>
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
              await getCategoryListData();
              form.resetFields();
            }}
          >
            重置
          </Button>
        </Card>
        {CategoryData ? <Table /> : null}
      </TableContent.Provider>
    </>
  );
}
