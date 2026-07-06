import fs from 'fs';
import path from 'path';
import { CallRecordingRepository } from '../repositories/call-recording.repository';
import { CallRecording } from '../models/CallRecording.model';

const repo = new CallRecordingRepository();

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'call-recordings');

function ensureDir() {
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export class CallRecordingService {
  async getByClientId(client_id: number): Promise<CallRecording[]> {
    return repo.findByClientId(client_id);
  }

  async create(client_id: number, note: string, file: File): Promise<CallRecording> {
    ensureDir();
    const ext = path.extname(file.name) || '.mp3';
    const storedName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(path.join(UPLOAD_DIR, storedName), buffer);

    return repo.create({
      client_id,
      note,
      file_name: file.name,
      file_path: `/api/uploads/call-recordings/${storedName}`,
    });
  }

  async delete(call_recording_id: number): Promise<void> {
    return repo.delete(call_recording_id);
  }
}
