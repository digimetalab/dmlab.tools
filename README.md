# DMLab Tools — All-in-One Developer & Designer Toolbox

**DMLab Tools** adalah platform *all-in-one digital toolbox* modern yang dirancang untuk developer, desainer UI/UX, sysadmin, dan digital creator. Aplikasi ini menyediakan puluhan utilitas interaktif dengan antarmuka neumorfik yang responsif, visual preview real-time, dan integrasi backend.

---

## 🚀 Fitur & Kategori Tools

### 1. 🔤 Text & Writing Tools
- **Case Converter**: Konversi teks ke UPPERCASE, lowercase, camelCase, kebab-case, snake_case, PascalCase, Title Case, dll.
- **Word & Character Counter**: Analisis jumlah kata, karakter, kalimat, paragraf, waktu baca, dan kepadatan kata.
- **Slug Generator**: Buat URL slug ramah SEO dari judul atau teks.
- **Lorem Ipsum Generator**: Hasilkan teks placeholder dalam format paragraf, kalimat, atau daftar.
- **Text Sorter & Deduplicator**: Urutkan baris alfabetis, hilangkan duplikat, dan balikkan urutan.
- **Diff / Text Compare**: Bandingkan dua versi teks dan temukan perbedaan baris per baris.
- **ASCII Art Generator**: Konversi teks ke banner ASCII art bergaya standard dan block.

### 2. 🎨 CSS & UI Generators
- **Neumorphism Generator**: Desain bayangan soft UI (flat, convex, concave, pressed) dengan ekspor CSS instan.
- **Glassmorphism Generator**: Efek kaca frosted dengan blur backdrop dan kontrol transparansi.
- **Box Shadow & Glow Generator**: Konfigurasi multi-layer shadow, inset, spread, dan blur.
- **Border Radius & Shape**: Atur kelengkungan tiap sudut secara visual.
- **CSS Gradient Generator**: Buat linear & radial gradient dengan color-stop fleksibel.
- **Flexbox Playground**: Simulator tata letak Flexbox (direction, justify, align, wrap, gap).
- **CSS Grid Layout Generator**: Generator grid responsive dengan pengaturan kolom, baris, dan celah.
- **CSS Animation & Cubic Bezier**: Kurva easing transisi dan efek animasi visual.

### 3. 🌐 Network & Connectivity Tools
- **WHOIS & RDAP Lookup**: Cek registrar domain, tanggal pendaftaran & kedaluwarsa, DNSSEC, dan authoritative nameservers.
- **DNS Records Resolver**: Resolusi DNS real-time untuk record A, AAAA, MX, TXT, NS, CNAME, SOA, dan CAA.
- **Ping & Latency Tester**: Pengukur latensi waktu bolak-balik (RTT), jitter, dan packet loss.
- **IP & Subnet CIDR Calculator**: Hitung subnet mask, usable host range, broadcast address, dan representasi biner.
- **My Public IP & Geolocation**: Deteksi IP publik, lokasi geografis, ISP, dan timezone.
- **HTTP Header & Status Inspector**: Audit response headers & panduan ensiklopedia kode HTTP (1xx-5xx).
- **SSL/TLS Certificate Checker**: Inspeksi masa berlaku sertifikat SSL, penerbit (CA), TLS protocol, dan SANs.
- **MAC Address Vendor & Formatter**: Lookup hardware OUI (Apple, Cisco, Intel, dll) dan konversi format MAC.
- **Port Reference & Protocol Guide**: Database 120+ port TCP/UDP standar.
- **User-Agent & Device Parser**: Dekonstruksi browser, sistem operasi, rendering engine, dan deteksi bot.
- **URL & Query Parameter Analyzer**: Deconstruct URL dan edit parameter kueri secara interaktif.
- **Bandwidth & Download Calculator**: Estimasi waktu transfer data berdasarkan ukuran file dan kecepatan internet.

### 4. 💻 Coding & Web Utilities
- **JSON Formatter & Validator**: Format, minify, perbaiki, dan validasi struktur JSON.
- **Base64 Encoder / Decoder**: Encode dan decode string teks atau biner ke format Base64.
- **JWT Debugger & Decoder**: Dekonstruksi header, payload, dan verifikasi klaim token JWT.
- **Regex Tester & Explainer**: Uji ekspresi reguler dengan flag (g, i, m) dan visual highlight kecocokan.
- **HTML / URL Encoder & Decoder**: Konversi entitas karakter khusus untuk keamanan web.
- **Hash Generator**: Pembuat hash MD5, SHA-1, SHA-256, dan SHA-512.
- **Markdown Live Editor**: Editor markdown dua panel dengan live HTML preview.

