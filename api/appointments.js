const { appendAppointmentRow } = require('../lib/googleSheets');

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  try {
    const data = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    await appendAppointmentRow(data);
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error('Sheets hatası:', err);
    res.status(500).json({ ok: false, error: 'Sheet yazılamadı' });
  }
};
