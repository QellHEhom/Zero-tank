const jsonwebtoken = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const secretKey = "(*-qellHomSbe-)";
function generateToken() {
  // 注意默认情况 Token 必须以 Bearer+空格 开头
  return (
    "Bearer " +
    // 调用 jsonwebtoken.sign() 生成 jwt字符串，三个参数分别是：用户信息对象，加密密钥，配置对象 expiresIn 60 * 60 * 24为一天有效期
    jsonwebtoken.sign({ Uid, userName }, secretKey, {
      expiresIn: 60 * 60 * 24,
    })
  );
}
