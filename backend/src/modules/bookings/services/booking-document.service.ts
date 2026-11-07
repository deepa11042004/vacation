import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { Booking } from '../models/Booking.model';
import { BookingRepository } from '../repositories/booking.repository';
import { Client } from '../../clients/models/Client.model';
import { Membership } from '../../memberships/models/Membership.model';
import { getCompanySettings } from '../../../shared/utils/company-settings.service';
import { AppError } from '../../../shared/middlewares/error.middleware';

const repo = new BookingRepository();

/** Booking ID shown to staff and on the PDF: generated from the system id, e.g. BK-000012. */
export const formatBookingId = (booking_id: number) => `BK-${String(booking_id).padStart(6, '0')}`;

const BLACK = '#000000';
const MUTED = '#555555';
const LIGHT = '#f4f4f4';
const BORDER = '#cccccc';

const fmtDate = (d?: string | null) => {
  if (!d) return '-';
  const date = new Date(`${String(d).slice(0, 10)}T00:00:00`);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

async function loadContext(booking_id: number, client_id: number) {
  const booking = await repo.findById(booking_id);
  if (!booking || booking.client_id !== client_id) throw new AppError('Booking not found', 404);
  const [client, membership] = await Promise.all([
    Client.findByPk(client_id),
    Membership.findByPk(booking.membership_id),
  ]);
  if (!client) throw new AppError('Client not found', 404);
  return { booking, client, membership };
}

function buildPdf(booking: Booking, clientName: string, membershipNo: string): Promise<Buffer> {
  const co = getCompanySettings();
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 0,
      info: { Title: `Booking ${formatBookingId(booking.booking_id)}`, Author: co.name },
    });
    const chunks: Buffer[] = [];
    doc.on('data', (c: Buffer) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const ML = 40;
    const CW = 595.28 - ML * 2;
    let y = 40;

    // Logo (same lookup the invoice PDF uses)
    const logoPaths = [
      path.join(process.cwd(), 'public', 'mandarine logo.PNG'),
      path.join(process.cwd(), 'public', 'logo.png'),
      path.join(process.cwd(), 'frontend', 'public', 'mandarine logo.PNG'),
      path.join(process.cwd(), '..', 'frontend', 'public', 'mandarine logo.PNG'),
      path.join(process.cwd(), '..', 'frontend', 'public', 'logo.png'),
    ];
    for (const p of logoPaths) {
      if (fs.existsSync(p)) {
        try {
          doc.image(p, ML, y, { fit: [110, 55] });
          break;
        } catch { /* ignore a bad image */ }
      }
    }

    // Company block on the right
    doc.fillColor(BLACK).font('Helvetica-Bold').fontSize(12).text(co.name, ML + 140, y, { width: CW - 140, align: 'right' });
    doc.font('Helvetica').fontSize(9).fillColor(MUTED)
      .text(co.address, ML + 140, y + 16, { width: CW - 140, align: 'right' })
      .text(`Phone: ${co.phone}   |   ${co.email}`, ML + 140, doc.y + 2, { width: CW - 140, align: 'right' });
    y = 110;

    doc.moveTo(ML, y).lineTo(ML + CW, y).strokeColor(BORDER).lineWidth(1).stroke();
    y += 18;

    doc.fillColor(BLACK).font('Helvetica-Bold').fontSize(18).text('BOOKING CONFIRMATION', ML, y);
    y += 34;

    // Booking ID + hotel confirmation number, side by side
    const boxW = (CW - 16) / 2;
    const idBox = (x: number, label: string, value: string) => {
      doc.rect(x, y, boxW, 52).fill(LIGHT);
      doc.fillColor(MUTED).font('Helvetica-Bold').fontSize(8).text(label.toUpperCase(), x + 14, y + 10);
      doc.fillColor(BLACK).font('Helvetica-Bold').fontSize(17).text(value, x + 14, y + 25, { width: boxW - 28 });
    };
    idBox(ML, 'Booking ID', formatBookingId(booking.booking_id));
    idBox(ML + boxW + 16, 'Hotel Confirmation No', booking.confirmation_number?.trim() || 'Pending');
    y += 72;

    const section = (title: string, rows: [string, string][]) => {
      doc.fillColor(BLACK).font('Helvetica-Bold').fontSize(12).text(title, ML, y);
      y += 18;
      doc.moveTo(ML, y).lineTo(ML + CW, y).strokeColor(BORDER).lineWidth(0.5).stroke();
      y += 8;
      for (const [label, value] of rows) {
        doc.fillColor(MUTED).font('Helvetica-Bold').fontSize(10).text(label, ML, y, { width: 150 });
        doc.fillColor(BLACK).font('Helvetica').fontSize(10).text(value || '-', ML + 160, y, { width: CW - 160 });
        y = Math.max(doc.y, y + 14) + 5;
      }
      y += 10;
    };

    section('Guest', [
      ['Guest Name', clientName],
      ['Membership No', membershipNo],
      ['Contact Number', booking.contact_number || '-'],
    ]);

    section('Hotel', [
      ['Hotel', booking.hotel_name],
      ['Address', booking.hotel_address || '-'],
      ['Hotel Contact', booking.hotel_contact || '-'],
    ]);

    section('Stay Details', [
      ['Check-in', fmtDate(booking.check_in)],
      ['Check-out', fmtDate(booking.check_out)],
      ['Nights', String(booking.nights)],
      ['Rooms', String(booking.no_of_rooms)],
      ['Guests', `${booking.no_of_adults} adult${booking.no_of_adults !== 1 ? 's' : ''}${booking.children ? `, ${booking.children} child${booking.children !== 1 ? 'ren' : ''}` : ''}`],
      ['Room Category', booking.room_category || '-'],
      ['Booking Type', booking.booking_type || '-'],
    ]);

    if (booking.remark) section('Remarks', [['Remark', booking.remark]]);

    doc.fillColor(MUTED).font('Helvetica').fontSize(8)
      .text(`Please carry a valid photo ID and quote the hotel confirmation number at check-in. For any assistance contact ${co.phone} or ${co.email}.`, ML, 790, { width: CW, align: 'center' });

    doc.end();
  });
}

