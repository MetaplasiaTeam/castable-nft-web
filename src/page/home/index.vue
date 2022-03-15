<script setup lang="ts">
import TopBar from '@/components/top-bar/topbar.vue'
import { MintCard } from '@/components'
import { NLayout, NLayoutHeader, NLayoutContent } from 'naive-ui'
import { onMounted, ref } from 'vue'

let show = ref(false)

onMounted(() => {
  setTimeout(function () {
    show.value = true
  }, 500)
})
</script>

<template>
  <n-layout>
    <n-layout-header>
      <top-bar ref="connect" />
    </n-layout-header>
    <n-layout-content
      class="animate__animated animate__zoomInDown"
      id="mint-app"
    >
      <mint-card />
    </n-layout-content>
  </n-layout>
</template>

<style>
.n-upload-trigger {
  width: 100%;
}
</style>

<style scoped>
#mint-app {
  padding-left: 15vw;
  padding-right: 15vw;
}

@media (max-width: 768px) {
  #mint-app {
    padding-left: 5vw;
    padding-right: 5vw;
  }
}
</style>
