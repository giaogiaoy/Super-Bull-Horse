import * as THREE from 'three'
import { Water } from 'three/examples/jsm/objects/Water'

export class CityWater {
  constructor(model, scene) {
    this.scene = scene
    this.model = model

    this.init()
  }
  init() {
    const modelGeo = this.model.geometry // 先保存原来水模型的几何图形对象
    // 新的水模型
    this.model = new Water(
      modelGeo,
      {
        textureWidth: 1024, // 水贴图的宽度（提高分辨率）
        textureHeight: 1024, // 水贴图的高度（提高分辨率）
        waterNormals: new THREE.TextureLoader().load('/textures/waternormals.jpg', (texture) => {
          // 纹理图片 UV 环绕到目标物体身上的重复方式
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping
          texture.repeat.set(4, 4) // 设置重复次数
        }),
        sunDirection: new THREE.Vector3(0, 1, 0), // 阳光方向
        sunColor: 0xffffff, // 阳光颜色
        waterColor: new THREE.Color("#4488ff"), // 水颜色调整为更鲜明的蓝色
        distortionScale: 3.5, // 水倒影分散度
        fog: false // 禁用雾效，提高清晰度
      }
    )
    this.model.rotation.x = -Math.PI / 2 // 默认模型是垂直于 x 轴，所以翻转
    this.scene.add(this.model) // 物体模型添加到场景中
  }
  // 给水波纹做动画
  onTick(t) {
    // t的值：渲染循环启动过了多少毫秒时间
    // time 全局参数是 Water 内置好的，我们只需要不断传入新的偏移单位数值即可实现水波纹动态效果
    if (this.model && this.model.material && this.model.material.uniforms) {
      this.model.material.uniforms['time'].value = t / 1200 // 降低速度使水面更平静
    }
  }
}
