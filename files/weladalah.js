
/**
 * config.js — Konfigurasi non-sensitif toko.
 * Edit file ini untuk mengubah tampilan & perilaku toko.
 * Nilai sensitif (API key, token, password) tetap di .env
 */

module.exports = {

  // ── Identitas Toko ──────────────────────────────────────────────────────
  // Nama toko yang tampil di seluruh halaman
  STORE_NAME: 'Dongtube',

  // Deskripsi singkat toko (tampil di hero section)
  STORE_DESCRIPTION: 'Panel hosting, API, OTP, dan berbagai produk digital premium dengan harga terjangkau dan proses otomatis.',

  // ── Kontak & Channel ────────────────────────────────────────────────────
  // Link WhatsApp CS (format: https://wa.me/628xxx)
  STORE_WA: 'https://wa.me/6283143961588',

  // Link Channel WhatsApp (kosongkan jika tidak ada)
  STORE_CHANNEL: 'https://whatsapp.com/channel/0029Vb91qeW17Emm4TVqu53K',

  // Link Instagram (kosongkan jika tidak ada)
  STORE_INSTAGRAM: '',

  // Link TikTok (kosongkan jika tidak ada)
  STORE_TIKTOK: '',

  // ── Gambar ──────────────────────────────────────────────────────────────
  // Logo utama (tampil di hero & footer). Path lokal atau URL
  STORE_LOGO: '/media/logo.jpg',

  // Icon aplikasi (tampil di navbar & favicon). Path lokal atau URL
  STORE_ICON: '/media/icon.jpg',

  // ── Tampilan ─────────────────────────────────────────────────────────────
  // Warna aksen utama dalam format hex (default: hijau emerald)
  STORE_PRIMARY_COLOR: '#34d399',

  // ── Order ───────────────────────────────────────────────────────────────
  // Waktu expire order pending (menit). Setelah ini order otomatis kadaluarsa.
  STORE_EXPIRY_MIN: 15,

};
