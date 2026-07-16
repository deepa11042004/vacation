import cron from 'node-cron';
import { connectDB } from '../database/sequelize';
import { ClientRepository } from '../../modules/clients/repositories/client.repository';
import { sendBirthdayEmail, sendAnniversaryEmail } from '../utils/email.service';

const clientRepo = new ClientRepository();

export async function runBirthdayAnniversaryJob(): Promise<{ birthdaySent: number; anniversarySent: number; errors: string[] }> {
  await connectDB();

  const currentYear = new Date().getFullYear();
  const errors: string[] = [];
  let birthdaySent = 0;
  let anniversarySent = 0;

  // --- Birthday emails ---
  const birthdayClients = await clientRepo.findTodaysBirthdays(currentYear);
  for (const client of birthdayClients) {
    try {
      const fullName = [client.first_name, client.middle_name, client.last_name].filter(Boolean).join(' ');
      await sendBirthdayEmail(client.email, fullName);
      await clientRepo.markBirthdayMailSent(client.client_id, currentYear);
      birthdaySent++;
      console.log(`[Cron] Birthday email sent → ${client.email}`);
    } catch (err) {
      const msg = `Birthday email failed for client_id=${client.client_id}: ${String(err)}`;
      errors.push(msg);
      console.error(`[Cron] ${msg}`);
    }
  }

  // --- Anniversary emails ---
  const anniversaryClients = await clientRepo.findTodaysAnniversaries(currentYear);
  for (const client of anniversaryClients) {
    try {
      const fullName = [client.first_name, client.middle_name, client.last_name].filter(Boolean).join(' ');
      await sendAnniversaryEmail(client.email, fullName, client.spouse_name || '');
      await clientRepo.markAnniversaryMailSent(client.client_id, currentYear);
      anniversarySent++;
      console.log(`[Cron] Anniversary email sent → ${client.email}`);
    } catch (err) {
      const msg = `Anniversary email failed for client_id=${client.client_id}: ${String(err)}`;
      errors.push(msg);
      console.error(`[Cron] ${msg}`);
    }
  }

  return { birthdaySent, anniversarySent, errors };
}

let cronStarted = false;

export function startCronJobs(): void {
  if (cronStarted) return;
  cronStarted = true;

  // Every day at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('[Cron] Running birthday & anniversary email job...');
    try {
      const result = await runBirthdayAnniversaryJob();
      console.log(`[Cron] Done — birthday: ${result.birthdaySent}, anniversary: ${result.anniversarySent}, errors: ${result.errors.length}`);
    } catch (err) {
      console.error('[Cron] Job failed:', err);
    }
  }, {
    timezone: 'Asia/Kolkata',
  });

  console.log('[Cron] Birthday & anniversary job scheduled for 09:00 IST daily.');
}
