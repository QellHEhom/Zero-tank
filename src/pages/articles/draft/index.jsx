import React, { useEffect, useState } from "react";
import DraftCss from "./index.module.css";
import { Input, Select, Image, Form, Button } from "antd";
import { SearchOutlined, UndoOutlined } from "@ant-design/icons";
import Card from "../../../components/Card/index";
import {
  getDraftList,
  delArticles,
  getTagList,
  getCategoryList,
  filterArticles,
} from "../../../api/articles/index";

// Table组件
import Table from "../../../components/Table";
// content
import TableContent from "../../../store/tableContext/index";
// 自定义hooks
import { useApi } from "../../../utils/useApi";

// 表格列
const columns = [
  {
    title: "封面",
    dataIndex: "avatar",
    width: "14%",
    // editable: true,
    render: (record) => (
      <div
        style={{
          width: "70%",
          height: "74px",
          backgroundColor: "#f0f0f0",
          margin: "0 auto",
        }}
      >
        <Image
          title="查看图片"
          fallback={<div>加载失败</div>}
          src={record}
          alt="预览"
          width="100%"
        />
      </div>
    ),
  },
  {
    title: "标题",
    dataIndex: "title",
    width: "30%",
    align: "center",
  },
  {
    title: "分类",
    dataIndex: "category",
    width: "12%",
  },
  {
    title: "标签",
    dataIndex: "tag",
    width: "12%",
  },
  {
    title: "创建时间",
    dataIndex: "create_time",
    width: "13%",
    // editable: true,
  },
];

const statusOptions = [
  {
    value: "is_stick",
    label: "置顶",
  },
  {
    value: "is_carousel",
    label: "轮播",
  },
  {
    value: "is_original",
    label: "原创",
  },
];
/**
 *
 * RedactTab 参数：
 *    columns: 表格列
 *    originData: 表格数据
 *    options: 标签
 *    alter: 内置编辑渲染组件
 *
 */

const Options = (Data) => {
  if (!Data) return;
  let categorylist = [];
  Data.forEach((item) => {
    categorylist.push({ value: item.name, label: item.name });
  });
  return categorylist;
};
export default function Draft() {
  const [form] = Form.useForm();
  // 主数据
  const [DraftData, setDraftData] = useState([]);
  // 标签数据
  const [tagOptions, setTagOptions] = useState("");
  const [categoryOptions, setCategoryOptions] = useState("");
  // 自定义hooks
  const { sendRequest, verifyRequest } = useApi();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 并行发起所有请求
        const [Draft, tags, categories] = await Promise.all([
          sendRequest(getDraftList),
          sendRequest(getTagList),
          sendRequest(getCategoryList),
        ]);
        // 批量更新状态
        setDraftData(Draft);
        setTagOptions(Options(tags));
        setCategoryOptions(Options(categories));
      } catch (error) {
        console.error("数据获取失败:", error);
      }
    };
    fetchAllData();
  }, []);
  const fn = {
    remove: async (id) => {
      return await verifyRequest(
        delArticles,
        id,
        `确定要删除这 ${id.length} 项吗？`,
        async () => setDraftData(await sendRequest(getDraftList))
      );
    },
  };
  const onSubmit = async () => {
    const data = await form.getFieldsValue();
    if (data.status) {
      data[data.status] = 1;
      delete data.status;
    }
    data.is_draft = 1;
    const filterData = await sendRequest(filterArticles, data);
    setDraftData(filterData);
  };
  return (
    <>
      <TableContent.Provider
        value={{
          module: "draft",
          columns,
          TabsData: DraftData,
          tagOptions,
          fn: fn,
        }}
      >
        <Card className={DraftCss.Search}>
          <Form form={form} layout="inline" className="Author-form">
            <Form.Item name="title" label="标题">
              <Input style={{ width: 300 }} placeholder="请输入文章标题" />
            </Form.Item>
            <Form.Item name="Category" label="分类">
              <Select
                placeholder="请选择分类"
                style={{
                  width: 200,
                }}
                size="middle"
                options={tagOptions}
              />
            </Form.Item>
            <Form.Item name="tag" label="标签">
              <Select
                placeholder="请选择标签"
                style={{
                  width: 200,
                }}
                size="middle"
                options={categoryOptions}
              />
            </Form.Item>
            <Form.Item name="status" label="状态">
              <Select
                placeholder="请选择状态"
                style={{
                  width: 200,
                }}
                size="middle"
                options={statusOptions}
              />
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
              setDraftData(await sendRequest(getDraftList));
              form.resetFields();
            }}
          >
            重置
          </Button>
        </Card>
        <Table />
      </TableContent.Provider>
    </>
  );
}
