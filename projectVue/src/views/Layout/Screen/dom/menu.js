import { EventBus } from '../utils/EventBus'

// 右上角 2 个按钮
let modeArr = [
  {
    mode: 'mode-topView', // id 名字，也作为 EventBus 中自定义事件名字
    isOpen: false, // 当前按钮状态-true开始，false关闭中
  },
  {
    mode: 'mode-roaming',
    isOpen: false,
  },
]

// 初始化菜单事件监听
function initMenuEvents() {
  for (let i = 0; i < modeArr.length; i++) {
    let item = modeArr[i]
    // 获取右上角按钮绑定原生点击事件
    const element = document.getElementById(item.mode)
    if (element) {
      element.onclick = function () {
        item.isOpen = !item.isOpen // 控制打开状态等
        // 设置激活状态样式
        if (item.isOpen) {
          element.classList.add('active')
        } else {
          element.classList.remove('active')
        }
        // 触发这个名字在发布订阅对象里，下属数组里所有方法触发，并传递第二个参数过去
        EventBus.getInstance().emit(item.mode, item.isOpen)
        console.log(`${item.mode} 状态: ${item.isOpen}`)
      }
    } else {
      console.error(`按钮元素 ${item.mode} 未找到，无法绑定事件`)
    }
  }
}

// DOM内容加载完成时初始化
window.addEventListener('DOMContentLoaded', () => {
  // 等待一小段时间确保DOM已完全加载
  setTimeout(initMenuEvents, 500)
})

// 页面完全加载后再次尝试初始化（以防DOMContentLoaded事件已经触发）
window.addEventListener('load', () => {
  initMenuEvents()
})

// 导出初始化函数，允许从外部手动调用
export function reinitMenuEvents() {
  initMenuEvents()
}
