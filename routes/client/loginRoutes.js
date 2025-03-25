// articlesRoutes
const express = require("express");
const router = express.Router();

// 导入逻辑处理
const LoginController = require("../../controllers/client/LoginController");

// 登录
router.post("/login", LoginController.Login);
// 注册
router.post("/register", LoginController.register);

module.exports = router;
