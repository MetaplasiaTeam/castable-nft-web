<script setup lang="ts">
import {
  NConfigProvider,
  GlobalThemeOverrides,
  NDialogProvider,
  NMessageProvider,
  useOsTheme,
  darkTheme,
} from 'naive-ui'
import { computed } from 'vue'
const osThemeRef = useOsTheme()
const theme = computed(() => (osThemeRef.value === 'dark' ? darkTheme : null))
const themeOverrides: GlobalThemeOverrides = {
  common: {
    bodyColor: '#19191a',
  },
  Layout: {
    headerColor: '#19191a',
    footerColor: '#19191a',
  },
  Popover: {
    color: '#19191a',
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
  <keep-alive>
    <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
      <n-message-provider
        ><n-dialog-provider
          ><div id="nftapp">
            <router-view v-slot="{ Component }">
              <keep-alive>
                <component v-if="$route.meta.keepAlive" :is="Component" />
              </keep-alive>
            </router-view>
            <router-view
              v-if="!$route.meta.keepAlive"
            ></router-view></div></n-dialog-provider
      ></n-message-provider>
    </n-config-provider>
  </keep-alive>
  <vdapp-board />
</template>

<style lang="scss">
:root {
  --color-background: #19191a;
  --color-card-background: #ffffff;
  --color-card-hover: #f5f5f5;
  --color-text: #515151;
  --color-text-emphasize: #333333;
  --color-text-lighter: rgba(0, 0, 0, 0.4);
  --color-text-solight: rgba(0, 0, 0, 0.16);
  --color-hint: #fcfcfc;
  --color-background-inner: rgba(255, 255, 255, 0.8);
  --color-decoration: rgba(0, 0, 0, 0.04);
  --color-decoration-darker: rgba(0, 0, 0, 0.08);
}

@media screen and (prefers-color-scheme: dark) {
  :root {
    --color-text: rgba(255, 255, 255, 0.8);
    --color-text-emphasize: #eeeeee;
    --color-text-lighter: rgba(255, 255, 255, 0.4);
    --color-text-solight: rgba(255, 255, 255, 0.16);
    --color-card-background: #303030;
    --color-card-hover: #404040;
    --color-background: #19191a;
    --color-hint: #202020;
    --color-background-inner: rgba(hexToRGB(#19191a), 0.8);
    --color-decoration: rgba(255, 255, 255, 0.04);
    --color-decoration-darker: rgba(255, 255, 255, 0.08);
  }
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

.cancle {
  width: 40%;
  margin-right: 16px;
  color: var(--color-text);
  &:hover {
    color: var(--color-text-emphasize);
  }
}

.confirm {
  width: 60%;
}

* {
  margin: 0;
  padding: 0;
}
</style>
