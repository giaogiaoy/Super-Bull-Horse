<template>
  <div class="building-view">
    <!-- 条件筛选 -->
    <div class="filter-container">
      <div class="filter-grid">
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
      <div class="filter-buttons">
        <button class="query-btn" @click="handleQuery">查询</button>
        <button class="export-btn" @click="handleExport">导出</button>
      </div>
    </div>

    <!-- 楼栋信息展示区域 -->
    <div class="building-info">
      <div class="building-summary">
        <div class="summary-item">
          <span class="summary-label">房屋总数</span>
          <span class="summary-value">4500</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">已入住</span>
          <span class="summary-value">4490</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">未入住</span>
          <span class="summary-value">10</span>
        </div>
      </div>

      <div class="building-cards">
        <div v-for="i in 10" :key="i" class="building-card">
          <h3>{{ i }}栋</h3>
          <!-- <img src="/public/img/building.svg" alt="building" class="building-icon" /> -->
          <div class="ThreeStyle">
            <ThreeCube :width="200" :height="200" />
          </div>
          <div class="card-info">
            <div class="info-item">
              <span class="info-label">店铺总数</span>
              <span class="info-value">900</span>
            </div>
            <div class="info-item">
              <span class="info-label">已过审</span>
              <span class="info-value">898</span>
            </div>
            <div class="info-item">
              <span class="info-label">未过审</span>
              <span class="info-value">2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { SelectProps } from "vue-amazing-ui";
import ThreeCube from "./BuildingsView.vue";
// 定义选择器的选项
const buildingOptions = ref([
  { label: "1栋", value: 1 },
  { label: "2栋", value: 2 },
  { label: "3栋", value: 3 },
  { label: "4栋", value: 4 },
  { label: "5栋", value: 5 },
  { label: "6栋", value: 6 },
  { label: "7栋", value: 7 },
  { label: "8栋", value: 8 },
]);

const unitOptions = ref([
  { label: "1单元", value: 1 },
  { label: "2单元", value: 2 },
  { label: "3单元", value: 3 },
]);

const floorOptions = ref([
  { label: "1层", value: 1 },
  { label: "2层", value: 2 },
  { label: "3层", value: 3 },
  { label: "4层", value: 4 },
  { label: "5层", value: 5 },
]);

const statusOptions = ref([
  { label: "已入住", value: 1 },
  { label: "未入住", value: 2 },
]);

// 定义选择器的状态
const buildingSelect = ref<SelectProps["modelValue"]>("");
const unitSelect = ref<SelectProps["modelValue"]>("");
const floorSelect = ref<SelectProps["modelValue"]>("");
const statusSelect = ref<SelectProps["modelValue"]>("");
const nameSelect = ref<SelectProps["modelValue"]>("");
const idCardSelect = ref<SelectProps["modelValue"]>("");
const phoneSelect = ref<SelectProps["modelValue"]>("");

// 处理选择器变化
function onChange(value: string | number, label: string, index: number) {
  console.log("选中值:", value, "标签:", label, "索引:", index);
}

function onOpenChange(open: boolean) {
  console.log("下拉框状态:", open ? "打开" : "关闭");
}

// 处理查询和导出
function handleQuery() {
  console.log("查询条件:", {
    building: buildingSelect.value,
    unit: unitSelect.value,
    floor: floorSelect.value,
    status: statusSelect.value,
    name: nameSelect.value,
    idCard: idCardSelect.value,
    phone: phoneSelect.value,
  });
}
// 处理导出
function handleExport() {
  console.log("导出数据");
}
</script>

<style scoped>
.building-view {
  padding: 20px;
}

.filter-container {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: #606266;
}

.filter-buttons {
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

.query-btn {
  background: #409eff;
  color: white;
}

.export-btn {
  background: #67c23a;
  color: white;
}

.building-info {
  margin-top: 24px;
}

.building-summary {
  display: flex;
  justify-content: space-around;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.summary-item {
  text-align: center;
}

.summary-label {
  font-size: 14px;
  color: #606266;
}

.summary-value {
  display: block;
  font-size: 24px;
  color: #303133;
  margin-top: 8px;
}

.building-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.building-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  cursor: pointer;
}

.building-card:hover {
  transform: translateY(-5px);
}

.building-card h3 {
  margin: 0 0 16px 0;
  color: #303133;
}

.building-icon {
  width: 100px;
  height: 100px;
  margin: 0 auto 16px;
  display: block;
}

.card-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.info-item {
  text-align: center;
}

.info-label {
  font-size: 12px;
  color: #909399;
}

.info-value {
  display: block;
  font-size: 16px;
  color: #303133;
  margin-top: 4px;
}

.ThreeStyle {
  width: 100%;
  height: 200px;
  margin: 0 auto 16px;
  text-align: center;
}
</style>
