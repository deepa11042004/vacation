import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { generateInvoicePDF } from './pdf.service';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export interface InvoiceData {
  invoice_no: string;
  issue_date: string;
  client_name: string;
  card_number: string;
  email: string;
  phone: string;
  address: string;
  payment_mode: string;
  payment_type: string;
  transaction_id: string;
  bank: string;
  card_cheque_no: string;
  amount: string;
  description: string;
  state: string;
}

interface EmailTemplate {
  subject: string;
  body: string;
}

interface TemplateFile {
  invoice: EmailTemplate;
}

const TEMPLATE_PATH = path.join(process.cwd(), 'data', 'email-templates.json');

export function getTemplates(): TemplateFile {
  try {
    return JSON.parse(fs.readFileSync(TEMPLATE_PATH, 'utf-8'));
  } catch {
    return {
      invoice: {
        subject: 'Invoice {{invoice_no}} — Peltown Vacations',
        body: 'Dear {{client_name}},\n\nPlease find your invoice attached.\n\nInvoice No: {{invoice_no}}\nDate: {{issue_date}}\nAmount: Rs. {{amount}}\n\nWarm regards,\nPeltown Vacations Team',
      },
    };
  }
}

export function saveTemplates(templates: TemplateFile): void {
  fs.writeFileSync(TEMPLATE_PATH, JSON.stringify(templates, null, 2), 'utf-8');
}

function interpolate(str: string, vars: Record<string, string>): string {
  return str.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
}

export async function sendInvoiceEmail(to: string, data: InvoiceData): Promise<void> {
  const templates = getTemplates();
  const tpl = templates.invoice;

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const vars: Record<string, string> = {
    invoice_no:  data.invoice_no,
    client_name: data.client_name,
    issue_date:  fmtDate(data.issue_date),
    amount:      Number(data.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
    email:       data.email,
    phone:       data.phone,
  };

  const subject  = interpolate(tpl.subject, vars);
  const bodyText = interpolate(tpl.body, vars);

  // Convert plain text body to simple HTML
  const bodyHtml = `<pre style="font-family:Arial,sans-serif;font-size:14px;line-height:1.7;color:#0f172a;white-space:pre-wrap">${bodyText}</pre>`;

  const pdfBuffer = await generateInvoicePDF(data);

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || '"Peltown Vacations" <peltowninfra@gmail.com>',
    to,
    subject,
    text: bodyText,
    html: bodyHtml,
    attachments: [
      {
        filename: `Invoice-${data.invoice_no.replace(/\//g, '-')}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  });
}
