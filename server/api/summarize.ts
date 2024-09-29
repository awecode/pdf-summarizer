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

  const maxContextLength = formData.get('maxContextLength') || config.public.maxContextLength
  const aiModel = formData.get('aiModel')?.toString() || config.public.cfWorkerAiModel

  const text = await pdfToText(pdfFile)

  const parsedText = text.slice(0, Number(maxContextLength))

  const response = await workerAi(aiModel, {
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

  return response
})
