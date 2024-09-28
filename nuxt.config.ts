// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', 'nitro-cloudflare-dev'],
  eslint: {
    config: {
      stylistic: true,
    },
  },
  runtimeConfig: {
    cfAccountId: '',
    cfApiToken: '',
  },
})
