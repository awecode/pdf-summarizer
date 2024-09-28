export default defineEventHandler(async (event) => {
  const text = await summarize('./sample.pdf')
  
  const response = await workerAi('@cf/facebook/bart-large-cnn', {
    input_text: text,
    max_length: 1024,
  })

  return {
    response,
    text: text,
  }
})
