# Lumina Portfolyo Web Sitesi

Bu proje Lumina'nın portfolyo web sitesidir. Netlify üzerinde güvenli bir şekilde deploy edilmiştir.

## 🚀 Netlify Deploy

### Environment Variables Kurulumu

Netlify dashboard'ında aşağıdaki environment variables'ları ayarlayın:

1. **SPREADSHEET_ID**: Google Sheets ID'niz
   - Sheets URL'inde `/d/` ile `/edit` arasındaki kısım
   - Örnek: `1xWt2olyEZYtoUBpj6S5nJC6IpMdQBctlI6TrQW5oX-M`

2. **GOOGLE_CLIENT_EMAIL**: Google Service Account email
   - `credentials.json`'daki `client_email` değeri

3. **GOOGLE_PRIVATE_KEY**: Google Service Account private key
   - `credentials.json`'daki `private_key` değeri
   - **Önemli**: Anahtar içindeki `\n` karakterlerini gerçek yeni satır karakterleriyle değiştirin

### Netlify'da Environment Variables Ayarlama

1. Netlify dashboard'ına gidin
2. Projenizi seçin
3. **Site settings** > **Environment variables** bölümüne gidin
4. Aşağıdaki değişkenleri ekleyin:

```
SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_CLIENT_EMAIL=your_service_account_email@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----\n
```

### Google Sheets API Kurulumu

1. Google Cloud Console'da yeni bir proje oluşturun
2. Google Sheets API'yi etkinleştirin
3. Service Account oluşturun
4. JSON anahtarını indirin (`credentials.json`)
5. Service Account'ı Sheets dosyasına düzenleyici olarak ekleyin

### Local Development

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

### Güvenlik Notları

- `credentials.json` dosyası `.gitignore`'da tanımlıdır ve deploy edilmez
- API anahtarları environment variables olarak saklanır
- Tüm API çağrıları serverless functions üzerinden yapılır
- CORS headers'ları doğru şekilde ayarlanmıştır

## 📁 Proje Yapısı

```
lumina/
├── index.html          # Ana sayfa
├── randevu.html        # Randevu sayfası
├── styles.css          # Stil dosyası
├── script.js           # JavaScript
├── netlify/
│   ├── functions/      # Serverless functions
│   │   ├── contact.js
│   │   └── appointments.js
│   └── toml            # Netlify konfigürasyonu
├── images/             # Resimler
└── README.md           # Bu dosya
```

## 🔧 API Endpoints

- `POST /.netlify/functions/contact` - İletişim formu
- `POST /.netlify/functions/appointments` - Randevu formu
