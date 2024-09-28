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
  const config = useRuntimeConfig()
  const cfAccountId = config.cfAccountId
  const cfApiToken = config.cfApiToken

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
