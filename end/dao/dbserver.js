const db = require("../config/db");
const bcrypt = require("./bcryptjs");
const token = require("../dao/jwt");
const axios = require("axios");

const USER_COLUMNS = {
  name: "name",
  email: "email",
  psw: "psw",
  sex: "sex",
  birth: "birth",
  phone: "phone",
  explain: "explain",
  imgUrl: "img_url",
  signature: "signature",
};

const USER_SELECT_FIELDS = "id, name, email, sex, birth, phone, `explain`, img_url AS imgUrl, signature, created_at AS time";

function getUserColumn(type) {
  return USER_COLUMNS[type];
}

// 新建用户
exports.buildUser = async function (name, email, pwd, res) {
  try {
    const exist = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (exist.length > 0) {
      res.send({ msg: "有此邮箱,注册失败", code: 404 });
      return;
    }
    const password = bcrypt.encryption(pwd);
    await db.query("INSERT INTO users (name, email, psw, sex, img_url, signature, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)", [
      name,
      email,
      password,
      "female",
      "https://xp-cdn-oss.oss-cn-wuhan-lr.aliyuncs.com/common/default_avatar.png",
      "该用户很懒,没有写签名!",
      new Date(),
    ]);
    res.send({ msg: "用户添加成功", code: 200 });
  } catch (err) {
    res.send({ msg: "服务器出大问题", code: 500, err: err });
  }
};

//匹配用户名(邮箱)是否已经被占用
exports.countUserValue = async function (data, type, res) {
  try {
    const column = getUserColumn(type);
    if (!column || (column !== "email" && column !== "name")) {
      res.send({ msg: "查询出问题", code: 500 });
      return;
    }
    const rows = await db.query(`SELECT COUNT(*) AS count FROM users WHERE ${column} = ?`, [data]);
    res.send({ msg: "查询结果", code: 200, result: rows[0]?.count || 0 });
  } catch (err) {
    res.send({ msg: "查询出问题", code: 500 });
  }
};

//用户验证token
exports.userMatch = async function (data, pwd, res) {
  try {
    const rows = await db.query("SELECT id, name, email, psw, img_url AS imgUrl FROM users WHERE name = ? OR email = ?", [data, data]);
    if (rows.length === 0) {
      res.send({ msg: "没有找到该用户", code: 400 });
      return;
    }
    for (const user of rows) {
      const pwdMatch = bcrypt.verification(pwd, user.psw);
      if (pwdMatch) {
        const tokens = token.generateToken(user.id);
        const back = {
          tokens,
          id: user.id,
          name: user.name,
          imgUrl: user.imgUrl,
        };
        res.send({ msg: "登录成功", back, code: 200 });
        return;
      }
    }
    res.send({ msg: "密码不正确", code: 400 });
  } catch (err) {
    res.send({ msg: "用户验证token出问题", code: 500 });
  }
};

//搜索用户
exports.searchUser = async function (data, res) {
  try {
    let rows;
    if (data == "all") {
      rows = await db.query("SELECT name, email, img_url AS imgUrl FROM users");
    } else if (data == "") {
      res.send({ msg: "搜索关键字为空", code: 404 });
      return;
    } else {
      const keyword = `%${data}%`;
      rows = await db.query("SELECT name, email, img_url AS imgUrl FROM users WHERE email LIKE ? OR name LIKE ?", [keyword, keyword]);
    }
    res.send({ msg: "搜索成功", code: 200, result: rows });
  } catch (err) {
    res.send({ msg: "搜索用户出问题", code: 500 });
  }
};

//判断是否为好友
exports.isFriend = async function (uid, fid, res) {
  try {
    const rows = await db.query("SELECT 1 FROM friends WHERE user_id = ? AND friend_id = ? AND state = 0 LIMIT 1", [uid, fid]);
    if (rows.length > 0) {
      res.send({ msg: "是好友", code: 200, tips: 1 });
    } else {
      res.send({ msg: "不是好友", code: 400 });
    }
  } catch (err) {
    res.send({ msg: "判断是否为好友-服务器出大问题", code: 500 });
  }
};

//搜索群
exports.searchGroup = async function (data, res) {
  try {
    let rows;
    if (data == "group") {
      rows = await db.query("SELECT name, img_url AS imgUrl FROM groups");
    } else if (data == "") {
      res.send({ msg: "搜索关键字为空", code: 404 });
      return;
    } else {
      const keyword = `%${data}%`;
      rows = await db.query("SELECT name, img_url AS imgUrl FROM groups WHERE name LIKE ?", [keyword]);
    }
    res.send({ msg: "搜索成功", code: 200, result: rows });
  } catch (err) {
    res.send({ msg: "搜索群-服务器出大问题", code: 500 });
  }
};

