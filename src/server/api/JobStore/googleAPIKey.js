import fs from 'fs';

let googleAPIKey;
try {
  googleAPIKey = fs.readFileSync('./google-api-key');
} catch (error) {
  console.error('Error: couldn\'t read google-api-key file.');
  console.error('Please put your API key into google-api-key and try again.');
  process.exit(1);
}
