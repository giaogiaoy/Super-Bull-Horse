import { EventBus } from './EventBus'
// 移除不需要的 axios 导入
// import axios from "axios";

// 模拟数据
const mockData = {
  // 这里填入你需要的模拟数据结构
  cityList: [
    { id: 1, name: '01-shanghaizhongxindasha', value: 100 },
    { id: 2, name: '城市2', value: 200 },
    { id: 3, name: '城市3', value: 300 },
  ],
}

export class DataManager {
  static getInstance() {
    if (!this.instance) {
      this.instance = new DataManager()
    }
    return this.instance
  }

  // 获取数据
  getData() {
    return new Promise((resolve) => {
      // 直接返回模拟数据
      resolve(mockData)
    })
  }

  // 模拟轮询请求服务器
  refreshData() {
    // 15 秒刷新一次数据
    setInterval(async () => {
      let data = await this.getData()
      EventBus.getInstance().emit('refreshHomeCount', data)
    }, 15000)
  }
}
