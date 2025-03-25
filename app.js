const express = require("express");
// 导入路由
const adminArticlesRoutes = require("./routes/admin/articlesRoutes");
const adminSelectRoutes = require("./routes/admin/selectRoutes");
const adminImgRoutes = require("./routes/admin/ImgRoutes");

const clientRoutes = require("./routes/client/clientRoutes");
const Chat = require("./routes/client/Chat");
const path = require("path");

const { WebSocketServer } = require("./controllers/client/ChatController");

const app = express();

// 中间件
// 用 body-parser 库进行数据格式转换
// const bodyParser = require("body-parser");
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// 用 express 自带的库进行数据格式转换
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require("cors");
app.use(cors());

app.use(
  express.static(path.join(__dirname, "./public"), {
    setHeaders: (res) => {
      res.setHeader("Cache-Control", "public, max-age=86400");
    },
    // maxAge: "1d", // 强缓存时间
    etag: true, // 开启 ETag
    lastModified: true, // 开启 Last-Modified
  })
);
// admin 路由
app.use("/admin", require("./routes/admin/articlesRoutes"));
app.use("/admin", require("./routes/admin/selectRoutes"));
app.use("/admin", require("./routes/admin/ImgRoutes"));

// 客户端路由
app.use("/api", clientRoutes);
app.use("/api", require("./routes/client/loginRoutes"));

app.use("/api", Chat);

// 错误处理
// app.use((err, req, res, next) => {
//   res.status(500).json({ success: false, message: err.message });
// });

// http://127.0.0.1:3031/
const server = app.listen(3031, () => {
  console.log(" http://127.0.0.1/");
});
WebSocketServer(server);
// // 对话记录
// let records = [];
// // 存储所有连接的 WebSocket 实例
// let clients = [];
// const WebSocket = require("ws");
// const wss = new WebSocket.Server({ server, path: "/ws" });
// wss.on("connection", (ws) => {
//   clients.push(ws); // 将新的客户端连接加入到列表
//   console.log("新客户端连接，在线的人数为：", clients.length);

//   // 监听消息
//   ws.on("message", (message) => {
//     const messages = JSON.parse(message.toString("utf8"));
//     // 如果是心跳心跳消息，则回复一个 pong 消息
//     if (messages.type === "ping") {
//       ws.send(
//         JSON.stringify({
//           type: "pong",
//           data: "pong",
//         })
//       );
//     } else {
//       console.log("收到消息:", messages);
//       console.log("records:", records);

//       records.push(messages);
//       // 广播消息
//       clients.forEach((client) => {
//         if (client !== ws && client.readyState === WebSocket.OPEN) {
//           client.send(JSON.stringify(messages)); // 将消息广播到所有客户端
//         }
//       });
//     }
//   });

//   const message = {
//     userId: 0,
//     type: "message",
//     content: "成功进入聊天室",
//     name: "系统",
//     avatar: "https://localhost:3030/server/user/user_1738806936454.webp",
//   };
//   // 向客户端发送欢迎消息
//   ws.send(JSON.stringify(message));
//   records.push(message);

//   // 客户端断开连接时
//   ws.on("close", () => {
//     console.log("客户端已断开连接");
//     // 从数组中移除断开连接的客户端
//     clients = clients.filter((client) => client !== ws);
//   });

//   // 错误处理
//   ws.on("error", (err) => {
//     console.error("WebSocket 错误:", err);
//   });
// });
