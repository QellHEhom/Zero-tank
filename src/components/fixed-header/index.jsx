import React, { useMemo } from "react";
import { Breadcrumb } from "antd";
import { useLocation, useNavigate } from "react-router";
import routes from "../../routes";
import "./index.scss";

export default function FixedHeader(props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  
  // 将OnRoute函数定义提前，确保在使用前已定义
  const OnRoute = (url) => {
    let choose = {};
    if (url === "/") {
      choose = {
        key: "home",
        keyPath: ["home"],
      };
    } else {
      const pathParts = url.split("/").filter(i => i);
      choose = {
        key: pathParts[0] || "home",
        keyPath: pathParts.length ? pathParts : ["home"],
      };
    }
    props.onToggle(choose);
    navigate(url);
  };

  // 使用useMemo优化面包屑计算，避免不必要的重新计算
  const Breadcrumbs = useMemo(() => {
    const initialBreadcrumbs = [{ title: <div onClick={() => OnRoute("/")}>首页</div> }];
    const pathSnippets = pathname.split("/").filter((i) => i);
    
    if (pathSnippets.length === 0) {
      return initialBreadcrumbs;
    }
    
    let currentList = routes;
    let currentUrl = "";
    const result = [...initialBreadcrumbs];
    
    for (const segment of pathSnippets) {
      if (!currentList) break;
      
      const matchedRoute = currentList.find(route => {
        const routePath = route.path.split("/").filter(i => i)[0];
        return segment === routePath;
      });
      
      if (matchedRoute) {
        currentUrl = `${currentUrl}/${segment}`;
        result.push({
          title: <div onClick={() => OnRoute(currentUrl)}>{matchedRoute.breadcrumbName}</div>,
        });
        currentList = matchedRoute.children;
      } else {
        break;
      }
    }
    
    return result;
  }, [pathname]);

  return <Breadcrumb className="FixedHeader" items={Breadcrumbs} />;
}
