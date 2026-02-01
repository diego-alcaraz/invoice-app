export function generateInvoiceHtml ({ invoice, lineItems, client, profile }) {
  const formatDesc = (str) => (str || '').replace(/\n/g, '<br/>')

  const rows = lineItems.map(item => `
    <tr>
      <td>${item.date || ''}</td>
      <td>
        <strong>${item.task || ''}</strong>
        ${item.description ? '<br/><span style="color:#999;font-size:11px">' + formatDesc(item.description) + '</span>' : ''}
      </td>
      <td style="text-align:right">${Number(item.hours).toFixed(2)}</td>
      <td style="text-align:right">$${Number(item.rate).toFixed(2)}</td>
      <td style="text-align:right">$${Number(item.total).toFixed(2)}</td>
    </tr>
  `).join('')

  const gstRow = Number(invoice.tax) > 0
    ? `<p>GST (10%): $${Number(invoice.tax).toFixed(2)}</p>`
    : ''

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <style>
      body { font-family: Helvetica, Arial, sans-serif; padding: 40px; color: #333; background: #fff; }
      h1 { color: #222; margin-bottom: 4px; font-size: 28px; }
      .invoice-number { font-size: 14px; color: #666; margin-bottom: 24px; }
      .header { width: 100%; margin-bottom: 30px; }
      .header td { vertical-align: top; padding: 0; width: 50%; }
      .label { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-top: 12px; margin-bottom: 2px; }
      .header p { margin: 2px 0; font-size: 13px; color: #333; }
      .header strong { color: #111; }
      .bank-box { background: #f7f7f7; border: 1px solid #ddd; border-radius: 6px; padding: 10px; margin-top: 8px; }
      .bank-box p { margin: 2px 0; font-size: 12px; }
      table.items { width: 100%; border-collapse: collapse; margin-top: 24px; }
      table.items th { background: #222; color: #fff; padding: 10px 8px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
      table.items th:nth-child(3), table.items th:nth-child(4), table.items th:nth-child(5) { text-align: right; }
      table.items td { padding: 10px 8px; border-bottom: 1px solid #eee; font-size: 12px; color: #333; vertical-align: top; }
      table.items tr:nth-child(even) { background: #fafafa; }
      .totals { text-align: right; margin-top: 20px; border-top: 2px solid #222; padding-top: 12px; }
      .totals p { margin: 4px 0; color: #333; font-size: 13px; }
      .total-line { font-size: 20px; font-weight: bold; color: #222; margin-top: 8px; }
      .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 16px; }
      table.pay-table { width: 100%; margin-top: 30px; border: 2px solid #222; border-collapse: collapse; }
      table.pay-table td { padding: 6px 10px; font-size: 13px; color: #333; border-bottom: 1px solid #eee; }
      table.pay-table tr:first-child td { background: #222; color: #fff; padding: 10px; font-size: 13px; border-bottom: 2px solid #222; }
      .pay-label { font-weight: bold; width: 100px; color: #555; }
    </style>
  </head>
  <body>
    <h1>INVOICE</h1>
    <p class="invoice-number">#${invoice.invoice_number}</p>

    <table class="header" cellpadding="0" cellspacing="0">
      <tr>
        <td>
          <p class="label">From</p>
          <p><strong>${profile.name || ''}</strong></p>
          ${profile.abn ? '<p>ABN: ' + profile.abn + '</p>' : ''}
          ${profile.email ? '<p>' + profile.email + '</p>' : ''}
        </td>
        <td>
          <p class="label">Bill To</p>
          <p><strong>${client?.company_name || ''}</strong></p>
          ${client?.address ? '<p>' + client.address + '</p>' : ''}
          ${client?.abn ? '<p>ABN: ' + client.abn + '</p>' : ''}
          ${client?.email ? '<p>' + client.email + '</p>' : ''}
        </td>
      </tr>
    </table>

    <table class="items">
      <thead>
        <tr>
          <th style="width:15%">Date</th>
          <th style="width:40%">Task / Description</th>
          <th style="width:12%;text-align:right">Hours</th>
          <th style="width:15%;text-align:right">Rate</th>
          <th style="width:18%;text-align:right">Total</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <div class="totals">
      <p>Subtotal: $${Number(invoice.subtotal).toFixed(2)}</p>
      ${gstRow}
      <p class="total-line">Total: $${Number(invoice.total).toFixed(2)}</p>
    </div>

    <table class="pay-table" cellpadding="0" cellspacing="0">
      <tr><td colspan="2"><strong>Payment Details — Please transfer to:</strong></td></tr>
      <tr><td class="pay-label">Name:</td><td>${profile.name || 'N/A'}</td></tr>
      <tr><td class="pay-label">Email:</td><td>${profile.email || 'N/A'}</td></tr>
      <tr><td class="pay-label">ABN:</td><td>${profile.abn || 'N/A'}</td></tr>
      <tr><td class="pay-label">Bank:</td><td>${profile.bank_name || 'N/A'}</td></tr>
      <tr><td class="pay-label">BSB:</td><td>${profile.bsb || 'N/A'}</td></tr>
      <tr><td class="pay-label">Account:</td><td>${profile.bank_account || 'N/A'}</td></tr>
    </table>

    <div class="footer">
      <p>Thank you for your business!</p>
    </div>
  </body>
  </html>
  `
}
