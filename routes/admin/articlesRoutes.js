// articlesRoutes
const express = require("express");
// 导入逻辑处理
const ArticlesController = require("../../controllers/admin/ArticlesController");
const TagController = require("../../controllers/admin/tagController");
const CategoryController = require("../../controllers/admin/CategoryController");

const router = express.Router();

// 获取发布文章列表
router.get("/article/publishList", ArticlesController.getPublishList);
// 发布文章
router.post("/article/publish", ArticlesController.publishArticles);
// 获取草稿箱列表
router.get("/article/draftList", ArticlesController.getDraftList);
// 暂存草稿
router.post("/article/draft", ArticlesController.draftArticles);
// 删除文章
router.delete("/article/delArticles", ArticlesController.delArticles);
// 筛选文章
router.get("/article/filter", ArticlesController.filterArticles);
// 获取文章详情
router.get("/article", ArticlesController.getArticles);

// 获取标签列表
router.get("/tag/list", TagController.getTagList);
// 添加标签
router.post("/tag/add", TagController.addTag);
// 删除标签
router.delete("/tag/remove", TagController.removeTags);
// 修改标签
router.put("/tag/edit", TagController.editTag);
// 检索标签
router.get("/tag/filter", TagController.filterTag);

// 获取分类列表
router.get("/category/list", CategoryController.getCategoryList);
// 添加分类
router.post("/category/add", CategoryController.addCategory);
// 删除分类
router.delete("/category/remove", CategoryController.removeCategory);
// 修改分类
router.put("/category/edit", CategoryController.editCategory);
// 检索分类
router.get("/category/filter", CategoryController.filterCategory);

// 获取标签信息
module.exports = router;
