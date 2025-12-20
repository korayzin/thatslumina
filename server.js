const { google } = require('googleapis');
const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Environment variables kontrolü
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;

if (!SPREADSHEET_ID || !GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
  console.error('Gerekli environment variables tanımlanmamış!');
  console.error('SPREADSHEET_ID, GOOGLE_CLIENT_EMAIL ve GOOGLE_PRIVATE_KEY gerekli.');
  process.exit(1);
}

// JSON body okumak için
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Google Auth - Environment variables kullanarak
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: GOOGLE_CLIENT_EMAIL,
    private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Netlify'da \n karakterlerini düzelt
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = google.sheets({ version: 'v4', auth });


// İletişim formu
app.post('/api/contact', async (req, res) => {
  const data = req.body;
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sayfa1!A:D',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          new Date().toLocaleString('tr-TR'),
          data.name || '',
          data.email || '',
          data.message || ''
        ]]
      }
    });
    console.log('İletişim sheet’e eklendi:', data);
    res.status(201).json({ ok: true });
  } catch (error) {
    console.error('İletişim sheet hatası:', error);
    res.status(500).json({ ok: false, error: 'Sheet yazılamadı' });
  }
});

// Randevu formu
app.post('/api/appointments', async (req, res) => {
  const data = req.body;
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sayfa1!A:F', // Sheet’te hangi sütunlara yazacağımız
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
    console.log('Randevu sheet’e eklendi:', data);
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error('Sheets hatası:', err);
    res.status(500).json({ ok: false, error: 'Sheet yazılamadı' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/randevu', (req, res) => {
  res.sendFile(path.join(__dirname, 'randevu.html'));
});

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
