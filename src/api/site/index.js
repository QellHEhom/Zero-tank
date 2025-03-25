import request from "../../utils/request";

// 查询author
export const selectAuthor = () => {
  return request.get("/sit/author");
};

// 修改author
export const editAuthor = (data) => {
  return request.put("/sit/author/edit", data);
};
// 查询author
export const selectTourist = () => {
  return request.get("/sit/tourist");
};

// 修改 游客头像
export const editTourist = (data) => {
  return request.put("/sit/tourist/edit", data);
};

// 查询banner;
export const getBannerList = () => {
  return request.get("/sit/banner");
};
// 添加banner
export const AddBanner = (data) => {
  return request.post("/sit/banner/add", data);
};
// 修改banner
export const editBanner = (data) => {
  return request.put("/sit/banner/edit", data);
};

//删除banner
export const removeBanner = (id) => {
  return request.delete("/sit/banner/remove", { id });
};
//查询全部文章
export const articlesAll = () => {
  return request.get("/sit/articles");
};
