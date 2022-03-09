import { defineConfig } from '@vue/cli-service'
export default defineConfig({
  pluginOptions: {
    i18n: {
      locale: 'y',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableLegacy: false,
      runtimeOnly: false,
      compositionOnly: false,
      fullInstall: true,
    },
  },
})
