import React, { useCallback, useEffect, useRef, useState } from "react";
import { Form, Input, Button } from "antd";
import Upload from "../../../../components/uplode";
import { selectAuthor, editAuthor } from "../../../../api/site/index";
// 自定义hooks
import { useApi } from "../../../../utils/useApi";
import "./index.scss";

// 表单提交
export default function Author() {
  // 自定义hooks
  const { sendRequest, verifyRequest } = useApi();
  const [form] = Form.useForm();
  const [author, setAuthor] = useState([]);
  const authorData = useRef();
  const AuthorData = async () => {
    const data = await sendRequest(selectAuthor);
    form.setFieldsValue({
      nickname: data?.nickname,
      intro: data?.intro,
    });
    setAuthor(data.avatar);
  };

  const getCover = (url) => {
    console.log(url);

    authorData.current = url;
  };

  const onSubmit = async () => {
    // 修改数据
    const { nickname, intro } = form.getFieldsValue();
    let newAvatar = author;
    if (authorData.current) {
      newAvatar = authorData.current;
    }
    await verifyRequest(
      editAuthor,
      { nickname, intro, avatar: newAvatar },
      "是否保存修改？",
      AuthorData
    );
  };
  useEffect(() => {
    AuthorData();
  }, []);

  return (
    <div className="Author">
      <>
        <div className="Author-avatar">
          <p>作者头像</p>
          <Upload getCover={getCover} imgurl={author} Imgtype="user" />
        </div>
        <Form
          form={form}
          onFinish={onSubmit}
          layout="inline"
          className="Author-form"
        >
          <Form.Item
            rules={[
              {
                required: true,
                message: "请输入作者名称!",
              },
            ]}
            name="nickname"
            label="作者名称"
          >
            <Input placeholder="input placeholder" />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "请输入个性签名!",
              },
            ]}
            name="intro"
            label="个性签名"
          >
            <Input placeholder="input placeholder" />
          </Form.Item>
        </Form>
        <Button
          type="primary"
          onClick={() => {
            form.submit();
          }}
          className="Author-formbtn"
        >
          保存
        </Button>
      </>
    </div>
  );
}
