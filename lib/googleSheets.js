const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const DEFAULT_SPREADSHEET_ID = '1xWt2olyEZYtoUBpj6S5nJC6IpMdQBctlI6TrQW5oX-M';

function getCredentials() {
  const raw = process.env.GOOGLE_CREDENTIALS_JSON;
  if (raw) {
    return JSON.parse(raw);
  }
  const credPath = path.join(__dirname, '..', 'credentials.json');
  if (fs.existsSync(credPath)) {
    return require(credPath);
  }
  throw new Error(
    'Google kimlik bilgisi yok: yerelde credentials.json kullanın veya GOOGLE_CREDENTIALS_JSON ortam değişkenini ayarlayın.'
  );
}

function spreadsheetId() {
  return process.env.GOOGLE_SHEET_ID || DEFAULT_SPREADSHEET_ID;
}

function getSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: getCredentials(),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

async function appendContactRow(data) {
  const sheets = getSheets();
  await sheets.spreadsheets.values.append({
    spreadsheetId: spreadsheetId(),
    range: 'Sayfa1!A:D',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        new Date().toLocaleString('tr-TR'),
        data.name || '',
        data.email || '',
        data.message || '',
      ]],
    },
  });
}

async function appendAppointmentRow(data) {
  const sheets = getSheets();
  await sheets.spreadsheets.values.append({
    spreadsheetId: spreadsheetId(),
    range: 'Sayfa1!A:F',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        new Date().toLocaleString('tr-TR'),
        data.name || '',
        data.email || '',
        data.preferredDate || '',
        data.preferredTime || '',
        data.message || '',
      ]],
    },
  });
}

module.exports = {
  appendContactRow,
  appendAppointmentRow,
};
