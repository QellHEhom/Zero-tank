import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Image, Select } from "antd";
import Upload from "../../../../components/uplode/index";
import Tables from "../../../../components/Table";
import "./index.scss";
// content
import TableContent from "../../../../store/tableContext/index";

import {
  getBannerList,
  AddBanner,
  articlesAll,
  editBanner,
  removeBanner,
} from "../../../../api/site/index";
import { useApi } from "../../../../utils/useApi";

// 表单提交
export default function Banner() {
  const { sendRequest, verifyRequest } = useApi();
  const [articlesList, setArticlesList] = useState([]);
  const [BannerData, setBannerData] = useState([]);
  const NewImage = useRef("");
  const getList = async () => {
    const data = await sendRequest(getBannerList);
    const List = await sendRequest(articlesAll);
    const Option = [];
    Option.push(
      List.map((item) => ({
        value: item.id,
        label: item.title,
      }))
    );
    setArticlesList(Option[0]);
    setBannerData(data);
  };
  const getCover = (url) => {
    NewImage.current = url;
  };

  // 表格列
  const columns = useMemo(() => [
    {
      title: "封面",
      dataIndex: "picture",
      width: "30%",
      editable: true,
      render: (record) => (
        <div
          style={{
            width: "70%",
            minHeight: "110px",
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
      title: "关联文章",
      dataIndex: "title",
      width: "32%",
      editable: true,
    },
    {
      title: "位置",
      dataIndex: "sort_order",
      width: "12%",
      editable: true,
    },
  ]);
  const alter = useCallback(
    (dataIndex, record) => {
      if (dataIndex === "picture")
        return (
          <div className="banner-image">
            <Upload
              getCover={getCover}
              imgurl={record.picture}
              Imgtype="banner"
            />
          </div>
        );
      if (dataIndex === "title")
        return (
          <Select
            style={{
              width: 360,
            }}
            options={articlesList}
          />
        );
      if (dataIndex === "sort_order")
        return (
          <Select
            options={[
              {
                value: 1,
                label: 1,
              },
              {
                value: 2,
                label: 2,
              },
              {
                value: 3,
                label: 3,
              },
              {
                value: 4,
                label: 4,
              },
              {
                value: 5,
                label: 5,
              },
            ]}
          />
        );
    },
    [articlesList]
  );

  const fn = {
    Data: BannerData,
    add: async (data) => {
      const Data = {
        image: NewImage.current ? NewImage.current : data.image,
        relevance: data.title,
        sort_order: data.sort_order,
      };
      const status = await verifyRequest(
        AddBanner,
        Data,
        "是否添加？",
        getList
      );
      if (status) {
        NewImage.current = "";
        return status;
      }
    },
    remove: async (id) => {
      const status = await verifyRequest(
        removeBanner,
        id,
        `确定要删除这 ${id.length} 项吗？`,
        getList
      );
      if (status) {
        NewImage.current = "";
        return status;
      }
    },
    edit: async (data) => {
      const Data = {
        id: data.id,
        relevance: data.title,
        sort_order: data.sort_order,
      };
      articlesList.forEach((item) => {
        if (item.label === data.title) {
          Data.relevance = item.value;
        }
      });
      console.log(Data);
      // banner_1738804385313
      if (NewImage.current) {
        Data.image = NewImage.current;
      } else {
        BannerData.forEach((item) => {
          if (item.id === data.id) {
            Data.image = item.image;
          }
        });
      }

      const status = await verifyRequest(
        editBanner,
        Data,
        "是否保存修改？",
        getList
      );
      if (status) {
        NewImage.current = "";
        return status;
      }
    },
  };

  useEffect(() => {
    getList();
  }, []);
  return (
    <div className="Banner">
      <div className="Author-banner">
        <TableContent.Provider
          value={{
            module: "banner",
            columns,
            TabsData: BannerData,
            alter,
            fn: fn,
          }}
        >
          <Tables />
        </TableContent.Provider>
      </div>
    </div>
  );
}
