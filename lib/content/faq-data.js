/**
 * Static FAQ content used for JSON-LD on the home page.
 * Visible FAQ UI lives in index.html; this keeps schema in sync.
 */

/** @type {import('../components/faq-section').FaqItem[]} */
const HOME_FAQ_ITEMS = [
  {
    question: 'Lumina ne yapar?',
    answer:
      'Lumina, markalar için AI destekli kampanya görselleri üretirken diğer bir tarafta işletmelerin tekrar eden operasyonel süreçlerini otomasyonlarla sistematik hale getiren dijital çözüm ortaklığı sunar.',
  },
  {
    question: 'Sadece görsel üretim için çalışabilir miyiz?',
    answer:
      'Evet. Kampanya, ürün, moda, kozmetik, hizmet veya sosyal medya odaklı görsel üretim projeleri için Lumina ile çalışabilirsiniz.',
  },
  {
    question: 'Otomasyon tarafında neler kuruyorsunuz?',
    answer:
      'İşletmenizde tekrar eden işleri birbirine bağlı, takip edilebilir ve otomatik çalışan akışlara dönüştürüyoruz. Formlar, CRM, Google Sheets, e-posta, takvim, WhatsApp/Telegram bildirimleri, Google Drive, Notion, Airtable ve proje yönetim araçları arasında veri akışı kurarak manuel takip yükünü azaltıyoruz.',
  },
  {
    question: 'Küçük işletmeler için uygun mu?',
    answer:
      "Biz markaların cirosuna değil, vizyonun büyüklüğüne bakarız. Lumina'da sabit ve katı fiyat listeleri yoktur. Projeniz heyecan vericiyse, bütçe sadece aşılması gereken teknik bir detaydır.",
  },
  {
    question: 'Proje mi, sürekli iş birliği mi?',
    answer:
      'İki model de mümkündür. Tek seferlik kreatif içerik, kampanya veya otomasyon kurulumu yapılabilir. İhtiyaç devam ediyorsa aylık dijital çözüm ortaklığı modeliyle sistemin geliştirilmesi mümkündür.',
  },
];

/** @type {import('../components/faq-section').FaqItem[]} */
const OTOMASYON_FAQ_ITEMS = [
  {
    question: 'Hangi süreçler otomasyona uygun?',
    answer:
      'Tekrarlayan form kayıtları, teklif takibi, randevu hatırlatmaları, CRM güncellemeleri, haftalık rapor özetleri ve ekip içi görev atamaları otomasyona en sık taşınan adımlardır.',
  },
  {
    question: 'Mevcut araçlarımızla entegre olur mu?',
    answer:
      'Evet. Google Sheets, Gmail, Notion, Airtable, Slack, WhatsApp/Telegram bildirimleri ve birçok CRM aracı arasında veri akışı kurabiliyoruz.',
  },
  {
    question: 'Kurulum ne kadar sürer?',
    answer:
      'Basit akışlar birkaç gün içinde devreye alınabilir. Birden fazla departmanı kapsayan yapılar genellikle 2–4 haftalık keşif ve kurulum süreci gerektirir.',
  },
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    HOME_FAQ_ITEMS,
    OTOMASYON_FAQ_ITEMS,
  };
}

if (typeof window !== 'undefined') {
  window.HOME_FAQ_ITEMS = HOME_FAQ_ITEMS;
  window.OTOMASYON_FAQ_ITEMS = OTOMASYON_FAQ_ITEMS;
}
