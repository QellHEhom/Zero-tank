import React, { useEffect } from "react";
import ViewHome from "./pages/index";
import { useLocation } from "react-router-dom";
import { ToastProvider } from "./utils/useApi";

export default function App() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0); // 页面滚动到顶部
  }, [location]);
  return (
    <>
      <ToastProvider>
        <ViewHome />
      </ToastProvider>
    </>
  );
}
