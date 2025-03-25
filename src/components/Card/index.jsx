import React from "react";
import CardCss from "./index.module.css";

function Card(props) {
  // 此时 card 组件相当于一个公共的样式组件
  return (
    <div className={`${CardCss.Card} ${props.className}`}>{props.children}</div>
  );
}

export default Card;
