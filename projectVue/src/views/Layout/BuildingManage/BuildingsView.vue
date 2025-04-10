<template>
  <div ref="threeContainer" class="three-container"></div>
</template>

<script lang="ts">
import { onMounted, ref, watch } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default {
  name: "ThreeCube",
  props: {
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
  },
  setup(props) {
    const threeContainer = ref<HTMLDivElement | null>(null);
    let renderer: THREE.WebGLRenderer | null = null;

    onMounted(() => {
      if (threeContainer.value) {
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(
          65,
          props.width / props.height,
          0.1,
          1000
        );
        camera.position.set(20, 25, 30);
        camera.lookAt(0, 10, 0);

        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
        });
        renderer.setSize(props.width, props.height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        threeContainer.value.appendChild(renderer.domElement);

        // 添加轨道控制器
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        // 创建3D建筑模型 - 现代简约大厦风格
        const createBuilding = () => {
          // 创建建筑主体
          const buildingGroup = new THREE.Group();

          // 建筑底座 - 极简设计
          const baseGeometry = new THREE.CylinderGeometry(6, 6, 0.2, 32);
          const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0xf0f0f0, // 更浅的银白色
            roughness: 0.15,
            metalness: 0.75,
          });
          const base = new THREE.Mesh(baseGeometry, baseMaterial);
          base.position.y = -0.1;
          base.receiveShadow = true;
          buildingGroup.add(base);

          // 建筑主体 - 现代高层大厦 - 更大尺寸
          const buildingGeometry = new THREE.BoxGeometry(8, 20, 8);
          const buildingMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff, // 纯白色墙面
            roughness: 0.03,
            metalness: 0.5,
            clearcoat: 0.6, // 增强清漆效果
            clearcoatRoughness: 0.08,
            reflectivity: 0.8, // 增强反光度
            envMapIntensity: 1.3, // 增强环境反射
          });
          const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
          building.position.y = 10;
          building.castShadow = true;
          building.receiveShadow = true;
          buildingGroup.add(building);

          // 顶部设计 - 现代平顶 - 更大尺寸
          const topGeometry = new THREE.BoxGeometry(8.5, 0.5, 8.5);
          const topMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xf5f5f5, // 更浅的银白色
            roughness: 0.08,
            metalness: 0.8,
            clearcoat: 0.6,
          });
          const top = new THREE.Mesh(topGeometry, topMaterial);
          top.position.y = 20.25;
          top.castShadow = true;
          buildingGroup.add(top);

          // 玻璃幕墙 - 现代高反光效果 - 更大尺寸
          const glassGeometry = new THREE.PlaneGeometry(7.9, 19.9);
          const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xf8f9fa, // 更浅的米白色
            roughness: 0.03,
            metalness: 0.85,
            transmission: 0.6, // 增强半透明效果
            reflectivity: 0.95,
            clearcoat: 0.95,
            emissive: 0x223344, // 轻微发光效果
          });

          // 创建四面玻璃幕墙
          const createGlassFacade = (rotationY, posX, posZ) => {
            const glass = new THREE.Mesh(glassGeometry, glassMaterial);
            glass.position.set(posX, 10, posZ);
            glass.rotation.y = rotationY;
            glass.castShadow = true;
            buildingGroup.add(glass);
          };

          // 应用四面玻璃幕墙
          createGlassFacade(0, 0, 4.01); // 前面
          createGlassFacade(Math.PI, 0, -4.01); // 后面
          createGlassFacade(Math.PI / 2, 4.01, 0); // 右面
          createGlassFacade(-Math.PI / 2, -4.01, 0); // 左面

          // 添加现代入口
          const entranceGeometry = new THREE.BoxGeometry(2, 0.8, 0.5);
          const entranceMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x34495e, // 深蓝灰色
            roughness: 0.1,
            metalness: 0.9,
            clearcoat: 0.8,
            reflectivity: 0.9,
          });
          const entrance = new THREE.Mesh(entranceGeometry, entranceMaterial);
          entrance.position.set(0, 0.4, 2.76);
          entrance.castShadow = true;
          buildingGroup.add(entrance);

          // 添加装饰线条 - 水平分割线
          for (let i = 1; i < 5; i++) {
            const lineGeometry = new THREE.BoxGeometry(5.1, 0.05, 5.1);
            const lineMaterial = new THREE.MeshStandardMaterial({
              color: 0x95a5a6, // 灰色
              roughness: 0.1,
              metalness: 0.9,
            });
            const line = new THREE.Mesh(lineGeometry, lineMaterial);
            line.position.y = 3 * i;
            line.castShadow = true;
            buildingGroup.add(line);
          }

          // 添加顶部天线/装饰
          const antennaGeometry = new THREE.CylinderGeometry(0.08, 0.08, 3, 8);
          const antennaMaterial = new THREE.MeshStandardMaterial({
            color: 0xbdbdbd, // 更浅的灰色
            roughness: 0.1,
            metalness: 0.7,
          });
          const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
          antenna.position.y = 21.5;
          antenna.castShadow = true;
          buildingGroup.add(antenna);

          // 添加顶部装饰灯
          const lightGeometry = new THREE.SphereGeometry(0.15, 16, 16);
          const lightMaterial = new THREE.MeshBasicMaterial({
            color: 0x64b5f6, // 浅蓝色
            emissive: 0x64b5f6,
            emissiveIntensity: 1,
          });
          const light = new THREE.Mesh(lightGeometry, lightMaterial);
          light.position.y = 23;
          buildingGroup.add(light);

          return buildingGroup;
        };

        const building = createBuilding();
        scene.add(building);

        // 添加光源 - 现代城市光照效果
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        // 主光源 - 模拟阳光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(15, 20, 15);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048; // 高质量阴影
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -15;
        directionalLight.shadow.camera.right = 15;
        directionalLight.shadow.camera.top = 15;
        directionalLight.shadow.camera.bottom = -15;
        directionalLight.shadow.radius = 1.5; // 柔化阴影边缘
        scene.add(directionalLight);

        // 添加辅助光源 - 模拟城市环境光
        const pointLight1 = new THREE.PointLight(0x4fc3f7, 0.5); // 蓝色调光源
        pointLight1.position.set(-8, 12, -8);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xecf0f1, 0.4); // 白色调光源
        pointLight2.position.set(8, 8, 8);
        scene.add(pointLight2);

        // 添加建筑物底部的环境光晕
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0xb3e5fc, 0.3);
        hemiLight.position.set(0, 25, 0);
        scene.add(hemiLight);

        // 移除了底部圆盘和环形装饰

        // 创建一个时钟用于动画
        const clock = new THREE.Clock();

        const animate = () => {
          requestAnimationFrame(animate);

          const elapsedTime = clock.getElapsedTime();

          // 建筑物极其轻微的旋转 - 现代大厦稳定感
          building.rotation.y = Math.sin(elapsedTime * 0.05) * 0.01;

          // 顶部灯光颜色变化

          // 移除了环形装饰光效果

          controls.update(); // 更新控制器
          renderer?.render(scene, camera);
        };

        animate();
      }
    });

    watch(
      () => [props.width, props.height],
      ([newWidth, newHeight]) => {
        if (renderer) {
          renderer.setSize(newWidth, newHeight);
        }
      },
      { immediate: true }
    );

    return {
      threeContainer,
    };
  },
};
</script>

<style scoped>
.three-container {
  width: 100%;
  height: 100%;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
