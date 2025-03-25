const query = require("../../db/index");
const { server } = require("../../store/index");

const AuthorData = ["avatar", "nickname", "intro"];
// 查询作者信息
const AuthorSql = `SELECT ${AuthorData}  FROM b_user WHERE role_id = 1 AND role = 'admin';`;

// 修改作者信息
const editAuthorSql = `UPDATE b_user SET ${AuthorData.map(
  (item) => item + " = ?"
).join(",")}  WHERE role_id = 1 AND role = 'admin';`;

//
const BannerData = ["image", "relevance", "sort_order"];
// 查询banner
const BannerSql = `SELECT
  b_articles.title AS title, b_banner.*
FROM
  b_banner
  LEFT JOIN b_articles ON b_banner.relevance = b_articles.id;`;
// 查询全部文章
const selectArticlesAllSql = `SELECT id,title FROM b_articles WHERE is_carousel = 1 AND is_draft = 0;`;
// 添加banner
const addBannerSql = `INSERT INTO b_banner (${BannerData}) VALUES (${BannerData.map(
  () => "?"
).join(", ")})`;

const editBannerSql = `UPDATE b_banner SET ${BannerData.map(
  (item) => item + " = ?"
).join(", ")} WHERE id = ?;`;
// 查询作者信息
const selectAuthor = async (req, res) => {
  try {
    const Data = (await query(AuthorSql))[0];
    res.status(200).json({
      success: true,
      message: Data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 修改作者信息
const editAuthor = async (req, res) => {
  try {
    const { avatar, nickname, intro } = req.body;

    // 查询全部文章标签
    await query(editAuthorSql, [avatar, nickname, intro]);
    res.status(200).json({
      success: true,
      message: "修改成功",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

// 查询banner
const selectBanner = async (req, res) => {
  try {
    const Data = (await query(BannerSql)).map((item) => {
      return {
        ...item,
        picture: `${server}/banner/${item.image}/${item.image}.webp`,
      };
    });
    res.status(200).json({
      success: true,
      message: Data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 根据id删除轮播图
const removeBannersql = `DELETE FROM b_banner WHERE id IN (?);`;
// 查询轮播文章
const selectArticlesAll = async (req, res) => {
  try {
    const Data = await query(selectArticlesAllSql);
    res.status(200).json({
      success: true,
      message: Data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 添加banner
const addBanner = async (req, res) => {
  try {
    const data = req.body;
    await query(addBannerSql, Object.values(data));
    res.status(200).json({
      success: true,
      message: "添加成功",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// 修改banner
const editBanner = async (req, res) => {
  try {
    const { image, relevance, sort_order, id } = req.body;
    await query(editBannerSql, [image, relevance, sort_order, id]);
    res.status(200).json({
      success: true,
      message: "添加成功",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 删除banner
const removeBanner = async (req, res) => {
  try {
    const { id } = req.query;
    await query(removeBannersql, id);
    res.status(200).json({
      success: true,
      message: "删除成功",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 读取游客头像
const getTourist = async (req, res) => {
  try {
    const TouristSql = `SELECT avatar  FROM b_user WHERE  role = 'tourist';`;
    const Data = (await query(TouristSql))[0];
    res.status(200).json({
      success: true,
      message: Data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// 修改游客头像
const editTourist = async (req, res) => {
  try {
    const { avatar } = req.body;
    const touristSql = `UPDATE b_user SET avatar = ? WHERE role = 'tourist';`;
    const Data = (await query(touristSql, avatar))[0];
    res.status(200).json({
      success: true,
      message: Data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  selectAuthor,
  editAuthor,
  selectBanner,
  addBanner,
  selectArticlesAll,
  editBanner,
  removeBanner,
  getTourist,
  editTourist,
};
