<script setup lang="ts"></script>

<template>
  <router-view />
</template>

<style>
:root {
  --color-text: #515151;
  --color-text-emphasize: #333333;
  --color-text-lighter: rgba(0, 0, 0, 0.4);
  --color-text-solight: rgba(0, 0, 0, 0.16);
  --color-background: #ffffff;
  --color-hint: #fcfcfc;
  --color-background-inner: rgba(255, 255, 255, 0.8);
  --color-decoration: rgba(0, 0, 0, 0.04);
  --color-decoration-darker: rgba(0, 0, 0, 0.08);
}

@media screen and (prefers-color-scheme: dark) {
  :root {
    --color-text: rgba(255, 255, 255, 0.6);
    --color-text-emphasize: #eeeeee;
    --color-text-lighter: rgba(255, 255, 255, 0.4);
    --color-text-solight: rgba(255, 255, 255, 0.16);
    --color-background: #222222;
    --color-hint: #202020;
    --color-background-inner: rgba(hexToRGB(#222222), 0.8);
    --color-decoration: rgba(255, 255, 255, 0.04);
    --color-decoration-darker: rgba(255, 255, 255, 0.08);
  }
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: block;
  box-sizing: border-box;
  justify-content: center;
}
</style>
