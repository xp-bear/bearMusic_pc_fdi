const dbserver = require("../dao/dbserver");
// 用户注册
exports.signUp = function (req, res) {
  let name = req.body.name;
  let email = req.body.email;
  let pwd = req.body.pwd;
  dbserver.buildUser(name, email, pwd, res);
};

// 判断邮箱是否占用
exports.judgeValue = function (req, res) {
  let data = req.body.data; //具体的邮箱
  let type = req.body.type; //email
  dbserver.countUserValue(data, type, res);
};
