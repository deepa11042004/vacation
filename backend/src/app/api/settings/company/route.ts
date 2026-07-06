import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, requireRoles } from '@/shared/middlewares/auth.middleware';
import { errorHandler } from '@/shared/middlewares/error.middleware';
import { ResponseUtil } from '@/shared/utils/response.util';
import { getCompanySettings, saveCompanySettings, CompanySettings } from '@/shared/utils/company-settings.service';
import { UserRole } from '@/modules/users/types/user.types';

export const dynamic = 'force-dynamic';

/**
 * @swagger
 * components:
 *   schemas:
 *     CompanySettings:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Arena International Holidays"
 *         address:
 *           type: string
 *           example: "101, Pratap Nagar, Mayur Vihar, Phase-1 Delhi-110091"
 *         state:
 *           type: string
 *           example: "Delhi"
 *         gst_number:
 *           type: string
 *           example: "07AABCU9603R1ZP"
 *         phone:
 *           type: string
 *           example: "+91-9999999999"
 *         email:
 *           type: string
 *           format: email
 *           example: "info@arenahols.com"
 */

/**
 * @swagger
 * /api/settings/company:
 *   get:
 *     summary: Get company settings
 *     description: Returns the company profile used on invoices and documents. Persisted in `data/company.json`.
 *     tags: [Settings]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Company settings retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *                 data:
 *                   $ref: '#/components/schemas/CompanySettings'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — Admin or Manager only
 */
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

/**
 * @swagger
 * /api/settings/company:
 *   put:
 *     summary: Update company settings
 *     description: Saves the company profile to `data/company.json`. Changes take effect immediately on the next document generated.
 *     tags: [Settings]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompanySettings'
 *     responses:
 *       200:
 *         description: Company settings updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Company settings updated" }
 *                 data:
 *                   $ref: '#/components/schemas/CompanySettings'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — Admin or Manager only
 */
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
