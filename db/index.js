const mysql = require("mysql");

const conn = mysql.createPool({
  host: "localhost", // 登入数据库的IP地址
  user: "root", // 登入数据库的账号
  password: "123456", // 数据库密码
  database: "b_blog_message", // 指定连接的数据库
  port: 3306, //mysql默认端口3306
  multipleStatements: true, //设置一次请求允许多条sql语句同时执行。默认false
});

conn.getConnection(function (err, connection) {
  if (err) {
    console.log("链接数据库失败");
  } else {
    console.log("链接数据库成功");
  }
});

const query = async (sql, params) => {
  return await new Promise((resolve, reject) => {
    conn.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

module.exports = query;
