const path = require('path');
const express = require('express');
const { appendContactRow, appendAppointmentRow } = require('./lib/googleSheets');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/contact', async (req, res) => {
  const data = req.body;
  try {
    await appendContactRow(data);
    console.log('İletişim sheet’e eklendi:', data);
    res.status(201).json({ ok: true });
  } catch (error) {
    console.error('İletişim sheet hatası:', error);
    res.status(500).json({ ok: false, error: 'Sheet yazılamadı' });
  }
});

app.post('/api/appointments', async (req, res) => {
  const data = req.body;
  try {
    await appendAppointmentRow(data);
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