export class BookingDocumentService {
  async generatePdf(booking_id: number, client_id: number): Promise<{ buffer: Buffer; fileName: string }> {
    const { booking, client, membership } = await loadContext(booking_id, client_id);
    const name = [client.first_name, client.last_name].filter(Boolean).join(' ');
    const buffer = await buildPdf(booking, name, membership?.membership_number ?? '-');
    return { buffer, fileName: `Booking-${formatBookingId(booking.booking_id)}.pdf` };
  }

  /** Emails the booking confirmation PDF to the client and records when it was sent. */
  async emailToClient(booking_id: number, client_id: number): Promise<{ sentTo: string; sentAt: Date }> {
    const { booking, client } = await loadContext(booking_id, client_id);
    if (!client.email) throw new AppError('Client has no email address', 400);
    if (!booking.confirmation_number?.trim()) {
      throw new AppError('Enter the hotel confirmation number before emailing the booking', 400);
    }

    const { buffer, fileName } = await this.generatePdf(booking_id, client_id);
    const co = getCompanySettings();
    const name = [client.first_name, client.last_name].filter(Boolean).join(' ');
    const port = Number(process.env.EMAIL_PORT) || 587;
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port,
      secure: port === 465 || process.env.EMAIL_SECURE === 'true',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const text = [
      `Dear ${name},`,
      '',
      `Your stay at ${booking.hotel_name} is confirmed.`,
      '',
      `Booking ID: ${formatBookingId(booking.booking_id)}`,
      `Hotel Confirmation No: ${booking.confirmation_number}`,
      `Check-in: ${fmtDate(booking.check_in)}`,
      `Check-out: ${fmtDate(booking.check_out)} (${booking.nights} night${booking.nights !== 1 ? 's' : ''})`,
      '',
      'Your booking confirmation is attached. Please carry a valid photo ID and quote the hotel confirmation number at check-in.',
      '',
      `For any assistance contact us at ${co.phone} or ${co.email}.`,
      '',
      'Warm regards,',
      co.name,
    ].join('\n');

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"${co.name}" <${co.email}>`,
      to: client.email,
      subject: `Booking Confirmation ${formatBookingId(booking.booking_id)} - ${booking.hotel_name}`,
      text,
      attachments: [{ filename: fileName, content: buffer, contentType: 'application/pdf' }],
    });

    const sentAt = new Date();
    await repo.update(booking_id, { email_sent_at: sentAt });
    return { sentTo: client.email, sentAt };
  }
}
