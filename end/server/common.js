const dbserver = require("../dao/dbserver");

// 1.查询用户信息数据
exports.searchInfo = function (req, res) {
  let name = req.query.name;
  dbserver.searchInfo(name, res);
};

// 1.查询用户信息数据
exports.updateUser = function (req, res) {
  let data = req.body;
  dbserver.updateUser(data, res);
};

// 多通道音乐接口实现
exports.searchMusic = function (req, res) {
  // get 请求参数 name:晴天 歌曲名称
  let data = req.query;
  // console.log(data);
  dbserver.searchMusic(data, res);
};
