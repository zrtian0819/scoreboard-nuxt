import withNuxt from './.nuxt/eslint.config.mjs'

export default [
  ...(await withNuxt()),
  {
    rules: {
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always', // ✅ 允許 `<br/>` 這種自閉合標籤
            normal: 'always',
            component: 'always',
          },
          svg: 'always',
          math: 'always',
        },
      ],
    },
  },
]
