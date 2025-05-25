import { defineNuxtPlugin } from '#app'
import { Home, Settings, User } from 'lucide-vue-next'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('IconHome', Home)
  nuxtApp.vueApp.component('IconSettings', Settings)
  nuxtApp.vueApp.component('IconUser', User)
  // 添加更多您需要的圖標
})