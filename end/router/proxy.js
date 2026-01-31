const express = require("express");
const axios = require("axios");
const router = express.Router();

// 代理咪咕搜索接口
router.get("/migu-search", async (req, res) => {
  const { text, pageNo = 1, pageSize = 30 } = req.query;
  try {
    const result = await axios.get(`https://app.u.nf.migu.cn/pc/resource/song/item/search/v1.0`, { params: { text, pageNo, pageSize } });
    res.json(result.data);
  } catch (error) {
    res.status(500).json({ error: "代理请求失败", detail: error.message });
  }
});

module.exports = router;
