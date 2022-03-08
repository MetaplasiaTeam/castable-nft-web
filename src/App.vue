<script setup lang="ts">
import {
  NConfigProvider,
  GlobalThemeOverrides,
  NDialogProvider,
  NMessageProvider,
} from 'naive-ui'

const themeOverrides: GlobalThemeOverrides = {
  common: {
    bodyColor: '#f2f2f2',
  },
  Layout: {
    headerColor: '#f2f2f2',
    footerColor: '#f2f2f2',
  },
}

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
  <n-config-provider :theme="null" :theme-overrides="themeOverrides">
    <n-message-provider
      ><n-dialog-provider
        ><div id="nftapp"><router-view /></div></n-dialog-provider
    ></n-message-provider>
  </n-config-provider>
  <vdapp-board />
</template>

<style>
:root {
  --color-background: #f2f2f2;
  --color-card-background: #ffffff;
  --color-text: #515151;
  --color-text-emphasize: #333333;
  --color-text-lighter: rgba(0, 0, 0, 0.4);
  --color-text-solight: rgba(0, 0, 0, 0.16);
  --color-hint: #fcfcfc;
  --color-background-inner: rgba(255, 255, 255, 0.8);
  --color-decoration: rgba(0, 0, 0, 0.04);
  --color-decoration-darker: rgba(0, 0, 0, 0.08);
}
/* @media screen and (prefers-color-scheme: dark) {
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
} */

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
