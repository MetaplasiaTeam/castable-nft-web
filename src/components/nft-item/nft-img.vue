<script setup lang="ts">
import { Api } from '@/common/net'

let prop = defineProps({
  imageUrl: String,
})
// Api.getIpfsImgRace(prop.imageUrl!)
</script>

<template>
  <div>
    <img :src="imageUrl" />
  </div>
</template>

<style scoped>
div {
  display: table-cell;
  width: 275px;
  height: 275px;
  vertical-align: middle;
  border-radius: 25px;
}

img {
  max-width: 100%;
  max-height: 100%;
  display: block;
  margin: auto;
}
</style>
