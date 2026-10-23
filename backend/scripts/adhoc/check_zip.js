const { execSync } = require('child_process');

try {
  const output = execSync('tar -tf "c:/Projects/vacation/all_hotels_images.zip"', { encoding: 'utf8' });
  const lines = output.split('\n').filter(Boolean);
  console.log('Total entries in all_hotels_images.zip:', lines.length);
  console.log('Sample entries:');
  console.log(lines.slice(0, 15));
} catch (e) {
  console.error(e);
}
