<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <div style="width: 100%;display: flex;justify-content: space-around;height: 100%;line-height: 100%;">

        </div>
      </el-header>
      <el-container>
        <el-aside width="15%">
          <div>
            <el-row class="tac">
              <el-col :span="23">
                <el-menu default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
                  <el-sub-menu index="1">
                    <template #title>
                      <el-icon>
                        <location />
                      </el-icon>
                      <span>首页</span>
                    </template>
                    <el-menu-item v-for="(item, index) in arr1" :key="index" :index="`1-${index}`">
                      <router-link :to="item.url">{{ item.name }}</router-link>
                    </el-menu-item>
                  </el-sub-menu>
                  <el-sub-menu index="2">
                    <template #title>
                      <el-icon>
                        <setting />
                      </el-icon>
                      <span>智慧社区</span>
                    </template>
                    <el-menu-item v-for="(item, index) in arr2" :key="index" :index="`2-${index}`">
                      <router-link :to="item.url">{{ item.name }}</router-link>
                    </el-menu-item>
                  </el-sub-menu>
                  <el-sub-menu index="3">
                    <template #title>
                      <el-icon>
                        <setting />
                      </el-icon>
                      <span>智慧社区</span>
                    </template>
                    <el-menu-item v-for="(item, index) in arr3" :key="index" :index="`3-${index}`">
                      <router-link :to="item.url">{{ item.name }}</router-link>
                    </el-menu-item>
                  </el-sub-menu>
                  <el-sub-menu index="4">
                    <template #title>
                      <el-icon>
                        <setting />
                      </el-icon>
                      <span>智慧社区</span>
                    </template>
                    <el-menu-item v-for="(item, index) in arr4" :key="index" :index="`4-${index}`">
                      <router-link :to="item.url">{{ item.name }}</router-link>
                    </el-menu-item>
                  </el-sub-menu>
                  <el-sub-menu index="5">
                    <template #title>
                      <el-icon>
                        <setting />
                      </el-icon>
                      <span>智慧社区</span>
                    </template>
                    <el-menu-item v-for="(item, index) in arr5" :key="index" :index="`5-${index}`">
                      <router-link :to="item.url">{{ item.name }}</router-link>
                    </el-menu-item>
                  </el-sub-menu>
                  <el-sub-menu index="6">
                    <template #title>
                      <el-icon>
                        <setting />
                      </el-icon>
                      <span>智慧社区</span>
                    </template>
                    <el-menu-item v-for="(item, index) in arr6" :key="index" :index="`6-${index}`">
                      <router-link :to="item.url">{{ item.name }}</router-link>
                    </el-menu-item>
                  </el-sub-menu>
                  <el-sub-menu index="7">
                    <template #title>
                      <el-icon>
                        <setting />
                      </el-icon>
                      <span>智慧社区</span>
                    </template>
                    <el-menu-item v-for="(item, index) in arr7" :key="index" :index="`7-${index}`">
                      <router-link :to="item.url">{{ item.name }}</router-link>
                    </el-menu-item>
                  </el-sub-menu>
                  <el-sub-menu index="8">
                    <template #title>
                      <el-icon>
                        <setting />
                      </el-icon>
                      <span>智慧社区</span>
                    </template>
                    <el-menu-item v-for="(item, index) in arr8" :key="index" :index="`8-${index}`">
                      <router-link :to="item.url">{{ item.name }}</router-link>
                    </el-menu-item>
                  </el-sub-menu>
                  <el-sub-menu index="9">
                    <template #title>
                      <el-icon>
                        <setting />
                      </el-icon>
                      <span>智慧社区</span>
                    </template>
                    <el-menu-item v-for="(item, index) in arr9" :key="index" :index="`9-${index}`">
                      <router-link :to="item.url">{{ item.name }}</router-link>
                    </el-menu-item>
                  </el-sub-menu>
                  <el-sub-menu index="10">
                    <template #title>
                      <el-icon>
                        <setting />
                      </el-icon>
                      <span>智慧社区</span>
                    </template>
                    <el-menu-item v-for="(item, index) in arr10" :key="index" :index="`10-${index}`">
                      <router-link :to="item.url">{{ item.name }}</router-link>
                    </el-menu-item>
                  </el-sub-menu>
                  <el-sub-menu index="11">
                    <template #title>
                      <el-icon>
                        <setting />
                      </el-icon>
                      <span>智慧社区</span>
                    </template>
                    <el-menu-item v-for="(item, index) in arr11" :key="index" :index="`11-${index}`">
                      <router-link :to="item.url">{{ item.name }}</router-link>
                    </el-menu-item>
                  </el-sub-menu>
                  <el-sub-menu index="12">
                    <template #title>
                      <el-icon>
                        <setting />
                      </el-icon>
                      <span>智慧社区</span>
                    </template>
                    <el-menu-item v-for="(item, index) in arr12" :key="index" :index="`12-${index}`">
                      <router-link :to="item.url">{{ item.name }}</router-link>
                    </el-menu-item>
                  </el-sub-menu>
                  <el-sub-menu index="13">
                    <template #title>
                      <el-icon>
                        <setting />
                      </el-icon>
                      <span>智慧社区</span>
                    </template>
                    <el-menu-item v-for="(item, index) in arr13" :key="index" :index="`13-${index}`">
                      <router-link :to="item.url">{{ item.name }}</router-link>
                    </el-menu-item>
                  </el-sub-menu>
                  <el-sub-menu index="14">
                    <template #title>
                      <el-icon>
                        <setting />
                      </el-icon>
                      <span>智慧社区</span>
                    </template>
                    <el-menu-item v-for="(item, index) in arr14" :key="index" :index="`14-${index}`">
                      <router-link :to="item.url">{{ item.name }}</router-link>
                    </el-menu-item>
                  </el-sub-menu>
                </el-menu>
              </el-col>
            </el-row>
          </div>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>


<script lang="ts" setup>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'
import axios from '@/instance/axios'
let arr: any = []
let names = ""

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
let arr1 = []
let arr2 = []
let arr3 = []
let arr4 = []
let arr5 = []
let arr6 = []
let arr7 = []
let arr8 = []
let arr9 = []
let arr10 = []
let arr11 = []
let arr12 = []
let arr13 = []
let arr14 = []
function getUser() {
  axios.get('/userinfo').then(res => {
    console.log(res.data.arr);
    arr = res.data.arr
    names = res.data.data.name
    arr1 = [...res.data.arr].filter(item => item.level == 1)
    arr2 = [...res.data.arr].filter(item => item.level == 2)
    arr3 = [...res.data.arr].filter(item => item.level == 3)
    arr4 = [...res.data.arr].filter(item => item.level == 4)
    arr5 = [...res.data.arr].filter(item => item.level == 5)
    arr6 = [...res.data.arr].filter(item => item.level == 6)
    arr7 = [...res.data.arr].filter(item => item.level == 7)
    arr8 = [...res.data.arr].filter(item => item.level == 8)
    arr9 = [...res.data.arr].filter(item => item.level == 9)
    arr10 = [...res.data.arr].filter(item => item.level == 10)
    arr11 = [...res.data.arr].filter(item => item.level == 11)
    arr12 = [...res.data.arr].filter(item => item.level == 12)
    arr13 = [...res.data.arr].filter(item => item.level == 13)
    arr14 = [...res.data.arr].filter(item => item.level == 14)


  })
}
getUser()
</script>
<style scoped>
.tac,
.el-menu-vertical-demo {
  width: 100%;
}

a {
  color: #000;
}

.router-link-active {
  color: #409eff;
}
</style>
