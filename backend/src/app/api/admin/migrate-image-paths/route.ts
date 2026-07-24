import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/shared/database/sequelize';
import { authenticateRequest, requireRoles } from '@/shared/middlewares/auth.middleware';
import { UserRole } from '@/modules/users/types/user.types';
import { sequelize } from '@/shared/database/sequelize';
import { QueryTypes } from 'sequelize';

/**
 * One-time migration: converts bare filenames stored in location_image and
 * hotel_images.image_path to full relative paths that the backend can serve.
 *
 * Bare filename  →  /uploads/locations/<filename>
 * Bare filename  →  /uploads/hotels/<filename>
 *
 * Already-correct paths (start with / or http) are left untouched.
 *
 * POST /api/admin/migrate-image-paths
 * Body: { dry_run?: boolean }   (default: true — preview only, no writes)
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const currentUser = await authenticateRequest(request);
    requireRoles(currentUser, [UserRole.ADMIN]);

    const body = await request.json().catch(() => ({}));
    const dryRun: boolean = body.dry_run !== false; // default true = preview only

    // ── Locations ─────────────────────────────────────────────────────────────
    type LocationRow = { location_id: number; location_image: string };
    const locations = await sequelize.query<LocationRow>(
      `SELECT location_id, location_image FROM locations
       WHERE location_image IS NOT NULL
         AND location_image != ''
         AND location_image NOT LIKE '/%'
         AND location_image NOT LIKE 'http%'
         AND deleted_at IS NULL`,
      { type: QueryTypes.SELECT },
    );

    const locationUpdates = locations.map(r => ({
      id: r.location_id,
      old: r.location_image,
      new: `/uploads/locations/${r.location_image}`,
    }));

    if (!dryRun && locationUpdates.length > 0) {
      for (const u of locationUpdates) {
        await sequelize.query(
          `UPDATE locations SET location_image = :newPath WHERE location_id = :id`,
          { replacements: { newPath: u.new, id: u.id }, type: QueryTypes.UPDATE },
        );
      }
    }

    // ── Hotel Images ──────────────────────────────────────────────────────────
    type HotelImageRow = { image_id: number; image_path: string };
    const hotelImages = await sequelize.query<HotelImageRow>(
      `SELECT image_id, image_path FROM hotel_images
       WHERE image_path IS NOT NULL
         AND image_path != ''
         AND image_path NOT LIKE '/%'
         AND image_path NOT LIKE 'http%'`,
      { type: QueryTypes.SELECT },
    );

    const hotelUpdates = hotelImages.map(r => ({
      id: r.image_id,
      old: r.image_path,
      new: `/uploads/hotels/${r.image_path}`,
    }));

    if (!dryRun && hotelUpdates.length > 0) {
      for (const u of hotelUpdates) {
        await sequelize.query(
          `UPDATE hotel_images SET image_path = :newPath WHERE image_id = :id`,
          { replacements: { newPath: u.new, id: u.id }, type: QueryTypes.UPDATE },
        );
      }
    }

    return NextResponse.json({
      dry_run: dryRun,
      message: dryRun
        ? 'Preview only — pass { "dry_run": false } to apply changes'
        : 'Migration applied successfully',
      locations: { count: locationUpdates.length, samples: locationUpdates.slice(0, 5) },
      hotel_images: { count: hotelUpdates.length, samples: hotelUpdates.slice(0, 5) },
    });
  } catch (err: unknown) {
    console.error(err);
    const msg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
