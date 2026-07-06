import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONTENT_TYPES: Record<string, string> = {
  '.mp3':  'audio/mpeg',
  '.mp4':  'video/mp4',
  '.pdf':  'application/pdf',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
};

export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await props.params;

  // Prevent directory traversal
  const sanitized = segments.map(s => path.basename(s));
  const filePath = path.join(process.cwd(), 'public', 'uploads', ...sanitized);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ message: 'File not found' }, { status: 404 });
  }

  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = CONTENT_TYPES[ext] ?? 'application/octet-stream';
  const fileName = sanitized[sanitized.length - 1];

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `inline; filename="${fileName}"`,
      'Cache-Control': 'private, max-age=3600',
    },
  });
}
