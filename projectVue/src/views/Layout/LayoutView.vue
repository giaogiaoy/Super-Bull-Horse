<script setup lang="ts">
import { reactive, ref } from 'vue'
const state = reactive({
  count: 0,
})

const count = ref(0)
</script>

<template>
  <div>
    <p>raest,{{ state.count }}{{ count }}</p>
  </div>
</template>

<style scoped></style>
