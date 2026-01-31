const { searchInfo, updateUser, searchMusic } = require("../server/common");
const { BASEURL } = require("../config/index");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
module.exports = function (app) {
  //查询用户表数据
  app.get("/seouserinfo", (req, res) => {
    searchInfo(req, res);
  });

  // 上传图片到服务器
  let filename = ""; //图片名称

  // 设置文件上传存储配置
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "views/uploads/"); // 设置上传文件存储目录
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      filename = file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname);
      cb(null, filename);
    },
  });
  const folderPath = path.join(__dirname, "views", "uploads");
  // console.log(folderPath);

  const upload = multer({ storage: storage });
  // 设置路由处理文件上传
  app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).send("No files were uploaded.");
    }

    res.send({
      code: 200,
      msg: "图片上传成功!",
      url: BASEURL + "uploads/" + filename,
    });
  });

  // 修改用户信息数据接口
  app.post("/updateuser", (req, res) => {
    updateUser(req, res);
  });

  // 多通道音乐接口实现
  app.get("/search", (req, res) => {
    searchMusic(req, res);
  });
};
