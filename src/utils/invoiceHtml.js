export function generateInvoiceHtml ({ invoice, lineItems, client, profile }) {
  const rows = lineItems.map(item => `
    <tr>
      <td>${item.date}</td>
      <td><strong>${item.task || ''}</strong>${item.description ? '<br/><span style="color:#999;font-size:11px">' + item.description + '</span>' : ''}</td>
      <td style="text-align:right">${item.hours}</td>
      <td style="text-align:right">$${Number(item.rate).toFixed(2)}</td>
      <td style="text-align:right">$${Number(item.total).toFixed(2)}</td>
    </tr>
  `).join('')

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <style>
      body { font-family: Helvetica, Arial, sans-serif; padding: 40px; color: #f0e6d0; background: #1a1a1a; }
      h1 { color: #c9a84c; margin-bottom: 4px; }
      p { color: #ddd; }
      .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
      .header-left, .header-right { width: 48%; }
      .label { font-size: 11px; color: #c9a84c; text-transform: uppercase; margin-top: 8px; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th { background: #c9a84c; color: #1a1a1a; padding: 10px 8px; text-align: left; font-size: 12px; }
      td { padding: 8px; border-bottom: 1px solid #333; font-size: 12px; color: #ddd; }
      .totals { text-align: right; margin-top: 20px; border-top: 2px solid #c9a84c; padding-top: 12px; }
      .totals p { margin: 4px 0; color: #ddd; }
      .total-line { font-size: 18px; font-weight: bold; color: #c9a84c; }
      .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #888; border-top: 1px solid #333; padding-top: 16px; }
    </style>
  </head>
  <body>
    <h1>INVOICE</h1>
    <p><strong>#${invoice.invoice_number}</strong></p>

    <div class="header">
      <div class="header-left">
        <p class="label">From</p>
        <p><strong>${profile.name || ''}</strong></p>
        <p>ABN: ${profile.abn || 'N/A'}</p>
        <p>${profile.email || ''}</p>
        <p class="label">Bank Details</p>
        <p>${profile.bank_name || ''}</p>
        <p>BSB: ${profile.bsb || ''} &nbsp; Acc: ${profile.bank_account || ''}</p>
      </div>
      <div class="header-right">
        <p class="label">Bill To</p>
        <p><strong>${client?.company_name || ''}</strong></p>
        <p>${client?.address || ''}</p>
        <p>ABN: ${client?.abn || 'N/A'}</p>
        <p>${client?.email || ''}</p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Task / Description</th>
          <th style="text-align:right">Hours</th>
          <th style="text-align:right">Rate</th>
          <th style="text-align:right">Total</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <div class="totals">
      <p>Subtotal: $${Number(invoice.subtotal).toFixed(2)}</p>
      <p>GST (10%): $${Number(invoice.tax).toFixed(2)}</p>
      <p class="total-line">Total: $${Number(invoice.total).toFixed(2)}</p>
    </div>

    <div class="footer">
      <p>Thank you for your business!</p>
    </div>
  </body>
  </html>
  `
}
