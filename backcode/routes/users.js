// routes/users.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 将数据库连接池作为参数传递给模块
module.exports = function(db) {
  // 登录接口
  router.post('/login', async function(req, res, next) {
    try {
      const { username, password } = req.body;
      console.log(req.body);
      // 从数据库查询用户
      const [rows] = await db.execute(
        'SELECT * FROM user WHERE username = ?',
        [username]
      );

      // 检查用户是否存在
      if (rows.length === 0) {
        return res.status(401).json({ message: '用户名不存在' });
      }

      const user = rows[0];
      console.log(user);
      if (password !== user.password) {
        return res.status(401).json({ message: '用户名或密码错误' });
      }
      
      res.json({ 
        message: '登录成功',
        user: {
          id: user.id,
          username: user.username
        }
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
};
