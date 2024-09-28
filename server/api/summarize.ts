export default defineEventHandler(async (event) => {
  const text = await summarize('./sample.pdf')

  console.log(text.slice(0, 100))
  const config = useRuntimeConfig()
  const cfAccountId = config.cfAccountId
  const cfApiToken = config.cfApiToken

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/ai/run/@cf/facebook/bart-large-cnn`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cfApiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input_text: text,
        max_length: 1024,
      }),
    }
  )

  const result = await response.json()
  return {
    result: result,
    text: text,
  }
})
