import { CallRecording, ICallRecording } from '../models/CallRecording.model';

export class CallRecordingRepository {
  async findByClientId(client_id: number): Promise<CallRecording[]> {
    return CallRecording.findAll({
      where: { client_id },
      order: [['created_at', 'DESC']],
    });
  }

  async create(data: Partial<ICallRecording>): Promise<CallRecording> {
    return CallRecording.create(data);
  }

  async delete(call_recording_id: number): Promise<void> {
    await CallRecording.destroy({ where: { call_recording_id } });
  }
}
