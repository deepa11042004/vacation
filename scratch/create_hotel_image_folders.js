const fs = require('fs');
const path = require('path');

function sanitizeFolderName(name) {
  // Replace invalid Windows filename characters: \ / : * ? " < > |
  return name.replace(/[\\/:*?"<>|]/g, '_').trim();
}

function main() {
  const csvPath = 'c:/Projects/vacation/New_Hotels_Import.csv';
  const baseFolder = 'c:/Projects/vacation/hotel_images';

  if (!fs.existsSync(baseFolder)) {
    fs.mkdirSync(baseFolder, { recursive: true });
    console.log(`Created base folder: ${baseFolder}`);
  }

  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const lines = csvContent.trim().split('\n');

  let createdCount = 0;

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    // Parse CSV row respecting quotes
    const regex = /(?:^|,)(?:"([^"]*)"|([^,]*))/g;
    const matches = [];
    let match;
    while ((match = regex.exec(lines[i])) !== null) {
      matches.push(match[1] !== undefined ? match[1] : match[2]);
    }

    const hotelName = matches[0] ? matches[0].trim() : '';
    const locName = matches[1] ? matches[1].trim() : '';

    if (!hotelName || !locName) continue;

    // Exclude Hyatt Regency Thrissur in Thrissur since it already has images in DB
    if (hotelName.toLowerCase() === 'hyatt regency thrissur' && locName.toLowerCase() === 'thrissur') {
      console.log(`Skipping existing hotel with images: ${hotelName} (${locName})`);
      continue;
    }

    const folderName = sanitizeFolderName(`${hotelName} - ${locName}`);
    const subFolderPath = path.join(baseFolder, folderName);

    if (!fs.existsSync(subFolderPath)) {
      fs.mkdirSync(subFolderPath, { recursive: true });
      createdCount++;
    }
  }

  console.log(`Successfully created ${createdCount} subfolders inside ${baseFolder}`);
}

main();
