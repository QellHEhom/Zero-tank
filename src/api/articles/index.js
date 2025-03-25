import request from "../../utils/request";

// 获取发布文章列表 ----- 查
export function getpublishList() {
  return request.get("/article/publishList");
}
// 发布文章 ------ 增 + 改
export function publishArticles(data) {
  return request.post("/article/publish", data);
}
// 删除文章 ( 参数：[] ) ---- 删
export function delArticles(id) {
  return request.delete("/article/delArticles", { id });
}

// 获取草稿箱列表
export function getDraftList() {
  return request.get("/article/draftList");
}
// 暂存草稿
export function draftArticles(data) {
  return request.post("/article/draft", data);
}
// 筛选文章
export function filterArticles(data) {
  return request.get("/article/filter", data);
}

// 获取文章信息
export function getArticles(id) {
  return request.get("/article", { id });
}

// 获取标签列表
export function getTagList() {
  return request.get("/tag/list");
}

// 添加标签
export function addTag(data) {
  return request.post("/tag/add", data);
}

// 删除标签
export function removeTag(id) {
  return request.delete("/tag/remove", { id });
}
// 修改标签
export function editTag(data) {
  return request.put("/tag/edit", data);
}
// 检索标签
export function filterTag(data) {
  return request.get("/tag/filter", data);
}

// 获取分类列表
export function getCategoryList() {
  return request.get("/category/list");
}

// 添加分类
export function addCategory(data) {
  return request.post("/category/add", data);
}

// 删除分类
export function removeCategory(id) {
  return request.delete("/category/remove", { id });
}

// 修改分类
export function editCategory(data) {
  return request.put("/category/edit", data);
}

// 检索分类
export function filterCategory(data) {
  return request.get("/category/filter", data);
}
