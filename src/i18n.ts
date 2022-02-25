import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-cn.json'
import en from './locales/en.json'

let i18n = createI18n({
  locale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    en: en,
  },
})

export default i18n
