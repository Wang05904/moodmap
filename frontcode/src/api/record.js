import axios from 'axios'

// 创建axios实例
const service = axios.create({
    baseURL: 'http://localhost:3000/api', // 后端服务器地址
    timeout: 5000 // 请求超时时间
  })

  // 发送记录
export const sendRcd = async (data) => {
    try{
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