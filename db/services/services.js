// 管理端对文章的操作
const conn = require("../index");
// 获取当前时间，返回 YYYY-MM-DD HH:mm:ss

// 获得文章列表

//

// module.exports = {
//   getArticleList,
// };

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
