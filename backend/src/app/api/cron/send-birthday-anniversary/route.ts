import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/shared/database/sequelize';
import { runBirthdayAnniversaryJob } from '@/shared/services/cron.service';
import { ResponseUtil } from '@/shared/utils/response.util';
import { errorHandler } from '@/shared/middlewares/error.middleware';

export async function POST(req: NextRequest) {
  try {
    // Protect with a secret so only authorised callers can trigger this
    const secret = req.headers.get('x-cron-secret');
    if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const result = await runBirthdayAnniversaryJob();

    return NextResponse.json(
      ResponseUtil.success('Birthday & anniversary emails processed', result),
      { status: 200 },
    );
  } catch (error) {
    return errorHandler(error);
  }
}
