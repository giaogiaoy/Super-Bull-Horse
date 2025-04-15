<template>
  <div class="building-view-view">
    <!-- 条件筛选 -->
    <div class="filter-container-view">
      <div class="filter-grid-view">
        <!-- 选择楼栋 -->
        <label for="building-select">
          楼栋
          <Select
            :options="buildingOptions"
            v-model="buildingSelect"
            @change="onChange"
            @openChange="onOpenChange"
            placeholder="请选择楼栋"
          />
        </label>
        <!-- 选择单元 -->
        <label for="unit-select">
          单元
          <Select
            :options="unitOptions"
            v-model="unitSelect"
            @change="onChange"
            @openChange="onOpenChange"
            placeholder="请选择单元"
          />
        </label>
        <!-- 选择楼层 -->
        <label for="floor-select">
          楼层
          <Select
            :options="floorOptions"
            v-model="floorSelect"
            @change="onChange"
            @openChange="onOpenChange"
            placeholder="请选择楼层"
          />
        </label>
        <!-- 选择状态 -->
        <label for="status-select">
          状态
          <Select
            :options="statusOptions"
            v-model="statusSelect"
            @change="onChange"
            @openChange="onOpenChange"
            placeholder="请选择状态"
          />
        </label>
        <!--  姓名  -->
        <label for="name-input">
          姓名
          <Input v-model="nameSelect" placeholder="请输入姓名" />
        </label>
        <!-- 身份证 -->
        <label for="idcard-input">
          身份证
          <Input v-model="idCardSelect" placeholder="请输入身份证" />
        </label>
        <!-- 手机号 -->
        <label for="phone-input">
          手机号
          <Input v-model="phoneSelect" placeholder="请输入手机号" />
        </label>
      </div>
      <div class="filter-buttons-view">
        <button class="query-btn-view" @click="handleQuery">查询</button>
        <button class="export-btn-view" @click="handleExport">导出</button>
      </div>
    </div>

    <!-- 楼栋信息展示区域 -->
    <div class="building-info-view">
      <div class="building-summary-view">
        <div class="summary-item-view">
          <span class="summary-label-view">房屋总数</span>
          <span class="summary-value-view">4500</span>
        </div>
        <div class="summary-item-view">
          <span class="summary-label-view">已入住</span>
          <span class="summary-value-view">4490</span>
        </div>
        <div class="summary-item-view">
          <span class="summary-label-view">未入住</span>
          <span class="summary-value-view">10</span>
        </div>
      </div>

      <div class="building-cards-view">
        <div v-for="i in 10" :key="i" class="building-card-view" @click="openBuildingModal(i)">
          <h3>{{ i }}栋</h3>
          <div class="ThreeStyle-view">
            <ThreeCube :width="200" :height="180" />
          </div>
          <div class="card-info-view">
            <div class="info-item-view">
              <span class="info-label-view">店铺总数</span>
              <span class="info-value-view">900</span>
            </div>
            <div class="info-item-view">
              <span class="info-label-view">已过审</span>
              <span class="info-value-view">898</span>
            </div>
            <div class="info-item-view">
              <span class="info-label-view">未过审</span>
              <span class="info-value-view">2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 楼栋详情弹窗 -->
  <SelectBuild
    :visible="showBuildingModal"
    :buildingId="selectedBuildingId"
    :title="selectedBuildingTitle"
    @close="closeBuildingModal"
  />
</template>

<script lang="ts">
// 使用普通<script>标签定义组件，而非setup语法糖
import { defineComponent, ref } from 'vue'
import { Select, Input } from 'vue-amazing-ui'
import type { SelectProps } from 'vue-amazing-ui'
import ThreeCube from './BuildingsView.vue'
import SelectBuild from './SelectBuild.vue'

