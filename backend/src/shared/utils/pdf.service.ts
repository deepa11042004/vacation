import PDFDocument from 'pdfkit';
import { InvoiceData } from './email.service';

const BLUE  = '#1d4ed8';
const DARK  = '#0f172a';
const SLATE = '#475569';
const LIGHT = '#f8fafc';
const BORDER= '#e2e8f0';
const WHITE = 'white';

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function fmtAmt(amt: string | number) {
  return `Rs.${Number(amt || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 0,
      info: { Title: `Invoice ${data.invoice_no}`, Author: 'Peltown Vacations' },
    });

    const chunks: Buffer[] = [];
    doc.on('data', (c: Buffer) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const ML = 50;           // left margin
    const MT = 50;           // top margin
    const W  = 595.28;       // A4 width
    const CW = W - ML * 2;   // content width

    // ── Header band ──────────────────────────────────────
    doc.rect(ML, MT, CW, 58).fill(BLUE);

    doc.fillColor(WHITE).fontSize(17).font('Helvetica-Bold')
      .text('Peltown Vacations', ML + 12, MT + 10);
    doc.fillColor(WHITE).fontSize(9).font('Helvetica')
      .text('Holiday Package Management', ML + 12, MT + 32, { characterSpacing: 0.3 });

    doc.fillColor(WHITE).fontSize(17).font('Helvetica-Bold')
      .text('INVOICE', ML + CW - 130, MT + 10, { width: 118, align: 'right' });
    doc.fillColor(WHITE).fontSize(8.5).font('Helvetica')
      .text(`No: ${data.invoice_no}`, ML + CW - 130, MT + 33, { width: 118, align: 'right' })
      .text(`Date: ${fmtDate(data.issue_date)}`, ML + CW - 130, MT + 45, { width: 118, align: 'right' });

    let y = MT + 74;

    // ── Bill To ──────────────────────────────────────────
    doc.fillColor(SLATE).fontSize(7.5).font('Helvetica-Bold')
      .text('BILL TO', ML, y, { characterSpacing: 1.2 });
    y += 11;

    const addrRows = data.address ? 4 : 3;
    const cardH = addrRows * 18 + 14;
    doc.rect(ML, y, CW, cardH).fill(LIGHT);
    doc.rect(ML, y, CW, cardH).stroke(BORDER);

    const row = (lbl: string, val: string, lx: number, lbx: number, ry: number) => {
      doc.fillColor(SLATE).fontSize(8).font('Helvetica').text(lbl, lx, ry);
      doc.fillColor(DARK).fontSize(8.5).font('Helvetica-Bold').text(val, lbx, ry - 0.5, { width: CW / 2 - 20 });
    };

    const half = ML + CW / 2;
    row('Client Name', data.client_name,  ML + 10, ML + 90,       y + 10);
    row('Card Number', data.card_number,  half + 5, half + 82,    y + 10);
    row('Email',       data.email,        ML + 10, ML + 90,       y + 26);
    row('Phone',       data.phone,        half + 5, half + 82,    y + 26);
    if (data.address) {
      doc.fillColor(SLATE).fontSize(8).font('Helvetica').text('Address', ML + 10, y + 42);
      doc.fillColor(DARK).fontSize(8.5).font('Helvetica').text(data.address, ML + 90, y + 42, { width: CW - 100 });
    }

    y += cardH + 16;

    // ── Payment Details ──────────────────────────────────
    doc.fillColor(SLATE).fontSize(7.5).font('Helvetica-Bold')
      .text('PAYMENT DETAILS', ML, y, { characterSpacing: 1.2 });
    y += 11;

    // Table header
    const cols = [
      { lbl: 'Payment Mode',   w: CW * 0.20 },
      { lbl: 'Payment Type',   w: CW * 0.19 },
      { lbl: 'Transaction ID', w: CW * 0.22 },
      { lbl: 'Bank',           w: CW * 0.17 },
      { lbl: 'Card / Cheque',  w: CW * 0.22 },
    ];
    let cx = ML;
    doc.rect(ML, y, CW, 19).fill(BLUE);
    cols.forEach(c => {
      doc.fillColor(WHITE).fontSize(8).font('Helvetica-Bold').text(c.lbl, cx + 4, y + 5, { width: c.w - 8 });
      cx += c.w;
    });
    y += 19;

    // Data row
    const vals = [
      data.payment_mode,
      data.payment_type,
      data.transaction_id || 'NONE',
      data.bank || '—',
      data.card_cheque_no || '—',
    ];
    cx = ML;
    doc.rect(ML, y, CW, 22).fill(LIGHT).stroke(BORDER);
    cols.forEach((c, i) => {
      doc.fillColor(DARK).fontSize(8.5).font('Helvetica').text(vals[i], cx + 4, y + 6, { width: c.w - 8 });
      cx += c.w;
    });
    y += 28;

    // Amount row spanning full width
    doc.rect(ML, y, CW, 20).fill('#eff6ff').stroke(BORDER);
    doc.fillColor(SLATE).fontSize(8).font('Helvetica').text('Amount Paid', ML + 8, y + 5);
    doc.fillColor(BLUE).fontSize(10).font('Helvetica-Bold')
      .text(fmtAmt(data.amount), ML + 8, y + 4, { width: CW - 16, align: 'right' });
    y += 26;

    // Description + State
    doc.rect(ML, y, CW, 20).fill(LIGHT).stroke(BORDER);
    doc.fillColor(SLATE).fontSize(8).font('Helvetica').text('Payment type:', ML + 8, y + 5);
    doc.fillColor(DARK).fontSize(8.5).font('Helvetica').text(data.description, ML + 82, y + 5, { width: CW * 0.55 });
    if (data.state) {
      doc.fillColor(SLATE).fontSize(8).font('Helvetica').text('State:', ML + CW * 0.73, y + 5);
      doc.fillColor(DARK).fontSize(8.5).font('Helvetica').text(data.state, ML + CW * 0.73 + 34, y + 5);
    }
    y += 28;

    // ── Total box ────────────────────────────────────────
    const boxW = 190;
    const boxX = ML + CW - boxW;
    doc.rect(boxX, y, boxW, 48).fill(BLUE);
    doc.fillColor(WHITE).fontSize(7.5).font('Helvetica')
      .text('TOTAL AMOUNT', boxX + 8, y + 10, { width: boxW - 16, align: 'right', characterSpacing: 0.8 });
    doc.fillColor(WHITE).fontSize(16).font('Helvetica-Bold')
      .text(fmtAmt(data.amount), boxX + 8, y + 22, { width: boxW - 16, align: 'right' });
    y += 60;

    // ── Signature lines ───────────────────────────────────
    const sigY = Math.max(y + 30, 680);
    doc.moveTo(ML, sigY + 44).lineTo(ML + 160, sigY + 44).strokeColor('#94a3b8').lineWidth(0.5).stroke();
    doc.fillColor(SLATE).fontSize(8).font('Helvetica')
      .text('Customer Signature', ML, sigY + 49, { width: 160, align: 'center' });

    doc.moveTo(ML + CW - 160, sigY + 44).lineTo(ML + CW, sigY + 44).strokeColor('#94a3b8').lineWidth(0.5).stroke();
    doc.fillColor(SLATE).fontSize(8).font('Helvetica')
      .text('Authorized Signature', ML + CW - 160, sigY + 49, { width: 160, align: 'center' });

    // ── Footer ───────────────────────────────────────────
    doc.fillColor('#94a3b8').fontSize(8).font('Helvetica')
      .text('Peltown Vacations  ·  Thank you for your business', ML, 785, { width: CW, align: 'center' });

    doc.end();
  });
}
