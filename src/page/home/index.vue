<template>
  <n-layout>
    <n-layout-header style="display: flex">
      <div id="title-left">CastableNFT</div>
      <div>
        <n-dropdown
          trigger="hover"
          :options="language"
          @select="languageSelect"
        >
          <n-tag checkable>{{ $t('language') }}</n-tag>
        </n-dropdown>
      </div>
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
import i18n from '@/i18n'
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
  NDropdown,
  NTag,
} from 'naive-ui'

// import { useBoard, useEthers } from 'vue-dapp'

export default defineComponent({
  name: 'home-page',
  components: {
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
    NDropdown,
    NTag,
  },
  setup() {
    // const { open } = useBoard()
    // const { address } = useEthers()

    return {
      value: ref(null),
      bulk: ref(false),
      language: [
        {
          label: '简体中文',
          key: 'zh-CN',
        },
        {
          label: 'English',
          key: 'en',
        },
      ],
      // 更改语言
      languageSelect(key: string) {
        i18n.global.locale = key
      },
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
.n-layout-header,
.n-layout-footer {
  /* background: rgba(128, 128, 128, 0.2); */
  padding: 24px;
}
/* 
.n-layout-sider {
  background: rgba(128, 128, 128, 0.3);
}

.n-layout-content {
  background: rgba(128, 128, 128, 0.4);
} */
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

#title-left {
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-text);
  left: 1vw;
  top: 1vh;
}
</style>
