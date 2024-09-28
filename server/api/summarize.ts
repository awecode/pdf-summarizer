export default defineEventHandler(async (event) => {
  const text = await summarize('./sample.pdf')

//   const parsedText = text
  const parsedText = text.slice(0, 112000)
  //   const parsedText = text.slice(0, 131072)


  const response = await workerAi('@cf/meta/llama-3.1-70b-instruct', {
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful assistant that summarizes a text. Respond with the summary in around 100 words only and nothing else.',
      },
      {
        role: 'user',
        content: parsedText
      },
    ],
  })

  return {
    response,
    text: parsedText,
  }
})
