<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, onUpdated, watch, nextTick } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const props = defineProps({
  width: {
    type: Number,
    default: 200,
  },
  height: {
    type: Number,
    default: 200,
  },
})

const containerRef = ref<HTMLElement | null>(null)
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let building: THREE.Group
let animationFrameId: number

// 监听属性变化
watch(() => props.width, updateSize)
watch(() => props.height, updateSize)

// 创建简约风格的大楼模型
const createBuilding = () => {
  building = new THREE.Group()

  // 主体结构 - 简约风格的矩形主楼
  const mainGeometry = new THREE.BoxGeometry(10, 30, 10)
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xadd8e6,
    metalness: 0.2,
    roughness: 0.1,
    transparent: true,
    opacity: 0.8,
    reflectivity: 1.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  })

  const mainBuilding = new THREE.Mesh(mainGeometry, glassMaterial)
  mainBuilding.position.y = 15
  building.add(mainBuilding)

  // 添加楼层线条
  for (let i = 1; i < 10; i++) {
    const floorGeometry = new THREE.BoxGeometry(10.2, 0.1, 10.2)
    const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.position.y = i * 3
    building.add(floor)
  }

  // 顶部结构
  const topGeometry = new THREE.BoxGeometry(8, 2, 8)
  const topMaterial = new THREE.MeshPhongMaterial({ color: 0x87cefa })
  const top = new THREE.Mesh(topGeometry, topMaterial)
  top.position.y = 31
  building.add(top)

  // 底座
  const baseGeometry = new THREE.BoxGeometry(14, 1, 14)
  const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 })
  const base = new THREE.Mesh(baseGeometry, baseMaterial)
  base.position.y = -0.5
  building.add(base)

  return building
}

// 更新相机和渲染器尺寸
function updateSize() {
  if (!camera || !renderer || !containerRef.value) return

  // 更新渲染器尺寸
  renderer.setSize(props.width, props.height)

  // 更新相机比例
  camera.aspect = props.width / props.height
  camera.updateProjectionMatrix()

  // 确保渲染器显示正确
  renderer.setSize(props.width, props.height)
  renderer.render(scene, camera)
}

// 初始化Three.js场景
const initThree = () => {
  if (!containerRef.value) return

  // 创建场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf0f0f0)

  // 创建相机
  camera = new THREE.PerspectiveCamera(50, props.width / props.height, 0.1, 1000)
  camera.position.set(20, 20, 20)
  camera.lookAt(0, 0, 0)

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  })
  renderer.setSize(props.width, props.height)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true

  // 确保容器中没有其他渲染器元素
  if (containerRef.value.firstChild) {
    containerRef.value.innerHTML = ''
  }

  containerRef.value.appendChild(renderer.domElement)

  // 设置canvas样式以确保居中
  if (renderer.domElement) {
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.margin = 'auto'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.top = '0'
    renderer.domElement.style.left = '0'
  }

  // 添加轨道控制器
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.minDistance = 15
  controls.maxDistance = 50
  controls.maxPolarAngle = Math.PI / 2
  controls.enablePan = false // 禁用平移以保持模型在中心
  controls.enableZoom = false // 禁用缩放以保持统一视图
  controls.autoRotate = false // 自动旋转
  controls.autoRotateSpeed = 5 // 旋转速度

  // 添加光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(10, 20, 10)
  directionalLight.castShadow = true
  scene.add(directionalLight)

  // 添加建筑模型
  building = createBuilding()

  // 确保模型在场景中央
  building.position.set(0, 0, 0)
  scene.add(building)

  // 开始动画循环
  animate()
}

// 动画循环
const animate = () => {
  animationFrameId = requestAnimationFrame(animate)

  // 使用轨道控制器自动旋转
  controls.update()

  renderer.render(scene, camera)
}

// 处理窗口大小变化
const handleResize = () => {
  updateSize()
}

// 清理资源
const cleanUp = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }

  if (scene) {
    scene.clear()
  }

  if (renderer && containerRef.value) {
    try {
      containerRef.value.removeChild(renderer.domElement)
      renderer.dispose()
    } catch (error) {
      console.error('清理渲染器资源时出错', error)
    }
  }
}

onMounted(() => {
  // 确保DOM元素已经渲染完成
  nextTick(() => {
    initThree()
    window.addEventListener('resize', handleResize)
  })
})

onUpdated(() => {
  // 当组件更新时，确保渲染器尺寸正确
  updateSize()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  cleanUp()
})
</script>

<template>
  <div ref="containerRef" class="three-container"></div>
</template>

<style scoped>
.three-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
  background-color: rgba(240, 240, 240, 0.5);
}
</style>
