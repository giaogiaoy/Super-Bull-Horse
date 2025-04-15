<template>
  <div class="select-build-modal" v-if="visible">
    <div class="modal-backdrop" @click="closeModal"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">{{ title }}</h2>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>
      <div class="modal-body">
        <div class="modal-layout">
          <div class="three-container" ref="threeContainer">
            <!-- 使用ThreeCube组件显示3D模型 -->
            <ThreeCube :width="threeContainerWidth" :height="threeContainerHeight" />
          </div>
          <div class="building-details">
            <h3 class="details-title">楼栋信息</h3>
            <div class="info-card">
              <div class="info-row">
                <span class="info-label">楼栋编号:</span>
                <span class="info-value">{{ buildingId }}栋</span>
              </div>
              <div class="info-row">
                <span class="info-label">建筑面积:</span>
                <span class="info-value">5000 m²</span>
              </div>
              <div class="info-row">
                <span class="info-label">楼层:</span>
                <span class="info-value">20层</span>
              </div>
              <div class="info-row">
                <span class="info-label">建成时间:</span>
                <span class="info-value">2020-06-15</span>
              </div>
            </div>

            <h3 class="details-title">统计数据</h3>
            <div class="stats-grid">
              <div class="info-item">
                <span class="info-label">店铺总数</span>
                <span class="info-value highlight">{{ buildingData.totalShops }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">已过审</span>
                <span class="info-value approved">{{ buildingData.approvedShops }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">未过审</span>
                <span class="info-value pending">{{ buildingData.pendingShops }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">入住率</span>
                <span class="info-value"
                  >{{
                    (
                      (buildingData.approvedShops / buildingData.totalShops) *
                      100
                    ).toFixed(1)
                  }}%</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  onUnmounted,
  defineProps,
  defineEmits,
  watch,
  computed,
  nextTick,
} from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import ThreeCube from "./BuildingsView.vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  buildingId: {
    type: Number,
    default: 1,
  },
  title: {
    type: String,
    default: "楼栋详情",
  },
});

const emit = defineEmits(["close"]);

// 建筑数据（实际应用中可能需要从API获取）
const buildingData = ref({
  totalShops: 900,
  approvedShops: 898,
  pendingShops: 2,
});

// Three.js 相关变量
const threeContainer = ref<HTMLDivElement | null>(null);
const threeContainerWidth = ref(0);
const threeContainerHeight = ref(0);
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let controls: OrbitControls | null = null;
let animationFrameId: number | null = null;

// 关闭弹窗
const closeModal = () => {
  emit("close");
};

// 初始化Three.js场景
const initThreeJS = () => {
  if (!threeContainer.value) return;

  // 创建场景
  scene = new THREE.Scene();

  // 创建相机
  const width = threeContainer.value.clientWidth;
  const height = threeContainer.value.clientHeight;
  camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
  camera.position.set(30, 30, 30);
  camera.lookAt(0, 15, 0);

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  threeContainer.value.appendChild(renderer.domElement);

  // 添加轨道控制器
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // 添加光源
  addLights();

  // 创建建筑模型
  createBuilding();

  // 开始动画循环
  animate();

  // 添加窗口大小变化监听
  window.addEventListener("resize", onWindowResize);
};

// 添加光源
const addLights = () => {
  if (!scene) return;

  // 环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  // 平行光（模拟太阳光）
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(20, 30, 20);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 100;
  directionalLight.shadow.camera.left = -30;
  directionalLight.shadow.camera.right = 30;
  directionalLight.shadow.camera.top = 30;
  directionalLight.shadow.camera.bottom = -30;
  scene.add(directionalLight);

  // 点光源（建筑内部发光效果）
  const pointLight = new THREE.PointLight(0x64b5f6, 0.8, 50);
  pointLight.position.set(0, 15, 0);
  scene.add(pointLight);
};