export default defineComponent({
  name: 'BuildingView',
  components: {
    Select,
    Input,
    ThreeCube,
    SelectBuild,
  },
  setup() {
    // 定义选择器的选项
    const buildingOptions = ref([
      { label: '1栋', value: 1 },
      { label: '2栋', value: 2 },
      { label: '3栋', value: 3 },
      { label: '4栋', value: 4 },
      { label: '5栋', value: 5 },
      { label: '6栋', value: 6 },
      { label: '7栋', value: 7 },
      { label: '8栋', value: 8 },
    ])

    const unitOptions = ref([
      { label: '1单元', value: 1 },
      { label: '2单元', value: 2 },
      { label: '3单元', value: 3 },
    ])

    const floorOptions = ref([
      { label: '1层', value: 1 },
      { label: '2层', value: 2 },
      { label: '3层', value: 3 },
      { label: '4层', value: 4 },
      { label: '5层', value: 5 },
    ])

    const statusOptions = ref([
      { label: '已入住', value: 1 },
      { label: '未入住', value: 2 },
    ])

    // 定义选择器的状态
    const buildingSelect = ref<SelectProps['modelValue']>('')
    const unitSelect = ref<SelectProps['modelValue']>('')
    const floorSelect = ref<SelectProps['modelValue']>('')
    const statusSelect = ref<SelectProps['modelValue']>('')
    const nameSelect = ref<string>('')
    const idCardSelect = ref<string>('')
    const phoneSelect = ref<string>('')

    // 处理选择器变化
    function onChange(value: string | number, label: string, index: number) {
      console.log('选中值:', value, '标签:', label, '索引:', index)
    }

    function onOpenChange(open: boolean) {
      console.log('下拉框状态:', open ? '打开' : '关闭')
    }

    // 处理查询和导出
    function handleQuery() {
      console.log('查询条件:', {
        building: buildingSelect.value,
        unit: unitSelect.value,
        floor: floorSelect.value,
        status: statusSelect.value,
        name: nameSelect.value,
        idCard: idCardSelect.value,
        phone: phoneSelect.value,
      })
    }

    // 处理导出
    function handleExport() {
      console.log('导出数据')
    }

    // 楼栋弹窗相关
    const showBuildingModal = ref(false)
    const selectedBuildingId = ref(1)
    const selectedBuildingTitle = ref('')

    // 打开楼栋详情弹窗
    function openBuildingModal(buildingId: number) {
      selectedBuildingId.value = buildingId
      selectedBuildingTitle.value = `${buildingId}栋详情`
      showBuildingModal.value = true
    }

    // 关闭楼栋详情弹窗
    function closeBuildingModal() {
      showBuildingModal.value = false
    }

    return {
      buildingOptions,
      unitOptions,
      floorOptions,
      statusOptions,
      buildingSelect,
      unitSelect,
      floorSelect,
      statusSelect,
      nameSelect,
      idCardSelect,
      phoneSelect,
      onChange,
      onOpenChange,
      handleQuery,
      handleExport,
      showBuildingModal,
      selectedBuildingId,
      selectedBuildingTitle,
      openBuildingModal,
      closeBuildingModal,
    }
  },
})
</script>

<style scoped>
.building-view-view {
  padding: 20px;
  background: #f5f7fa; /* 添加明确的背景色，覆盖可能的全局背景图片 */
  position: relative;
  z-index: 1; /* 确保内容在背景之上 */
  isolation: isolate; /* 创建新的层叠上下文，防止外部样式渗透 */
  min-height: 100vh; /* 确保页面至少占满整个视口高度 */
  box-sizing: border-box; /* 确保内边距不会增加元素的总宽高 */
}
.filter-container-view {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.filter-grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .filter-grid-view {
    grid-template-columns: 1fr;
  }
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: #606266;
}

.filter-buttons-view {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 20px;
}

button {
  padding: 8px 20px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.query-btn-view {
  background: #409eff;
  color: white;
}

.query-btn-view:hover {
  background: #66b1ff;
}

.export-btn-view {
  background: #67c23a;
  color: white;
}

.export-btn-view:hover {
  background: #85ce61;
}

.building-info-view {
  margin-top: 24px;
  background: none !important; /* 覆盖可能的全局背景图片 */
  background-image: none !important; /* 确保没有背景图片 */
  padding: 0 !important; /* 重置可能的全局内边距 */
}

.building-summary-view {
  display: flex;
  justify-content: space-around;
  padding: 20px;
  background: #fff !important; /* 确保背景是白色 */
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  background-image: none !important; /* 确保没有背景图片 */
}

@media (max-width: 576px) {
  .building-summary-view {
    flex-direction: column;
    gap: 16px;
  }
}

.summary-item-view {
  text-align: center;
}

.summary-label-view {
  font-size: 14px;
  color: #606266;
}

.summary-value-view {
  display: block;
  font-size: 24px;
  color: #303133;
  margin-top: 8px;
}

.building-cards-view {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  margin: 0 auto;
  max-width: 1400px;
  padding: 20px;
}

.building-card-view {
  flex: 0 0 auto;
  width: 280px;
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.building-card-view:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.building-card-view h3 {
  margin: 0 0 16px 0;
  color: #2c3e50;
  width: 100%;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
}

.ThreeStyle-view {
  width: 100%;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin: 0 auto 20px;
  border-radius: 8px;
  background-color: #f5f7fa;
  position: relative;
}

.card-info-view {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  background: none !important; /* 覆盖可能的全局背景 */
  background-image: none !important; /* 确保没有背景图片 */
  width: 100%;
  margin-top: 10px;
}

.info-item-view {
  text-align: center;
}

.info-label-view {
  font-size: 12px;
  color: #909399;
  display: block;
  white-space: nowrap;
}

.info-value-view {
  display: block;
  font-size: 16px;
  color: #303133;
  margin-top: 4px;
  font-weight: bold;
}
</style>
