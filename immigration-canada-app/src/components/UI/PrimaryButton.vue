<template>
  <button class="btn-primary" :type="type"><slot /></button>
</template>
<script setup lang="ts">
defineProps<{ type?: 'button'|'submit' }>();
</script>