// 创建3D建筑模型
const createBuilding = () => {
  if (!scene) return;

  // 创建建筑主体
  const buildingGroup = new THREE.Group();

  // 建筑底座 - 方形设计
  const baseGeometry = new THREE.BoxGeometry(10, 0.5, 10);
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0xf0f0f0, // 浅银色
    roughness: 0.15,
    metalness: 0.75,
  });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.y = -0.25;
  base.receiveShadow = true;
  buildingGroup.add(base);

  // 建筑主体 - 方形大楼 - 浅蓝色外墙
  const buildingGeometry = new THREE.BoxGeometry(9, 16, 9);
  const buildingMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x81d4fa, // 浅蓝色墙面
    roughness: 0.1,
    metalness: 0.3,
    clearcoat: 0.4,
    clearcoatRoughness: 0.05,
    reflectivity: 0.6,
    envMapIntensity: 1.0,
  });
  const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
  building.position.y = 8;
  building.castShadow = true;
  building.receiveShadow = true;
  buildingGroup.add(building);

  // 顶部设计 - 方形平顶
  const topGeometry = new THREE.BoxGeometry(9.5, 0.5, 9.5);
  const topMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xb3e5fc, // 更浅的蓝色
    roughness: 0.08,
    metalness: 0.6,
    clearcoat: 0.5,
  });
  const top = new THREE.Mesh(topGeometry, topMaterial);
  top.position.y = 16.25;
  top.castShadow = true;
  buildingGroup.add(top);

  // 窗户 - 规则排列的窗户
  const glassGeometry = new THREE.PlaneGeometry(8.9, 15.9);
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xbbdefb, // 浅蓝色
    roughness: 0.05,
    metalness: 0.7,
    transmission: 0.4,
    reflectivity: 0.8,
    clearcoat: 0.7,
    emissive: 0x1e88e5, // 蓝色发光效果
  });

  // 创建规则排列的窗户
  const createGlassFacade = (rotationY: number, posX: number, posZ: number) => {
    const glass = new THREE.Mesh(glassGeometry, glassMaterial);
    glass.position.set(posX, 8, posZ);
    glass.rotation.y = rotationY;
    glass.castShadow = true;
    buildingGroup.add(glass);
  };

  // 应用四面窗户
  createGlassFacade(0, 0, 4.51); // 前面
  createGlassFacade(Math.PI, 0, -4.51); // 后面
  createGlassFacade(Math.PI / 2, 4.51, 0); // 右面
  createGlassFacade(-Math.PI / 2, -4.51, 0); // 左面

  // 添加方形入口
  const entranceGeometry = new THREE.BoxGeometry(2.5, 1.2, 0.3);
  const entranceMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x1976d2, // 蓝色
    roughness: 0.1,
    metalness: 0.7,
    clearcoat: 0.6,
    reflectivity: 0.8,
  });
  const entrance = new THREE.Mesh(entranceGeometry, entranceMaterial);
  entrance.position.set(0, 0.6, 4.52);
  entrance.castShadow = true;
  buildingGroup.add(entrance);

  // 添加窗户装饰线条 - 水平排列
  for (let i = 1; i < 6; i++) {
    const lineGeometry = new THREE.BoxGeometry(9.1, 0.1, 9.1);
    const lineMaterial = new THREE.MeshStandardMaterial({
      color: 0x2196f3, // 蓝色
      roughness: 0.1,
      metalness: 0.7,
    });
    const line = new THREE.Mesh(lineGeometry, lineMaterial);
    line.position.y = 2.5 * i;
    line.castShadow = true;
    buildingGroup.add(line);
  }

  // 添加窗户 - 垂直排列
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 5; j++) {
      // 前面窗户
      const windowGeometry = new THREE.PlaneGeometry(1.2, 1.2);
      const windowMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xe3f2fd,
        roughness: 0.05,
        metalness: 0.8,
        transmission: 0.5,
        reflectivity: 0.9,
        emissive: 0x64b5f6,
        emissiveIntensity: 0.2,
      });

      // 前面窗户
      const frontWindow = new THREE.Mesh(windowGeometry, windowMaterial);
      frontWindow.position.set(-3 + i * 2, 3 + j * 2.5, 4.52);
      buildingGroup.add(frontWindow);

      // 后面窗户
      const backWindow = new THREE.Mesh(windowGeometry, windowMaterial);
      backWindow.position.set(3 - i * 2, 3 + j * 2.5, -4.52);
      backWindow.rotation.y = Math.PI;
      buildingGroup.add(backWindow);

      // 左侧窗户
      const leftWindow = new THREE.Mesh(windowGeometry, windowMaterial);
      leftWindow.position.set(-4.52, 3 + j * 2.5, -3 + i * 2);
      leftWindow.rotation.y = -Math.PI / 2;
      buildingGroup.add(leftWindow);

      // 右侧窗户
      const rightWindow = new THREE.Mesh(windowGeometry, windowMaterial);
      rightWindow.position.set(4.52, 3 + j * 2.5, 3 - i * 2);
      rightWindow.rotation.y = Math.PI / 2;
      buildingGroup.add(rightWindow);
    }
  }

  // 添加顶部装饰结构
  const roofStructureGeometry = new THREE.BoxGeometry(5, 1, 5);
  const roofStructureMaterial = new THREE.MeshStandardMaterial({
    color: 0x2196f3, // 蓝色
    roughness: 0.1,
    metalness: 0.7,
  });
  const roofStructure = new THREE.Mesh(roofStructureGeometry, roofStructureMaterial);
  roofStructure.position.y = 16.75;
  roofStructure.castShadow = true;
  buildingGroup.add(roofStructure);

  scene.add(buildingGroup);
};

