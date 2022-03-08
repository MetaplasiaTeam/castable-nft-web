<template>
  <VuePdf v-for="page in numOfPages" :key="page" :src="pdfSrc" :page="page" />
</template>

<script setup lang="ts">
import { onMounted, ref } from '@vue/runtime-dom'
import { VuePdf, createLoadingTask } from 'vue3-pdfjs'
import { VuePdfPropsType } from 'vue3-pdfjs/components/vue-pdf/vue-pdf-props'
import pdf from '../../assets/CastableNFT-Introduction.pdf'
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api'

let pdfSrc = ref<VuePdfPropsType['src']>(pdf)
let numOfPages = ref(0)

onMounted(() => {
  // @ts-ignore
  const loadingTask = createLoadingTask(pdfSrc.value)
  loadingTask.promise.then((pdf: PDFDocumentProxy) => {
    numOfPages.value = pdf.numPages
  })
})
</script>
