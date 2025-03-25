const query = require("../../db/index");
const { server, Token, formattedTime } = require("../../store/index");
const bcrypt = require("bcryptjs");
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
// (async function createTestUser() {
//   const password = "123456"; // 假设原始密码
//   const saltRounds = 10;
//   const hashedPassword = await bcrypt.hash(password, saltRounds);
//   users.set("admin", hashedPassword);
// })();

// 用户类型  用户名 用户ID 昵称 用户密码 创建时间
const userData = [
  "role",
  "username",
  "user_id",
  "nickname",
  "password",
  "create_time",
];
// 登入
const Login = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    // const hashedPassword = await bcrypt.hash(password, saltRounds);
    // bcrypt.compare(password, storedHashedPassword);
    const result = await query(
      `SELECT * FROM b_user WHERE username = ? AND password = ?;`,
      [data.username, data.password]
    );
    console.log(result);

    if (!result.length) {
      return res.status(401).json({
        code: 401,
        message: "success",
        data: "用户名或密码错误",
      });
    }
    const token = Token({
      role: "ordinary",
      username: data.username,
      id: data.user_id,
    });
    // console.log(token);
    res.status(200).json({
      code: 200,
      message: "success",
      data: token,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "error",
      data: error.message,
    });
  }
};
// 注册
const register = async (req, res) => {
  try {
    const data = req.body;
    // 用户id
    data.user_id = `25` + Date.now();
    data.create_time = formattedTime();
    const Data = [
      "ordinary",
      data.username,
      data.user_id,
      data.nickname,
      data.password,
      data.create_time,
    ];
    const registerSql = `INSERT INTO b_user (${userData}) VALUES (${userData
      .map(() => "?")
      .join(",")});`;
    // await query(registerSql, Data);
    res.status(200).json({
      code: 200,
      message: "success",
      data: "注册成功",
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
  Login,
  register,
};
/**
 * 字典：
 *
 *  代号        含义
 *  1           获取作者展示信息
 *
 */
