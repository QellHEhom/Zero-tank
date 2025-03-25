import React, { useEffect, useMemo, useState } from "react";
import { Upload, Image } from "antd";
import { LoadingOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons";
import "./index.scss";
// 图片裁剪
import ImgCrop from "antd-img-crop";
// 引入api
import { upLodeImg, upLodeBanner, upLodeAuthor } from "../../api/img/index";
// 自定义hooks
import { useApi } from "../../utils/useApi";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
function Uplode({ imgurl, getCover, Imgtype = "img", quantity = 1 }) {
  // imgurl: 图片地址  getCover: 父组件的回调函数返回上传图片地址
  // console.log(imgurl);

  // 自定义hooks
  const { uploadFile } = useApi();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  // const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  useEffect(() => {
    if (imgurl && imgurl.length) {
      if (Array.isArray(imgurl)) {
        imgurl.forEach((item) => {
          setFileList((prev) => [
            ...prev,
            {
              uid: "-2",
              name: "image.png",
              status: "done",
              url: item,
            },
          ]);
        });
      } else {
        setFileList([
          {
            uid: "-2",
            name: "image.png",
            status: "done",
            url: imgurl,
          },
        ]);
      }
    }
  }, [imgurl]);

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        上传图片
      </div>
    </button>
  );

  // 上传图片
  const beforeUpload = async (event) => {
    const file = event.file;
    let Data = "";
    let url = "";
    if (Imgtype === "banner") {
      Data = await uploadFile(upLodeBanner, file);
      url = Data.url;
      getCover(Data.name);
    } else if (Imgtype === "user") {
      Data = await uploadFile(upLodeAuthor, file);
      console.log(Data);

      url = Data.url;
      getCover(url);
    } else {
      Data = await uploadFile(upLodeImg, file);
      getCover(Data.name);
      url = Data.url;
    }
    // forceUpdate();
    setFileList([
      {
        uid: "-3",
        name: "image.png",
        status: "done",
        url: url,
      },
    ]);
    // console.log("222");
  };

  return (
    <div className="Uplode">
      <ImgCrop
        rotationSlider
        quality={1}
        aspect={
          Imgtype === "user" ? 1 / 1 : Imgtype === "banner" ? 46 / 19 : 16 / 10
        }
      >
        <Upload
          // action="https://localhost:3030/admin/Banner"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          customRequest={beforeUpload}
          disabled={false}
        >
          {fileList.length >= quantity ? null : uploadButton}
        </Upload>
      </ImgCrop>
      {previewImage && (
        <Image
          wrapperStyle={{
            display: "none",
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </div>
  );
}
export default React.memo(Uplode);
