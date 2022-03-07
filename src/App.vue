<script setup lang="ts">
import {
  NConfigProvider,
  GlobalThemeOverrides,
  NDialogProvider,
  NMessageProvider,
  darkTheme,
  useOsTheme,
} from 'naive-ui'
import { BuiltInGlobalTheme } from 'naive-ui/lib/themes/interface'
import { computed, ref } from 'vue'

const darkThemeOverrides: GlobalThemeOverrides = {
  common: {
    bodyColor: '#1f2223',
  },
  Layout: {
    headerColor: '#1f2223',
  },
}
</script>

<template>
  <n-config-provider
    :theme="darkTheme"
    :theme-overrides="darkThemeOverrides"
  >
    <n-message-provider
      ><n-dialog-provider
        ><div id="nftapp"><router-view /></div></n-dialog-provider
    ></n-message-provider>
  </n-config-provider>
  <vdapp-board />
</template>

<style>
:root {
    --color-text: rgba(255, 255, 255, 0.6);
    --color-text-emphasize: #eeeeee;
    --color-text-lighter: rgba(255, 255, 255, 0.4);
    --color-text-solight: rgba(255, 255, 255, 0.16);
    --color-card-background: #181818;
    --color-background: #1f2223;
    --color-hint: #202020;
    --color-background-inner: rgba(hexToRGB(#1f2223), 0.8);
    --color-decoration: rgba(255, 255, 255, 0.04);
    --color-decoration-darker: rgba(255, 255, 255, 0.08);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: var(--color-background);
  display: block;
  box-sizing: border-box;
  justify-content: center;
  height: 100vh;
}

#nftapp {
  background-color: var(--color-background);
  height: 100vh;
}
</style>
