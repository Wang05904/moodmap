var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 登录接口
router.post('/login', async function(req, res) {
  return res.json({ message: '登录成功' });
  // const { username, password } = req.body;
  // // 从数据库查询用户
  // const [rows] = await db.execute(
  //   'SELECT * FROM users WHERE username = ?',
  //   [username]
  // );

  // // 检查用户是否存在
  // if (rows.length === 0) {
  //   return res.status(401).json({ message: '用户名或密码错误' });
  // }

  // const user = rows[0];

  // // 验证密码
  // const isPasswordValid = await bcrypt.compare(password, user.password);
  
  // if (!isPasswordValid) {
  //   return res.status(401).json({ message: '用户名或密码错误' });
  // }

  // // 登录成功
  // const token = jwt.sign(
  //   { 
  //     userId: user.id,
  //     username: user.username 
  //   },
  //   JWT_SECRET,
  //   { expiresIn: '24h' }  // token 有效期为24小时
  // );
  // res.json({ 
  //   message: '登录成功',
  //   token,
  //   user: {
  //     id: user.id,
  //     username: user.username
  //   }
  // });

} );

module.exports = router;
