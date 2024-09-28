export default defineEventHandler(async (event) => {
  const formData = await readFormData(event)
  const pdfFile = formData.get('pdf')

  if (!pdfFile || !(pdfFile instanceof File)) {
    throw createError({
      statusCode: 400,
      message: 'No PDF file uploaded',
    })
  }

  const config = useRuntimeConfig()

  const text = await pdfToText(pdfFile)

  const parsedText = text.slice(0, config.maxContextLength)

  const response = await workerAi(config.cfWorkerAiModel, {
    messages: [
      {
        role: 'system',
        content: config.systemPrompt,
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
