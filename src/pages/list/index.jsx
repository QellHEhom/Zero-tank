import React, { useState, useRef, useEffect, useLayoutEffect } from "react";

const VirtualList = ({ items, containerHeight }) => {
  const [visibleItems, setVisibleItems] = useState([]);
  const containerRef = useRef(null);

  // 整个数据渲染后的高度
  const [totalHeight, setTotalHeight] = useState(0);
  const ob = useRef([]);
  const totHeight = useRef([]);
  // 开始计算
  const calculateVisibleItems = () => {
    // 总高度
    let totalHeight = 0;
    // 获取高度
    let startIndex = 0;
    let endIndex = 0;
    const containerTop = containerRef.current && containerRef.current.scrollTop;
    if (totHeight.current.length) {
      totHeight.current.forEach((item, index) => {
        items[index].height = `${item}px`;
        if (index > 0) {
          items[index].top = `${totalHeight}px`;
        } else {
          items[index].top = `0px`;
        }
        totalHeight += item;
        if (totalHeight < containerTop) {
          startIndex = index + 1;
        }
        if (containerTop + containerHeight > totalHeight) {
          endIndex = index;
        }
      });
    }
    setVisibleItems(items.slice(startIndex, endIndex + 2));
  };
  useEffect(() => {
    setVisibleItems(items);
    const container = containerRef.current;
    container.addEventListener("scroll", () => {
      calculateVisibleItems();
    });
    setTimeout(() => {
      if (ob.current) {
        let totalHeight = 0;
        ob.current.forEach((item) => {
          totalHeight += item.scrollHeight;
          totHeight.current.push(item.scrollHeight);
        });
        setTotalHeight(totalHeight);
      }
      calculateVisibleItems();
    }, 0);
    return () => {
      container.removeEventListener("scroll", calculateVisibleItems());
    };
  }, [items, containerHeight]);

  return (
    <div
      ref={containerRef}
      style={{
        overflowY: "auto",
        height: containerHeight,
        position: "relative",
        width: "80%",
      }}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        {visibleItems.map((item) => (
          <div
            key={item.index}
            ref={(el) => (ob.current[item.index] = el)}
            index={item.index}
            style={{
              position: "absolute",
              width: "100%",
              top: item.top,
              height: item.height,
              overflowWrap: "break-word", // 使文本自动换行
              wordBreak: "break-word", // 强制长单词换行
              padding: "5px", // 添加内边距以避免文本与容器边缘粘在一起
            }}
          >
            {item.data}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualList;
