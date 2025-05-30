// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  app: {
    baseURL: '/scoreboard-nuxt/', // 確保與倉庫名稱一致
  },
  // nitro: {
  //   output: {
  //     dir: 'dist', // 明確指定輸出目錄
  //   },
  // },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
});