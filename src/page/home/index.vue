<template>
  <n-layout>
    <n-layout-header>
      <top-bar />
    </n-layout-header>
    <n-layout-content
      content-style="padding-left: 20vw; padding-right: 20vw; padding-bottom: 5vh"
    >
      <n-space vertical>
        <n-space justify="center" :style="{ alignItems: 'flex-end' }">
          <a style="font-size: 2rem; font-weight: bold">{{
            $t('home.title')
          }}</a>
          <a>{{ $t('home.subtitle') }}</a>
        </n-space>
        <div style="display: flex; flex-direction: row; align-items: center">
          <n-input
            v-model:value="value"
            type="text"
            :placeholder="$t('home.input.placeholder')"
            autosize
            style="width: 100%; margin-right: 0"
          />
          <a :style="{ 'font-weight': 'bold' }">#</a>
          <a style="white-space: nowrap">{{ $t('home.token_id') }}</a>
        </div>
        <n-upload>
          <n-upload-dragger>
            <div style="width: 100%; margin-right: 0">
              {{ $t('home.upload') }}
            </div>
          </n-upload-dragger>
        </n-upload>
        <div style="display: flex; flex-direction: row">
          <n-input
            v-model:value="value"
            type="text"
            :placeholder="$t('home.input.placeholder_2')"
            style="width: 100%; margin-right: 0"
          ></n-input>
          <n-image width="25" height="25" preview-disabled src="@/eth.png" />
        </div>
        <!-- <n-button @click="open"> 测试 </n-button>
        {{ address }}
        <vdapp-board /> -->
        <n-collapse arrow-placement="right">
          <n-collapse-item :title="$t('home.advance_option')">
            <div style="display: flex; flex-direction: column">
              <n-checkbox
                v-model:checked="bulk"
                :style="{ 'margin-bottom': '16px' }"
                >{{ $t('home.batch_mint') }}</n-checkbox
              >
              <n-input-number
                :disabled="!bulk"
                :placeholder="$t('home.input.placeholder_3')"
              />
            </div>
          </n-collapse-item>
        </n-collapse>
        <n-button type="primary" :style="{ width: '100%' }">
          {{ $t('home.mint_now') }}
        </n-button>
      </n-space>
    </n-layout-content>
  </n-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/runtime-dom'
import TopBar from '@/components/topbar.vue'
import {
  NInput,
  NSpace,
  NUpload,
  NUploadDragger,
  NImage,
  NButton,
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NCollapse,
  NCollapseItem,
  NCheckbox,
  NInputNumber,
} from 'naive-ui'

// import { useBoard, useEthers } from 'vue-dapp'

export default defineComponent({
  name: 'home-page',
  components: {
    TopBar,
    NInput,
    NSpace,
    NUpload,
    NUploadDragger,
    NImage,
    NButton,
    NLayout,
    NLayoutHeader,
    NLayoutContent,
    NCollapse,
    NCollapseItem,
    NCheckbox,
    NInputNumber,
  },
  setup() {
    // const { open } = useBoard()
    // const { address } = useEthers()

    return {
      value: ref(null),
      bulk: ref(false),

      // address,
      // open,
    }
  },
})
</script>

<style>
.n-upload-trigger {
  width: 100%;
}
</style>

<style scoped>
#search-app {
  margin-top: 20vh;
  display: block;
  padding-left: 20vw;
  padding-right: 20vw;
}

@media screen and (max-width: 768px) {
  #search-app {
    padding-left: 5vw;
    padding-right: 5vw;
  }
}
</style>
