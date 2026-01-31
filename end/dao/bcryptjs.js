// 密码加密方式 bcryptjs
const bcrypt = require("bcryptjs");

// 加密
exports.encryption = function (pwd) {
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(pwd, salt);
  //返回加密之后的hash值
  return hash;
};

//解密
exports.verification = function (pwd, hash) {
  let result = bcrypt.compareSync(pwd, hash); // 结果返回的是 true 或者 false
  return result;
};
