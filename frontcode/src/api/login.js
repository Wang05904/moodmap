import axios from 'axios'

// 创建axios实例
const service = axios.create({
  baseURL: 'http://localhost:3000/api', // 后端服务器地址
  timeout: 5000 // 请求超时时间
})

// 登录方法
export const login = async (username, password) => {
  try {
    const response = await service.post('/users/login', {
      username,
      password
    })
    
    return response.data
  } catch (error) {
    if (error.response) {
      // 服务器返回错误状态码
      throw new Error(error.response.data.message || '登录失败')
    } else if (error.request) {
      // 请求发出但没有收到响应
      throw new Error('服务器无响应')
    } else {
      // 请求配置出错
      throw new Error('请求配置错误')
    }
  }
}

// 退出登录方法
export const logout = async () => {
  sessionStorage.removeItem('isLogin')
  sessionStorage.removeItem('username')
}

// 获取登录状态
export const getLoginStatus = () => {
  return !!sessionStorage.getItem('isLogin')
}

export default {
  login,
  logout,
  getLoginStatus
}