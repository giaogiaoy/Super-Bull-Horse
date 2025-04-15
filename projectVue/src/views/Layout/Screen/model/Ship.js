// 游船类
import * as THREE from 'three'
import { BaseModel } from './BaseModel'
import { EventBus } from '../utils/EventBus'

export class Ship extends BaseModel {
  init() {
    this.scene.add(this.model)
    this.pointIndex = 0 // 保存当前游船所在位置坐标的索引
    this.pointArr = [] // 保存游船移动的路径点

    try {
      this.generatorMovePath() // 生成游船移动的路径
      console.log('游船路径生成成功，共', this.pointArr.length, '个点')
    } catch (error) {
      console.error('游船路径生成失败:', error)
    }

    this.isMoveCamera = false // 开关属性（控制摄像机是否跟随游船移动）
    this.isMouseTouching = false // 鼠标是否按下
    this.prePos = 0 // 上一次鼠标x坐标

    this.onModelAttach() // 鼠标事件
  }

  // 生成游船行进的路线坐标点集合
  generatorMovePath() {
    // 设置平滑的三维样条曲线路线坐标点，CatmullRomCurve3
    // 设置关键的几个点坐标，其他的构造函数内会帮我们计算
    const shipPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(134.356097129589, 2.0112688541412354, -78.91746888546072),
      new THREE.Vector3(13.132075955743915, 2.0112688541412425, -69.85260460470285),
      new THREE.Vector3(13.132075955743915, 2.0112688541412425, -69.85260460470285),
      new THREE.Vector3(-80.28995611104816, 2.0112688541412282, -12.640254617216172),
      new THREE.Vector3(-71.5470123066941, 2.0112688541412354, 25.641138454485144),
      new THREE.Vector3(-71.5470123066941, 2.0112688541412354, 25.641138454485144),
      new THREE.Vector3(-17.5179164111899, 2.0112688541412354, 139.95062075065943),
      new THREE.Vector3(-67.10547001341894, 2.0112688541412354, 64.30494908329582),
      new THREE.Vector3(-87.03568940230136, 2.0112688541412354, 20.40776369519459),
      new THREE.Vector3(-88.0509634357777, 2.0112688541412425, -32.429601593890354),
      new THREE.Vector3(-70.27457116256328, 2.0112688541412425, -50.370253013515836),
      new THREE.Vector3(-39.206573479212764, 2.0112688541412425, -64.28841112963838),
      new THREE.Vector3(47.33347662423566, 2.0112688541412354, -73.13885409538068),
      new THREE.Vector3(134.356097129589, 2.0112688541412354, -78.91746888546072),
    ])
    // getSpacedPoints 等间距的坐标点
    this.pointArr = shipPath.getSpacedPoints(3500)

    // 显示路径线（辅助调试）
    const geometry = new THREE.BufferGeometry().setFromPoints(this.pointArr)
    const material = new THREE.LineBasicMaterial({
      color: 0x00ff00,
      opacity: 0.5,
      transparent: true,
    })
    const line = new THREE.Line(geometry, material)
    line.visible = false // 默认不显示
    this.pathLine = line
    this.scene.add(line)
  }

  // 游船行进方法-切换坐标点位置
  onTick() {
    if (!this.pointArr || this.pointArr.length === 0) {
      console.warn('游船路径点不存在')
      return
    }

    try {
      if (this.pointIndex < this.pointArr.length - 1) {
        const { x, y, z } = this.pointArr[this.pointIndex + 1]
        if (this.isMoveCamera) {
          // 移动摄像机
          if (!this.isMouseTouching) {
            // 鼠标没有被按下时，才设置摄像机的 lookAt
            // 如果处于漫游模式+鼠标被按下，证明自己要旋转摄像机，那就不能让摄像的 lookAt 执行影响旋转效果
            this.camera.lookAt(x, y + 20, z)
          }

          this.camera.position.set(x, y + 20, z)

          // 禁用轨道控制器
          if (this.control) {
            this.control.enabled = false
          }

          // 显示路径线
          if (this.pathLine) {
            this.pathLine.visible = true
          }
        } else {
          // 启用轨道控制器
          if (this.control) {
            this.control.enabled = true
          }

          // 隐藏路径线
          if (this.pathLine) {
            this.pathLine.visible = false
          }
        }

        // 游船移动：
        // 取出坐标设置给模型对象
        this.model.position.copy(this.pointArr[this.pointIndex])
        // 确保船头朝向下一个坐标点位置（前进船头效果）
        // 让物体朝着自己 z 轴正方向作为前面
        this.model.lookAt(this.pointArr[this.pointIndex + 1])
        this.pointIndex += 1
      } else {
        // 索引回到 0，重新继续做坐标的取值然后做动画效果
        this.pointIndex = 0
      }
    } catch (error) {
      console.error('游船动画更新错误:', error)
    }
  }

  // 鼠标按下
  mousedownFn = (e) => {
    console.log('游船漫游模式: 鼠标按下')
    this.isMouseTouching = true // 鼠标已经按下
    this.prePos = e.clientX // 记录当前位置
  }

  // 鼠标移动
  mousemoveFn = (e) => {
    if (this.isMouseTouching) {
      // 只有按下时进入此逻辑代码
      // 旋转核心思想：在原有的旋转角度基础上，新增移动的偏移量，乘以 0.01 让旋转弧度降低
      // rotateY() 在上一次旋转的角度上继续新增你传入的弧度数值
      // rotation.y = 直接赋予一个旋转的最终弧度数值
      const delta = (this.prePos - e.clientX) * 0.01
      if (this.camera) {
        this.camera.rotateY(delta)
      }
    }

    this.prePos = e.clientX
  }

  // 鼠标抬起
  mouseupFn = () => {
    console.log('游船漫游模式: 鼠标释放')
    this.isMouseTouching = false
    this.prePos = undefined // 清空上一次记录的坐标点位置
  }

  // 绑定/移除鼠标事件
  onModelAttach() {
    // 点击漫游模式 - 绑定/移除鼠标相关事件
    EventBus.getInstance().on('mode-roaming', (isOpen) => {
      console.log('游船接收到漫游模式状态:', isOpen)
      try {
        if (isOpen) {
          // 添加鼠标事件监听
          window.addEventListener('mousedown', this.mousedownFn)
          window.addEventListener('mousemove', this.mousemoveFn)
          window.addEventListener('mouseup', this.mouseupFn)
          console.log('游船漫游模式: 已添加鼠标事件监听')
        } else {
          // 移除鼠标事件监听
          window.removeEventListener('mousedown', this.mousedownFn)
          window.removeEventListener('mousemove', this.mousemoveFn)
          window.removeEventListener('mouseup', this.mouseupFn)
          console.log('游船漫游模式: 已移除鼠标事件监听')
        }
      } catch (error) {
        console.error('游船漫游模式事件处理错误:', error)
      }
    })
  }
}
