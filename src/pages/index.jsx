import React, { useEffect, useState } from "react";
import MainCss from "./index.module.css";
import FixedHeader from "../components/fixed-header/index";
// 引入 routes
import { useRoutes, useNavigate } from "react-router-dom";
import routes from "../routes";

import Icon from "../components/Icon";
// 引入 antd
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
const { Header, Sider, Content } = Layout;

// 侧边栏菜单
const items = [
  {
    key: "home",
    icon: <HomeOutlined />,
    label: "首页",
  },
  {
    key: "articleList",
    icon: <Icon name="article" />,
    label: "文章管理",
    children: [
      {
        key: "article",
        icon: <Icon name="article" />,
        label: "文章管理",
      },
      {
        key: "category",
        icon: <Icon name="category" />,
        label: "分类管理",
      },
      {
        key: "tags",
        icon: <Icon name="tags" />,
        label: "标签管理",
      },
      {
        key: "draft",
        icon: <Icon name="draft" />,
        label: "草稿箱",
      },
    ],
  },
  {
    key: "site",
    icon: <Icon name="webManage" />,
    label: "站点管理",
    children: [
      {
        key: "config",
        icon: <Icon name="webManage" />,
        label: "网站配置",
      },
    ],
  },
  {
    key: "users",
    icon: <Icon name="user" />,
    label: "用户管理",
    children: [
      {
        key: "user",
        icon: <Icon name="user" />,
        label: "用户管理",
      },
    ],
  },
  {
    key: "system",
    icon: <Icon name="system" />,
    label: "系统管理",
  },
];

export default function ViewMain() {
  // 添加路由表
  const element = useRoutes(routes);
  // 编程式路由导航
  const navigate = useNavigate();
  // 路由选中
  const [choose, setchoose] = useState(
    JSON.parse(sessionStorage.getItem("choose")) || {
      SelectedKeys: "home",
      OpenKeys: [],
    }
  );
  // 路由切换
  const onToggle = (event) => {
    const path = event.keyPath.reverse().join("/");
    setchoose({
      SelectedKeys: event.key,
      OpenKeys: event.keyPath,
    });
    if (path === "home") {
      navigate(`/`);
      return;
    }

    navigate(`/${path}`);
  };
  // 侧边栏展开
  const openChange = (OpenKeys) => {
    setchoose((prevState) => ({
      ...prevState,
      OpenKeys: OpenKeys,
    }));
  };

  // 侧边栏是否缩起
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    sessionStorage.setItem("choose", JSON.stringify(choose));
    return () => {};
  }, [choose]);

  return (
    <Layout style={{ minHeight: "100rem" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        onCollapse={(value) => setCollapsed(value)}
        width={230}
        className={MainCss.LayoutSider}
      >
        <div className={MainCss.Logo}>
          <Icon name="article" />
          <span
            style={{ fontSize: "20px", display: collapsed ? "none" : "" }}
            className={MainCss.titleSpan}
          >
            零点舱后台管理管理
          </span>
        </div>
        <Menu
          openKeys={choose.OpenKeys}
          selectedKeys={choose.SelectedKeys}
          onOpenChange={openChange}
          mode="inline"
          theme="dark"
          inlineCollapsed={collapsed}
          items={items}
          onSelect={onToggle}
          forceSubMenuRender="true"
        />
      </Sider>
      <Layout
        className="site-layout"
        style={{ marginLeft: collapsed ? 80 : 230 }}
      >
        <Header className={MainCss.layoutHeader}>
          <div className={MainCss.FixedHeader} style={{ display: "flex" }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <FixedHeader onToggle={onToggle} collapsed={collapsed} />
          </div>
        </Header>
        <Content className={MainCss.content}>
          <div>{element}</div>
        </Content>
      </Layout>
    </Layout>
  );
}
