<template>
  <div class='payment-page'>
    <!-- 顶部导航栏 -->
    <el-tabs v-model="activeTab" class="payment-tabs" type="border-card" >
      <el-tab-pane label="收银台" name="cashier"></el-tab-pane>
      <el-tab-pane label="缴费情况" name="payment"></el-tab-pane>
      <el-tab-pane label="交易记录" name="transaction"></el-tab-pane>
      <el-tab-pane label="费用设置" name="setting"></el-tab-pane>
      <el-tab-pane label="收款商户绑定" name="merchant"></el-tab-pane>
      <el-tab-pane label="优惠配置" name="discount"></el-tab-pane>
    </el-tabs>

    <!-- 功能按钮区域 -->
    <div class="function-buttons">
      <el-button class="custom-button room-button" @click="activeView = 'query'">
        <el-icon class="custom-icon"><House /></el-icon>按地区查询
      </el-button>
      <el-button class="custom-button owner-button" @click="activeView = 'query'">
        <el-icon class="custom-icon"><User /></el-icon>按商户查询
      </el-button>
      <el-button class="custom-button stats-button" @click="activeView = 'stats'">
        <el-icon class="custom-icon"><DataLine /></el-icon>数据统计
      </el-button>
    </div>
    <!-- 缴费情况区域 -->
    <div v-if="activeView === 'pay'" class="payment-container">
      <el-table :data="dataList" style="width: 100%" :border="true" stripe>
        <el-table-column type="selection" />
          <el-table-column prop="MainAddress" label="片区" min-width="200" align="center"></el-table-column>
          <el-table-column prop="SubAddress" label="区域" min-width="200" align="center"></el-table-column>
          <el-table-column prop="name" label="负责人" min-width="200" align="center"></el-table-column>
          <el-table-column prop="phone" label="手机号" min-width="200" align="center"></el-table-column>
          <el-table-column prop="Money" label="应收费金额" min-width="200" align="center"></el-table-column>
          <el-table-column label="操作" width="120" align="center">
            <template #default>
              <el-button type="primary" link>详情</el-button>
            </template>
          </el-table-column>
        </el-table>
    </div>
    <!-- 查询表单区域 -->
    <div v-if="activeView === 'query'" class="query-container">
      <el-form :model="queryForm" class="query-form" label-position="top">
        <el-form-item label="片区">
          <el-input v-model="queryForm.community" placeholder="输入东西地区" clearable></el-input>
        </el-form-item>
        <el-form-item label="地区信息">
          <el-select v-model="queryForm.room" placeholder="请选择" clearable class="full-width">
            <el-option label="襄都区" value="襄都区"></el-option>
            <el-option label="信都区" value="信都区"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="pay-button" @click="handGO">去收费</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 数据统计区域 -->
    <div v-if="activeView === 'stats'" class="stats-container">
      <!-- 年份选择器和返回按钮 -->
      <div class="year-selector">
        <div class="left-controls">
          <el-button @click="activeView = 'query'" class="back-button" icon="ArrowLeft">返回</el-button>
          <el-select v-model="selectedYear" placeholder="选择年份" class="year-select">
            <el-option v-for="year in years" :key="year" :label="year + '年'" :value="year"></el-option>
          </el-select>
          <el-button type="primary" @click="queryStats">查询</el-button>
        </div>
      </div>

      <!-- 收费项目表格 -->
      <el-card class="stats-card">
        <template #header>
          <div class="card-header">
            <span>收费项目</span>
          </div>
        </template>
        <el-table :data="feeItems" style="width: 100%" :border="true" stripe>
          <el-table-column prop="name" label="收费项" min-width="200" align="center"></el-table-column>
          <el-table-column prop="price" label="单价" min-width="150" align="right">
            <template #default="scope">
              <span class="price-text">{{ scope.row.price }}元/{{ scope.row.unit }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" align="center">
            <template #default>
              <el-button type="primary" link>详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 图表区域 -->
      <div class="charts-container">
        <el-card class="stats-card">
          <template #header>
            <div class="card-header">
              <span>费用缴纳情况</span>
            </div>
          </template>
          <div ref="paymentStatusChart" class="chart"></div>
        </el-card>

        <el-card class="stats-card">
          <template #header>
            <div class="card-header">
              <span>月度收费趋势</span>
            </div>
          </template>
          <div ref="monthlyTrendChart" class="chart"></div>
        </el-card>

        <el-card class="stats-card">
          <template #header>
            <div class="card-header">
              <span>线上线下缴费比例</span>
            </div>
          </template>
          <div ref="paymentMethodChart" class="chart"></div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted, nextTick } from 'vue'
import { House, User, DataLine } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import axios from 'axios'

const dataList = ref([])
const getDate = async()=>{
  const params = {
    MainAddress:queryForm.value.community,
    SubAddress:queryForm.value.room
  }
  let res = await axios.get('http://localhost:3000/xzx/pay',{params:params})
  dataList.value=res.data.data
}
onMounted(()=>{
  getDate()
})


// 当前激活的标签页
const activeTab = ref('cashier')
const activeView = ref('query')

// 监听标签页变化
watch(activeTab, (newVal) => {
  // 根据不同的标签页显示不同的视图
  switch(newVal) {
    case 'payment':
      activeView.value = 'pay'
      break
    case 'cashier':
    case 'transaction':
      activeView.value = 'query'
      break
    case 'setting':
    case 'merchant':
    case 'discount':
      activeView.value = 'stats'
      break
  }
})

// 监听视图变化，当切换到stats视图时初始化图表
watch(activeView, (newVal) => {
  if (newVal === 'stats') {
    nextTick(() => {
      initCharts()
    })
  }
})

