let BASEURL = ""; //图片链接地址
if (process.env.NODE_ENV === "production") {
  BASEURL = "http://1.94.161.15:5001/";
} else {
  BASEURL = "http://127.0.0.1:5001/";
}

module.exports = { BASEURL };
