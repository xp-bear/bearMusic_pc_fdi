const mongoose = require("mongoose");
//连接数据库提醒
const db = require("../config/db");

// 用户表
const UserSchema = new mongoose.Schema({
  name: { type: String }, //用户名
  psw: { type: String }, //密码
  email: { type: String }, //邮箱
  sex: { type: String, default: "female" }, //性别
  birth: { type: Date }, //生日
  phone: { type: Number }, //电话
  explain: { type: String }, //介绍
  imgUrl: { type: String, default: "https://xp-cdn-oss.oss-cn-wuhan-lr.aliyuncs.com/common/default_avatar.png" }, //用户头像
  signature: { type: String, default: "该用户很懒,没有写签名!" }, //用户头像
  time: { type: Date }, //注册时间
});

// // 好友表
// const FriendSchema = new mongoose.Schema({
//   userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, //用户ID
//   friendID: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, //好友ID
//   state: { type: String }, //好友状态（0表示已为好友，1表示申请中，2表示申请发送方，对方还未同意）
//   markname: { type: String }, //好友昵称
//   time: { type: Date }, //注册时间
//   lastTime: { type: Date }, //最后通讯时间(后加入项)
// });

// // 一对一消息表
// const MessageSchema = new mongoose.Schema({
//   userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, //用户ID
//   friendID: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, //好友ID
//   message: { type: String }, //内容
//   types: { type: String }, //内容类型（0文字，1图片链接，2音频链接..）
//   state: { type: String }, //消息状态（0已读，1未读）
//   time: { type: Date }, //发送时间，
// });

// //群表
// const GroupSchema = new mongoose.Schema({
//   userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, //用户ID
//   name: { type: String }, //群名称
//   imgUrl: { type: String, default: "group.png" }, //群头像
//   notice: { type: String }, //群公告
//   time: { type: Date }, //创建时间
// });

// //群成员表
// const GroupUserSchema = new mongoose.Schema({
//   groupID: { type: mongoose.Schema.Types.ObjectId, ref: "Group" }, // 群ID
//   userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, //用户ID
//   name: { type: String }, //群名称
//   tip: { type: String }, //未读消息数
//   shield: { type: String }, // 是否屏蔽群消息（0不屏蔽，1屏蔽）
//   time: { type: Date }, //加入时间，
//   lastTime: { type: Date }, //最后通讯时间(后加入项)
// });

// //群消息表
// const GroupMsgSchema = new mongoose.Schema({
//   groupID: { type: mongoose.Schema.Types.ObjectId, ref: "Group" }, // 群ID
//   userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, //用户ID
//   message: { type: String }, //内容
//   types: { type: String }, //内容类型（0文字，1图片链接，2音频链接..）
//   time: { type: Date }, //发送时间，
// });

module.exports = {
  User: mongoose.model("User", UserSchema, "User"),
  // Friend: mongoose.model("Friend", FriendSchema, "Friend"),
  // Message: mongoose.model("Message", MessageSchema, "Message"),
  // Group: mongoose.model("Group", GroupSchema, "Group"),
  // GroupUser: mongoose.model("GroupUser", GroupUserSchema, "GroupUser"),
  // GroupMsg: mongoose.model("GroupMsg", GroupMsgSchema, "GroupMsg"),
};
