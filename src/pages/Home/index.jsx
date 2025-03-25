import React, { useEffect, useState } from "react";
import HomeCss from "./index.module.css";
import { Avatar, Upload, message } from "antd";
import { UserOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import VirtualList from "../list/index";
const name = "admin";
const desc = "Takeout后台管理系统";
export default function Home() {
  const [time, setTime] = React.useState(new Date().toLocaleTimeString());

  const generateRandomNumber = () => {
    const min = 100;
    const max = 1000;
    // 生成随机整数
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
  };
  const getRandomLetter = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomIndex = Math.floor(Math.random() * letters.length);
    const randomLetter = letters.charAt(randomIndex);
    return randomLetter;
  };
  const generateString = (length) => {
    const minLength = 100;
    const maxLength = 1000;

    // 确保长度在最小和最大范围内
    if (length < minLength) {
      length = minLength;
    } else if (length > maxLength) {
      length = maxLength;
    }

    // 生成字符串
    const string = getRandomLetter().repeat(length);

    return string;
  };
  const d = [];
  for (let i = 0; i < 100; i++) {
    const length = generateRandomNumber();
    d.push({
      data: generateString(length),
      index: i,
    });
  }
  // 虚拟不定高列表
  const containerHeight = 300; // 容器的高度
  const data = d;

  return (
    <>
      <div className={HomeCss.adminMsg}>
        <Avatar size={64} icon={<UserOutlined />} />
        <div className={HomeCss.desc}>
          <div className={HomeCss.descLeft}>
            <div className={HomeCss.welcome}>欢迎{name}</div>
            <span style={{ color: "#9ca3af" }}>
              欢迎来到{desc}，当前时间是{time}。
            </span>
          </div>
          <div className={HomeCss.descRight}>
            <div>
              <div>
                <UserOutlined />
                文章数
              </div>
              <div>97</div>
            </div>
            <div>
              <UserOutlined />
              文章数
              <div>97</div>
            </div>
            <div>
              <UserOutlined />
              文章数
              <div>97</div>
            </div>
            <div>
              <UserOutlined />
              文章数
              <div>97</div>
            </div>
          </div>
        </div>
      </div>
      <VirtualList items={data} containerHeight={containerHeight} />
    </>
  );
}
