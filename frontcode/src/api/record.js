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
    const sentiment_score = await analyzeMood(inputContent.value)

    // 2. 再发送记录（后端 /record/sendRcd 接收情绪分）
    const response = await service.post('/record/sendRcd', {
          username: data.username,
          content: data.content,
          latitude: data.latitude,
          longitude: data.longitude,
          sentiment_score: data.sentiment_score,
        })
      return response;
    } catch (error) {
      console.log(error)
    }
}
export const getRcdByUsername = async (username) => {
  try{
    const response = await service.get('/record/getRcdByUsername', username)
    return response;
  } catch (error) {
    console.log(error)
  }
}
  export default {
    // getScore,
    sendRcd,
    // deleteRcd,
    // getRcds,
    // addRcd,
    getRcdByUsername,
    // getAllRcd
  }