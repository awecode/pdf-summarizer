import { extractText, getDocumentProxy } from 'unpdf'
import { readFile } from "node:fs/promises"

export const pdfToText = async (filePath: String) => {
  const buffer = await readFile(filePath)
  const pdf = await getDocumentProxy(new Uint8Array(buffer))
  // Extract text from PDF
  const { totalPages, text } = await extractText(pdf, { mergePages: true })
  console.log(`Total pages: ${totalPages}`)
  return text
}
