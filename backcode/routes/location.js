// routes/location.js
const express = require('express');
module.exports = function(db) {
  const router = express.Router();

// 上传/更新用户位置
// router.post('/', async (req, res) => {
//   const { user_id, lng, lat } = req.body;
//   if (!user_id || lng === undefined || lat === undefined) return res.status(400).json({ error: '参数缺失' });
//   try {
//     // 将 pool.execute 修改为 db.execute
//     await db.execute(
//       'REPLACE INTO user_location (user_id, lng, lat) VALUES (?, ?, ?)',
//       [user_id, lng, lat]
//     );
//     res.json({ success: true });
//   } catch (e) {
//     res.status(500).json({ error: e.message });
//   }
// });

// 获取所有用户位置
router.get('/', async (req, res) => {
  try {
    // 将 pool.execute 修改为 db.execute
    const [rows] = await db.execute('SELECT user_id, lng, lat FROM user_location');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

  return router;
};