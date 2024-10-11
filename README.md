# PDF Summarizer

PDF Summarizer allows users to upload PDF files and generate summaries using AI models.

You can deploy it with zero configuration on your Cloudflare account using NuxtHub:

[![Deploy to NuxtHub](https://hub.nuxt.com/button.svg)](https://hub.nuxt.com/new?repo=awecode/pdf-summarizer)

## Demo

[https://pdf-summarizer-ckg.pages.dev/](https://pdf-summarizer-ckg.pages.dev/)

## Features

- Upload PDF files
- Generate summaries using AI models
- Configurable AI model selection


## Setup

```
git clone git@github.com:awecode/pdf-summarizer.git
cd pdf-summarizer
pnpm install
pnpm dev
```

## Configuration

Create a `.env` file in the root directory with the following configuration:

| Variable | Description | Default Value |
|----------|-------------|---------------|
| NUXT_PUBLIC_CF_WORKER_AI_MODEL | AI model to be used for summarization | '@cf/meta/llama-3.1-70b-instruct' |
| NUXT_PUBLIC_MAX_CONTEXT_LENGTH | Maximum context length for the AI model | 112000 |
| NUXT_SYSTEM_PROMPT | System prompt for the AI model | 'You are a helpful assistant that summarizes a text. Respond with the summary in around 100 words only and nothing else.' |
| NUXT_CF_ACCOUNT_ID | Cloudflare account ID | '' |
| NUXT_CF_API_TOKEN | Cloudflare API token | '' |


Notes:
- NUXT_CF_ACCOUNT_ID and NUXT_CF_API_TOKEN are required only when AI binding is not available. When deploying through NuxtHub or in a Cloudflare environment, you can utilize bindings instead of these tokens. Bindings are automatically set up when deploying via NuxtHub.
- The summary may be empty if the uploaded file exceeds the model's input length. If the summary is empty, reduce the input context length from settings and try again.

## Technology Credits

- [Nuxt 3](https://nuxt.com/)
- [Vue.js](https://vuejs.org/)
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)
- [Unpdf](https://github.com/unjs/unpdf)
- [PicoCSS](https://picocss.com/)
