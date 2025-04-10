<script setup lang="ts">
import * as echarts from "echarts/core"; // 推荐按需引入
import { PieChart } from "echarts/charts";
import { TooltipComponent, LegendComponent, GridComponent } from "echarts/components";
import { SVGRenderer } from "echarts/renderers";
import { ref, onMounted, onUnmounted, watchEffect } from "vue";
echarts.use([PieChart, TooltipComponent, LegendComponent, GridComponent, SVGRenderer]);
const chartContainer = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;
// 初始化图表
const initChart = () => {
  if (!chartContainer.value) return;

  disposeChart();

  // 创建新实例（必须指定 renderer）
  chartInstance = echarts.init(chartContainer.value, null, {
    renderer: "svg", // 或 'canvas' 根据需求选择
  });
  chartInstance.setOption({
    tooltip: {
      trigger: "item",
    },
    legend: {
      left: "center",
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: ["30%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: "Search Engine" },
          { value: 735, name: "Direct" },
          { value: 580, name: "Email" },
          { value: 484, name: "Union Ads" },
          { value: 300, name: "Video Ads" },
        ],
      },
    ],
  });

  // 窗口变化时自动调整
  window.addEventListener("resize", handleResize);
};
// 窗口尺寸变化处理
const handleResize = () => {
  chartInstance?.resize({
    animation: { duration: 300 },
  });
};
// 释放资源
const disposeChart = () => {
  chartInstance?.dispose();
  window.removeEventListener("resize", handleResize);
};
// 生命周期管理
onMounted(() => {
  // 延迟初始化确保容器渲染完成
  setTimeout(initChart, 50);
});
// 组件卸载时释放
onUnmounted(disposeChart);
// 🚀 响应式数据示例（若需要）
watchEffect(() => {
  chartInstance?.setOption({
    // 动态数据更新
  });
});
import type { CarouselImage } from "vue-amazing-ui";
const images = ref<CarouselImage[]>([
  {
    name: "image-1",
    src: "https://cdn.jsdelivr.net/gh/themusecatcher/resources@0.1.2/1.jpg",
    link: "https://cdn.jsdelivr.net/gh/themusecatcher/resources@0.1.2/1.jpg",
  },
  {
    name: "image-2",
    src: "https://cdn.jsdelivr.net/gh/themusecatcher/resources@0.1.2/2.jpg",
    link: "https://cdn.jsdelivr.net/gh/themusecatcher/resources@0.1.2/2.jpg",
  },
  {
    name: "image-3",
    src: "https://cdn.jsdelivr.net/gh/themusecatcher/resources@0.1.2/3.jpg",
    link: "https://cdn.jsdelivr.net/gh/themusecatcher/resources@0.1.2/3.jpg",
  },
  {
    name: "image-4",
    src: "https://cdn.jsdelivr.net/gh/themusecatcher/resources@0.1.2/4.jpg",
  },
  {
    name: "image-5",
    src: "https://cdn.jsdelivr.net/gh/themusecatcher/resources@0.1.2/5.jpg",
  },
]);
function clickImage(image: CarouselImage) {
  console.log("image", image);
}
</script>

