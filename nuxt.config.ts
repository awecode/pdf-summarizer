export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', 'nitro-cloudflare-dev', '@nuxthub/core'],
  hub: {
    ai: true
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  runtimeConfig: {
    cfAccountId: '',
    cfApiToken: '',
    public: {
      cfWorkerAiModel: '@cf/meta/llama-3.1-70b-instruct',
      maxContextLength: 112000,
    },
    systemPrompt:
      'You are a helpful assistant that summarizes a text. Respond with the summary in around 100 words only and nothing else.',
  },
  app: {
    head: {
      title: 'AI Text Summarizer',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content:
            'An AI-powered text summarization tool using Cloudflare Workers AI',
        },
        { name: 'format-detection', content: 'telephone=no' },
        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'AI Text Summarizer' },
        {
          property: 'og:description',
          content:
            'An AI-powered text summarization tool using Cloudflare Workers AI',
        },
        { property: 'og:image', content: '/pdf-summarizer.png' },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'AI Text Summarizer' },
        {
          name: 'twitter:description',
          content:
            'An AI-powered text summarization tool using Cloudflare Workers AI',
        },
        { name: 'twitter:image', content: '/pdf-summarizer.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css',
        },
      ],
    },
  },
})