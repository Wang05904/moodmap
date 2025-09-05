// utils/sentimentAI.js
const axios = require('axios');


/**
 * 使用通义千问分析文本情绪，返回 1-5 级评分
 * @param {string} text - 用户输入的心情文本
 * @returns {number} - 情绪等级 1-5
 */


module.exports = { analyzeSentiment };