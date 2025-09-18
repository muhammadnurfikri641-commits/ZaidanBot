const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// === CONFIG (ganti dengan data kamu) ===
// Access token dan phone number id dari Meta Developer (WhatsApp Cloud API)
const TOKEN = process.env.WA_TOKEN || "ACCESS_TOKEN_KAMU";
const PHONE_NUMBER_ID = process.env.WA_PHONE_NUMBER_ID || "PHONE_NUMBER_ID_KAMU";

// Jika ingin hanya admin tertentu yang dapat mengirim konfirmasi ✅,
// isi ADMIN_NUMBER dengan nomor admin (format: countrycode + number, contoh: 6281234567890)
// Jika dikosongkan, siapa saja yang mengirim '✅' akan dianggap konfirmasi.
const ADMIN_NUMBER = process.env.ADMIN_NUMBER || ""; // contoh: "6281234567890"

// Helper untuk ambil nomor tanpa suffix (kadang webhook mengirim '62812...@c.us' atau '62812...')
function normalizeNumber(raw) {
  if (!raw) return "";
  return raw.split('@')[0];
}

app.post("/webhook", async (req, res) => {
  try {
    // Struktur payload WhatsApp Cloud API
    const messageObj = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!messageObj) {
      // Tidak ada pesan baru
      return res.sendStatus(200);
    }

    const fromRaw = messageObj.from;
    const from = normalizeNumber(fromRaw);
    const text = (messageObj.text?.body || "").trim().toLowerCase();

    console.log(`[Pesan masuk] dari=${from} text="${text}"`);

    let reply = "";

    // Jika pesan tanda centang ✅ dan admin diperbolehkan meng-konfirmasi
    if (text === "✅") {
      if (!ADMIN_NUMBER || from === ADMIN_NUMBER) {
        reply = "Terima kasih telah belanja di *Zaidan Store* 🙏";
      } else {
        // Jika ADMIN_NUMBER diset tapi yang mengirim bukan admin, abaikan atau kirim pesan kecil
        console.log(`Tanda ✅ diterima dari ${from} tetapi ADMIN_NUMBER diatur ke ${ADMIN_NUMBER}. Mengabaikan.`);
        return res.sendStatus(200);
      }
    } else if (text.includes("produk") || text.includes("list")) {
      // Jika pelanggan minta daftar produk
      reply = "📦 Produk yang tersedia di *Zaidan Store*:\n- Diamond Mobile Legends (ML)\n- Diamond Free Fire (FF)";
    } else {
      // Balasan default untuk setiap pesan masuk
      reply = "Tunggu admin online ya, Silahkan isi saja barang yang ingin anda beli";
    }

    // Kirim balasan via WhatsApp Cloud API
    await axios.post(
      `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: from,
        text: { body: reply }
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log(`[Balas] ke=${from} text="${reply}"`);
  } catch (err) {
    console.error("Error proses webhook:", err.response?.data || err.message || err);
  }

  res.sendStatus(200);
});

// Endpoint GET untuk verifikasi webhook (digunakan saat setup di Meta Developer)
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || "TOKEN_WEBHOOK_KAMU";
  const mode = req.query["hub.mode"];
  const token_query = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token_query && mode === "subscribe" && token_query === VERIFY_TOKEN) {
    console.log("Webhook terverifikasi");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot berjalan di port ${PORT} 🚀`));
  
