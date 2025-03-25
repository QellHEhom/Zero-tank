// articlesRoutes
const express = require("express");
const router = express.Router();

// 导入逻辑处理
const ArticlesController = require("../../controllers/client/ArticlesController");
const ClientController = require("../../controllers/client/ClientController");

// 获取发布文章列表
router.get("/article/list", ArticlesController.getPublishList);

// 获取发布文章列表
router.get("/article/post", ArticlesController.getArticles);

// 文章分类
router.get("/article/getcategory", ArticlesController.getCategory);

// 标签
router.get("/article/taglist", ArticlesController.getTags);
// 标签
router.get("/article/getRecommends", ArticlesController.getRecommends);

// search
router.get("/search", ArticlesController.getSearch);

// 获取轮播图
router.get("/banner", ClientController.getBanner);

// 获取作者信息
router.get("/webConfig", ClientController.webConfig);

module.exports = router;
