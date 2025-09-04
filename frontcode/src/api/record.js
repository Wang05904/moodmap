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
      username,  // 注意：确保 username 在作用域内
      content: inputContent.value,
      location: location.value,
      sentiment_score  // 把 AI 分析结果传给后端
    })

    return response.data // 返回后端响应
  } catch (error) {
    console.log('发送记录失败:', error)
    throw error // 让调用者知道失败了
  }
}
  export default {
    sendRcd,
    deleteRcd,
    getRcds,
    addRcd,
    getRcdById,
    getAllRcd
  }