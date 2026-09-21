import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { IVoucher } from '../interfaces/voucher.interface';

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

function formatDate(d: Date | string): string {
  if (!d) return '—';
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? String(d) : dt.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export class VoucherPdfService {
  static async generateVoucherPDF(voucher: IVoucher): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margin: 0,
          info: {
            Title: `Holiday Gift Voucher - ${voucher.voucher_number}`,
            Author: 'Mandarin Worldwide Vacations',
            Subject: 'Luxury Holiday Gift Voucher Certificate',
            Keywords: 'Voucher, Holiday, Mandarin Worldwide Vacations',
          },
        });

        const chunks: Buffer[] = [];
        doc.on('data', (chunk: Buffer) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', (err: any) => reject(err));

        const PAGE_WIDTH = 595.28;
        const PAGE_HEIGHT = 841.89;
        const MARGIN_X = 36;
        const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN_X * 2);

        // ================= PAGE 1 =================
        // Header Background
        doc.rect(0, 0, PAGE_WIDTH, 115).fill('#0B192E');
        // Gold Accent Stripe
        doc.rect(0, 115, PAGE_WIDTH, 4).fill('#D4AF37');

        // Draw Logo if available
        const logoPath = getAssetPath('mandarine logo.PNG') || getAssetPath('mandarin-logo.png') || getAssetPath('C6962E7E-5B0E-4164-B527-746F400C487D.PNG');
        let headerContentY = 12;

        if (logoPath) {
          try {
            // White card behind logo for contrast
            doc.roundedRect(PAGE_WIDTH / 2 - 100, headerContentY, 200, 62, 6).fill('#FFFFFF');
            doc.image(logoPath, PAGE_WIDTH / 2 - 90, headerContentY + 4, {
              fit: [180, 54],
              align: 'center',
              valign: 'center',
            });
            headerContentY += 68;
          } catch (e) {
            // Fallback text if image cannot be embedded
            doc.fillColor('#FBBF24').fontSize(16).font('Helvetica-Bold')
              .text('MANDARIN WORLDWIDE VACATIONS', 0, 25, { align: 'center' });
            headerContentY = 65;
          }
        } else {
          doc.fillColor('#FBBF24').fontSize(16).font('Helvetica-Bold')
            .text('MANDARIN WORLDWIDE VACATIONS', 0, 25, { align: 'center' });
          headerContentY = 65;
        }

        // Subheader in Header
        doc.fillColor('#FBBF24').fontSize(12).font('Helvetica-Bold')
          .text('HOLIDAY GIFT VOUCHER', 0, headerContentY + 8, { align: 'center', characterSpacing: 2 });

        let curY = 135;

        // Voucher Key Details Card (Dark Navy & Gold Theme)
        doc.roundedRect(MARGIN_X, curY, CONTENT_WIDTH, 78, 8).fill('#F8FAFC');
        doc.roundedRect(MARGIN_X, curY, CONTENT_WIDTH, 78, 8).lineWidth(1).strokeColor('#E2E8F0').stroke();

        // Left Column: Voucher Number & Type
        doc.fillColor('#64748B').fontSize(9).font('Helvetica-Bold').text('VOUCHER NUMBER', MARGIN_X + 16, curY + 12);
        doc.fillColor('#1E40AF').fontSize(16).font('Helvetica-Bold').text(voucher.voucher_number, MARGIN_X + 16, curY + 25);
        doc.fillColor('#475569').fontSize(9).font('Helvetica').text(`Type: ${voucher.voucher_type}`, MARGIN_X + 16, curY + 50);

        // Middle Column: Issue Date
        const col2X = MARGIN_X + (CONTENT_WIDTH / 3) + 10;
        doc.fillColor('#64748B').fontSize(9).font('Helvetica-Bold').text('ISSUING DATE', col2X, curY + 12);
        doc.fillColor('#0F172A').fontSize(11).font('Helvetica-Bold').text(formatDate(voucher.issue_date), col2X, curY + 27);
        doc.fillColor('#475569').fontSize(9).font('Helvetica').text(`Validity: ${voucher.validity || '1 Year'}`, col2X, curY + 50);

        // Right Column: Expiry Date
        const col3X = MARGIN_X + (CONTENT_WIDTH * 2 / 3) + 10;
        doc.fillColor('#64748B').fontSize(9).font('Helvetica-Bold').text('VALID UNTIL', col3X, curY + 12);
        doc.fillColor('#DC2626').fontSize(11).font('Helvetica-Bold').text(formatDate(voucher.expiry_date), col3X, curY + 27);
        doc.fillColor('#059669').fontSize(9).font('Helvetica-Bold').text(`Status: ${voucher.status || 'ACTIVE'}`, col3X, curY + 50);

        curY += 92;

        // Beneficiary & Destination Details
        doc.roundedRect(MARGIN_X, curY, CONTENT_WIDTH, 90, 8).fill('#FFFFFF');
        doc.roundedRect(MARGIN_X, curY, CONTENT_WIDTH, 90, 8).lineWidth(1).strokeColor('#E2E8F0').stroke();

        // Section Title
        doc.fillColor('#0F172A').fontSize(11).font('Helvetica-Bold').text('BENEFICIARY INFORMATION', MARGIN_X + 14, curY + 10);
        doc.moveTo(MARGIN_X + 14, curY + 24).lineTo(MARGIN_X + CONTENT_WIDTH - 14, curY + 24).lineWidth(0.5).strokeColor('#E2E8F0').stroke();

        const bRowY1 = curY + 30;
        doc.fillColor('#64748B').fontSize(8.5).font('Helvetica-Bold').text('Primary Applicant:', MARGIN_X + 14, bRowY1);
        doc.fillColor('#0F172A').fontSize(9.5).font('Helvetica-Bold').text(voucher.applicant, MARGIN_X + 105, bRowY1);

        if (voucher.spouse) {
          doc.fillColor('#64748B').fontSize(8.5).font('Helvetica-Bold').text('Spouse Name:', MARGIN_X + (CONTENT_WIDTH / 2) + 10, bRowY1);
          doc.fillColor('#0F172A').fontSize(9.5).font('Helvetica').text(voucher.spouse, MARGIN_X + (CONTENT_WIDTH / 2) + 85, bRowY1);
        }

        const bRowY2 = curY + 46;
        doc.fillColor('#64748B').fontSize(8.5).font('Helvetica-Bold').text('Email Address:', MARGIN_X + 14, bRowY2);
        doc.fillColor('#0F172A').fontSize(9.5).font('Helvetica').text(voucher.email, MARGIN_X + 105, bRowY2);

        doc.fillColor('#64748B').fontSize(8.5).font('Helvetica-Bold').text('Phone Number:', MARGIN_X + (CONTENT_WIDTH / 2) + 10, bRowY2);
        doc.fillColor('#0F172A').fontSize(9.5).font('Helvetica').text(voucher.phone, MARGIN_X + (CONTENT_WIDTH / 2) + 85, bRowY2);

        const bRowY3 = curY + 62;
        const locationsList = Array.isArray(voucher.locations)
          ? voucher.locations.join(', ')
          : String(voucher.locations || 'Shimla, Cochin, Jim Corbett, Jaipur, Agra, Goa, Nainital, Manesar');
        doc.fillColor('#64748B').fontSize(8.5).font('Helvetica-Bold').text('Destinations:', MARGIN_X + 14, bRowY3);
        doc.fillColor('#1E40AF').fontSize(8.5).font('Helvetica-Bold').text(locationsList, MARGIN_X + 105, bRowY3, { width: CONTENT_WIDTH - 120 });

        curY += 104;

        // Voucher Certificates Header
        doc.fillColor('#0F172A').fontSize(11).font('Helvetica-Bold').text('GIFT VOUCHER CERTIFICATES', MARGIN_X, curY);
        doc.fillColor('#64748B').fontSize(8.5).font('Helvetica').text('Present these certificates at the time of reservation or check-in.', MARGIN_X, curY + 13);

        curY += 28;

        // Embed Voucher Certificates
        const pathMovie = getAssetPath('movie voucher.png') || getAssetPath('voucher-movie.png');
        const path2n3d = getAssetPath('holiday voucher.png') || getAssetPath('voucher-2n3d.png');

        const certHeight = 135;
        const certSpacing = 10;
        let path2n3dDrawnOnPage1 = false;

        if (pathMovie) {
          try {
            doc.roundedRect(MARGIN_X, curY, CONTENT_WIDTH, certHeight, 6).lineWidth(1).strokeColor('#E2E8F0').stroke();
            doc.image(pathMovie, MARGIN_X + 2, curY + 2, {
              fit: [CONTENT_WIDTH - 4, certHeight - 4],
              align: 'center',
              valign: 'center',
            });
            curY += certHeight + certSpacing;
          } catch (e) {
            // ignore
          }
        }

        if (path2n3d && curY + certHeight <= PAGE_HEIGHT - 60) {
          try {
            doc.roundedRect(MARGIN_X, curY, CONTENT_WIDTH, certHeight, 6).lineWidth(1).strokeColor('#E2E8F0').stroke();
            doc.image(path2n3d, MARGIN_X + 2, curY + 2, {
              fit: [CONTENT_WIDTH - 4, certHeight - 4],
              align: 'center',
              valign: 'center',
            });
            curY += certHeight + certSpacing;
            path2n3dDrawnOnPage1 = true;
          } catch (e) {
            // ignore
          }
        }

        // Page 1 Footer
        doc.rect(0, PAGE_HEIGHT - 35, PAGE_WIDTH, 35).fill('#0B192E');
        doc.fillColor('#94A3B8').fontSize(8).font('Helvetica')
          .text('Mandarin Worldwide Vacations  •  https://mwvpl.com  •  Page 1 of 2', 0, PAGE_HEIGHT - 22, { align: 'center' });

        // ================= PAGE 2 =================
        doc.addPage({ size: 'A4', margin: 0 });

        // Page 2 Header Banner
        doc.rect(0, 0, PAGE_WIDTH, 60).fill('#0B192E');
        doc.rect(0, 60, PAGE_WIDTH, 3).fill('#D4AF37');
        doc.fillColor('#FBBF24').fontSize(13).font('Helvetica-Bold')
          .text('MANDARIN WORLDWIDE VACATIONS - TERMS & CONDITIONS', 0, 22, { align: 'center', characterSpacing: 1 });

        let p2Y = 78;

        // 2nd certificate on Page 2 if not drawn on Page 1
        if (path2n3d && !path2n3dDrawnOnPage1) {
          try {
            doc.roundedRect(MARGIN_X, p2Y, CONTENT_WIDTH, certHeight, 6).lineWidth(1).strokeColor('#E2E8F0').stroke();
            doc.image(path2n3d, MARGIN_X + 2, p2Y + 2, {
              fit: [CONTENT_WIDTH - 4, certHeight - 4],
              align: 'center',
              valign: 'center',
            });
            p2Y += certHeight + 14;
          } catch (e) {
            // ignore
          }
        }

        // Terms and Conditions Box
        const termsBoxHeight = PAGE_HEIGHT - p2Y - 110;
        doc.roundedRect(MARGIN_X, p2Y, CONTENT_WIDTH, termsBoxHeight, 6).fill('#F8FAFC');
        doc.roundedRect(MARGIN_X, p2Y, CONTENT_WIDTH, termsBoxHeight, 6).lineWidth(1).strokeColor('#E2E8F0').stroke();

        doc.fillColor('#0F172A').fontSize(10.5).font('Helvetica-Bold').text('TERMS & CONDITIONS POLICY', MARGIN_X + 14, p2Y + 10);
        doc.moveTo(MARGIN_X + 14, p2Y + 23).lineTo(MARGIN_X + CONTENT_WIDTH - 14, p2Y + 23).lineWidth(0.5).strokeColor('#E2E8F0').stroke();

        const termsText = (voucher.terms_and_conditions || '').slice(0, 2000);
        doc.fillColor('#334155').fontSize(7.5).font('Helvetica')
          .text(termsText, MARGIN_X + 14, p2Y + 30, {
            width: CONTENT_WIDTH - 28,
            lineGap: 2.2,
          });

        // Redemption CTA Box at bottom of Page 2
        const ctaY = PAGE_HEIGHT - 95;
        doc.roundedRect(MARGIN_X, ctaY, CONTENT_WIDTH, 50, 6).fill('#0B192E');
        doc.roundedRect(MARGIN_X, ctaY, CONTENT_WIDTH, 50, 6).lineWidth(1).strokeColor('#D4AF37').stroke();

        doc.fillColor('#FBBF24').fontSize(9.5).font('Helvetica-Bold')
          .text('HOW TO REDEEM YOUR VOUCHER ONLINE', MARGIN_X, ctaY + 8, { align: 'center' });
        doc.fillColor('#FFFFFF').fontSize(8.5).font('Helvetica')
          .text('Visit https://mwvpl.com/redeem-voucher or email: voucher@mandarinworldwidevacations.com', MARGIN_X, ctaY + 24, { align: 'center' });
        doc.fillColor('#93C5FD').fontSize(7.5).font('Helvetica')
          .text('For packages & bookings: packages@mandarinworldwidevacations.com | www.mandarinworldwidevacations.com', MARGIN_X, ctaY + 36, { align: 'center' });

        // Page 2 Footer
        doc.rect(0, PAGE_HEIGHT - 35, PAGE_WIDTH, 35).fill('#0B192E');
        doc.fillColor('#94A3B8').fontSize(8).font('Helvetica')
          .text('Mandarin Worldwide Vacations  •  All Rights Reserved  •  Page 2 of 2', 0, PAGE_HEIGHT - 22, { align: 'center' });

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }
}
