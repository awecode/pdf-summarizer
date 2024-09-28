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
    cfWorkerAiModel: '@cf/meta/llama-3.1-70b-instruct',
    maxContextLength: 112000,
    systemPrompt:
      'You are a helpful assistant that summarizes a text. Respond with the summary in around 100 words only and nothing else.',
  },
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css',
        },
      ],
    },
  },
})