//判断是否在群内
exports.isInGroup = async function (uid, gid, res) {
  try {
    const rows = await db.query("SELECT 1 FROM group_users WHERE user_id = ? AND group_id = ? LIMIT 1", [uid, gid]);
    if (rows.length > 0) {
      res.send({ msg: "是在群内", code: 200 });
    } else {
      res.send({ msg: "不是在群内", code: 400 });
    }
  } catch (err) {
    res.send({ msg: "判断是否是否在群内-服务器出大问题", code: 500 });
  }
};

//根据id查询用户详情
exports.userDetial = async function (id, res) {
  try {
    const rows = await db.query(`SELECT ${USER_SELECT_FIELDS} FROM users WHERE id = ? LIMIT 1`, [id]);
    if (rows.length > 0) {
      res.send({ msg: "找到用户详情", result: rows[0], code: 200 });
    } else {
      res.send({ msg: "没有找到用户详情", code: 400 });
    }
  } catch (err) {
    res.send({ msg: "用户详情-服务器出大问题", code: 500 });
  }
};

// 用户修改(修改密码 , 修改邮箱)
exports.userUpdate = async function (data, res) {
  try {
    if (typeof data.pwd != "undefined") {
      const rows = await db.query("SELECT id, psw FROM users WHERE id = ? LIMIT 1", [data.id]);
      if (rows.length === 0) {
        res.send({ msg: "没有找到该用户", code: 400 });
        return;
      }
      const user = rows[0];
      const pwdMatch = bcrypt.verification(data.pwd, user.psw);
      if (!pwdMatch) {
        res.send({ msg: "密码不正确", code: 400 });
        return;
      }

      if (data.type == "psw") {
        const password = bcrypt.encryption(data.data);
        const ret = await db.query("UPDATE users SET psw = ? WHERE id = ?", [password, data.id]);
        res.send({ msg: "修改成功", ret, code: 200 });
        return;
      }

      if (data.type == "email") {
        const exist = await db.query("SELECT id FROM users WHERE email = ?", [data.data]);
        if (exist.length > 0) {
          res.send({ msg: "修改失败,该邮箱已经被注册", code: 400 });
          return;
        }
        const ret = await db.query("UPDATE users SET email = ? WHERE id = ?", [data.data, data.id]);
        res.send({ msg: "修改成功", ret, code: 200 });
        return;
      }

      if (data.type == "name") {
        const exist = await db.query("SELECT id FROM users WHERE name = ?", [data.data]);
        if (exist.length > 0) {
          res.send({ msg: "修改失败,该名字已经被占用", code: 400 });
          return;
        }
        const ret = await db.query("UPDATE users SET name = ? WHERE id = ?", [data.data, data.id]);
        res.send({ msg: "修改成功", ret, code: 200 });
        return;
      }
    } else {
      const column = getUserColumn(data.type);
      if (!column) {
        res.send({ msg: "修改出错", code: 500 });
        return;
      }
      const ret = await db.query(`UPDATE users SET ${column} = ? WHERE id = ?`, [data.data, data.id]);
      res.send({ msg: "修改成功", ret, code: 200 });
    }
  } catch (err) {
    res.send({ msg: "用户修改出大问题", code: 500 });
  }
};

// 忘记密码,根据邮箱查询出用户id值,进行密码修改
exports.userPasswordUpdate = async function (data, res) {
  try {
    const rows = await db.query("SELECT id FROM users WHERE email = ? LIMIT 1", [data.email]);
    if (rows.length === 0) {
      res.send({ msg: "没有找到该用户", code: 400 });
      return;
    }
    const password = bcrypt.encryption(data.data);
    const ret = await db.query("UPDATE users SET psw = ? WHERE id = ?", [password, rows[0].id]);
    res.send({ msg: "修改成功", ret, code: 200 });
  } catch (err) {
    res.send({ msg: "用户修改出大问题", code: 500 });
  }
};

//获取好友昵称
exports.getMarkName = async function (data, res) {
  try {
    const rows = await db.query("SELECT markname FROM friends WHERE user_id = ? AND friend_id = ? LIMIT 1", [data.uid, data.fid]);
    res.send({ msg: "获取好友昵称成功", code: 200, result: rows[0] || null });
  } catch (err) {
    res.send({ msg: "获取好友昵称失败", code: 500 });
  }
};

