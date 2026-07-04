import PDFDocument from 'pdfkit';
import { InvoiceData } from './email.service';
import { getCompanySettings } from './company-settings.service';
import fs from 'fs';
import path from 'path';

const BLACK = '#000000';
const LIGHT_GRAY = '#f4f4f4';
const BORDER = '#cccccc';
const WHITE = '#ffffff';

function fmtDate(iso: string) {
  if (!iso) return '—';
  return iso; // Keep exactly as input (e.g. 2026-07-04)
}

function fmtAmt(amt: string | number) {
  return `Rs. ${Number(amt || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  const co = getCompanySettings();

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 0,
      info: { Title: `Invoice ${data.invoice_no}`, Author: co.name },
    });

    const chunks: Buffer[] = [];
    doc.on('data', (c: Buffer) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const ML = 40;           // left margin
    const MT = 40;           // top margin
    const W  = 595.28;       // A4 width
    const CW = W - ML * 2;   // content width

    let y = MT;

    // ── Header ──────────────────────────────────────────
    // Attempt to draw logo if exists
    let logoDrawn = false;
    const possibleLogoPaths = [
      path.join(process.cwd(), 'public', 'logo.png'),
      path.join(process.cwd(), 'frontend', 'public', 'logo.png'),
      path.join(process.cwd(), '..', 'frontend', 'public', 'logo.png'),
    ];
    for (const p of possibleLogoPaths) {
      if (fs.existsSync(p)) {
        try {
          doc.image(p, ML, y, { width: 80, height: 50, fit: [80, 50] });
          logoDrawn = true;
          break;
        } catch (e) {
          // ignore
        }
      }
    }

    if (logoDrawn) {
      y += 60;
    }

    // Company Details
    doc.fillColor(BLACK).fontSize(12).font('Helvetica-Bold')
      .text(co.name, ML, y);
    y += 14;
    doc.fontSize(10).font('Helvetica').text(co.address, ML, y);
    y += 12;
    doc.font('Helvetica-Bold').text('Phone: ', ML, y, { continued: true })
      .font('Helvetica').text(co.phone || '8447391828');
    y += 12;
    doc.font('Helvetica-Bold').text('Complaint Mail: ', ML, y, { continued: true })
      .font('Helvetica').text('customercare@arenainternationalholidays.com');
    y += 12;
    doc.font('Helvetica-Bold').text('Official Mail: ', ML, y, { continued: true })
      .font('Helvetica').text(co.email || 'info@arenainternationalholidays.com');

    // Right side header (Invoice No, Date, GSTIN)
    let rightY = MT + (logoDrawn ? 20 : 0);
    const rightX = W - ML - 200;
    
    doc.fontSize(10);
    doc.font('Helvetica-Bold').text('Invoice No:', rightX, rightY, { width: 80, align: 'right' });
    doc.font('Helvetica').text(data.invoice_no || '—', rightX + 85, rightY, { width: 115, align: 'left' });
    rightY += 14;
    doc.font('Helvetica-Bold').text('Date:', rightX, rightY, { width: 80, align: 'right' });
    doc.font('Helvetica').text(fmtDate(data.issue_date), rightX + 85, rightY, { width: 115, align: 'left' });
    
    const isTax = data.invoice_type === 'tax';
    if (isTax) {
      rightY += 16;
      doc.fillColor('#b45309').fontSize(8).font('Helvetica-Bold')
         .text('TAX INVOICE', rightX + 85, rightY, { width: 115, align: 'left' });
    }
    
    doc.fillColor(BLACK).fontSize(10);
    if (isTax && co.gst_number) {
      doc.font('Helvetica-Bold').text('GSTIN:', rightX, y, { width: 80, align: 'right' });
      doc.font('Helvetica').text(co.gst_number, rightX + 85, y, { width: 115, align: 'left' });
    }

    y += 30;

    // ── Buyer & Payment Details Block ─────────────────────
    const blockH = 120;
    doc.rect(ML, y, CW, blockH).fill(LIGHT_GRAY);
    
    const half = ML + CW / 2;
    
    // Buyer Details
    let by = y + 10;
    doc.fillColor(BLACK).fontSize(14).font('Helvetica-Bold').text('Buyer Details', ML + 10, by);
    by += 20;
    
    const drawRow = (lbl: string, val: string, startX: string | number, startY: number) => {
      doc.fontSize(10).font('Helvetica-Bold').text(lbl + ':', startX as number, startY);
      doc.font('Helvetica').text(val || '—', (startX as number) + 105, startY, { width: (CW/2) - 120 });
    };

    drawRow('Name', data.client_name, ML + 10, by); by += 12;
    drawRow('Email ID', data.email, ML + 10, by); by += 12;
    drawRow('Address', data.address, ML + 10, by); by += 12;
    drawRow('Customer ID', data.card_number, ML + 10, by); by += 12;
    drawRow('Mobile No', data.phone, ML + 10, by); by += 12;
    drawRow('State', data.state, ML + 10, by); by += 12;
    if (isTax) {
      drawRow('GST No', data.client_gst || '—', ML + 10, by);
    }

    // Payment Details
    let py = y + 10;
    doc.fontSize(14).font('Helvetica-Bold').text('Payment Details', half + 10, py);
    py += 20;
    
    const amtStr = fmtAmt(data.amount);
    drawRow('Pay Mode', data.payment_mode, half + 10, py); py += 12;
    drawRow('Payment Type', data.payment_type, half + 10, py); py += 12;
    drawRow('Transaction ID', data.transaction_id || 'NONE', half + 10, py); py += 12;
    drawRow('Bank Name', data.bank || '—', half + 10, py); py += 12;
    drawRow('Cheque/Card No', data.card_cheque_no || '—', half + 10, py); py += 12;
    drawRow('Amount', amtStr, half + 10, py);

    y += blockH + 20;

    // ── Particulars Table ─────────────────────────────────
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('S.No.', ML, y);
    doc.text('Particulars', ML + 50, y);
    doc.text('Amount', ML + CW - 100, y, { width: 100, align: 'right' });
    y += 15;
    
    const amt = parseFloat(data.amount as string) || 0;
    const GST_RATE = 5;
    const isInterState = data.state.trim().toLowerCase() !== co.state.trim().toLowerCase();
    const base = isTax ? parseFloat((amt * 100 / (100 + GST_RATE)).toFixed(2)) : amt;
    const gst  = parseFloat((amt - base).toFixed(2));
    const halfGst = parseFloat((gst / 2).toFixed(2));
    const tableAmount = fmtAmt(base);

    doc.font('Helvetica');
    doc.text('1.', ML, y);
    doc.text(data.description || 'Holiday Package (Sheet Attached For Details)', ML + 50, y);
    doc.font('Helvetica-Bold').text(tableAmount, ML + CW - 100, y, { width: 100, align: 'right' });
    y += 40;

    // ── Subtotals ─────────────────────────────────────────
    const totalsW = 250;
    const totalsX = ML + CW - totalsW;
    
    // Top line of subtotals
    doc.moveTo(totalsX, y).lineTo(ML + CW, y).strokeColor(BLACK).lineWidth(1).stroke();
    y += 5;
    
    doc.font('Helvetica-Bold').text(tableAmount, totalsX, y, { width: totalsW, align: 'right' });
    y += 15;

    if (isTax) {
      if (isInterState) {
        doc.font('Helvetica-Bold').text('Add :', totalsX, y);
        doc.text(`IGST @${GST_RATE}%`, totalsX + 40, y);
        doc.text(fmtAmt(gst), totalsX, y, { width: totalsW, align: 'right' });
        y += 15;
      } else {
        doc.font('Helvetica-Bold').text('Add :', totalsX, y);
        doc.text(`CGST @${GST_RATE/2}%`, totalsX + 40, y);
        doc.text(fmtAmt(halfGst), totalsX, y, { width: totalsW, align: 'right' });
        y += 15;
        doc.text(`SGST @${GST_RATE/2}%`, totalsX + 40, y);
        doc.text(fmtAmt(halfGst), totalsX, y, { width: totalsW, align: 'right' });
        y += 15;
      }
    }

    // Double bottom line or thick line for total
    doc.moveTo(totalsX, y).lineTo(ML + CW, y).strokeColor(BLACK).lineWidth(1).stroke();
    y += 5;
    doc.font('Helvetica-Bold').text('Total Amount', totalsX, y);
    doc.text(fmtAmt(amt), totalsX, y, { width: totalsW, align: 'right' });
    y += 15;
    doc.moveTo(totalsX, y).lineTo(ML + CW, y).strokeColor(BLACK).lineWidth(1).stroke();
    y += 2;
    doc.moveTo(totalsX, y).lineTo(ML + CW, y).strokeColor(BLACK).lineWidth(1).stroke();
    
    y += 30;

    // ── Terms & Conditions ────────────────────────────────
    doc.rect(ML, y, CW, 20).fill(LIGHT_GRAY);
    doc.fillColor(BLACK).fontSize(10).font('Helvetica-Bold').text('Terms and Conditions', ML + 10, y + 6);
    y += 20;
    
    doc.rect(ML, y, CW, 50).strokeColor(BORDER).lineWidth(1).stroke();
    doc.fontSize(9).font('Helvetica');
    const terms = [
      'All Cheques are subject to clearing from Bank.',
      'Holiday Amount is Non-Refundable.',
      'Sale of Holiday Package is Consider as "Sale" / "Supply of Service" under GST Act.'
    ];
    let ty = y + 8;
    terms.forEach(t => {
      doc.circle(ML + 14, ty + 3, 1.5).fill(BLACK);
      doc.text(t, ML + 22, ty);
      ty += 12;
    });

    doc.end();
  });
}
