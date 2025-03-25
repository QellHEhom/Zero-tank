// articlesRoutes
const express = require("express");
const router = express.Router();

// 导入逻辑处理
const userController = require("../../controllers/client/ClientController");

// 获取作者信息
router.get("/webConfig", userController.webConfig);

// 获取轮播图
router.get("/banner", userController.getBanner);

module.exports = router;
