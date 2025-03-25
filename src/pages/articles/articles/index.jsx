import React, { useContext, useEffect, useState } from "react";
import ArticlesCss from "./index.module.css";
import { Input, Select, Image, Form, Button } from "antd";
import { SearchOutlined, UndoOutlined } from "@ant-design/icons";
import Card from "../../../components/Card/index";
import {
  getpublishList,
  delArticles,
  getTagList,
  getCategoryList,
  filterArticles,
} from "../../../api/articles/index";
// content
import TableContent from "../../../store/tableContext/index";
// Table组件
import Table from "../../../components/Table";
// 自定义hooks
import { useApi } from "../../../utils/useApi";

// 表格列
const columns = [
  {
    title: "封面",
    dataIndex: "avatar",
    width: "14%",
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
export default function Articles() {
  // 搜索文章数据
  const [form] = Form.useForm();
  // 标签数据
  const [tagOptions, setTagOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  // 自定义hooks
  const { sendRequest, verifyRequest } = useApi();
  // 主数据
  const [articlesData, setArticlesData] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 并行发起所有请求
        const [articles, tags, categories] = await Promise.all([
          sendRequest(getpublishList),
          sendRequest(getTagList),
          sendRequest(getCategoryList),
        ]);
        // 批量更新状态
        setArticlesData(articles);
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
        async () => {
          setArticlesData(await sendRequest(getpublishList));
        }
      );
    },
  };

  const onSubmit = async () => {
    const data = await form.getFieldsValue();
    if (data.status) {
      data[data.status] = 1;
      delete data.status;
    }
    data.is_draft = 0;
    const filterData = await sendRequest(filterArticles, data);
    setArticlesData(filterData);
  };
  return (
    <>
      <TableContent.Provider
        value={{
          module: "articles",
          columns,
          TabsData: articlesData,
          tagOptions,
          fn: fn,
        }}
      >
        <Card className={ArticlesCss.Search}>
          <Form form={form} layout="inline" className="Author-form">
            <Form.Item name="title" label="标题">
              <Input style={{ width: 300 }} placeholder="请输入文章标题" />
            </Form.Item>
            <Form.Item name="category" label="分类">
              <Select
                placeholder="请选择分类"
                style={{
                  width: 200,
                }}
                size="middle"
                options={categoryOptions}
              />
            </Form.Item>
            <Form.Item name="tag" label="标签">
              <Select
                placeholder="请选择标签"
                style={{
                  width: 200,
                }}
                size="middle"
                options={tagOptions}
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
              setArticlesData(await sendRequest(getpublishList));
              form.resetFields();
            }}
          >
            重置
          </Button>
        </Card>
        {articlesData && <Table />}
      </TableContent.Provider>
    </>
  );
}
