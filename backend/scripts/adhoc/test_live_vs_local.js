const fs = require('fs');
const path = require('path');
const https = require('https');

const LIVE_BASE = 'https://mandarinworldwidevacations.com';
const feUploads = 'c:/Projects/vacation/frontend/public/uploads/hotels';

async function testFile() {
  const sampleFile = '082920211025321_domesticlmt1.jpg';
  const localPath = path.join(feUploads, sampleFile);
  const localStat = fs.statSync(localPath);
  console.log('Local file size:', localStat.size);

  https.get(LIVE_BASE + '/uploads/hotels/' + sampleFile, (res) => {
    console.log('Live status:', res.statusCode);
    console.log('Live Content-Length:', res.headers['content-length']);
  });
}

testFile();
