import React, { useEffect, useState } from "react";
import Card from "../../Card";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router";
import ButCss from "./ButtonTable.module.css";
export default function ButtonTable({
  module,
  addData,
  removeControls,
  hasSelected,
  selectedRowKeys,
}) {
  const navigate = useNavigate();
  const onAdd = () => {
    switch (module) {
      case "articles":
        navigate("/articleList/addarticles");
        break;
      case "draft":
        navigate("/articleList/addarticles");
        break;
      default:
        addData();
        break;
    }
  };

  return (
    <Card className={ButCss.ButTable}>
      <Button
        style={{ margin: "0 10px", backgroundColor: "#67c23a" }}
        icon={<PlusOutlined />}
        size="small"
        type="primary"
        color="default"
        onClick={onAdd}
      >
        新增
      </Button>
      <Button
        style={{ margin: "0 10px" }}
        size="small"
        type="primary"
        danger
        icon={<DeleteOutlined />}
        onClick={() => removeControls(selectedRowKeys)}
      >
        删除
      </Button>
      {hasSelected ? `已选择 ${selectedRowKeys.length} 项` : null}
    </Card>
  );
}
