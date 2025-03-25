import React, { useEffect, useState } from "react";
import "./index.scss";
import { Outlet } from "react-router-dom";
import { NavLink, useRoutes } from "react-router-dom";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";

import { useNavigate } from "react-router-dom";
const items = [
  {
    label: "作者信息",
    key: "author",
  },
  {
    label: "轮播图",
    key: "banner",
  },
  {
    label: "网站设置",
    key: "system",
  },
];

const Config = () => {
  const [current, setCurrent] = useState("author");
  // 编程式路由导航
  const navigate = useNavigate();
  const onClick = (e) => {
    setCurrent(e.key);
    navigate(`/site/config/${e.key}`);
  };

  useEffect(() => {
    navigate(`/site/config/author`);
  }, []);
  return (
    <div className="site-config">
      <Menu
        onClick={onClick}
        defaultSelectedKeys="author"
        selectedKeys={current}
        mode="horizontal"
        items={items}
      />
      <Outlet />
    </div>
  );
};
export default Config;
