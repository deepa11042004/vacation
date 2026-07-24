import fs from 'fs';
import path from 'path';
import { KycDocumentRepository } from '../repositories/kyc-document.repository';
import { KycDocument } from '../models/KycDocument.model';
import { AppError } from '@/shared/middlewares/error.middleware';

const repo = new KycDocumentRepository();

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'kyc-documents');

function ensureDir() {
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export class KycDocumentService {
  async getByClientId(client_id: number): Promise<KycDocument[]> {
    return repo.findByClientId(client_id);
  }

  async create(client_id: number, title: string, file: File): Promise<KycDocument> {
    if (file.type !== 'application/pdf') {
      throw new AppError('Only PDF files are allowed', 400);
    }
    ensureDir();
    const ext = '.pdf';
    const storedName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(path.join(UPLOAD_DIR, storedName), buffer);

    return repo.create({
      client_id,
      title,
      file_name: file.name,
      file_path: `/api/uploads/kyc-documents/${storedName}`,
    });
  }

  async delete(kyc_document_id: number): Promise<void> {
    return repo.delete(kyc_document_id);
  }
}
