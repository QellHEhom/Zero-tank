// articlesRoutes
const express = require("express");
// 导入逻辑处理
const ChatController = require("../../controllers/client/ChatController");

const router = express.Router();

// 获取文章列表  http://localhost:3000/articles/articlesList
router.post("/Ai", ChatController.postAIChat);

// 获取历史聊天
router.get("/records", ChatController.getRecords);

module.exports = router;
