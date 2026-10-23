import fs from 'fs';
import path from 'path';
import { Client } from '../models/Client.model';
import { AppError } from '../../../shared/middlewares/error.middleware';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'client-photos');
const URL_PREFIX = '/api/uploads/client-photos/';
const MAX_BYTES = 2 * 1024 * 1024;

// Type is decided from the file signature, not the client-supplied MIME type or name.
function detectImageExt(buf: Buffer): '.jpg' | '.png' | '.webp' | null {
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return '.jpg';
  if (buf.length > 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return '.png';
  if (buf.length > 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return '.webp';
  return null;
}

function removeStoredFile(photoPath?: string | null) {
  if (!photoPath || !photoPath.startsWith(URL_PREFIX)) return;
  const file = path.join(UPLOAD_DIR, path.basename(photoPath));
  if (fs.existsSync(file)) fs.unlinkSync(file);
}

export class ClientPhotoService {
  async setPhoto(client_id: number, file: File): Promise<string> {
    const client = await Client.findByPk(client_id);
    if (!client) throw new AppError('Client not found', 404);
    if (file.size > MAX_BYTES) throw new AppError('Photo must be 2 MB or smaller', 400);

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = detectImageExt(buffer);
    if (!ext) throw new AppError('Only JPG, PNG or WebP images are allowed', 400);

    if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    const storedName = `${client_id}-${Date.now()}${ext}`;
    fs.writeFileSync(path.join(UPLOAD_DIR, storedName), buffer);

    const previous = client.profile_photo;
    const photoPath = `${URL_PREFIX}${storedName}`;
    await client.update({ profile_photo: photoPath });
    removeStoredFile(previous);
    return photoPath;
  }

  async removePhoto(client_id: number): Promise<void> {
    const client = await Client.findByPk(client_id);
    if (!client) throw new AppError('Client not found', 404);
    const previous = client.profile_photo;
    await client.update({ profile_photo: null });
    removeStoredFile(previous);
  }
}
