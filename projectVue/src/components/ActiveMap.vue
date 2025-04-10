<script setup lang="ts">
import AMapLoader from '@amap/amap-jsapi-loader'
import { reactive, ref, shallowRef, onMounted } from 'vue'


const keyword = ref('')
// 存储搜索用的数据
const form: any = reactive({
  address: '',
})

const emit = defineEmits(['update:modelValue'])
let map = shallowRef(null)
let placeSearch = shallowRef(null)

const handleSearch = (e: Event) => {
  // 阻止默认行为
  e.preventDefault()
  if (keyword.value && placeSearch.value) {
    (placeSearch.value as any).search(keyword.value, (status: string, result: any) => {
      if (status === 'complete' && result.info === 'OK') {
        const poi = result.poiList.pois[0]
        // 检查 map.value 是否存在再调用 clearMap
        if (map.value) {
          ;(map.value as any).clearMap()
        }

        new (window as any).AMap.Marker({
          map: map.value,
          position: poi.location,
        })

        if (map.value) {
          ;(map.value as any).setZoomAndCenter(15, poi.location)
        }
        // 更新地址并发送到父组件
        form.address = poi.address + poi.name
        emit('update:modelValue', form.address)
      }
    })
  }
}

const initMap = () => {
  AMapLoader.load({
    key: '68f12dc9d996c7483251c6f9a17cd538',
    version: '1.4.4',
    plugins: ['AMap.PlaceSearch', 'AMap.AutoComplete', 'AMap.Geocoder'],
  })
    .then((AMap) => {
      map.value = new AMap.Map('container', {
        resizeEnable: true,
        zoom: 9.5,
        center: [117.2, 31.8],
      })

     // 使用 plugin 方法加载插件
     AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Geocoder'], () => {
        const autoComplete = new AMap.Autocomplete({
          input: 'keyword',
        })

        placeSearch.value = new AMap.PlaceSearch({
          map: map.value,
          pageSize: 1,
        })

        // 监听回车事件
        document.getElementById('keyword')?.addEventListener('keyup', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            handleSearch(e)
          }
        })
      })
    })
    .catch((e) => {
      console.error('地图加载失败:', e)
    })
}

onMounted(() => {
  initMap()
})
console.log(keyword)
</script>

<script lang="ts">
// 添加默认导出
export default {
  name: 'ActiveMap',
}
</script>

<template>
  <div class="activemapView">
    <div class="box">
      <div id="container" style="width: 80%; height: 300px; position: relative">
        <input
          v-model="keyword"
          class="keyword"
          id="keyword"
          placeholder="请输入搜索位置"
          style="position: absolute; z-index: 99; top: 10px; left: 10px; width: 200px; padding: 5px"
        />
        <!-- 移除了handleSearch方法的引用,因为它在setup作用域内定义 -->
        <button
          type="button"
          class="el-button el-button--primary"
          style="position: absolute; z-index: 99; top: 8px; left: 225px; padding:0px 15px"
          @click="handleSearch"
        >
          搜索
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

.activemapView {
  width: 100%;
}
</style>
