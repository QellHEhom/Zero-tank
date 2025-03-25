import { Navigate } from "react-router-dom";

//
import Home from "../pages/Home";
//
import ArticlesIndex from "../pages/articles/articles";
import AddArticles from "../components/addArticles";
import Category from "../pages/articles/category";
import Tags from "../pages/articles/tags";
import Draft from "../pages/articles/draft";

// site
import Config from "../pages/site/config";
import Author from "../pages/site/config/author";
import Banner from "../pages/site/config/banner";
import System from "../pages/site/config/system/index";

const routes = [
  {
    path: "/",
    element: <Home />,
    breadcrumbName: "首页",
  },
  {
    path: "articleList",
    breadcrumbName: "文章管理",
    children: [
      {
        path: "article",
        element: <ArticlesIndex />,
        breadcrumbName: "文章管理",
      },
      {
        path: "changearticles/:id",
        element: <AddArticles />,
        breadcrumbName: "编辑文章",
      },
      {
        path: "addarticles",
        element: <AddArticles />,
        breadcrumbName: "添加文章",
      },
      {
        path: "category",
        element: <Category />,
        breadcrumbName: "分类管理",
      },
      {
        path: "tags",
        element: <Tags />,
        breadcrumbName: "标签管理",
      },
      {
        path: "draft",
        element: <Draft />,
        breadcrumbName: "草稿箱",
      },
    ],
  },
  {
    path: "site",
    breadcrumbName: "站点管理",
    children: [
      {
        path: "config",
        element: <Config />,
        breadcrumbName: "站点配置",
        children: [
          {
            path: "author",
            element: <Author />,
            breadcrumbName: "作者信息",
          },
          {
            path: "banner",
            element: <Banner />,
            breadcrumbName: "轮播图",
          },
          {
            path: "system",
            element: <System />,
            breadcrumbName: "网站设置",
          },
        ],
      },
    ],
  },

  // {
  //   path: "/about/about/about",
  //   element: <Navigate to="/about" />,
  // },
];

export default routes;