//修改好友昵称
exports.friendMarkName = async function (data, res) {
  try {
    await db.query("UPDATE friends SET markname = ? WHERE user_id = ? AND friend_id = ?", [data.name, data.uid, data.fid]);
    res.send({ msg: "修改成功", code: 200 });
  } catch (err) {
    res.send({ msg: "修改出错", code: 500 });
  }
};

// 好友操作
// 添加好友表
exports.bulidFriend = async function (uid, fid, state, res) {
  try {
    await db.query("INSERT INTO friends (user_id, friend_id, state, time, last_time) VALUES (?, ?, ?, ?, ?)", [uid, fid, state, new Date(), new Date()]);
  } catch (err) {
    if (res) {
      res.send({ msg: "添加失败,出大问题", code: 500 });
    }
  }
};

//更新好友最后通讯时间
exports.upFriendLastTime = async function (uid, fid) {
  try {
    await db.query("UPDATE friends SET last_time = ? WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)", [new Date(), uid, fid, fid, uid]);
  } catch (err) {
    console.error("更新时间失败", err);
  }
};

// 添加一对一消息表
exports.insertMsg = async function (uid, fid, msg, types, res) {
  try {
    await db.query("INSERT INTO messages (user_id, friend_id, message, types, state, time) VALUES (?, ?, ?, ?, ?, ?)", [uid, fid, msg, types, 1, new Date()]);
    res.send({ msg: "一对一消息表添加成功", code: 200 });
  } catch (err) {
    res.send({ msg: "添加失败,服务器出大问题", code: 500 });
  }
};

// 好友申请
exports.applyFriend = async function (data, res) {
  try {
    const rows = await db.query("SELECT COUNT(*) AS count FROM friends WHERE user_id = ? AND friend_id = ?", [data.uid, data.fid]);
    if ((rows[0]?.count || 0) == 0) {
      await exports.bulidFriend(data.uid, data.fid, 2);
      await exports.bulidFriend(data.fid, data.uid, 1);
    } else {
      await exports.upFriendLastTime(data.uid, data.fid);
    }
    await exports.insertMsg(data.uid, data.fid, data.msg, 0, res);
  } catch (err) {
    res.send({ msg: "申请好友出大问题", code: 500 });
  }
};

// 拓展功能
//--------------------------------------
// 1.查询用户信息数据
exports.searchInfo = async function (name, res) {
  try {
    const rows = await db.query(`SELECT ${USER_SELECT_FIELDS} FROM users WHERE name = ?`, [name]);
    res.send({ msg: "搜索成功", code: 200, result: rows });
  } catch (err) {
    res.send({ msg: "搜索用户出问题", code: 500 });
  }
};

// 修改用户信息
exports.updateUser = async function (data, res) {
  try {
    const result = await db.query("UPDATE users SET name = ?, signature = ?, sex = ?, img_url = ? WHERE name = ?", [data.newName, data.sign, data.sex, data.imgUrl, data.name]);
    res.send({
      code: 200,
      msg: "修改成功!",
      result: result,
    });
  } catch (err) {
    res.send({ msg: "修改用户出问题", code: 500 });
  }
};

// 多通道音乐接口实现
exports.searchMusic = function (data, res) {
  let name = data.name; //搜索的歌曲名称

  const referer = "https://bailemi.com/"; // 设置引荐页面的 URL
  // 创建 Axios 请求配置对象
  const axiosConfig = {
    headers: {
      Referer: referer,
    },
  };

  // 使用 Axios 发起请求，并传入配置对象
  axios.get(`https://bailemi.com/dance/search?type=&key=${name}`, axiosConfig).then((result) => {
    // 根据result的结果提取歌曲id值
    const pattern = /<input type=checkbox  checked  name=\\\"checkd\\\" value=\\\"(.*?)\\\" checked=\\\"checked\\\" class=\\\"xuan\\\">/g; // 匹配所有数字
    const matches = JSON.stringify(result.data).match(pattern) || [];
    if (matches.length == 0) {
      res.send({
        code: 200,
        msg: "暂无数据",
      });
    }
    let musicArr = []; //所有音乐数据
    matches.forEach(async (item, index) => {
      let number = parseInt(item.match(/\d+/g)[0]); //单个音乐id , 再次发起请求，拿到对应的数据。
      await axios.get(`https://bailemi.com/dance/Playsong/data?id=${number}`, axiosConfig).then((mdata) => {
        musicArr.push(mdata.data[0]);
      });
      // 获取到所有的歌曲数据
      if (index == matches.length - 1) {
        res.send({
          code: 200,
          msg: "歌曲搜索成功!",
          result: musicArr,
        });
      }
    });
  });
};
