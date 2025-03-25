// articlesRoutes
const express = require("express");
const router = express.Router();
// 导入逻辑处理
const siteConfigController = require("../../controllers/admin/siteConfig");

// 修改
router.put("/sit/author/edit", siteConfigController.editAuthor);
// 查询author
router.get("/sit/author", siteConfigController.selectAuthor);
// 修改
router.put("/sit/tourist/edit", siteConfigController.editTourist);
// 查询author
router.get("/sit/tourist", siteConfigController.getTourist);

// 添加banner
router.post("/sit/banner/add", siteConfigController.addBanner);
// 修改banner
router.put("/sit/banner/edit", siteConfigController.editBanner);
// 删除banner;
router.delete("/sit/banner/remove", siteConfigController.removeBanner);
// 查询banner;
router.get("/sit/banner", siteConfigController.selectBanner);

// 查询全部文章
router.get("/sit/articles", siteConfigController.selectArticlesAll);

// 获取标签信息
module.exports = router;
