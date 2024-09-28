interface CloudflareAIResponse {
  result: Record<string, any> | null
  success: boolean
  errors: Record<string, any>[]
  messages: string[]
}

export const workerAi = async (
  model: string,
  params: Record<string, string | number>
): Promise<CloudflareAIResponse> => {
  // @ts-expect-error globalThis.__env__ is not defined
  const aiBinding = process.env.AI || globalThis.__env__?.AI || globalThis.AI

  if (aiBinding) {
    try {
      const result = await aiBinding.run(model, params) as Record<string, any>
      return {
        result: result,
        success: true,
        errors: [],
        messages: [],
      }
    } catch (error) {
      const errors = []
      if (error instanceof Error) {
        errors.push({ message: error.message, name: error.name })
      }
      const response = {
        result: null,
        success: false,
        errors: errors,
        messages: ['Error running Cloudflare AI model'],
      }
      return response
    }
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
        body: JSON.stringify(params),
      }
    )
    return await response.json()
  }
}
