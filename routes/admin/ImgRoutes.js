// articlesRoutes
const express = require("express");
const fs = require("fs");
const path = require("path");
// 导入逻辑处理
const ImgController = require("../../controllers/admin/imgController");
const router = express.Router();

// 上传照片
router.post(
  "/uplode",
  ImgController.multers.single("file"),
  ImgController.uplode
);

router.post(
  "/Banner",
  ImgController.multers.single("file"),
  ImgController.uplodeBanner
);
// router.post(
//   "/User",
//   ImgController.preHandle.user,
//   ImgController.multers.single("file"),
//   ImgController.uplodeUser
// );
router.post(
  "/User",
  ImgController.multers.single("file"),
  ImgController.uplodeUser
);

module.exports = router;
