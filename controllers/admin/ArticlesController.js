// const userService = require("../services/userService");
// const conn = require("../db/index");
const query = require("../../db/index");
const { server } = require("../../store/index");
// 需要写入的数据
const keys = [
  "id",
  "avatar",
  "title",
  "summary",
  "category",
  "is_stick",
  "is_original",
  "is_carousel",
  "original_url",
  "contents",
  "is_draft",
  "create_time",
];

// 查询文章列表 包括标签
const articleListData = [
  // 需要查询的数据
  // 返回值：articleListData中的每一项的值
  "b_articles.id",
  "title",
  "avatar",
  "category",
  "is_draft",
  'DATE_FORMAT(b_articles.create_time, "%Y-%m-%d %H:%i:%s") AS create_time',
  "GROUP_CONCAT(b_tags.name) AS tag",
];
const articleListSql = `SELECT ${articleListData} FROM b_articles 
  LEFT JOIN 
    b_article_tag ON b_articles.id = b_article_tag.article_id
  LEFT JOIN 
    b_tags ON b_article_tag.tag_id = b_tags.id
  GROUP BY 
    b_articles.id;`;

// 根据文章ID查询文章详情 （参数：文章id） 返回值：articleIdData中的每一项的值
const articleIdData = [
  // 需要查询的数据
  // 返回值：articleListData中的每一项的值
  "id",
  "avatar",
  "title",
  "summary",
  "category",
  "is_stick",
  "is_original",
  "is_carousel",
  "original_url",
  "is_draft",
  "contents",
];
const articleIdSql = `SELECT ${articleIdData} FROM b_articles WHERE id = ?;`;

// 查询全部文章的全部标签  返回值：article_id + tag_id + name(标签名)
const tagArticleAllSql = `SELECT article_id, tag_id, b_tags.name FROM b_article_tag
INNER JOIN b_tags ON b_article_tag.tag_id = b_tags.id;`;

// 根据文章ID查询所属标签 （参数：article.id） 返回值：article_id + tag_id + 标签名
const tagSelectSql = `SELECT article_id, tag_id, b_tags.name FROM b_article_tag
  INNER JOIN b_tags ON b_article_tag.tag_id = b_tags.id
WHERE article_id = ?;`;

// 查询标签表全部数据 返回值：tag_id + name + quantity + create_time
const tagAllSql = `SELECT * FROM b_tags;`;
// 通过标签名查询标签表 （参数：tag_name） 返回值：tag_id + name + quantity + create_time
const tagSelectNameSql = `SELECT * FROM b_tags WHERE b_tags.name = ?;`;

// 删除标签关联  [article id, tag id]
const tagDeleteSql = `DELETE FROM b_article_tag WHERE article_id = ? AND tag_id = ?;`;
// 新增标签关联  [article id, tag id]
const tagMiddleSql = `INSERT INTO b_article_tag (article_id, tag_id) VALUES (?, ?);`;
// 减少标签关联数 ( tag id )
const tagNumAddSql = `UPDATE b_tags SET quantity = quantity - 1 WHERE id = ?;`;
// 增加标签关联数 (tag id)
const tagNumDeleteSql = `UPDATE b_tags SET quantity = quantity + 1 WHERE id = ?;`;

// 减少分类关联数
const categoryNumDeleteSql = `UPDATE b_category SET quantity = quantity - 1 WHERE name = ?;`;
// 增加分类关联数
const categoryNumAddSql = `UPDATE b_category SET quantity = quantity + 1 WHERE name = ?;`;
// 获取时间 格式：YYYY-MM-DD HH:mm:ss
const formattedTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = ("0" + (now.getMonth() + 1)).slice(-2);
  const day = ("0" + now.getDate()).slice(-2);
  const hours = ("0" + now.getHours()).slice(-2);
  const minutes = ("0" + now.getMinutes()).slice(-2);
  const seconds = ("0" + now.getSeconds()).slice(-2);
  const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedTime;
};
// 判断两个数组是否相同
const arraysAreEqual = (arr1, arr2) => {
  // 提取 arr1 中的 name 值，转为一个数组
  const namesInArr1 = arr1.map((item) => item.name);
  // 排序两个数组
  const sortedArr1 = namesInArr1.sort();
  const sortedArr2 = arr2.sort();
  // 如果两个数组相等，则返回 true
  if (JSON.stringify(sortedArr1) === JSON.stringify(sortedArr2)) {
    return false;
  }
  // 否则，返回未匹配到的元素
  let oldArr = [];
  let newArr = [];
  const mapArr2 = new Set(arr2);
  // 检查 arr1 中的每一项是否在 arr2 中
  sortedArr1.forEach((item) => {
    if (!mapArr2.has(item)) {
      oldArr.push(item);
      // unmatched.push({ oldData: item });
    }
  });
  // 检查 arr2 中的每一项是否在 arr1 中
  sortedArr2.forEach((item) => {
    if (!namesInArr1.includes(item)) {
      newArr.push(item);
      // unmatched.push({ newData: item });
    }
  });
  return { oldData: oldArr, newData: newArr };
};

