<template>
  <div class="wrap">
    <div class="bar" :style="{ width: percent + '%' }"></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ percent: number }>();
</script>

<style scoped>
.wrap {
  height: 10px;
  border-radius: 999px;
  background: rgba(255,255,255,.08);
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.15);
}
.bar {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #5dd6ff, #9bffb3);
  transition: width .3s ease;
}
</style>
