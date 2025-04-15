// 城市类
import { BaseModel } from './BaseModel'
import * as THREE from 'three'
// 边缘边线类
import { EdgesLine } from '../effect/EdgesLine'
// 修改城市模型的着色器函数
import { modifyCityDefaultMaterial } from '../shader/modifyCityMaterial'
// 水面效果
import { CityWater } from '../effect/CityWater'
// 引入计算物体中心点和大小工具函数
import { getBoxCenter } from '../utils/getBoxCenter'
// 火灾标记
import { Fire } from '../effect/Fire'
// 火灾影响范围球体标记
import { FireBall } from '../effect/FireBall'
// 动效管理类
import { EffectManager } from '../utils/EffectManager'

export class City extends BaseModel {
  init() {
    this.scene.add(this.model)

    this.buildNameObj = {
      // 模型名字和建筑显示名字对应关系
      '01-shanghaizhongxindasha': '上海中心大厦',
      '02-huanqiujinrongzhongxin': '环球金融中心',
      '03-jinmaodasha': '金茂大厦',
      '04-dongfangmingzhu': '东方明珠',
    }

    // 添加建筑介绍数据
    this.dataObj = {
      buildingsIntroduce: {
        '01-shanghaizhongxindasha':
          '上海中心大厦是位于中国上海市浦东新区陆家嘴金融贸易区的一栋超高层大楼，高632米。',
        '02-huanqiujinrongzhongxin':
          '上海环球金融中心是一座位于上海浦东陆家嘴的摩天大楼，高492米。',
        '03-jinmaodasha': '金茂大厦是一座位于上海浦东陆家嘴的超高层大楼，高420.5米。',
        '04-dongfangmingzhu': '东方明珠广播电视塔是上海的标志性文化景观之一，高468米。',
      },
    }

    this.initEffect()
  }
  // 初始化城市效果
  initEffect() {
    // 中心城市建筑材质
    const centerMaterial = new THREE.MeshBasicMaterial({
      color: 0xa8cded,
      transparent: true,
    })
    // 外围城市建筑材质
    const periphery = new THREE.MeshBasicMaterial({
      color: 0xa8cded,
      transparent: true,
    })

    this.model.traverse((model) => {
      if (model.name === 'Text') {
        // 隐藏默认建筑名字
        model.visible = false
        return
      }

      // 排除地板和河水物体
      if (model.name !== 'Shanghai-09-Floor' && model.name !== 'Shanghai-08-River') {
        // 修改城市建筑模型材质
        if (
          model.name == 'Shanghai-02' ||
          model.name == 'Shanghai-03' ||
          model.name == 'Shanghai-04' ||
          model.name == 'Shanghai-05' ||
          model.name == 'Shanghai-06' ||
          model.name == 'Shanghai-07'
        ) {
          // 周围建筑
          model.material = periphery
          new EdgesLine(this.scene, model, new THREE.Color('#666666'))
          // 对物体追加混合的着色器代码（渐变色白膜效果）
          modifyCityDefaultMaterial(model, false)
        } else {
          // 中心建筑
          model.material = centerMaterial
          new EdgesLine(this.scene, model, new THREE.Color('#00ffff'))
          modifyCityDefaultMaterial(model, true)
        }
      }

      // 针对水物体单独处理
      if (model.name === 'Shanghai-08-River') {
        // 把原本水物体隐藏
        model.visible = false
        try {
          // 创建更加真实的水面效果物体
          const theWater = new CityWater(model, this.scene)
          // 把水波纹物体传入到动效管理类当中
          EffectManager.getInstance().addObj(theWater)

          // 为确保水面能正确渲染，手动触发一次动画更新
          theWater.onTick(0)
        } catch (error) {
          console.error('河流材质初始化失败:', error)
          // 如果无法创建水面效果，显示原始水面
          model.visible = true
        }
      }
    })
  }
  // 创建火灾标记
  // buildName 就是建模师模型中的小物体名字
  initFire(buildName) {
    const build = this.model.getObjectByName(buildName)
    const { center, size } = getBoxCenter(build)

    const fire = new Fire(this.scene, center, size)
    const ball = new FireBall(this.scene, center)

    // 注册动效管理
    EffectManager.getInstance().addObj(ball)

    // 过了 15 秒以后清除标记
    setTimeout(() => {
      fire.clear()
      ball.clear()

      // 移除动效
      EffectManager.getInstance().removeObj(ball)
    }, 15000)
  }
}
