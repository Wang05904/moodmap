import { defineStore } from 'pinia'
import { getRcdByUserId,deleteRcdById } from '@/api/record' // 假设接口在这个路径

export const useRcdStore = defineStore('rcd', {
  state: () => ({
    myRcd: [],
    // 加载状态
    loading: false,
    // 错误信息
    error: null
  }),

  getters: {
    // 获取列表长度
    rcdCount: (state) => state.myRcd.length,
    // 检查列表是否为空
    isEmpty: (state) => state.myRcd.length === 0
  },

  actions: {

    async initRcdList() {
      // 获取用户名
      const userId = sessionStorage.getItem('userId')
      
      // 设置加载状态
      this.loading = true
      this.error = null
      
      try {
        // 调用接口获取数据
        const response = await getRcdByUserId(userId)
        if (response) {
          this.myRcd = response.data
        } else {
          this.error = '获取数据失败: '
        }
      } catch (err) {
        this.error = '请求出错: ' + err.message
        console.error('获取记录失败:', err)
      } finally {
        // 无论成功失败，都结束加载状态
        this.loading = false
      }
    },

    async removeRcdItem(id) {
      const response = await deleteRcdById(id)
      const initialLength = this.myRcd.length
      this.myRcd = this.myRcd.filter(item => item.id !== id)
      return this.myRcd.length !== initialLength
    },
  }
})
    