<template>
  <div class="home-view">
    <!-- 顶部第一块 -->
    <div class="top-box">
      <!-- 用户头像 -->
      <img src="/public/img/user.png" alt="用户头像" class="user-avatar" />

      <!-- 用户信息 -->
      <div class="user-info">
        <!-- 用户名（或其它标题） -->
        <div class="user-name">平台方（物联网设备）</div>
        <!-- 统计信息 -->
        <div class="user-stats">
          <span>系统工作人员 <em>6</em></span>
          <span>今日访客 <em>3</em></span>
          <span>未处理 <em>247</em></span>
        </div>
      </div>
    </div>

    <!-- 内容大盒子 -->
    <div class="content-box">
      <!-- 左边 -->
      <div class="left-content">
        <div class="left-box">
          <Card hoverable title="设备设施" :width="'100%'">
            <template #extra>
              <a href="#">更多</a>
            </template>
            <div class="firstBoxCard">
              <div class="firstBoxCardItem">
                <h4>设备设施总数</h4>
                <h1>95</h1>
              </div>
              <div class="firstBoxCardItem">
                <h4>门禁</h4>
                <h1>10</h1>
                <h4>在线16 离线13</h4>
              </div>
              <div class="firstBoxCardItem">
                <h4>门禁</h4>
                <h1>10</h1>
                <h4>在线16 离线13</h4>
              </div>
              <div class="firstBoxCardItem">
                <h4>门禁</h4>
                <h1>10</h1>
                <h4>在线16 离线13</h4>
              </div>
            </div>
          </Card>
        </div>
        <div class="left-box">
          <Card hoverable title="数据统计" style="width: 100%">
            <!-- echarts 圆形 -->
            <div
              ref="chartContainer"
              class="chart-container"
              :style="{
                width: '100%',
                height: '200px',
                minHeight: '100px',
              }"
            />
          </Card>
        </div>

        <div class="left-box">
          <Card hoverable title="代办项目" :width="'100%'">
            <div class="todo-list">
              <!-- 身份确认 -->
              <div class="todo-item">
                <h3>身份确认</h3>
                <h2>100</h2>
                <h5>待处理</h5>
              </div>
              <!-- 维修报备 -->
              <div class="todo-item">
                <h3>维修报备</h3>
                <h2>3</h2>
                <h5>待审批</h5>
              </div>
              <!-- 投诉建议 -->
              <div class="todo-item">
                <h3>投诉建议</h3>
                <h2>2</h2>
                <h5>待处理</h5>
              </div>
              <!-- 缴费单 -->
              <div class="todo-item">
                <h3>缴费单</h3>
                <p>
                  <span style="color: #f5222d; font-size: 20px; font-weight: bold"
                    >969000.00</span
                  >
                  已缴
                </p>
                <h4>
                  <p><span>969000.00</span>未缴</p>
                  <p>欠费54户</p>
                </h4>
              </div>
              <!-- 自然灾害 -->
              <div class="todo-item">自然灾害</div>
            </div>
          </Card>
        </div>

        <div class="left-box">
          <!-- 公告 -->
          <div class="left-box-left">
            <Card hoverable title="通知公告" style="width: 100%">
              <ul>
                <li>
                  <p>停水通知</p>
                  <p>2021-09-12 12:34</p>
                </li>
                <li>
                  <p>维修公告</p>
                  <p>2021-09-12 12:34</p>
                </li>
                <li>
                  <p>停电通知</p>
                  <p>2021-09-12 12:34</p>
                </li>
              </ul>
            </Card>
          </div>
          <!-- 轮播图 -->
          <div class="left-box-right">
            <Carousel :images="images" :height="'100%'" autoplay @click="clickImage" />
          </div>
        </div>
      </div>
      <!-- 右边 -->
      <div class="right-content">
        <div class="right-box1">
          <Card hoverable title="警告" :width="'100%'">
            <template #extra>
              <a href="#">more</a>
            </template>
            <div class="right-alarm-list">
              <ul>
                <li>
                  <img src="/public/img/image.png" alt="警告" width="30" height="30" />
                  <p>出入告警</p>
                </li>
                <li>
                  <img src="/public/img/image.png" alt="警告" width="30" height="30" />
                  <p>陌生人告警</p>
                </li>
                <li>
                  <img src="/public/img/image.png" alt="警告" width="30" height="30" />
                  <p>高空抛物</p>
                </li>
                <li>
                  <img src="/public/img/image.png" alt="警告" width="30" height="30" />
                  <p>车辆穿越</p>
                </li>
                <li>
                  <img src="/public/img/image.png" alt="警告" width="30" height="30" />
                  <p>周界入侵</p>
                </li>
                <li>
                  <img src="/public/img/image.png" alt="警告" width="30" height="30" />
                  <p>电瓶车入楼</p>
                </li>
              </ul>
            </div>
          </Card>
        </div>

        <div class="right-box2">
          <Card hoverable title="事件" :width="'100%'" class="event-card">
            <template #extra>
              <a href="#">more</a>
            </template>
            <!-- 事件列表整体容器 -->
            <div class="event-list">
              <!-- 投诉建议 -->
              <div class="event-section">
                <div class="event-header">
                  <span class="section-title">投诉建议</span>
                  <a class="section-more" href="#">更多</a>
                  <span class="event-status">待回复</span>
                </div>
                <ul>
                  <li>
                    <span class="dot"></span>
                    <span class="event-desc">电梯摇晃的，太危险了...</span>
                    <span class="event-time">2021-09-12 12:34</span>
                  </li>
                  <li>
                    <span class="dot"></span>
                    <span class="event-desc">电梯摇晃的，太危险了...</span>
                    <span class="event-time">2021-09-12 12:34</span>
                  </li>
                </ul>
              </div>

              <!-- 维修处理 -->
              <div class="event-section">
                <div class="event-header">
                  <span class="section-title">维修处理</span>
                  <a class="section-more" href="#">更多</a>
                  <span class="event-status">待派单</span>
                  <span class="event-status">待接单</span>
                </div>
                <ul>
                  <li>
                    <span class="dot"></span>
                    <span class="event-desc">电梯摇晃的，太危险了...</span>
                    <span class="event-time">2021-09-12 12:34</span>
                  </li>
                  <li>
                    <span class="dot"></span>
                    <span class="event-desc">电梯摇晃的，太危险了...</span>
                    <span class="event-time">2021-09-12 12:34</span>
                  </li>
                </ul>
              </div>

              <!-- 事件上报 -->
              <div class="event-section">
                <div class="event-header">
                  <span class="section-title">事件上报</span>
                  <a class="section-more" href="#">更多</a>
                  <span class="event-status">待处理</span>
                </div>
                <ul>
                  <li>
                    <span class="dot"></span>
                    <span class="event-desc">电梯摇晃的，太危险了...</span>
                    <span class="event-time">2021-09-12 12:34</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.chart-container {
  /* 防止动画渲染错位 */
  transform: translateZ(0);
}
/* 全局变量 */
// 整体背景颜色
.home-view {
  background-color: #eeeeee;
}
/* 顶部第一块 */
.top-box {
  /* 容器本身 */
  width: 90%;
  height: 6rem;
  margin: 0 auto;

  /* 使用 Flex 布局让头像和文字并排 */
  display: flex;
  align-items: center;
  padding: 0 1rem; /* 可以视需要添加左右内边距 */

  /* 用户头像 */
  .user-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-right: 1rem; /* 头像和文字之间留间距 */
  }

  /* 用户信息整体 */
  .user-info {
    color: black;
    display: flex;
    flex-direction: column; /* 让名字和统计信息上下排列 */

    /* 用户名或标题 */
    .user-name {
      font-size: 1.2rem;
      font-weight: bold;
      color: black;
      margin-bottom: 0.5rem;
    }

    /* 统计信息部分 */
    .user-stats {
      display: flex;
      gap: 1rem; /* 每个统计项之间的间距 */

      span {
        color: black;

        em {
          color: #1890ff; /* 关键数字可突出显示 */
          font-style: normal; /* 去掉斜体 */
          margin-left: 0.25rem;
        }
      }
    }
  }
}

