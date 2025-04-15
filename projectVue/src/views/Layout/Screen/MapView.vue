<template>
  <div id="app">
    <div class="index-wrapper">
      <div class="header">
        <img class="logo" src="/image/park-logo.png" alt="" />
      </div>
      <div class="page-container" ref="container">
        <div class="model-container">
          <div id="loading" class="loading">
            <p id="processing" class="text">园区资源加载中<span id="processing-number"></span>…</p>
            <div id="loading-bar" class="loading-bar"></div>
          </div>
          <div id="canvas" class="canvas"></div>
          <!-- <div id="all-charts" class="all-charts">
            <div class="section-one">
              <img class="img-header" src="/image/city-gaikuang.png" alt="" />
              <div class="icons-container">
                <div class="item">
                  <div class="icons-item building-icon">
                    <span id="building-number" class="number"> 28 </span>
                  </div>
                  <span class="title">电量峰值</span>
                  <span class="unity">（度）</span>
                </div>
                <div class="item">
                  <div class="icons-item enterprise-icon">
                    <span id="enterprise-number" class="number"> 6 </span>
                  </div>
                  <span class="title"> 实时温度</span>
                  <span class="unity">（度）</span>
                </div>
                <div class="item">
                  <div class="icons-item car-icon">
                    <span id="car-number" class="number"> 1530 </span>
                  </div>
                  <span class="title">出租车运力</span>
                  <span class="unity">（个）</span>
                </div>
                <div class="item">
                  <div class="icons-item rod-icon">
                    <span id="rod-number" class="number"> 48 </span>
                  </div>
                  <span class="title">拥堵程度</span>
                  <span class="unity">（个）</span>
                </div>
              </div>
            </div>
            <div class="section-two">
              <img class="img-header" src="/image/city-shouru.png" alt="" />
              <div id="bar-chart" class="bar-chart"></div>
            </div>
            <div class="section-three">
              <img class="img-header" src="/image/city-chanye.png" alt="" />
              <div id="pie-chart" class="pie-chart"></div>
            </div>
          </div> -->

          <div id="right-btns" class="right-btns" style="pointer-events: all">
            <div>
              <img
                id="mode-topView"
                class="mode-topView"
                src="/image/city-niaokan.png"
                style="pointer-events: all"
                alt=""
              />
            </div>
            <div>
              <img
                id="mode-roaming"
                class="mode-roaming"
                src="/image/city-manyou.png"
                style="pointer-events: all"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
      <div id="tag-1" class="building-name" style="display: none">东方明珠</div>
      <div id="tag-2" class="building-info" style="display: none">
        <div>总平米数： 2000</div>
        <div>容纳人数： 10000</div>
        <div>可出租位： 50</div>
        <div>空余车位： 10</div>
      </div>

      <div id="tag-3" class="building-fire" style="display: none">
        <div>着火大楼： 东方明珠</div>
        <div>着火楼层： 18层</div>
        <div>疏散人数： 1800人</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, nextTick } from 'vue'
// 样式 - 使用绝对路径确保正确加载
import '@/views/Layout/Screen/styles/all.less'
// 2D 图表入口
import '@/views/Layout/Screen/charts'

// 导入Three.js相关模块
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'
import { loadManager } from '@/views/Layout/Screen/model/loadManager'
import { City } from '@/views/Layout/Screen/model/City'
import { Ship } from '@/views/Layout/Screen/model/Ship'
import { Sky } from '@/views/Layout/Screen/environment/Sky'
import { EffectManager } from '@/views/Layout/Screen/utils/EffectManager'
import { ClickHandler } from '@/views/Layout/Screen/utils/ClickHandler'
import { Fly } from '@/views/Layout/Screen/model/Fly'
import { EventBus } from '@/views/Layout/Screen/utils/EventBus'
import { DataManager } from '@/views/Layout/Screen/utils/DataManager'
import { modifySelectCityMaterial } from '@/views/Layout/Screen/shader/modifyCityMaterial'

// 导入菜单相关功能，并获取reinitMenuEvents函数
import { reinitMenuEvents } from '@/views/Layout/Screen/dom/menu'

let scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  control: OrbitControls,
  css2Renderer: CSS2DRenderer
let animationFrameId: number

// 初始化 3d 基本环境
function init() {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000)
  camera.position.set(-148, 55, -101)

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)

  // 创建2D渲染器
  css2Renderer = new CSS2DRenderer()
  css2Renderer.setSize(window.innerWidth, window.innerHeight)
  css2Renderer.domElement.style.position = 'absolute'
  css2Renderer.domElement.style.top = '0px'
  css2Renderer.domElement.style.pointerEvents = 'none'

  // DOM 添加到页面
  const canvas = document.getElementById('canvas')
  if (canvas) {
    canvas.appendChild(renderer.domElement)
    canvas.appendChild(css2Renderer.domElement)
  }

  // 轨道控制器
  control = new OrbitControls(camera, renderer.domElement)
  control.update()
}

// 渲染循环
function renderLoop(t: number) {
  // 这里不再调用轨道控制器 update 方法，会影响摄像机 lookAt
  renderer.render(scene, camera)
  css2Renderer.render(scene, camera)

  // 开始做动效->遍历所有要做动效的实例物体内置的 onTick 方法
  EffectManager.getInstance().tickForEach(t)

  animationFrameId = requestAnimationFrame(renderLoop)
}

// 灯光
function createLight() {
  // 基础光-环境光
  const ambientLight = new THREE.AmbientLight('#fff', 3)
  scene.add(ambientLight)
}

// 适配
function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  css2Renderer.setSize(window.innerWidth, window.innerHeight)
}