### 5. 🎨 Color & Palette Tools
- **Color Converter & Picker**: Konversi instan HEX, RGB, HSL, HSV, dan CMYK.
- **Color Contrast Checker**: Evaluasi rasio kontras warna berdasarkan standar aksesibilitas WCAG AA & AAA.
- **Tailwind CSS Color Helper**: Pencocokan warna kustom ke palet standar Tailwind terdekat.
- **Color Harmonies & Palettes**: Generator skema komplementer, analog, triadik, dan tetradik.
- **Color Shades & Tints**: Generator variasi warna bertahap (tints + putih, shades + hitam).
- **Color Blender**: Interpolasi warna multi-titik dengan ekspor CSS gradient.

### 6. 📱 Social Media & Image Tools
- **QR Code Generator**: Buat QR code kustom dengan opsi ukuran, warna, margin, dan unduh PNG/SVG.
- **Image Cropper & Resizer**: Potong dan sesuaikan resolusi gambar langsung di browser.
- **Social Media Post Previewer**: Simulasi tampilan card preview di Open Graph, Twitter/X, LinkedIn, dan Facebook.
- **SVG Optimizer & Viewer**: Tinjau dan bersihkan kode SVG.

### 7. 🔢 Math & Daily Calculators
- **Percentage & Growth Calculator**: Perhitungan persentase nilai, kenaikan, dan diskon.
- **Discount & Sales Tax Calculator**: Hitung diskon ganda, kupon promosi, dan pajak penjualan.
- **Length & Weight Unit Converter**: Konversi metrik ke imperial untuk panjang, berat, dan suhu.
- **Aspect Ratio Calculator**: Kalkulator rasio aspek video/layar (16:9, 4:3, 1:1, 21:9, kustom).
- **Storage & Data Unit Converter**: Konversi bit, byte, KB, MB, GB, TB, PB.
- **Timezone & Date Difference**: Hitung selisih durasi antara dua tanggal atau zona waktu.

### 8. 🤖 AI-Powered Tools (Powered by Gemini)
- **AI Code Explainer & Optimizer**: Penjelasan logika kode dan saran optimasi performa.
- **AI Regex Assistant**: Buat ekspresi reguler kompleks dari instruksi bahasa manusia.
- **AI Text Enhancer**: Perbaiki tata bahasa, parafrase, dan penyesuaian nada tulisan (formal/casual).

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion
- **Icons**: Lucide React
- **Backend API**: Node.js, Express, tsx
- **Build Tool**: Vite 6, esbuild
- **Database Engine**: `@libsql/client` (Embedded SQLite lokal & Turso Cloud DB over HTTP)
- **Authentication**: Stateless JWT + bcrypt password hashing
- **AI Engine**: Groq API SDK (`groq-sdk`, default `llama-3.3-70b-versatile`)

---

## 📦 Menjalankan Proyek Secara Lokal (SQLite Mode)

### 1. Prasyarat
Pastikan Anda telah menginstal **Node.js (v20+)** dan **npm** atau **bun**.

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variable
Salin file `.env.example` ke `.env`:
```bash
cp .env.example .env
```
Isi konfigurasi lokal:
```env
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
DATABASE_URL=file:data/local.db
JWT_SECRET=your_secure_random_jwt_secret_key
PORT=3000
```

### 4. Menjalankan Server Pengembangan
```bash
npm run dev
```
Aplikasi akan otomatis menginisialisasi skema database SQLite di folder `data/local.db` dan berjalan di `http://localhost:3000`.

---

## ☁️ Deployment ke Vercel (Turso Mode)

1. Buat database di [Turso](https://turso.tech):
   ```bash
   turso db create dmlab-tools-db
   turso db show dmlab-tools-db --url
   turso db tokens create dmlab-tools-db
   ```
2. Tambahkan Environment Variables di Vercel Dashboard:
   - `DATABASE_URL`: URL database Turso Anda (`libsql://...`)
   - `TURSO_AUTH_TOKEN`: Auth token Turso Anda
   - `GROQ_API_KEY`: API Key Groq Anda
   - `GROQ_MODEL`: `llama-3.3-70b-versatile`
   - `JWT_SECRET`: Secret string acak untuk enkripsi JWT
3. Deploy proyek:
   ```bash
   vercel --prod
   ```
