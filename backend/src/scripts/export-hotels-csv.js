const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

function resolveUrl(relativePath) {
  if (!relativePath) return '';
  if (/^https?:\/\//i.test(relativePath)) return relativePath;
  const frontendBase = (process.env.FRONTEND_URL || process.env.BACKEND_URL || 'https://mandarinworldwidevacations.com').replace(/\/$/, '');
  const backendBase = (process.env.BACKEND_URL || 'https://api.mandarinworldwidevacations.com').replace(/\/$/, '');
  if (relativePath.startsWith('/uploads/')) {
    return `${frontendBase}${relativePath}`;
  }
  if (relativePath.startsWith('/api/')) return `${backendBase}${relativePath}`;
  return `${backendBase}/api${relativePath}`;
}

function escapeCsvValue(val) {
  if (val === null || val === undefined) return '';
  let str = String(val);
  // Replace newlines or normalize them so CSV formatting stays clean
  str = str.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    str = `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

async function exportHotels() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306', 10),
  });

  console.log('Connected to database successfully.');

  // Fetch all hotels along with location details
  const [hotels] = await connection.query(`
    SELECT 
      h.hotel_id,
      h.hotel_code,
      h.hotel_name,
      h.property_type,
      h.hotel_type,
      h.status,
      h.address,
      h.map_link,
      h.description,
      h.remarks,
      h.location_id,
      l.location_name,
      l.country as location_country,
      l.type as location_type,
      h.created_by,
      h.updated_by,
      h.created_at,
      h.updated_at,
      h.deleted_at
    FROM hotels h
    LEFT JOIN locations l ON h.location_id = l.location_id
    ORDER BY h.hotel_id ASC
  `);

  console.log(`Fetched ${hotels.length} hotels.`);

  // Fetch all images grouped by hotel_id
  const [images] = await connection.query(`
    SELECT image_id, hotel_id, image_path, sort_order
    FROM hotel_images
    ORDER BY hotel_id ASC, sort_order ASC, image_id ASC
  `);

  const imagesByHotel = new Map();
  for (const img of images) {
    if (!imagesByHotel.has(img.hotel_id)) {
      imagesByHotel.set(img.hotel_id, []);
    }
    imagesByHotel.get(img.hotel_id).push(img);
  }

  const headers = [
    'hotel_id',
    'hotel_code',
    'hotel_name',
    'property_type',
    'hotel_type',
    'status',
    'location_id',
    'location_name',
    'location_country',
    'location_type',
    'address',
    'map_link',
    'description',
    'remarks',
    'total_images',
    'primary_image_path',
    'primary_image_url',
    'all_image_paths',
    'all_image_urls',
    'created_by',
    'updated_by',
    'created_at',
    'updated_at',
    'deleted_at'
  ];

  const csvRows = [headers.join(',')];

  for (const h of hotels) {
    const hotelImgs = imagesByHotel.get(h.hotel_id) || [];
    const totalImages = hotelImgs.length;
    const primaryImgPath = totalImages > 0 ? hotelImgs[0].image_path : '';
    const primaryImgUrl = totalImages > 0 ? resolveUrl(hotelImgs[0].image_path) : '';
    const allImgPaths = hotelImgs.map(i => i.image_path).join(' ; ');
    const allImgUrls = hotelImgs.map(i => resolveUrl(i.image_path)).join(' ; ');

    const row = [
      escapeCsvValue(h.hotel_id),
      escapeCsvValue(h.hotel_code),
      escapeCsvValue(h.hotel_name),
      escapeCsvValue(h.property_type),
      escapeCsvValue(h.hotel_type),
      escapeCsvValue(h.status),
      escapeCsvValue(h.location_id),
      escapeCsvValue(h.location_name),
      escapeCsvValue(h.location_country),
      escapeCsvValue(h.location_type),
      escapeCsvValue(h.address),
      escapeCsvValue(h.map_link),
      escapeCsvValue(h.description),
      escapeCsvValue(h.remarks),
      escapeCsvValue(totalImages),
      escapeCsvValue(primaryImgPath),
      escapeCsvValue(primaryImgUrl),
      escapeCsvValue(allImgPaths),
      escapeCsvValue(allImgUrls),
      escapeCsvValue(h.created_by),
      escapeCsvValue(h.updated_by),
      escapeCsvValue(h.created_at ? new Date(h.created_at).toISOString() : ''),
      escapeCsvValue(h.updated_at ? new Date(h.updated_at).toISOString() : ''),
      escapeCsvValue(h.deleted_at ? new Date(h.deleted_at).toISOString() : '')
    ];

    csvRows.push(row.join(','));
  }

  // Output paths: in project root as well as backend
  const outPathRoot = path.resolve(__dirname, '../../../hotels_export.csv');
  fs.writeFileSync(outPathRoot, '\uFEFF' + csvRows.join('\r\n'), 'utf8'); // with UTF-8 BOM for Excel compatibility

  console.log(`Successfully exported ${hotels.length} hotels to ${outPathRoot}`);
  await connection.end();
}

exportHotels().catch(err => {
  console.error('Export failed:', err);
  process.exit(1);
});