// 初始化Three.js场景
function initThreeJS() {
  init()
  createLight()

  // 光线投射注册
  ClickHandler.getInstance().init(camera)

  // 初始化天空背景
  new Sky(scene).setBack('/textures/sky/', [
    'px.jpg',
    'nx.jpg',
    'py.jpg',
    'ny.jpg',
    'pz.jpg',
    'nz.jpg',
  ])

  // 加载模型并确保错误处理
  try {
    loadManager(['/fbx/city.fbx', '/gltf/ship.glb'], (modelList) => {
      modelList.forEach(async (obj) => {
        if (obj.url === '/fbx/city.fbx') {
          try {
            const city = new City(obj.model, scene, camera, control)

            // 接收默认数据和更新数据
            const data = await DataManager.getInstance().getData()
            city.dataObj = data // 传入默认数据

            // 监听自定义饼状图事件，让模型高亮
            city.lastOriginMat = [] // 上一次高亮物体本来的材质
            EventBus.getInstance().on('pieClick', (buildName) => {
              // 如果有上一个物体，先把上一个物体的材质恢复一下
              let index = 0
              if (city.lastClick && city.lastOriginMat.length > 0) {
                city.lastClick.traverse((model) => {
                  model.material = city.lastOriginMat[index++]
                })
              }

              // 设置当前点击的物体的高亮材质
              const targetBuild = city.model.getObjectByName(buildName)
              if (targetBuild) {
                targetBuild.traverse((model) => {
                  if (model.type === 'Mesh') {
                    city.lastOriginMat.push(model.material) // 保留小物体中每个细节物体的材质对象
                    model.material = new THREE.MeshBasicMaterial({
                      color: 0x0000ff,
                    })
                    modifySelectCityMaterial(model) // 再给选中的小物体边线再设置上去
                  }
                })
                city.lastClick = targetBuild // 上一次点击的小物体对象
              }
            })

            // 监听自定义刷新数据事件，实现火灾标记切换
            EventBus.getInstance().on('refreshHomeCount', (data) => {
              // 使用可选链操作符和空值合并操作符
              const buildName = data?.fireBuilding?.name || '01-shanghaizhongxindasha'
              if (buildName) {
                city.initFire(buildName)
              }
            })
          } catch (error) {
            console.error('城市模型初始化失败:', error)
          }
        } else if (obj.url === '/gltf/ship.glb') {
          try {
            const ship = new Ship(obj.model, scene, camera, control)
            ship.model.position.set(150, 0, -80)
            ship.model.rotation.set(0, -Math.PI / 2, 0)
            ship.model.scale.set(100, 100, 100) // 游船物体很小要与大城市模型匹配需要放大

            // 让游船物体也做动效
            EffectManager.getInstance().addObj(ship)
            // 订阅改变摄像机跟随游船移动的事件
            EventBus.getInstance().on('mode-roaming', (isOpen) => {
              console.log('漫游模式状态:', isOpen)
              if (ship && ship.control) {
                ship.control.enabled = !isOpen // 关闭/开启轨道控制器
                ship.isMoveCamera = isOpen // 摄像机跟随移动
              }
            })
          } catch (error) {
            console.error('船只模型初始化失败:', error)
          }
        }
      })

      // 生成飞行器对象
      try {
        const meshObj = new THREE.Mesh(
          new THREE.BoxGeometry(5, 5, 5),
          new THREE.MeshBasicMaterial({ color: 'lightblue' }),
        )
        meshObj.visible = false

        const fly = new Fly(meshObj, scene, camera, control)
        // 注册动效
        EffectManager.getInstance().addObj(fly)
        // 注册事件-控制摄像机是否移动鸟瞰
        EventBus.getInstance().on('mode-topView', (isOpen) => {
          console.log('鸟瞰模式状态:', isOpen)
          if (fly && fly.control) {
            fly.control.enabled = !isOpen // 鸟瞰时轨道控制器禁止交互
            fly.isCameraMove = isOpen // 控制摄像机是否跟随飞行器切换坐标点位置
          }
        })
      } catch (error) {
        console.error('飞行器初始化失败:', error)
      }

      // 注册轮询的事件，负责间隔 15 秒更新城市概况的数据
      DataManager.getInstance().refreshData()
    })
  } catch (error) {
    console.error('加载模型失败:', error)
  }

  renderLoop(0)
}

onMounted(() => {
  // 在组件挂载后初始化Three.js场景
  initThreeJS()

  // 添加窗口大小变化事件监听
  window.addEventListener('resize', handleResize)

  // 确保DOM元素完全加载后再初始化菜单
  nextTick(() => {
    // 手动初始化菜单事件
    setTimeout(() => {
      reinitMenuEvents()
      // 确保鸟瞰和漫游按钮能正常点击
      const modeTopView = document.getElementById('mode-topView')
      const modeRoaming = document.getElementById('mode-roaming')

      if (modeTopView) {
        console.log('找到鸟瞰按钮')
        modeTopView.style.pointerEvents = 'all'
        modeTopView.style.cursor = 'pointer'
      } else {
        console.error('未找到鸟瞰按钮')
      }

      if (modeRoaming) {
        console.log('找到漫游按钮')
        modeRoaming.style.pointerEvents = 'all'
        modeRoaming.style.cursor = 'pointer'
      } else {
        console.error('未找到漫游按钮')
      }
    }, 1000)
  })
})

onUnmounted(() => {
  // 在组件卸载前清理资源
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }

  // 移除窗口大小变化事件监听
  window.removeEventListener('resize', handleResize)

  // 清理Three.js资源
  if (renderer) {
    renderer.dispose()
  }

  if (scene) {
    // 清理场景中的对象
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        if (object.geometry) {
          object.geometry.dispose()
        }

        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose())
          } else {
            object.material.dispose()
          }
        }
      }
    })
  }
})
</script>

<style></style>
