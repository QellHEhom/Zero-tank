import React, { useCallback, useEffect, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { DatePicker, Form, Input, Button } from "antd";
import Upload from "../../../../components/uplode";
import {
  selectAuthor,
  editAuthor,
  editTourist,
  selectTourist,
} from "../../../../api/site/index";
// 自定义hooks
import { useApi } from "../../../../utils/useApi";
import "./index.scss";

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
const rules = [
  {
    required: true,
    message: "Please input your password!",
  },
];

// 表单提交
export default function System() {
  // 自定义hooks
  const { sendRequest, verifyRequest } = useApi();
  const [form] = Form.useForm();
  const [tourist, setTourist] = useState([]);
  const avatarData = useRef();
  // const [author, setAuthor] = useState();
  const TouristData = async () => {
    const data = await sendRequest(selectTourist);
    // form.setFieldsValue({
    //   name: data?.name,
    //   signature: data?.signature,
    // });
    setTourist(data.avatar);
  };
  const getCover = (url) => {
    avatarData.current = url;
  };

  const onSubmit = async () => {
    // 修改数据
    // const { name, signature } = form.getFieldsValue();
    let newAvatar = tourist;
    if (avatarData.current) {
      newAvatar = avatarData.current;
    }
    console.log(newAvatar);

    await verifyRequest(
      editTourist,
      { avatar: newAvatar },
      "是否保存修改？",
      TouristData
    );
  };
  useEffect(() => {
    TouristData();
  }, []);

  return (
    <div className="System">
      <>
        <div className="System-avatar">
          <p>游客头像</p>
          <Upload getCover={getCover} imgurl={tourist} Imgtype="user" />
        </div>
        <Form
          form={form}
          onFinish={onSubmit}
          layout="inline"
          className="System-form"
        >
          <Form.Item name="name" label="公告">
            <TextArea rows={4} />
          </Form.Item>
        </Form>
        <Button
          type="primary"
          onClick={() => {
            form.submit();
          }}
          className="System-formbtn"
        >
          保存
        </Button>
      </>
    </div>
  );
}
