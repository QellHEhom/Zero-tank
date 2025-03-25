const axios = require("axios");
// const userService = require("../services/userService");
const { APIPassword, url } = require("../../store/index");

// const records = {
//   id: 9001,
//   content: [{ role: "user", content: content }],
// };
const postAIChat = async (req, res) => {
  const contents = req.body.content; // tom
  let data = "";
  const messages = [{ role: "user", content: contents }];
  try {
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Transfer-Encoding", "chunked");
    // 发起流式请求
    const response = await axios({
      method: "post", // 可以根据接口要求改为 'get' 或 'post'
      url: url, // 替换为你的流式接口 URL
      responseType: "stream", // 设置响应类型为流
      headers: {
        Authorization: APIPassword, // 替换为真实的API密钥
        "Content-Type": "application/json",
      },
      data: {
        model: "4.0Ultra",
        messages: messages,
        stream: true, // 开启流式响应
      },
    });

    // 将流式数据传递给客户端
    response.data.pipe(res);

    response.data.on("data", (chunk) => {
      // const str = textDecoder.decode(chunk).split("data:")[1];
      // if (str === "[DONE]") {
      //   console.log("结束");
      // }
      // const data = JSON.parse(str).choices[0].delta.content;
      // console.log("data", data);
      // res.write(data);
      // data += chunk; // 累加每一块数据
    });

    // 监听流结束
    response.data.on("end", () => {
      // console.log("40", data);
      // console.log("流数据传输完毕");
      // console.log("42", messages);
    });

    // 错误处理
    response.data.on("error", (err) => {
      console.error("流数据传输错误:", err);
      res.status(500).send("数据传输错误");
    });
  } catch (error) {
    console.error("请求失败:", error);
    res.status(500).send("请求失败");
  }
};

// 对话记录
let records = [];
// 存储所有连接的 WebSocket 实例
let clients = [];

const WebSocketServer = (server) => {
  const WebSocket = require("ws");
  const wss = new WebSocket.Server({ server, path: "/ws" });
  wss.on("connection", (ws) => {
    clients.push(ws); // 将新的客户端连接加入到列表
    // 监听消息
    ws.on("message", (message) => {
      const messages = JSON.parse(message.toString("utf8"));
      // 如果是心跳心跳消息，则回复一个 pong 消息
      if (messages.type === "ping") {
        ws.send(
          JSON.stringify({
            type: "pong",
            data: "pong",
          })
        );
      } else {
        records.push(messages);
        // 广播消息
        clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(messages)); // 将消息广播到所有客户端
          }
        });
      }
    });
    // 客户端断开连接时
    ws.on("close", () => {
      console.log("客户端已断开连接");
      // 从数组中移除断开连接的客户端
      clients = clients.filter((client) => client !== ws);
    });
    // 错误处理
    ws.on("error", (err) => {
      console.error("WebSocket 错误:", err);
    });
  });
};

const getRecords = async (req, res) => {
  try {
    res.status(200).json({
      code: 200,
      message: "success",
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "error",
      data: error.message,
    });
  }
};

module.exports = {
  postAIChat,
  getRecords,
  WebSocketServer,
};
