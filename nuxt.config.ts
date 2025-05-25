// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false, // 可開可關，GitHub Pages 建議使用 ssr: false
  app: {
    baseURL: '/scoreboard-nuxt/', // 替換為你的倉庫名稱
    buildAssetsDir: '/_assets/',
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss']
})