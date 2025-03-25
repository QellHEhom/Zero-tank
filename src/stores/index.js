import { defineStore } from 'pinia'
import { getWebConfig } from '@/api/article'
import { ref } from 'vue'

export const useWebDataStore = defineStore('store', () => {
  const webConfig = ref([])
  const token = ref('')
  // 异步获取公告数据，并进行缓存（首次请求后存入 state）
  async function getWebConfigData() {
    // 如果已有数据，则直接返回，避免重复请求
    if (webConfig.value.length) {
      return webConfig.value
    }
    try {
      // 根据实际接口地址修改下面 URL
      webConfig.value = (await getWebConfig()).data
    } catch (error) {
      console.error('获取公告数据失败:', error)
    }
  }

  async function exitMain() {
    await getWebConfigData()
  }
  exitMain()

  return { webConfig, token }
})
