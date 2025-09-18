# ZaidanStore WhatsApp Bot (WhatsApp Cloud API)

Project sederhana untuk menjalankan bot WhatsApp berfungsi sebagai:
- Balasan otomatis saat ada pesan masuk:
  "Tunggu admin online ya, Silahkan isi saja barang yang ingin anda beli"
- Menampilkan daftar produk saat pelanggan mengirim "produk" atau "list"
  (Produk: Diamond ML, Diamond FF)
- Jika admin mengirim "✅" maka bot membalas:
  "Terima kasih telah belanja di Zaidan Store"

---

## Isi package
- `server.js` — kode utama bot
- `package.json` — dependensi & script start
- `README.md` — file ini

---

## Persiapan (singkat)
1. Pastikan sudah punya **WhatsApp Business** & **WhatsApp Cloud API** di Meta Developer.
   Dapatkan `ACCESS_TOKEN` dan `PHONE_NUMBER_ID`.
2. Clone / unzip project ini, lalu:
   ```bash
   npm install
   ```
3. Konfigurasi environment variables (direkomendasikan):
   - `WA_TOKEN` = access token dari Meta
   - `WA_PHONE_NUMBER_ID` = phone number id (contoh: 1234567890)
   - `WEBHOOK_VERIFY_TOKEN` = token verifikasi webhook yang kamu pilih
   - `ADMIN_NUMBER` = (opsional) nomor admin tanpa tanda +, contoh: 6281234567890
     - Jika dikosongkan, maka siapa saja mengirim '✅' akan meng-trigger konfirmasi.

   Contoh menjalankan (Linux/macOS):
   ```bash
   export WA_TOKEN="EAA..."
   export WA_PHONE_NUMBER_ID="1234567890"
   export WEBHOOK_VERIFY_TOKEN="my_verify_token"
   export ADMIN_NUMBER="6281234567890"
   npm start
   ```
   Atau buat file `.env` dan gunakan `dotenv` jika mau.

4. Expose server ke internet (selama development) pakai `ngrok`:
   ```bash
   ngrok http 3000
   ```
   Salin URL ngrok (mis. https://abcd-1234.ngrok.io) lalu daftar webhook di Meta:
   - Callback URL: `https://<NGROK_ID>.ngrok.io/webhook`
   - Verify token: gunakan `WEBHOOK_VERIFY_TOKEN` yang kamu set

5. Uji coba:
   - Kirim pesan dari akun pelanggan -> bot akan membalas pesan default.
   - Kirim "produk" atau "list" -> bot akan mengirim daftar produk.
   - Jika ingin tanda ✅ hanya dari admin: set `ADMIN_NUMBER` sesuai nomor admin.

---

## Catatan penting
- Pastikan token tetap aman. Jangan publish token publik.
- WhatsApp Cloud API punya kebijakan penggunaan. Jangan gunakan untuk spam.
- Jika mau fitur lebih lanjut (katalog, simpan order di DB, kirim media), minta saja — aku bantu tambah.

