import { saveAs } from 'file-saver';
import isString from 'lodash/isString';

export const generatePDF = (pdfFile: any, order: any) => {
  if (!isString(pdfFile)) return false
  const fileName = `Invoice-${order?.orderNo}`
  const pdfData = atob(pdfFile)
  const arrayBuffer = new ArrayBuffer(pdfData.length)
  const uint8Array = new Uint8Array(arrayBuffer)

  for (let i = 0; i < pdfData.length; i++) {
    uint8Array[i] = pdfData.charCodeAt(i)
  }

  const blob = new Blob([uint8Array], { type: 'application/pdf' })

  saveAs(blob, fileName)
}
