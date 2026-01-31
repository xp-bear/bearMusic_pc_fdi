// 第三方模块
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const ejs = require("ejs"); // 配置Express 视图引擎
const jwt = require("./dao/jwt");
const miguSearchRouter = require("./router/proxy");
const { initDatabase } = require("./config/initDB");

// 实例化
const app = express();
const PORT = 5001;
// 设置跨域请求
app.use(cors());

// 处理请求携带参数
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//静态资源托管
app.use(express.static("views"));
// 配置HTML引擎
app.engine("html", ejs.__express);
app.set("view engine", "html");

// token判断
// app.use((req, res, next) => {
//   if (req.body.tokens != "undefined") {
//     let tokens = req.body.tokens;
//     tokenResult = jwt.verifyToken(tokens); //0 表示token有问题  //1 表示正确
//     console.log("解码token", tokenResult);
//     if (tokenResult == 1) {
//       next();
//     } else {
//       res.send({ tokenResult, code: 300, msg: "token验证失败" });
//     }
//   } else {
//     next();
//   }
// });
// 配置咪咕搜索接口代理
app.use("/api", miguSearchRouter);

// 路由模块
require("./router/index")(app);
// 配置个人路由模块
require("./router/seo")(app);

//没有匹配到的项目==> 404页面
app.use((req, res, next) => {
  next(res.render("404/index.html"));

  // let err = new Error("页面不存在");
  // err.status = 404;
  // next(err);
});
// app.use("home", (req, res, next) => {
//   next(res.render("404/index.html"));
// });

// 错误处理中间件
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message);
});

// 初始化数据库并启动服务器
(async () => {
  try {
    // 在启动服务器前初始化数据库
    await initDatabase();

    app.listen(PORT, () => {
      console.log(`启动成功,端口 http://127.0.0.1:${PORT}`);
    });
  } catch (error) {
    console.error("服务器启动失败:", error);
    process.exit(1);
  }
})();
