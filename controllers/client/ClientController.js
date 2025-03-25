const query = require("../../db/index");
const path = require("path");
const fs = require("fs");
const { server } = require("../../store/index");

const data = ["nickname", "avatar", "intro"];
// 获取网页信息
const webConfig = async (req, res) => {
  try {
    const sql = `SELECT ${data} FROM b_user WHERE role = 'admin'`;
    const result = (await query(sql))[0];
    res.status(200).json({
      code: 200,
      message: "success",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "error",
      data: error.message,
    });
  }
};

// 获取轮播图列表
const getBanner = async (req, res) => {
  try {
    const results = await query(`SELECT * FROM b_banner `);
    const carousel = await query(
      `SELECT id,title FROM b_articles WHERE is_draft = 0 AND is_carousel = 1`
    );
    results.forEach((item) => {
      const obj = carousel.find((obj) => obj.id === item.relevance);
      if (obj) {
        item.title = obj.title;
      }
      const slicesDir = path.join(
        process.cwd(),
        `public/banner/${item.image}/slice`
      );
      item.slice = fs
        .readdirSync(slicesDir)
        .map((file) => `${server}/banner/${item.image}/slice/${file}`);
    });
    res.status(200).json({
      code: 200,
      message: "success",
      data: results,
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
  getBanner,
  webConfig,
};
/**
 * 字典：
 *
 *  代号        含义
 *  1           获取作者展示信息
 *
 */
