<script setup lang="ts">
import { reactive, ref } from 'vue'

</script>

<template>
  <div class="layoutmain">

    <RouterView />
  </div>

</template>

<style scoped>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.layoutmain{
  padding:100px  0 0 300px;
  background: #f0f3f8;
  height: 100vh;
}
</style>
