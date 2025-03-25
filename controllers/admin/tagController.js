const query = require("../../db/index");
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

// 需要获取的数据
const tags = [
  "id",
  "name",
  "quantity",
  'DATE_FORMAT(create_time, "%Y-%m-%d %H:%i:%s") AS create_time',
];
// 需要修改的数据
const tagsUpdate = ["name"];
// 查询所有标签
const selectTagAll = `select ${tags} from b_tags`;
// 根据id删除标签
const removeTagsql = `DELETE FROM b_tags WHERE id IN (?);`;
// 修改标签
const updateTagsql = `UPDATE b_tags SET ${tagsUpdate} = ? WHERE id = ?;`;

// 获取标签列表
const getTagList = async (req, res) => {
  try {
    const tagList = await query(selectTagAll);
    res.status(200).json({
      success: true,
      message: tagList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// 添加标签
const addTag = async (req, res) => {
  try {
    const { name } = req.body;
    const create_time = formattedTime();
    const addTagsql = `INSERT INTO b_tags (name,create_time) values (?,?);`;
    await query(addTagsql, [name, create_time]);
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
// 删除标签
const removeTags = async (req, res) => {
  try {
    const { id } = req.query;
    await query(removeTagsql, id);
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

// 编辑标签
const editTag = async (req, res) => {
  try {
    const { id, name } = req.body;
    await query(updateTagsql, [name, id]);
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

// 检索标签列表
const filterTag = async (req, res) => {
  try {
    const data = req.query;
    const filterSql = `SELECT ${tags} FROM b_tags WHERE name LIKE '%${data.name}%'`;
    const result = await query(filterSql);
    res.status(200).json({
      success: true,
      message: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getTagList, addTag, removeTags, editTag, filterTag };
