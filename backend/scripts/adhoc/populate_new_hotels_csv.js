const fs = require('fs');
const path = require('path');
const mysql = require(path.resolve(__dirname, '../backend/node_modules/mysql2/promise'));
require(path.resolve(__dirname, '../backend/node_modules/dotenv')).config({ path: path.resolve(__dirname, '../backend/.env') });

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306', 10),
  });

  const [locations] = await connection.execute(
    'SELECT location_id, location_code, location_name, country FROM locations'
  );

  const locMap = {};
  locations.forEach(l => {
    locMap[l.location_name.toLowerCase().trim()] = l;
  });

  const csvPath = 'c:/Projects/vacation/New_Hotels_Import.csv';
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const lines = csvContent.trim().split('\n');
  
  const headers = [
    'hotel_name',
    'location_name',
    'hotel_code',
    'location_id',
    'property_type',
    'hotel_type',
    'address',
    'map_link',
    'description',
    'status',
    'remarks'
  ];

  const codeCounts = {};
  const outputRows = [headers.join(',')];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    // Parse CSV row respecting potential quotes
    // Simple split since original data doesn't have commas inside hotel names/locations
    const parts = lines[i].split(',');
    const hotelName = parts[0].trim();
    const locName = parts[1].trim();

    const locObj = locMap[locName.toLowerCase()];
    if (!locObj) {
      console.error(`Location not found for: ${locName}`);
      continue;
    }

    const locCode = locObj.location_code || 'HOT';
    codeCounts[locCode] = (codeCounts[locCode] || 0) + 1;
    const seq = String(codeCounts[locCode]).padStart(2, '0');
    const hotelCode = `${locCode}${seq}`;

    // Determine hotel_type
    let hotelType = 'HOTEL';
    const lowerName = hotelName.toLowerCase();
    if (lowerName.includes('resort') || lowerName.includes('retreat') || lowerName.includes('lodge') || lowerName.includes('safari')) {
      hotelType = 'RESORT';
    } else if (lowerName.includes('villa')) {
      hotelType = 'VILLA';
    } else if (lowerName.includes('apartment') || lowerName.includes('suites')) {
      hotelType = 'APARTMENT';
    } else if (lowerName.includes('homestay') || lowerName.includes('cottage')) {
      hotelType = 'HOMESTAY';
    }

    // Property type - alternate or set based on index
    const propertyType = (i % 2 === 0) ? 'INTERNAL_PROPERTY' : 'ASSOCIATED_PROPERTY';

    const address = `"${hotelName}, Main Road, ${locName}, ${locObj.country}"`;
    const mapLink = `https://maps.google.com/?q=${encodeURIComponent(hotelName + ' ' + locName)}`;
    const description = `"Experience luxury hospitality at ${hotelName} in ${locName}, featuring modern amenities and exceptional service."`;
    const status = 'ACTIVE';
    const remarks = `"New hotel import for ${locName}"`;

    const row = [
      `"${hotelName.replace(/"/g, '""')}"`,
      `"${locName.replace(/"/g, '""')}"`,
      hotelCode,
      locObj.location_id,
      propertyType,
      hotelType,
      address,
      mapLink,
      description,
      status,
      remarks
    ];

    outputRows.push(row.join(','));
  }

  fs.writeFileSync(csvPath, outputRows.join('\n'), 'utf8');
  console.log(`Successfully updated ${csvPath} with ${outputRows.length - 1} populated hotel rows.`);

  await connection.end();
}

main().catch(console.error);
