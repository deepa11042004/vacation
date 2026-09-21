import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { IVoucher } from '../interfaces/voucher.interface';
import { VoucherPdfService } from './voucher-pdf.service';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function getAssetPath(filename: string): string | null {
  const possiblePaths = [
    path.join(process.cwd(), 'public', 'voucher-assets', filename),
    path.join(process.cwd(), 'backend', 'public', 'voucher-assets', filename),
    path.join(__dirname, '..', '..', '..', '..', 'public', 'voucher-assets', filename),
    path.join(process.cwd(), 'frontend', 'public', filename),
    path.join(process.cwd(), 'frontend', 'public', 'voucher-assets', filename),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

export class VoucherEmailService {
  static async sendVoucherEmail(voucher: IVoucher): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const formatDate = (d: Date | string) => {
        const dt = new Date(d);
        return isNaN(dt.getTime()) ? String(d) : dt.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        });
      };

      const locationsList = Array.isArray(voucher.locations)
        ? voucher.locations.join(', ')
        : String(voucher.locations || 'Shimla, Cochin, Jim Corbett, Jaipur, Agra, Goa, Nainital, Manesar');

      const isDev = process.env.NODE_ENV !== 'production';
      const frontendUrl = (
        process.env.APP_FRONTEND_URL ||
        (isDev ? 'http://localhost:3001' : process.env.SERVICE_URL_FRONTEND || process.env.FRONTEND_URL || 'https://mwvpl.com')
      ).replace(/\/$/, '');
      const redeemUrl = `${frontendUrl}/redeem-voucher`;
      const downloadPdfUrl = `${frontendUrl}/api/vouchers/download/${voucher.voucher_number}`;

      const subject = `Your Holiday Gift Voucher – Voucher No. ${voucher.voucher_number}`;

      // Assets for CID attachments
      const pathLogo = getAssetPath('mandarine logo.PNG') || getAssetPath('mandarin-logo.png') || getAssetPath('C6962E7E-5B0E-4164-B527-746F400C487D.PNG');
      const pathMovie = getAssetPath('movie voucher.png') || getAssetPath('voucher-movie.png');
      const path2n3d = getAssetPath('holiday voucher.png') || getAssetPath('voucher-2n3d.png');

      const attachments: any[] = [];
      let logoSrc = `${frontendUrl}/voucher-assets/mandarin-logo.png`;
      let imgMovieSrc = `${frontendUrl}/voucher-assets/voucher-movie.png`;
      let img2n3dSrc = `${frontendUrl}/voucher-assets/voucher-2n3d.png`;

      if (pathLogo) {
        attachments.push({
          filename: 'mandarin-logo.png',
          path: pathLogo,
          cid: 'mandarinlogo',
        });
        logoSrc = 'cid:mandarinlogo';
      }

      if (pathMovie) {
        attachments.push({
          filename: 'voucher-movie.png',
          path: pathMovie,
          cid: 'vouchermovie',
        });
        imgMovieSrc = 'cid:vouchermovie';
      }
      if (path2n3d) {
        attachments.push({
          filename: 'voucher-2n3d.png',
          path: path2n3d,
          cid: 'voucher2n3d',
        });
        img2n3dSrc = 'cid:voucher2n3d';
      }

      // Generate Voucher PDF Attachment
      try {
        const pdfBuffer = await VoucherPdfService.generateVoucherPDF(voucher);
        attachments.push({
          filename: `Holiday-Gift-Voucher-${voucher.voucher_number}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        });
      } catch (pdfErr) {
        console.error('Failed to attach voucher PDF:', pdfErr);
      }

      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { margin:0; padding:0; background-color:#f1f5f9; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#1e293b; }
    table { border-collapse:collapse; }
    .wrapper { width:100%; max-width:640px; margin:0 auto; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.06); }
    .header { background: linear-gradient(135deg, #0b192e 0%, #1e3a8a 100%); padding:28px 24px; text-align:center; color:#ffffff; }
    .logo-container { background-color:#ffffff; display:inline-block; padding:10px 24px; border-radius:12px; box-shadow:0 4px 16px rgba(0,0,0,0.25); margin-bottom:14px; border:1px solid #d4af37; }
    .header p { margin:4px 0 0; font-size:13px; letter-spacing:2px; font-weight:700; text-transform:uppercase; color:#fbbf24; }
    .content { padding:32px 28px; }
    .greeting { font-size:16px; font-weight:600; color:#0f172a; margin-bottom:12px; }
    .details-card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:20px; margin:24px 0; }
    .detail-row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px dashed #e2e8f0; font-size:14px; }
    .detail-row:last-child { border-bottom:none; }
    .detail-label { color:#64748b; font-weight:600; }
    .detail-value { color:#0f172a; font-weight:700; text-align:right; }
    .badge { display:inline-block; padding:3px 10px; border-radius:999px; background:#dbeafe; color:#1e40af; font-size:12px; font-weight:700; }
    .cta-container { text-align:center; margin:28px 0; }
    .cta-btn { display:inline-block; padding:13px 26px; background-color:#2563eb; color:#ffffff !important; text-decoration:none; font-weight:700; font-size:14px; border-radius:8px; margin:6px 4px; box-shadow:0 4px 12px rgba(37,99,235,0.25); }
    .cta-btn-pdf { display:inline-block; padding:13px 26px; background-color:#0b192e; border:1px solid #d4af37; color:#fbbf24 !important; text-decoration:none; font-weight:700; font-size:14px; border-radius:8px; margin:6px 4px; }
    .images-section { margin:32px 0; text-align:center; }
    .images-section h3 { font-size:14px; text-transform:uppercase; letter-spacing:1px; color:#475569; margin-bottom:16px; }
    .voucher-img { width:100%; max-width:580px; height:auto; border-radius:10px; margin-bottom:18px; border:1px solid #e2e8f0; box-shadow:0 2px 8px rgba(0,0,0,0.05); }
    .terms-section { background:#fafafa; border:1px solid #e5e7eb; border-radius:10px; padding:20px; font-size:12px; line-height:1.6; color:#4b5563; margin-top:24px; }
    .terms-section h4 { margin:0 0 12px; font-size:13px; text-transform:uppercase; color:#111827; }
    .footer { background:#0f172a; color:#94a3b8; padding:24px; text-align:center; font-size:12px; }
    .footer a { color:#60a5fa; text-decoration:none; }
  </style>
</head>
<body style="margin:0; padding:20px 0; background-color:#f1f5f9;">
  <center>
    <div class="wrapper" style="width:100%; max-width:640px; margin:0 auto; background-color:#ffffff; border-radius:12px; overflow:hidden; text-align:left;">
      
      <!-- HEADER WITH LOGO -->
      <div class="header" style="background: linear-gradient(135deg, #0b192e 0%, #1e3a8a 100%); padding:28px 24px; text-align:center; color:#ffffff;">
        <div style="background-color:#ffffff; display:inline-block; padding:10px 22px; border-radius:12px; box-shadow:0 4px 16px rgba(0,0,0,0.25); margin-bottom:12px; border:1px solid #d4af37;">
          <img src="${logoSrc}" alt="Mandarin Worldwide Vacations" style="max-width:230px; width:100%; height:auto; display:block; margin:0 auto;" />
        </div>
        <p style="margin:4px 0 0; font-size:13px; letter-spacing:2px; font-weight:700; text-transform:uppercase; color:#fbbf24;">HOLIDAY GIFT VOUCHER</p>
      </div>

      <!-- BODY -->
      <div class="content" style="padding:32px 28px;">
        <div class="greeting" style="font-size:16px; font-weight:600; color:#0f172a; margin-bottom:12px;">
          Dear ${voucher.applicant}${voucher.spouse ? ` & ${voucher.spouse}` : ''},
        </div>
        <p style="margin:0 0 16px; font-size:14px; line-height:1.6; color:#334155;">
          Congratulations! Please find your official Holiday Gift Voucher details below. A downloadable PDF copy is also attached to this email.
        </p>

        <!-- DETAILS CARD -->
        <div style="background-color:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:20px; margin:20px 0;">
          <table style="width:100%; font-size:14px;">
            <tr>
              <td style="padding:6px 0; color:#64748b; font-weight:600;">Voucher Number:</td>
              <td style="padding:6px 0; color:#0f172a; font-weight:700; text-align:right; font-family:monospace; font-size:15px; color:#1e40af;">${voucher.voucher_number}</td>
            </tr>
            <tr>
              <td style="padding:6px 0; color:#64748b; font-weight:600;">Issuing Date:</td>
              <td style="padding:6px 0; color:#0f172a; font-weight:700; text-align:right;">${formatDate(voucher.issue_date)}</td>
            </tr>
            <tr>
              <td style="padding:6px 0; color:#64748b; font-weight:600;">Valid Until:</td>
              <td style="padding:6px 0; color:#0f172a; font-weight:700; text-align:right; color:#dc2626;">${formatDate(voucher.expiry_date)}</td>
            </tr>
            <tr>
              <td style="padding:6px 0; color:#64748b; font-weight:600;">Voucher Type:</td>
              <td style="padding:6px 0; color:#0f172a; font-weight:700; text-align:right;">${voucher.voucher_type}</td>
            </tr>
            <tr>
              <td style="padding:6px 0; color:#64748b; font-weight:600;">Validity:</td>
              <td style="padding:6px 0; color:#0f172a; font-weight:700; text-align:right;">${voucher.validity}</td>
            </tr>
            <tr>
              <td style="padding:6px 0; color:#64748b; font-weight:600;">Holiday Destinations:</td>
              <td style="padding:6px 0; color:#0f172a; font-weight:700; text-align:right;">${locationsList}</td>
            </tr>
          </table>
        </div>

        <!-- ACTION CTAS -->
        <div style="text-align:center; margin:28px 0;">
          <a href="${redeemUrl}" style="display:inline-block; padding:13px 26px; background-color:#2563eb; color:#ffffff !important; text-decoration:none; font-weight:700; font-size:14px; border-radius:8px; margin:6px 4px; box-shadow:0 4px 12px rgba(37,99,235,0.25);">
            Redeem Your Voucher Online
          </a>
          <a href="${downloadPdfUrl}" style="display:inline-block; padding:13px 26px; background-color:#0b192e; border:1px solid #d4af37; color:#fbbf24 !important; text-decoration:none; font-weight:700; font-size:14px; border-radius:8px; margin:6px 4px;">
            Download Voucher (PDF)
          </a>
          <p style="margin:10px 0 0; font-size:12px; color:#64748b;">
            Redemption Portal: <a href="${redeemUrl}" style="color:#2563eb;">${redeemUrl}</a>
          </p>
        </div>

        <!-- VOUCHER IMAGES -->
        <div style="margin:32px 0; text-align:center;">
          <h3 style="font-size:14px; text-transform:uppercase; letter-spacing:1px; color:#475569; margin-bottom:16px;">
            Your Gift Voucher Certificates
          </h3>
          <img src="${imgMovieSrc}" alt="Movie Voucher" style="width:100%; max-width:560px; height:auto; border-radius:8px; margin-bottom:16px; border:1px solid #e2e8f0;" />
          <img src="${img2n3dSrc}" alt="2 Nights / 3 Days Holiday Voucher - India" style="width:100%; max-width:560px; height:auto; border-radius:8px; margin-bottom:16px; border:1px solid #e2e8f0;" />
        </div>

        <!-- TERMS & CONDITIONS -->
        <div style="background-color:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:20px; font-size:12px; line-height:1.7; color:#475569; white-space:pre-wrap;">
<strong style="color:#0f172a; font-size:13px;">TERMS &amp; CONDITIONS</strong>

${voucher.terms_and_conditions}
        </div>
      </div>

      <!-- FOOTER -->
      <div style="background-color:#0f172a; color:#94a3b8; padding:24px; text-align:center; font-size:12px;">
        <p style="margin:0 0 8px; color:#f8fafc; font-weight:600;">Mandarin Worldwide Vacations</p>
        <p style="margin:0 0 8px;">For booking enquiries, visit <a href="${frontendUrl}" style="color:#60a5fa;">${frontendUrl}</a> or email <a href="mailto:voucher@mandarinworldwidevacations.com" style="color:#60a5fa;">voucher@mandarinworldwidevacations.com</a></p>
        <p style="margin:0; font-size:11px; color:#64748b;">&copy; ${new Date().getFullYear()} Mandarin Worldwide Vacations. All rights reserved.</p>
      </div>

    </div>
  </center>
</body>
</html>
      `;

      const text = `MANDARIN WORLDWIDE VACATIONS
HOLIDAY GIFT VOUCHER

Dear ${voucher.applicant}${voucher.spouse ? ` & ${voucher.spouse}` : ''},

Congratulations! Please find your Holiday Gift Voucher details below.

Voucher Number: ${voucher.voucher_number}
Issuing Date: ${formatDate(voucher.issue_date)}
Valid Until: ${formatDate(voucher.expiry_date)}
Voucher Type: ${voucher.voucher_type}
Holiday Destinations: ${locationsList}

To redeem this voucher, visit: ${redeemUrl}
To download your PDF voucher, visit: ${downloadPdfUrl}

TERMS & CONDITIONS
${voucher.terms_and_conditions}

Thanks & Regards,
Mandarin Worldwide Vacations
`;

      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || '"Mandarin Worldwide Vacations" <hhd973030@gmail.com>',
        to: voucher.email,
        subject,
        text,
        html,
        attachments,
      });

      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      console.error('Error sending voucher email:', error);
      return { success: false, error: error?.message || 'Failed to send voucher email' };
    }
  }
}
