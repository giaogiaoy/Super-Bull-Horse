// 整个项目-动效管理类
// 思路：要做动效的实例对象加入到这里，后续会不断分别调度每个实例对象内置的 onTick 方法
export class EffectManager {
  constructor() {
    this.list = [] // 保存将来要做动效的实例对象
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new EffectManager()
    }

    return this.instance
  }
  // 添加要做动效的实例对象
  addObj(obj) {
    if (obj && typeof obj.onTick === 'function') {
      this.list.push(obj)
    } else {
      console.warn('添加的对象没有onTick方法，无法参与动效')
    }
  }
  tickForEach(t) {
    // t: 将来渲染循环传过来的毫秒级时间数值
    this.list.forEach(obj => {
      try {
        if (obj && typeof obj.onTick === 'function') {
          obj.onTick(t)
        }
      } catch (error) {
        console.error('动效执行错误:', error)
      }
    })
  }
  // 移除指定物体，不参与动效
  removeObj(obj) {
    const index = this.list.findIndex(target => target === obj)
    if (index !== -1) {
      this.list.splice(index, 1)
    }
  }
}
