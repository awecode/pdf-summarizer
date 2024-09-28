interface CloudflareAIResponse {
  result: Record<string, any>
  success: boolean
  errors: string[]
  messages: string[]
}

export const workerAi = async (
  model: string,
  body: Record<string, string | number>
): Promise<CloudflareAIResponse> => {
  // @ts-expect-error globalThis.__env__ is not defined
  const aiBinding = process.env.AI || globalThis.__env__?.AI || globalThis.AI

  if (aiBinding) {
    const result = await aiBinding.run(model, body)
    return result
  } else {
    const config = useRuntimeConfig()
    const cfAccountId = config.cfAccountId
    const cfApiToken = config.cfApiToken

    if (!cfAccountId || !cfApiToken) {
      throw new Error(
        'Neither the Cloudflare AI binding nor the Cloudflare API credentials were found. Please set the NUXT_CF_ACCOUNT_ID and NUXT_CF_API_TOKEN environment variables.'
      )
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/ai/run/${model}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cfApiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    )
    return await response.json()
  }
}
