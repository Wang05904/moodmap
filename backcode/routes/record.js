// routes/users.js
const express = require('express');
const router = express.Router();

// 将数据库连接池作为参数传递给模块
module.exports = function(db) {
  // 增加记录接口
  router.post('/sendRcd', async function(req, res) {
    
  });
  // 删除记录接口
  router.post('/deleteRcd', function(req, res) {
    
  });
  //获取个人记录接口
  router.post('/getMyRcd', async function(req, res) {
    const { userId } = req.body;
    const records = await db.query('SELECT * FROM records WHERE userId =?', [userId]);
    
  });

  // 获取所有记录接口
  router.post('/getAllRcd', async function(req, res) {
    const records = await db.query('SELECT * FROM records');
    res.json(records);
  });
  return router;
};
