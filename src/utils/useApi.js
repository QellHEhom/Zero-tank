import React, { createContext, useContext, useCallback, useMemo } from "react";
// import "./Toast.css"; // 自定义样式文件
import { message, Modal } from "antd";
const ToastContext = createContext();
export const ToastProvider = React.memo(({ children }) => {
  // 全局提示
  const [messageApi, contextHolder] = message.useMessage();
  const [modal, contextHolders] = Modal.useModal();
  const showMessage = useCallback((type, content) => {
    messageApi.open({
      type,
      content,
    });
  }, []);

  // 有确认框的请求
  const verifyRequest = useCallback(
    async (api, data = {}, verify = "操作成功！", getNewData, id = 0) => {
      if (!api || !data) {
        showMessage("error", "API 或数据未正确设置");
        return;
      }
      // 步骤一：打开确认框
      let status = "Pending";
      await modal.confirm({
        title: verify,
        okText: "确认",
        cancelText: "取消",
        maskClosable: true,
        async onOk() {
          try {
            await api(data);
            status = "Fulfilled";
          } catch (error) {
            showMessage("error", "请求发生错误！");
            status = "Rejected";
          }
        },
        onCancel() {
          status = "Rejected";
        },
      });
      if (status === "Fulfilled") {
        if (getNewData) await getNewData(id);
        showMessage("success", "操作成功！");
        return true;
      } else if (status === "Rejected") {
        showMessage("warning", "操作取消！");
        return false;
      }
    },
    []
  );

  // 无确认框的请求，有处理函数
  const sendRequest = useCallback(async (api, data = {}, fn) => {
    if (!api || !data) {
      showMessage("error", "API 或数据未正确设置");
      return;
    }
    try {
      const res = (await api(data)).data;
      const Data = fn ? fn(res.message) : res.message;
      return Data;
    } catch (error) {
      showMessage("error", error.message);
      return [];
    }
  }, []);

  // 文件上传
  const uploadFile = useCallback(
    async (api, file, headers = { "Content-Type": "application/json" }, fn) => {
      if (!file) {
        showMessage("error", "文件为空，请选择文件。");
        return;
      }
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = (await api(formData, headers)).data.message;
        return res;
      } catch (error) {
        showMessage("error", error.message);
        return [];
      }
    },
    []
  );

  const value = useMemo(() => {
    return {
      sendRequest,
      verifyRequest,
      uploadFile,
    };
  }, []);
  return (
    <ToastContext.Provider value={value}>
      {children}
      {contextHolder}
      {contextHolders}
    </ToastContext.Provider>
  );
});
export const useApi = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
