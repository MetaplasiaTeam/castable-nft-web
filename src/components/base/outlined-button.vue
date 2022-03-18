<script setup lang="ts">
import { NButton } from 'naive-ui'
defineProps({
  text: String,
})
</script>

<template>
  <n-button class="outlined" color="#E1E4E6" ghost text-color="#000" round>{{
    text
  }}</n-button>
</template>

<style lang="scss">
.outlined {
  width: 40%;
  margin-right: 16px;
}
</style>