// 将图片更改为一半大小缩略图
const addthumbnail = (item) =>
  `${server}/articles/${item.avatar}/${item.avatar}-thumbnail.webp`;
// 将图片更改为最小缩略图
const addminthumbnail = (item) =>
  `${server}/articles/${item.avatar}/${item.avatar}-minthumbnail.webp`;
// 添加文章数据
const AddArticles = async (articleData, res) => {
  try {
    // 添加文章 id
    articleData.id = `20` + Date.now();
    // 添加创建时间
    articleData.create_time = formattedTime();
    const values = keys.map((key) => articleData[key]);
    // 插入文章数据
    const articleAddSql = `INSERT INTO b_articles (${keys}) VALUES (${keys
      .map(() => "?")
      .join(", ")})`;
    await query(articleAddSql, values);
    // 增加分类关联数
    await query(categoryNumAddSql, articleData.category);
    // 遍历标签
    articleData.tag.forEach(async (tagName) => {
      // 通过标签名查询标签ID
      const TagId = await query(tagSelectNameSql, tagName);
      // 增加标签关联数
      await query(tagNumDeleteSql, TagId[0].id);
      // 新增标签关联
      await query(tagMiddleSql, [articleData.id, TagId[0].id]);
    });
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
// 修改文章数据
const editArticles = async (articleData, res) => {
  try {
    // 根据id查询文章数据
    const oldData = await query(articleIdSql, articleData.id);
    await Promise.all(
      keys.map(async (key) => {
        // 根据需要修改的字段修改数据
        const columnUpdataSql = `UPDATE b_articles SET ${key} = ? WHERE id = ?;`;
        if (articleData[key] !== oldData[0][key]) {
          await query(columnUpdataSql, [articleData[key], articleData.id]);
        }
      })
    );
    // 查询分类是否变动
    if (articleData.category !== oldData[0].category) {
      // 减少分类关联数
      await query(categoryNumDeleteSql, oldData[0].category);
      // 增加分类关联数
      await query(categoryNumAddSql, articleData.category);
    }
    // 查询标签
    const results = await query(tagSelectSql, articleData.id);
    // 新旧标签进行对比，判断哪些标签需要更改
    const arr = arraysAreEqual(results, articleData.tag);
    if (arr) {
      // 标签id
      let tagId = "";
      // 获取标签列表
      const Tags = await query(tagAllSql, articleData.id);
      // 删除标签关联
      if (arr.oldData.length !== 0) {
        arr.oldData.forEach(async (tag) => {
          // 获取标签id
          Tags.forEach((item) => {
            if (tag === item.name) tagId = item.id;
          });

          // 删除标签关联
          await query(tagDeleteSql, [articleData.id, tagId]);
          // 减少标签关联数
          await query(tagNumAddSql, tagId);
        });
      }
      // 添加标签关联;
      if (arr.newData.length !== 0) {
        arr.newData.forEach(async (tag) => {
          Tags.forEach((item) => {
            if (tag === item.name) tagId = item.id;
          });
          // 添加标签关联
          await query(tagMiddleSql, [articleData.id, tagId]);
          // 增加标签关联数
          await query(tagNumDeleteSql, tagId);
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "修改成功",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// 获取文章详情
const getArticles = async (req, res) => {
  try {
    const id = req.query.id;
    const results = await query(articleIdSql, id);
    // 根据文章ID查询所属标签
    const arr = await query(tagSelectSql, id);
    // 添加标签
    results[0].tag = [];
    arr.forEach((item) => {
      results[0].tag.push(item.name);
    });
    results.map((item) => {
      item.avatar = addthumbnail(item);
    });
    res.status(200).json({
      success: true,
      message: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// 删除文章
const delArticles = async (req, res) => {
  try {
    const idArr = req.query.id;
    await Promise.all(
      idArr.map(async (id) => {
        // 查询文章信息
        const Data = await query(articleIdSql, id);
        if (Data[0].is_draft === 0) {
          // 将文章状态改为草稿
          const articleUpdateSql = `UPDATE b_articles SET is_draft = ? WHERE id = ?;`;
          await query(articleUpdateSql, [1, id]);
        } else {
          const category = Data[0].category;
          // 减少分类关联数
          await query(categoryNumDeleteSql, category);
          // 删除文章
          const articleDelSql = `DELETE FROM b_articles WHERE id = ?;`;
          await query(articleDelSql, id);
          //根据文章ID查询所属标签
          const tag = await query(tagSelectSql, id);
          if (tag.length) {
            await Promise.all(
              tag.map(async (item) => {
                // 减少标签关联数
                await query(tagNumAddSql, item.tag_id);
              })
            );
          }
        }
      })
    );
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
// 获取发布文章列表
const getPublishList = async (req, res) => {
  try {
    // 查询文章列表
    const Data = await query(articleListSql);
    const results = Data.filter((item) => !item.is_draft);
    results.map((item) => {
      item.tag = item.tag.split(",");
      item.avatar = addminthumbnail(item);
    });
    res.status(200).json({
      success: true,
      message: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// 发布文章
const publishArticles = async (req, res) => {
  // 获取文章数据
  const articleData = req.body;
  articleData.is_draft = 0;
  if (articleData.id) {
    editArticles(articleData, res);
  } else {
    AddArticles(articleData, res);
  }
};
// 获取草稿箱列表
const getDraftList = async (req, res) => {
  // 查询文章列表
  try {
    // 查询文章列表
    const Data = await query(articleListSql);
    const results = Data.filter((item) => item.is_draft);
    results.map((item) => {
      item.avatar = addminthumbnail(item);
      item.tag = item.tag.split(",");
    });
    res.status(200).json({
      success: true,
      message: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// // 暂存草稿
const draftArticles = async (req, res) => {
  // 获取文章数据
  const articleData = req.body;
  articleData.is_draft = 1;
  if (articleData.id) {
    editArticles(articleData, res);
  } else {
    AddArticles(articleData, res);
  }
};

const filterArticles = async (req, res) => {
  try {
    const message = req.query;
    const filterSql = `SELECT
    b_articles.id,
    title,
    avatar,
    category,
    is_original,
    is_carousel,
    is_stick,
    is_draft,
    DATE_FORMAT( b_articles.create_time, "%Y-%m-%d %H:%i:%s" ) AS create_time,
    GROUP_CONCAT( b_tags.NAME ) AS tag 
  FROM
    b_articles
    LEFT JOIN b_article_tag ON b_articles.id = b_article_tag.article_id
    LEFT JOIN b_tags ON b_article_tag.tag_id = b_tags.id 
  WHERE ${Object.keys(message)
    .filter((item) => item !== "tag")
    .map((item) => `${item} LIKE '%${message[item]}%'`)
    .join(" AND ")}
  GROUP BY b_articles.id
  ${message.tag ? `HAVING tag LIKE '%${message.tag}%'` : ""};`;
    const results = await query(filterSql);
    results.map((item) => {
      item.tag = item.tag.split(",");
      item.avatar = addminthumbnail(item);
    });
    res.status(200).json({
      success: true,
      message: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getArticles,
  delArticles,
  getPublishList,
  publishArticles,
  getDraftList,
  draftArticles,
  filterArticles,
};

// INSERT INTO `b_category` VALUES (13, '生活随笔', 0, 4, '2021-12-29 10:22:09', '2021-12-29 10:23:40', 'Ship');
// INSERT INTO b_articles (id, title, pinned, original, reprint, createtime, content, creater) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
// id	      title	    avatar	   summary	content	category	tag_id	quantity	is_recommend	commentnum	create_time	is_original	original_url	is_carousel	is_stick
// 文章ID	文章标题	文章封面地址	  文章简介	文章内容	分类ID	标签ID	  阅读量	       点赞数	      评论数	    发表时间	    是否原创	  转载地址	是否首页轮播	是否置顶