// 查询表单数据
const queryForm = ref({
  community: '',
  room: ''
})
const handGO = () => {
  // 在这里处理查询逻辑
  console.log('查询表单数据：', queryForm.value)
  activeView.value = 'pay'
  getDate()
}
// 数据统计相关
const selectedYear = ref(new Date().getFullYear())
const years = Array.from({length: 10}, (_, i) => selectedYear.value - i)

// 图表引用
const paymentStatusChart = ref(null)
const monthlyTrendChart = ref(null)
const paymentMethodChart = ref(null)

// 模拟数据
const feeItems = ref([
  { name: '片区管理费', price: '3.00', unit: 'm²*月' },
  { name: '垃圾清运费', price: '20.00', unit: '户*月' }
])

// 初始化图表
const initCharts = () => {
  if (!paymentStatusChart.value || !monthlyTrendChart.value || !paymentMethodChart.value) {
    console.warn('图表容器未准备就绪，跳过初始化')
    return
  }
  // 费用缴纳情况环形图
  const paymentStatus = echarts.init(paymentStatusChart.value)
  paymentStatus.setOption({
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [{
      name: '缴费情况',
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: true,
        position: 'center',
        formatter: '{c}元\n{d}%',
        fontSize: 14,
        color: '#333'
      },
      emphasis: {
        label: { show: true, fontSize: '20', fontWeight: 'bold' }
      },
      itemStyle: {
        borderRadius: 8,
        borderColor: '#fff',
        borderWidth: 2
      },
      data: [
        { value: 2288906.02, name: '已收' },
        { value: 783451.06, name: '未收' }
      ]
    }]
  })

  // 月度收费趋势折线图
  const monthlyTrend = echarts.init(monthlyTrendChart.value)
  monthlyTrend.setOption({
    tooltip: { trigger: 'axis' },
    grid: { top: 40, right: 30, bottom: 40, left: 50 },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      axisLine: { lineStyle: { color: '#ddd' } },
      axisLabel: { color: '#666' }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#eee' } },
      axisLabel: { color: '#666', formatter: '{value}元' }
    },
    series: [{
      name: '月度收费',
      data: [15000, 18000, 23000, 29000, 33000, 37000, 42000, 45000, 48000, 42000, 35000, 20000],
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      itemStyle: { color: '#1890ff' },
      lineStyle: { width: 3 },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(24,144,255,0.3)'
          }, {
            offset: 1, color: 'rgba(24,144,255,0.1)'
          }]
        }
      }
    }]
  })

  // 线上线下缴费比例饼图
  const paymentMethod = echarts.init(paymentMethodChart.value)
  paymentMethod.setOption({
    tooltip: { trigger: 'item' },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: { color: '#666' }
    },
    color: ['#1890ff', '#13c2c2'],
    series: [{
      name: '支付方式',
      type: 'pie',
      radius: '60%',
      center: ['60%', '50%'],
      data: [
        { value: 71.66, name: '线上（微信）' },
        { value: 28.34, name: '线下' }
      ],
      itemStyle: {
        borderRadius: 6,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: true,
        formatter: '{b}: {d}%',
        color: '#666'
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.2)'
        },
        label: { fontSize: 14 }
      }
    }]
  })

  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    paymentStatus.resize()
    monthlyTrend.resize()
    paymentMethod.resize()
  })
}

// 查询统计数据
const queryStats = () => {
  // 这里可以添加实际的数据查询逻辑
  console.log('查询年份:', selectedYear.value)
}

onMounted(() => {
  if (activeView.value === 'stats') {
    nextTick(() => {
      initCharts()
    })
  }
})

// 组件卸载时清理图表实例
onUnmounted(() => {
  if (paymentStatusChart.value) {
    paymentStatusChart.value.dispose()
  }
  if (monthlyTrendChart.value) {
    monthlyTrendChart.value.dispose()
  }
  if (paymentMethodChart.value) {
    paymentMethodChart.value.dispose()
  }
})
</script>

<style scoped>
.payment-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.payment-tabs {
  margin-bottom: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.payment-tabs :deep(.el-tabs__header) {
  margin-bottom: 0;
}

.function-buttons {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.custom-button {
  flex: 1;
  min-width: 200px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s;
  border: none;
}

.room-button {
  background-color: #e6f4ff;
  color: #1890ff;
}

.owner-button {
  background-color: #fff1f0;
  color: #ff4d4f;
}

.stats-button {
  background-color: #f6ffed;
  color: #52c41a;
}

.custom-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.custom-icon {
  font-size: 20px;
}

.query-container {
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.query-form {
  max-width: 500px;
  margin: 0 auto;
}

.full-width {
  width: 100%;
}

.pay-button {
  width: 100%;
  margin-top: 24px;
  height: 40px;
  font-size: 16px;
  border-radius: 8px;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border: none;
  transition: all 0.3s;
}

.pay-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(24,144,255,0.3);
}

.stats-container {
  padding: 20px;
}

.year-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background-color: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.left-controls {
  display: flex;
  gap: 16px;
  align-items: center;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 4px;
}

.year-select {
  width: 120px;
}

.price-text {
  color: #f56c6c;
  font-weight: 500;
}

.stats-card {
  margin-bottom: 24px;
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

@media screen and (max-width: 768px) {
  .charts-container {
    grid-template-columns: 1fr;
  }

  .year-selector {
    flex-direction: column;
    gap: 16px;
  }

  .left-controls {
    width: 100%;
    flex-wrap: wrap;
  }

  .year-select {
    width: 100%;
  }
}

.chart {
  height: 300px;
  width: 100%;
}
</style>
