export default defineEventHandler(async (event) => {
  const formData = await readFormData(event)
  const pdfFile = formData.get('pdf')

  if (!pdfFile || !(pdfFile instanceof File)) {
    throw createError({
      statusCode: 400,
      message: 'No PDF file uploaded',
    })
  }

  const text = await pdfToText(pdfFile)

  const parsedText = text.slice(0, 112000)

  const response = await workerAi('@cf/meta/llama-3.1-70b-instruct', {
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful assistant that summarizes a text. Respond with the summary in around 100 words only and nothing else.',
      },
      {
        role: 'user',
        content: parsedText,
      },
    ],
  })

  return {
    response,
    text: parsedText,
  }
})
