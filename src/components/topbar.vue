<template>
  <div style="display: flex; padding: 24px; justify-content: space-between">
    <router-link to="/"
      ><n-tag id="title-left" checkable>CastableNFT</n-tag>
    </router-link>
    <div>
      <router-link to="/profile"
        ><n-tag checkable>{{ $t('profile') }}</n-tag></router-link
      >
      <n-dropdown trigger="hover" :options="language" @select="languageSelect">
        <n-tag checkable>{{ $t('language') }}</n-tag>
      </n-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-dom'
import i18n from '@/i18n'
import { NDropdown, NTag } from 'naive-ui'

export default defineComponent({
  components: {
    NDropdown,
    NTag,
  },
  setup() {
    return {
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
    }
  },
})
</script>

<style scoped>
#title-left {
  font-size: 2rem;
  font-weight: bold;
  left: 1vw;
  top: 1vh;
}
</style>
