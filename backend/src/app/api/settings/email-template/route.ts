import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateRequest, requireRoles } from '@/shared/middlewares/auth.middleware';
import { errorHandler, AppError } from '@/shared/middlewares/error.middleware';
import { ResponseUtil } from '@/shared/utils/response.util';
import { getTemplates, saveTemplates } from '@/shared/utils/email.service';
import { UserRole } from '@/modules/users/types/user.types';

const SingleTemplate = z.object({
  subject: z.string().min(1, 'Subject is required'),
  body:    z.string().min(1, 'Body is required'),
});

const TemplateSchema = z.object({
  invoice:     SingleTemplate,
  birthday:    SingleTemplate,
  anniversary: SingleTemplate,
});

/**
 * @swagger
 * components:
 *   schemas:
 *     EmailTemplate:
 *       type: object
 *       properties:
 *         subject:
 *           type: string
 *           description: "Email subject. Supports variables: {{invoice_no}}, {{client_name}}, {{issue_date}}, {{amount}}"
 *           example: "Invoice {{invoice_no}} — Peltown Vacations"
 *         body:
 *           type: string
 *           description: "Plain-text email body. Same variables available."
 *           example: "Dear {{client_name}},\n\nPlease find your invoice attached."
 *     EmailTemplates:
 *       type: object
 *       properties:
 *         invoice:
 *           $ref: '#/components/schemas/EmailTemplate'
 */

/**
 * @swagger
 * /api/settings/email-template:
 *   get:
 *     summary: Get email templates
 *     description: Returns the current invoice email template (subject + body). Available variables — `{{invoice_no}}`, `{{client_name}}`, `{{issue_date}}`, `{{amount}}`, `{{email}}`, `{{phone}}`.
 *     tags: [Settings]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Templates retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *                 data:
 *                   $ref: '#/components/schemas/EmailTemplates'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — Admin or Manager only
 */
export async function GET(request: NextRequest) {
  try {
    const currentUser = await authenticateRequest(request);
    requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);
    const templates = getTemplates();
    return NextResponse.json(ResponseUtil.success('Templates retrieved', templates));
  } catch (error) {
    return errorHandler(error);
  }
}

/**
 * @swagger
 * /api/settings/email-template:
 *   put:
 *     summary: Update email templates
 *     description: Persists the invoice email template to `data/email-templates.json`. Changes take effect immediately on the next invoice send.
 *     tags: [Settings]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailTemplates'
 *     responses:
 *       200:
 *         description: Templates saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Templates saved" }
 *                 data:
 *                   $ref: '#/components/schemas/EmailTemplates'
 *       400:
 *         description: Validation error — subject or body missing
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — Admin only
 */
export async function PUT(request: NextRequest) {
  try {
    const currentUser = await authenticateRequest(request);
    requireRoles(currentUser, [UserRole.ADMIN]);

    const body = await request.json();
    const data = TemplateSchema.parse(body);

    saveTemplates(data);
    return NextResponse.json(ResponseUtil.success('Templates saved', data));
  } catch (error) {
    return errorHandler(error);
  }
}
