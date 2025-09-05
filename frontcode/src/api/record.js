import axios from 'axios'

// 创建axios实例
const service = axios.create({
    baseURL: 'http://localhost:3000/api', // 后端服务器地址
    timeout: 5000 // 请求超时时间
  })

const analyzeMood = async (content) => {
  try {
    const response = await service.post('/mood/analyze', {
      content: content
    })
    if (response.data.status === 'success') {
      return response.data.data.sentiment_score
    } else {
      console.warn('AI分析失败:', response.data.message)
      return 2 // 默认中性
    }
  } catch (error) {
    console.error('AI请求失败:', error)
    return 2 // 失败时返回中性分
  }
}
//发送记录
export const sendRcd = async (data) => {
  try {
    //  1. 先调用 AI 分析，获取情绪分
    const sentiment_score = await analyzeMood(data.content)
    console.log('情绪分:', sentiment_score)
    const moodData = {
      userId: data.userId,
      content: data.content,
      latitude: data.latitude,
      longitude: data.longitude,
      sentiment_score: sentiment_score,
    }
    // 2. 再发送记录（后端 /record/sendRcd 接收情绪分）
    const response = await service.post('/record/sendRcd', moodData)
      return moodData;
    } catch (error) {
      console.log(error)
    }
}
export const getRcdByUserId = async (userId) => {
  try{
    const response = await service.get('/record/getRcdByUserId', {
      params: {
        userId: userId // 会自动转换为查询参数 ?userId=1
      }
    })
    return response;
  } catch (error) {
    console.log(error)
  }
}
export const deleteRcdById = async (id) => {
  try {
    console.log('删除记录:', id);
    const response = await service.delete(`/record/deleteRcdById/${id}`);
    console.log('删除记录响应:', response);
    if (!response.data.success) {
      throw new Error('删除记录失败');
    }
    
    return response;
  } catch (error) {
    console.error('删除记录时发生错误:', error);
    throw error; // 抛出自定义错误处理
  }
};
  export default {
    // getScore,
    sendRcd,
    deleteRcdById,
    // getRcds,
    // addRcd,
    getRcdByUserId,
    // getAllRcd
  }