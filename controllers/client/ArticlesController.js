const query = require("../../db/index");
const { server } = require("../../store/index");
// 文章总数
const totalCountSql = `SELECT COUNT( DISTINCT b_articles.id ) AS totalCount 
FROM
  b_articles
WHERE
  b_articles.is_draft = 0 
GROUP BY
  b_articles.id;`;
const searchData = [
  "b_articles.id AS id",
  "title",
  "summary",
  "category",
  "quantity",
  'DATE_FORMAT( b_articles.create_time, "%Y-%m-%d %H:%i:%s" ) AS create_time',
];

// 获取文章列表
const articleListData = [
  // 需要查询的数据
  // 返回值：articleListData中的每一项的值
  "b_articles.id AS id",
  "title",
  "avatar",
  "summary",
  "category",
  "b_articles.quantity AS quantity",
  "is_recommend AS recommend",
  "commentnum",
  // "is_original AS original",
  // "is_stick AS stick",
  // "original_url AS original",
  'DATE_FORMAT( b_articles.create_time, "%Y-%m-%d %H:%i:%s" ) AS create_time',
  "GROUP_CONCAT( b_tags.NAME ) AS tag",
];
const articleListSql = `SELECT ${articleListData} FROM b_articles 
  LEFT JOIN 
    b_article_tag ON b_articles.id = b_article_tag.article_id
  LEFT JOIN 
    b_tags ON b_article_tag.tag_id = b_tags.id
  WHERE
    b_articles.is_draft = 0 
  GROUP BY 
    b_articles.id 
  LIMIT ? OFFSET ?;`;

// 将图片更改为高清图
const addoriginal = (item) =>
  `${server}/articles/${item.avatar}/${item.avatar}.webp`;
// 将图片更改为 最小图片
const addminthumbnail = (item) =>
  `${server}/articles/${item.avatar}/${item.avatar}-minthumbnail.webp`;

// 将图片更改为 图片
const addthumbnail = (item) =>
  `${server}/articles/${item.avatar}/${item.avatar}-thumbnail.webp`;

const pageSize = 10; // 每页显示 10 条数据
// 计算总共有多少条数据
const totalCount = async () => {
  const pagination = (await query(totalCountSql)).length;
  return pagination;
};

// 获取发布文章列表
const getPublishList = async (req, res) => {
  try {
    const page = req.query.page;
    // 计算 OFFSET
    const offset = (page - 1) * pageSize;
    // 查询文章列表
    const results = await query(articleListSql, [pageSize, offset]);
    const pagination = await totalCount();
    // 更改图片及标签显示
    results.map((item) => {
      item.tag = item.tag.split(",");
      item.avatar = addoriginal(item);
    });
    res.status(200).json({
      code: 200,
      message: "success",
      data: {
        data: results,
        pagination: pagination,
      },
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "error",
      data: error.message,
    });
  }
};

// 获取文章信息
const articleData = [
  // 需要查询的数据
  // 返回值：articleListData中的每一项的值
  "b_articles.id AS id",
  "title",
  "contents",
  "category",
  "b_articles.quantity AS quantity",
  "is_recommend AS recommend",
  "commentnum",
  "is_original AS original",
  "is_stick AS stick",
  "original_url AS original",
  'DATE_FORMAT( b_articles.create_time, "%Y-%m-%d %H:%i:%s" ) AS create_time',
  "GROUP_CONCAT( b_tags.NAME ) AS tag",
];
const getArticles = async (req, res) => {
  try {
    const id = req.query.id;
    const results = await query(
      `SELECT ${articleData} FROM b_articles 
      LEFT JOIN 
        b_article_tag ON b_articles.id = b_article_tag.article_id
      LEFT JOIN 
        b_tags ON b_article_tag.tag_id = b_tags.id
      WHERE
        b_articles.id = ?;`,
      id
    );
    results.map((item) => {
      item.tag = item.tag.split(",");
      item.avatar = addoriginal(item);
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

// 文章分类
const getCategory = async (req, res) => {
  try {
    const Category = await query(`SELECT id,name FROM b_category;`);
    await Promise.all(
      Category.map(async (item) => {
        const data = await query(
          `SELECT id,title,avatar FROM b_articles WHERE category = ?  AND is_draft = 0;`,
          item.name
        );
        data.map((item) => {
          item.avatar = addminthumbnail(item);
        });
        item.posts = data;
      })
    );
    res.status(200).json({
      code: 200,
      message: "success",
      data: Category,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "error",
      data: error.message,
    });
  }
};

// 标签列表
const getTags = async (req, res) => {
  try {
    // const { tag } = req.query;
    const tagsSql = `SELECT id,name,quantity FROM b_tags;`;
    const tagList = await query(tagsSql);
    res.status(200).json({
      code: 200,
      message: "success",
      data: tagList,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "error",
      data: error.message,
    });
  }
};

// 按标签分类
const getRecommends = async (req, res) => {
  try {
    const { id } = req.query;
    const data = await query(
      `SELECT article_id AS id,title,avatar  FROM b_article_tag
    INNER JOIN 
      b_articles ON b_articles.id = b_article_tag.article_id 
    WHERE tag_id = ? AND is_draft = 0;`,
      id
    );
    await Promise.all(
      data.map((item) => {
        item.avatar = addthumbnail(item);
      })
    );
    res.status(200).json({
      code: 200,
      message: "success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "error",
      data: error.message,
    });
  }
};

// 搜索
const getSearch = async (req, res) => {
  try {
    const data = req.query;
    let search = [];
    if (data.data)
      search = await query(
        `SELECT ${searchData} FROM b_articles 
        WHERE
          is_draft = 0 AND title LIKE '%${data.data}%' OR summary LIKE '%${data.data}%';`
      );

    res.status(200).json({
      code: 200,
      message: "success",
      data: search,
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
  getPublishList,
  getArticles,
  getCategory,
  getTags,
  getRecommends,
  getSearch,
};
