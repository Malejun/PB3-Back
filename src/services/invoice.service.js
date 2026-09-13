export function escapePdfText(value = '') {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/\r/g, ' ')
    .replace(/\n/g, ' ')
}

export function formatCurrency(value) {
  const numericValue = Number(value || 0)
  return `${numericValue.toFixed(2)} €`
}

export function generateOrderInvoicePdf({
  order,
  user,
  items = [],
  productMap = new Map(),
  companyName = 'Mi Tienda',
}) {
  const safeOrderId = order?.id || 'N/A'
  const safeEmail = user?.email || 'No disponible'
  const createdAt = order?.createdAt ? new Date(order.createdAt) : new Date()
  const invoiceDate = createdAt.toISOString().slice(0, 10)

  const lines = [
    `${companyName}`,
    `Factura #${safeOrderId}`,
    `Fecha: ${invoiceDate}`,
    `Cliente: ${safeEmail}`,
    `Estado: ${order?.status || 'COMPLETED'}`,
    'Productos:',
  ]

  let subtotal = 0

  items.forEach((item) => {
    const product = productMap.get(item.productId)
    const productName = product?.name || `Producto ${item.productId}`
    const lineTotal = Number(item.price || 0) * Number(item.quantity || 0)
    subtotal += lineTotal

    lines.push(
      `- ${productName} x${item.quantity} - ${formatCurrency(lineTotal)}`
    )
  })

  lines.push(`Total: ${formatCurrency(Number(order?.total ?? subtotal))}`)

  const content = []
  let y = 760

  const addLine = (text, size = 12, bold = false) => {
    const font = bold ? '/F2' : '/F1'
    const escapedText = escapePdfText(text)
    content.push(`BT ${font} ${size} Tf 50 ${y} Td (${escapedText}) Tj ET`)
    y -= size + 6
  }

  addLine(companyName, 18, true)
  addLine(`Factura #${safeOrderId}`, 14)
  addLine(`Fecha: ${invoiceDate}`)
  addLine(`Cliente: ${safeEmail}`)
  addLine(`Estado: ${order?.status || 'COMPLETED'}`)
  addLine('Productos:')

  items.forEach((item) => {
    const product = productMap.get(item.productId)
    const productName = product?.name || `Producto ${item.productId}`
    const lineTotal = Number(item.price || 0) * Number(item.quantity || 0)
    addLine(`- ${productName} x${item.quantity} - ${formatCurrency(lineTotal)}`)
  })

  addLine(`Total: ${formatCurrency(Number(order?.total ?? subtotal))}`, 14, true)

  const stream = Buffer.from(content.join('\n'), 'latin1')
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
    `<< /Length ${stream.length} >>\nstream\n${content.join('\n')}\nendstream`,
  ]

  let pdf = '%PDF-1.4\n'
  const offsets = [0]

  for (let i = 0; i < objects.length; i += 1) {
    offsets.push(pdf.length)
    pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`
  }

  const xrefOffset = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`

  for (let i = 1; i <= objects.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`

  return Buffer.from(pdf, 'latin1')
}
