import { KycDocument, IKycDocument } from '../models/KycDocument.model';

export class KycDocumentRepository {
  async findByClientId(client_id: number): Promise<KycDocument[]> {
    return KycDocument.findAll({
      where: { client_id },
      order: [['created_at', 'DESC']],
    });
  }

  async create(data: Partial<IKycDocument>): Promise<KycDocument> {
    return KycDocument.create(data);
  }

  async delete(kyc_document_id: number): Promise<void> {
    await KycDocument.destroy({ where: { kyc_document_id } });
  }
}