// 窗口大小变化处理
const onWindowResize = () => {
  if (!camera || !renderer || !threeContainer.value) return;

  const width = threeContainer.value.clientWidth;
  const height = threeContainer.value.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
};

// 动画循环
const animate = () => {
  if (!renderer || !scene || !camera || !controls) return;

  // 旋转建筑
  if (scene.children.length > 0 && scene.children[0] instanceof THREE.Group) {
    scene.children[0].rotation.y += 0.005;
  }

  controls.update();
  renderer.render(scene, camera);

  animationFrameId = requestAnimationFrame(animate);
};

// 清理Three.js资源
const cleanupThreeJS = () => {
  // 使用ThreeCube组件时，不需要手动清理Three.js资源
  // 如果需要回退到手动清理，可以取消下面代码的注释
  /*
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }

  if (renderer) {
    renderer.dispose();
    renderer.domElement.remove();
    renderer = null;
  }

  if (controls) {
    controls.dispose();
    controls = null;
  }

  scene = null;
  camera = null;

  window.removeEventListener("resize", onWindowResize);
  */
};

// 监听visible属性变化
watch(
  () => props.visible,
  (newValue) => {
    if (newValue) {
      // 弹窗显示时，更新ThreeCube组件的尺寸
      nextTick(() => {
        if (threeContainer.value) {
          threeContainerWidth.value = threeContainer.value.clientWidth;
          threeContainerHeight.value = threeContainer.value.clientHeight;
        }
        // 不再需要手动初始化Three.js
        // initThreeJS();
      });
    } else {
      // 弹窗关闭时不再需要手动清理Three.js资源
      // cleanupThreeJS();
    }
  }
);

// 组件卸载时清理资源
onUnmounted(() => {
  cleanupThreeJS();
});
</script>

<style scoped>
.select-build-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}

.modal-content {
  position: relative;
  width: 90%;
  max-width: 1200px;
  height: 90%;
  max-height: 800px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1001;
  animation: modal-appear 0.3s ease-out;
}

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
  background-color: #f8f9fa;
}

.modal-title {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  color: #999;
  transition: all 0.2s;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.close-button:hover {
  color: #333;
  background-color: #f0f0f0;
}

.modal-body {
  flex: 1;
  overflow: auto;
  padding: 0;
}

.modal-layout {
  display: flex;
  height: 100%;
}

.three-container {
  flex: 2;
  height: 100%;
  background-color: #f2f7fd;
  overflow: hidden;
  position: relative;
}

.building-details {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: #f8f9fa;
  border-left: 1px solid #eee;
}

.details-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #e1e4e8;
}

.info-card {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed #eee;
}

.info-row:last-child {
  border-bottom: none;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.info-item {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.info-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.info-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.info-value {
  font-size: 24px;
  font-weight: bold;
  color: #1976d2;
}

.highlight {
  color: #2196f3;
}

.approved {
  color: #4caf50;
}

.pending {
  color: #ff9800;
}

/* 响应式调整 */
@media (max-width: 992px) {
  .modal-layout {
    flex-direction: column;
  }

  .three-container {
    height: 50%;
  }

  .building-details {
    border-left: none;
    border-top: 1px solid #eee;
  }
}

@media (max-width: 576px) {
  .modal-content {
    width: 95%;
    height: 95%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .info-card {
    padding: 12px;
  }

  .info-row {
    flex-direction: column;
    padding: 12px 0;
  }

  .info-label {
    margin-bottom: 4px;
  }
}
</style>
