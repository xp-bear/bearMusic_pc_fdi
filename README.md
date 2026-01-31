

# 熊仔音乐项目

> 一个前后端分离的音乐应用项目，包含用户管理、搜索、朋友圈等功能。
>
> ![image-20260131232047100](https://xp-cdn-oss.oss-cn-wuhan-lr.aliyuncs.com/typora/image-20260131232047100.png)

## 📋 项目结构

```
├── end/              # 后端项目 (Express API 服务)
├── front/            # 前端项目 (Vue.js 应用)
└── wangyi_api/       # 网易音乐 API 代理
```

---

## 🚀 快速开始

### 1. 后端服务启动

**位置**: `end/` 目录

```bash
cd end
pnpm install
pnpm dev
```

**默认端口**: `5001`

- 访问地址: `http://127.0.0.1:5001`

**修改端口方法**:
编辑 `end/app.js` 第 11 行:

```javascript
const PORT = 5001; // 改成你需要的端口号，如 3000
```

### 2. 前端应用启动

**位置**: `front/` 目录

```bash
cd front
pnpm install
pnpm dev
```

**默认端口**: `5000`

- 访问地址: `http://127.0.0.1:5000`

**修改端口方法**:
编辑 `main.js`连接后端服务

```js
if (process.env.NODE_ENV === "production") {
  // 生产环境的逻辑
  //根url路径
  axios.defaults.baseURL = "http://127.0.0.1:5001";
} else {
  // 开发环境的逻辑
  //根url路径  music-api
  axios.defaults.baseURL = "http://127.0.0.1:5001";
}
```

编辑 `config/index.js`连接网易云api服务

```js
let MUSIC_API = "http://127.0.0.1:5002/"; //网易云音乐接口
```

### 3. 网易音乐 API 

**位置**: `wangyi_api/` 目录

```bash
cd wangyi_api
pnpm install
pnpm dev
```
**修改端口方法**:

编辑`server.js`第293行修改端口号

```js
const port = Number(options.port || process.env.PORT || '5002')
```

---

## 🗄️ 数据库配置

### MySQL 数据库

**自动初始化**:
项目启动时会自动创建数据库和表（如果不存在）。

**数据库配置** (`end/config/db.js`):

```javascript
const pool = mysql.createPool({
  host: "localhost", // MySQL 服务器地址
  user: "root", // 数据库用户名
  password: "root", // 数据库密码
  database: "bear_music", // 数据库名称
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
});
```

**修改数据库连接**:

1. 编辑 `end/config/db.js` 修改连接参数
2. 编辑 `end/config/initDB.js` 中的 `dbConfig` 对象修改初始化配置

### 数据库初始化

初始化脚本自动执行以下操作：

- 创建 `bear_music` 数据库
- 创建 5 个数据表:
  - `users` - 用户表
  - `friends` - 好友表
  - `groups` - 分组表
  - `group_users` - 分组用户表
  - `messages` - 消息表

---

## ⚙️ 常见修改

### 修改后端端口

**文件**: `end/app.js`

```javascript
const PORT = 5001; // 改成需要的端口
```

### 修改前端端口

**文件**: `front/package.json`

```json
"dev": "SET NODE_OPTIONS=--openssl-legacy-provider && vue-cli-service serve --port 5000"
```

### 修改后端 API 地址

#### 方式1: 在后端配置

**文件**: `end/config/index.js`

```javascript
BASEURL = "http://new-ip:new-port/";
```

#### 方式2: 在前端配置

**文件**: `front/src/main.js`

```javascript
axios.defaults.baseURL = "http://new-ip:new-port";
```

### 修改数据库连接

**文件**: `end/config/db.js`

```javascript
const pool = mysql.createPool({
  host: "your-host", // 改成你的数据库主机
  user: "your-user", // 改成你的用户名
  password: "your-password", // 改成你的密码
  database: "bear_music",
  // ...
});
```

---

**最后更新**: 2026年1月31日
