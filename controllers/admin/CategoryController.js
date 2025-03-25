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

const query = require("../../db/index");
// 需要获取的数据
const Categorys = [
  "id",
  "name",
  "quantity",
  'DATE_FORMAT(create_time, "%Y-%m-%d %H:%i:%s") AS create_time',
];
// 需要修改的数据
const CategoryUpdate = ["name"];
// 查询所有分类
const selectCategoryAll = `select ${Categorys} from b_category`;
// 添加分类
const addCategorysql = `INSERT INTO b_category (name,create_time) values (?,?);`;
// 根据id查询分类
const selectCategoryId = `select ${Categorys} from b_category WHERE id = ?;`;
// 根据id删除分类
const removeCategorysql = `DELETE FROM b_category WHERE id IN (?);`;
// 修改分类
const updateCategorysql = `UPDATE b_category SET ${CategoryUpdate} = ? WHERE id = ?;`;

// 获取分类列表
const getCategoryList = async (req, res) => {
  try {
    const CategoryList = await query(selectCategoryAll);
    res.status(200).json({
      success: true,
      message: CategoryList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// 添加分类
const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const create_time = formattedTime();
    await query(addCategorysql, [name, create_time]);
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
// 删除分类
const removeCategory = async (req, res) => {
  try {
    const { id } = req.query;
    await Promise.all(
      id.map(async (id) => {
        const data = await query(selectCategoryId, id);
        const UPDATEArticlesCategory = `UPDATE b_articles SET  category = '暂无分类' WHERE category = (?);`;
        await query(UPDATEArticlesCategory, data[0].name);
      })
    );
    await query(removeCategorysql, id);
    res.status(200).json({
      success: true,
      message: "删除成功",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
    return;
  }
};

// 编辑分类
const editCategory = async (req, res) => {
  try {
    const { id, name } = req.body;
    await query(updateCategorysql, [name, id]);
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

// 检索分类列表
const filterCategory = async (req, res) => {
  try {
    const data = req.query;
    const filterSql = `SELECT ${Categorys} FROM b_category WHERE name LIKE '%${data.name}%'`;
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

module.exports = {
  getCategoryList,
  addCategory,
  removeCategory,
  editCategory,
  filterCategory,
};
