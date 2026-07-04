import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, requireRoles } from '@/shared/middlewares/auth.middleware';
import { errorHandler } from '@/shared/middlewares/error.middleware';
import { ResponseUtil } from '@/shared/utils/response.util';
import { getCompanySettings, saveCompanySettings, CompanySettings } from '@/shared/utils/company-settings.service';
import { UserRole } from '@/modules/users/types/user.types';

export const dynamic = 'force-dynamic';

// Company details are managed directly in data/company.json
export async function GET(request: NextRequest) {
  try {
    const currentUser = await authenticateRequest(request);
    requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);
    
    // We will get the company settings. If it fails, we want to know why.
    const settings = getCompanySettings();
    return NextResponse.json(ResponseUtil.success('Company settings retrieved', settings));
  } catch (error) {
    return errorHandler(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await authenticateRequest(request);
    requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);
    
    const body: CompanySettings = await request.json();
    saveCompanySettings(body);
    
    return NextResponse.json(ResponseUtil.success('Company settings updated', body));
  } catch (error) {
    return errorHandler(error);
  }
}
