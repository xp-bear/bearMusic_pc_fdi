// 导入连接数据库
const dbserver = require("../dao/dbserver");
//导入邮箱发送
const emailserver = require("../dao/emailserver");
// 用户注册
const { signUp, judgeValue } = require("../server/signup");
// 登录
const { singIn } = require("../server/signin");
// 搜索
const { searchUser, isFriend, searchGroup, isInGroup } = require("../server/search");
// 详情
const { friendMarkName, userUpdate, userPasswordUpdate, userDetial, getMarkName } = require("../server/userdetail");
// 好友
const { applyFriend } = require("../server/friend");

module.exports = function (app) {
  //首页
  app.get("/", (req, res) => {
    res.send({
      code: 200,
      msg: "熊仔音乐后台接口启动成功!",
    });
  });

  // 邮箱验证码
  app.post("/email", (req, res) => {
    let email = req.body.email;
    // res.send(email);
    emailserver.emailSignUp(email, res);
  });

  //判断邮箱是否被占用
  app.post("/signup/judge", (req, res) => {
    judgeValue(req, res);
  });

  // 注册
  app.post("/signup/add", (req, res) => {
    signUp(req, res);
  });

  // 登录
  app.post("/signin/match", (req, res) => {
    singIn(req, res);
  });

  //搜索用户
  app.post("/search/user", (req, res) => {
    searchUser(req, res);
  });

  //判断是否为好友
  app.post("/search/isfriend", (req, res) => {
    isFriend(req, res);
  });

  //搜索群
  app.post("/search/group", (req, res) => {
    searchGroup(req, res);
  });

  //判断是否为好友
  app.post("/search/isingroup", (req, res) => {
    isInGroup(req, res);
  });

  // 根据id找用户详情
  app.post("/user/detail", (req, res) => {
    userDetial(req, res);
  });

  // 用户信息修改
  app.post("/user/update", (req, res) => {
    userUpdate(req, res);
  });

  // 用户邮箱密码信息修改
  app.post("/user/passwordupdate", (req, res) => {
    userPasswordUpdate(req, res);
  });

  // 好友昵称获取
  app.post("/user/getmarkname", (req, res) => {
    getMarkName(req, res);
  });

  // 好友昵称修改
  app.post("/user/markname", (req, res) => {
    friendMarkName(req, res);
  });

  // 申请好友
  app.post("/friend/applyfriend", (req, res) => {
    applyFriend(req, res);
  });
};