/* 内容大盒子 */
.content-box {
  width: 90%;
  /* 用最小高度保证内容区填满屏幕 */
  min-height: calc(100vh - 6rem - 1rem);
  display: flex;
  justify-content: space-between;
  align-items: stretch; /* 让左右两侧高度一致 */
  margin: 0.5rem auto;

  .left-content,
  .right-content {
    display: flex;
    flex-direction: column;
  }

  .left-content {
    width: 54%;
    margin: 0.4rem;

    .left-box {
      width: 100%;
      margin: 0.5rem 0;

      /* Card 内部布局 */
      .firstBoxCard {
        display: flex;
        justify-content: space-between;
        align-items: stretch;
        flex: 1;
        margin: 0.5rem auto;
        padding-bottom: 0.4rem;

        .firstBoxCardItem {
          text-align: center;
          flex: 1;
          h4 {
            font-weight: normal;
            font-size: 16px;
          }
        }
      }

      .todo-list {
        width: 100vw;
        max-width: 100%;
        display: flex;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        -webkit-touch-callout: none;
        caret-color: transparent !important;

        .todo-item {
          flex: 0 0 12rem;
          height: 6rem;
          background-color: #eeeeee;
          margin: 0.2rem;
          padding: 0.2rem;

          h3 {
            color: #999;
          }
          h2 {
            color: #1890ff;
          }

          h5 {
            font-size: 14px;
            color: #999;
          }

          h4 {
            display: flex;
            color: #999;
            p {
              margin-right: 0.6rem;
            }
          }
        }

        &::-webkit-scrollbar {
          height: 6px;
          background-color: transparent;
        }
        &::-webkit-scrollbar-thumb {
          background-color: #bfbfbf;
          border-radius: 40px;
        }
      }
    }

    .left-box:last-child {
      width: 100%;
      height: 200px;
      margin: 0.5rem 0;
      display: flex;
      justify-content: space-between;

      .left-box-left {
        width: 49%;
        height: 100%;
        ul {
          li {
            display: flex;
            justify-content: space-between;
            height: 2rem;
            p:last-child {
              color: gray;
            }
          }
        }
      }
      .left-box-right {
        width: 49%;
        height: 100%;
      }
    }
  }

  .right-content {
    width: 46%;
    margin: 0.4rem;
    display: flex;
    flex-direction: column;

    .right-box1,
    .right-box2 {
      width: 100%;
      margin: 0.5rem 0;
      display: flex;
      flex-direction: column;
    }

    .right-box1 {
      .right-alarm-list {
        ul {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          padding: 0;
          margin: 0;
          li {
            width: 12rem;
            height: 2rem;
            display: flex;
            align-items: center;
            margin-bottom: 0.5rem;
            p {
              margin-left: 0.5rem;
            }
          }
        }
      }
    }

    .right-box2 {
      /* 为事件卡添加固定高度和滚动条 */
      .event-card {
        height: 800px;
        overflow-y: auto;
      }
      /* 事件列表整体样式 */
      .event-list {
        margin-top: 1rem;

        .event-section {
          margin-bottom: 1rem;

          /* 小标题 + 更多链接 + 状态 */
          .event-header {
            display: flex;
            align-items: center;
            margin-bottom: 0.5rem;

            .section-title {
              font-weight: 600;
            }
            .section-more {
              margin-left: 1rem;
              color: #1890ff;
            }
            .event-status {
              margin-left: 1rem;
              color: #fa541c;
            }
          }

          /* 列表部分 */
          ul {
            list-style: none;
            padding: 0;
            margin: 0;

            li {
              display: flex;
              align-items: center;
              margin-bottom: 0.5rem;

              /* 红色圆点 */
              .dot {
                display: inline-block;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background-color: #f5222d;
                margin-right: 0.5rem;
              }

              /* 事件描述 */
              .event-desc {
                flex: 1;
                color: #333;
              }

              /* 时间显示 */
              .event-time {
                color: #999;
                margin-left: 1rem;
              }
            }
          }
        }
      }
    }
  }
}

/* 响应式媒体查询 */
@media (max-width: 768px) {
  .content-box {
    flex-direction: column;
  }
  .left-content,
  .right-content {
    width: 100%;
  }
}
</style>
