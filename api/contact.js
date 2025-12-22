const { google } = require('googleapis');

// Vercel Serverless Function
module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  // OPTIONS request için
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Sadece POST isteklerine izin ver
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body;

    // Environment variables kontrolü
    const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
    const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
    let GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;

    if (!SPREADSHEET_ID || !GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
      throw new Error('Environment variables eksik');
    }

    // Private key'i temizle ve formatla
    // Vercel'de \n karakterleri farklı şekilde saklanabilir
    GOOGLE_PRIVATE_KEY = GOOGLE_PRIVATE_KEY
      .replace(/\\n/g, '\n')  // String literal \n'leri gerçek \n'e çevir
      .replace(/\r\n/g, '\n')  // Windows line endings
      .replace(/\r/g, '\n')    // Mac line endings
      .trim();                 // Başta/sonda boşlukları temizle

    // Eğer BEGIN/END satırları yoksa ekle
    if (!GOOGLE_PRIVATE_KEY.includes('BEGIN PRIVATE KEY')) {
      throw new Error('Private key formatı geçersiz');
    }

    // Google Auth
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: GOOGLE_CLIENT_EMAIL.trim(),
        private_key: GOOGLE_PRIVATE_KEY,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Sheet'e veri ekle
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sayfa1!A:D',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          new Date().toLocaleString('tr-TR'),
          name || '',
          email || '',
          message || ''
        ]]
      }
    });

    return res.status(201).json({ ok: true });

  } catch (error) {
    console.error('Contact form error:', error);
    const errorMessage = error.message || 'Sunucu hatası';
    return res.status(500).json({ 
      ok: false, 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

