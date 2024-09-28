import { extractText, getDocumentProxy } from 'unpdf'

export const pdfToText = async (pdfFile: File) => {
  const buffer = await pdfFile.arrayBuffer()
  const pdf = await getDocumentProxy(new Uint8Array(buffer))
  const { text } = await extractText(pdf, { mergePages: true })
  return text
}
