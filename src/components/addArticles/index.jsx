import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import "./index.scss";
import Uplode from "../uplode/index";
import { Input, Select, Divider, Button, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
// 富文本
import { AiEditor } from "aieditor";
import "aieditor/dist/style.css";

import { useNavigate } from "react-router-dom";

import { useApi } from "../../utils/useApi";

// 请求
import {
  getArticles,
  draftArticles,
  publishArticles,
  getTagList,
  getCategoryList,
} from "../../api/articles/index";
import { upLodeImg } from "../../api/img/index";

const { TextArea } = Input;
// 判断是否为空
const is_empty = (temporarily) => {
  for (let key in temporarily) {
    switch (key) {
      case "original_url":
        continue;
      case "tag":
        if (!temporarily[key] || !temporarily[key].length) {
          return key;
        }
        break;
      case "is_stick":
        break;
      case "is_carousel":
        break;
      case "is_original":
        if (temporarily[key] === 0 && temporarily["original_url"] === "") {
          return "original_url";
        }
        break;
      case "is_draft":
        continue;
      default:
        if (!temporarily[key]) {
          return key;
        }
        break;
    }
  }
  return true;
};
// 获取下拉框数据
const Options = (Data) => {
  let categorylist = [];
  Data.forEach((item) => {
    categorylist.push({ value: item.name, label: item.name });
  });
  return categorylist;
};
export default function AddArticles() {
  // 全局提示
  const [messageApi, contextHolder] = message.useMessage();
  const { id } = useParams();
  const navigate = new useNavigate();
  // 自定义hooks
  const { sendRequest, verifyRequest, uploadFile } = useApi();
  // 富文本
  const divRef = useRef(null);
  // 标签数据
  const [tagOptions, setTagOptions] = useState("");
  const [categoryOptions, setCategoryOptions] = useState("");

  // 文章数据
  const [ArticlesData, setArticlesData] = useState({
    // 文章封面
    avatar: "",
    // 文章标题
    title: "",
    // 文章简介
    summary: "",
    // 文章分类
    category: "",
    // 文章标签
    tag: [],
    // 是否置顶
    is_stick: 0,
    // 是否原创
    is_original: 0,
    // 是否首页轮播
    is_carousel: 0,
    // 转载地址
    original_url: "",
    // 文章内容
    contents: "",
    // 状态
    is_draft: 2,
  });
  // 封面
  const avatar = useRef("");

  // 发布/添加草稿
  const onTap = async (behavior) => {
    const temporarily = ArticlesData;
    const bolo = is_empty(temporarily);
    console.log(ArticlesData);

    if (bolo !== true) {
      messageApi.open({
        type: "warning",
        content: "请将信息填写完整",
      });
      return;
    }
    if (behavior === "publish") {
      await verifyRequest(publishArticles, ArticlesData, "确认发布文章？");
    }
    if (behavior === "draft") {
      await verifyRequest(draftArticles, ArticlesData, "添加至草稿箱？");
    }
  };

  // 自定义hooks
  const aiEditor = useMemo(() => {
    if (divRef.current) {
      const editor = new AiEditor({
        element: divRef.current,
        placeholder: "点击输入内容...",
        content: ArticlesData.contents,
        codeBlock: {
          languages: [
            { name: "Auto", value: "auto" },
            { name: "JavaScript", value: "javascript", alias: ["js"] },
            { name: "bash", value: "bash", alias: ["sh", "shell", "cli"] },
            { name: "TypeScript", value: "typescript", alias: ["ts"] },
            { name: "C", value: "c", alias: ["h"] },
            { name: "Python", value: "python", alias: ["py"] },
            { name: "SQL", value: "sql", alias: [] },
          ],
        },
        image: {
          uploader: async (file) => {
            const formData = new FormData();
            formData.append("file", file);
            return new Promise(async (resolve, reject) => {
              const message = await uploadFile(upLodeImg, file);
              if (message.url) {
                resolve(message.url);
              } else {
                reject(message);
              }
              // axios({
              //   url: "http://127.0.0.1:3030/admin/uplode",
              //   method: "post",
              //   data: formData,
              //   headers: { "Content-Type": "multipart/form-data" },
              // })
              //   .then((url) => {
              //     if (url.status === 200) {
              //       console.log(url.data.message.src);
              //       resolve(url.data.message.src);
              //     }
              //   })
              //   .catch((error) => {
              //     reject(error);
              //   });
            });
          },
          uploaderEvent: {
            onSuccess: (file, response) => {
              //监听图片上传成功
              //注意：
              // 1、如果此方法返回 false，则图片不会被插入到编辑器
              // 2、可以在这里返回一个新的 json 给编辑器
              const Data = {
                errorCode: 0,
                data: {
                  src: response,
                  alt: "",
                },
              };
              return Data;
            },
          },
        },
        onBlur: (aiEditor) => {
          setArticlesData((prevData) => ({
            ...prevData,
            contents: aiEditor.getHtml(),
          }));
        },
      });
      return editor;
    }
    return null;
  }, [divRef.current]);

  // 获取文章信息
  const getArticlesData = useCallback(async () => {
    const res = await sendRequest(getArticles, id);
    const data = res[0];
    setArticlesData(data);
    avatar.current = data.avatar;
    if (aiEditor) {
      aiEditor.setContent(data.contents);
    }
  }, [id, sendRequest]);

  // 获取标签和分类数据
  const getTagCategoryData = useCallback(async () => {
    const tag = Options(await sendRequest(getTagList));
    const category = Options(await sendRequest(getCategoryList));
    setTagOptions(tag);
    setCategoryOptions(category);
  }, [getTagList, getCategoryList]);

  useEffect(() => {
    if (id) {
      getArticlesData(id);
    } else {
      // 确保在新增数据时初始化内容为空
      // setArticlesData((prevData) => ({
      //   ...prevData,
      //   contents: "",
      // }));
    }
    getTagCategoryData();
    return () => {
      if (aiEditor) {
        aiEditor.destroy();
      }
    };
  }, [id]);

  // 获取封面
  const getCover = (fileName) => {
    console.log("触发");
    console.log(fileName);

    setArticlesData((prevData) => ({
      ...prevData,
      avatar: fileName,
    }));
  };

  return (
    <>
      <div className="AddArticles">
        <div className="back" onClick={() => navigate(-1)}>
          <ArrowLeftOutlined />
          Back
        </div>
        <div className="Message">
          <div className="MessageLeft">
            <Uplode getCover={getCover} imgurl={avatar.current} />
            <div style={{ marginTop: "1.25rem" }}>文章封面</div>
          </div>
          <div className="Input">
            <div>
              <span>文章标题</span>
              <Input
                value={ArticlesData.title}
                style={{ width: "23.75rem" }}
                onChange={(e) =>
                  setArticlesData((prevData) => ({
                    ...prevData,
                    title: e.target.value,
                  }))
                }
                placeholder="请输入文章标题"
              />
            </div>
            <div>
              <span>文章简介</span>
              <TextArea
                value={ArticlesData.summary}
                onChange={(e) =>
                  setArticlesData((prevData) => ({
                    ...prevData,
                    summary: e.target.value,
                  }))
                }
                placeholder="请输入章简介"
                autoSize={{
                  minRows: 6,
                  maxRows: 7,
                }}
                style={{ width: "23.75rem", marginTop: "1.25rem" }}
              />
            </div>
          </div>
          <div className="Select">
            <div className="SelectCenter">
              <div>
                <span>分类</span>
                <Select
                  value={ArticlesData.category}
                  onChange={(value) => {
                    setArticlesData((prevData) => ({
                      ...prevData,
                      category: value,
                    }));
                  }}
                  style={{ width: 200 }}
                  options={categoryOptions}
                />
              </div>
              <div>
                <span>是否置顶</span>
                <Select
                  value={ArticlesData.is_stick}
                  style={{ width: 120 }}
                  options={[
                    { value: 0, label: "否" },
                    { value: 1, label: "是" },
                  ]}
                  onChange={(value) =>
                    setArticlesData((prevData) => ({
                      ...prevData,
                      is_stick: value,
                    }))
                  }
                />
              </div>
              <div>
                <span>标签</span>
                <Select
                  mode="multiple"
                  allowClear
                  value={ArticlesData.tag}
                  onChange={(value) =>
                    setArticlesData((prevData) => ({
                      ...prevData,
                      tag: value,
                    }))
                  }
                  style={{ width: 200 }}
                  options={tagOptions}
                />
              </div>
              <div>
                <span>是否轮播</span>
                <Select
                  value={ArticlesData.is_carousel}
                  style={{ width: 120 }}
                  options={[
                    { value: 0, label: "否" },
                    { value: 1, label: "是" },
                  ]}
                  onChange={(value) =>
                    setArticlesData((prevData) => ({
                      ...prevData,
                      is_carousel: value,
                    }))
                  }
                />
              </div>
              <div>
                <span>是否原创</span>
                <Select
                  value={ArticlesData.is_original}
                  style={{ width: 120 }}
                  options={[
                    { value: 0, label: "否" },
                    { value: 1, label: "是" },
                  ]}
                  onChange={(value) => {
                    setArticlesData((prevData) => ({
                      ...prevData,
                      is_original: value,
                      original_url: "",
                    }));
                  }}
                />
              </div>
              <div style={{ fontSize: ".9375rem" }}>
                当前状态：
                <span style={{ color: "rgb(223, 63, 251)" }}>
                  {ArticlesData.is_draft === 0
                    ? "已发布"
                    : ArticlesData.is_draft === 1
                    ? "草稿"
                    : ArticlesData.is_draft === 2
                    ? "新建"
                    : "状态异常"}
                </span>
              </div>
            </div>
            {ArticlesData.is_original === 0 && (
              <div className="reship">
                <span>转载地址</span>
                <Input
                  value={ArticlesData.original_url}
                  style={{ width: "18.75rem" }}
                  onChange={(e) =>
                    setArticlesData((prevData) => ({
                      ...prevData,
                      original_url: e.target.value,
                    }))
                  }
                  placeholder="请输入转载地址"
                />
              </div>
            )}
          </div>
          <div className="MessageRight">
            <Button
              type="primary"
              size="large"
              onClick={() => {
                onTap("publish");
              }}
            >
              发布
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={() => {
                onTap("draft");
              }}
            >
              暂存草稿
            </Button>
          </div>
        </div>
        <Divider />
        <div ref={divRef} className="AiEditor" />
      </div>
      {contextHolder}
      {/* <Modal
        open={open}
        onOk={() => handleOk(modalText)}
        confirmLoading={confirmLoading}
        onCancel={() => setOpen(false)}
      >
        <p style={{ fontSize: "1.125rem" }}>{modalText}</p>
      </Modal> */}
    </>
  );
}
