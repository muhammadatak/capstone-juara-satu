// ─────────────────────────────────────────────────────────────────────────────
// DUMMY DATA — Ganti semua fetch di sini saat backend sudah siap
// ─────────────────────────────────────────────────────────────────────────────

export const WHITELIST_URLS = [
  'cimbniaga.co.id', 'octo.id', 'cimbniaga.com', 'octo.cimbniaga.co.id',
]
export const WHITELIST_PHONES = [
  '14041', '1500800', '+6214041', '021-14041',
]
export const WHITELIST_EMAILS = [
  'cs@cimbniaga.co.id', 'info@cimbniaga.co.id', 'noreply@cimbniaga.co.id',
]

// ─── Ticket structure ────────────────────────────────────────────────────────
// id, jenis, pesan (raw input), pelapor, email, tanggal, status
// extractedUrls[], extractedPhones[], extractedEmails[]
// whitelistScore (0 | 80), nlpScore (0-100), riskScore (final 0-100)
// breakdownType: 'combined' | 'nlp_only'
// adminValidated: bool, adminOverrideScore: null | number, adminNotes: string
// ─────────────────────────────────────────────────────────────────────────────

export const DUMMY_TICKETS = [
  {
    id: 'T-0047',
    jenis: 'SMS',
    pesan: 'Yth Nasabah CIMB Niaga, akun Anda terdeteksi aktivitas mencurigakan. Segera verifikasi melalui link berikut atau akun Anda akan diblokir dalam 24 jam: http://cimb-verify-secure.xyz/login',
    pelapor: 'Budi Santoso',
    email: 'budi.s@gmail.com',
    tanggal: '2026-04-01T08:23:00',
    status: 'Open',
    extractedUrls: ['cimb-verify-secure.xyz/login'],
    extractedPhones: [],
    extractedEmails: [],
    whitelistScore: 80,
    nlpScore: 20,
    riskScore: 100,
    breakdownType: 'combined',
    adminValidated: false,
    adminOverrideScore: null,
    adminNotes: '',
  },
  {
    id: 'T-0046',
    jenis: 'WhatsApp',
    pesan: 'Selamat! Anda terpilih sebagai pemenang program loyalitas CIMB Niaga senilai Rp 5.000.000. Klaim hadiah Anda sebelum kadaluarsa: bit.ly/cimb-hadiah2024. Hubungi CS kami di 0812-9999-1234.',
    pelapor: 'Siti Rahayu',
    email: 'siti.rahayu@yahoo.com',
    tanggal: '2026-04-01T07:45:00',
    status: 'Investigasi',
    extractedUrls: ['bit.ly/cimb-hadiah2024'],
    extractedPhones: ['0812-9999-1234'],
    extractedEmails: [],
    whitelistScore: 80,
    nlpScore: 20,
    riskScore: 100,
    breakdownType: 'combined',
    adminValidated: true,
    adminOverrideScore: null,
    adminNotes: 'Dikonfirmasi phishing. Domain bit.ly mengarah ke halaman login palsu.',
  },
  {
    id: 'T-0045',
    jenis: 'Email',
    pesan: 'Dari: security-alert@cimb-niaga-update.com\nKepada: nasabah@email.com\n\nPemberitahuan Penting: Sistem kami mendeteksi percobaan login dari perangkat baru. Jika ini bukan Anda, segera klik link berikut untuk mengamankan akun: https://secure-cimb-update.com/verify?token=abc123',
    pelapor: 'Ahmad Fauzi',
    email: 'ahmad.f@gmail.com',
    tanggal: '2026-03-31T16:10:00',
    status: 'Open',
    extractedUrls: ['secure-cimb-update.com/verify'],
    extractedPhones: [],
    extractedEmails: ['security-alert@cimb-niaga-update.com'],
    whitelistScore: 80,
    nlpScore: 20,
    riskScore: 100,
    breakdownType: 'combined',
    adminValidated: false,
    adminOverrideScore: null,
    adminNotes: '',
  },
  {
    id: 'T-0044',
    jenis: 'SMS',
    pesan: 'Rekening Anda telah dibekukan sementara karena transaksi mencurigakan. Hubungi tim keamanan kami di 0800-1234-567 atau balas pesan ini dengan nomor rekening Anda untuk verifikasi.',
    pelapor: 'Dewi Lestari',
    email: 'dewi.l@gmail.com',
    tanggal: '2026-03-31T14:55:00',
    status: 'Open',
    extractedUrls: [],
    extractedPhones: ['0800-1234-567'],
    extractedEmails: [],
    whitelistScore: 80,
    nlpScore: 20,
    riskScore: 100,
    breakdownType: 'combined',
    adminValidated: false,
    adminOverrideScore: null,
    adminNotes: '',
  },
  {
    id: 'T-0043',
    jenis: 'WhatsApp',
    pesan: 'Beruntung sekali kamu! Dapatkan cashback 50% untuk semua transaksi bulan ini. Daftar sekarang di cimb-cashback-promo.net sebelum kuota habis!',
    pelapor: 'Rudi Hartono',
    email: 'rudi.h@hotmail.com',
    tanggal: '2026-03-31T11:20:00',
    status: 'Investigasi',
    extractedUrls: ['cimb-cashback-promo.net'],
    extractedPhones: [],
    extractedEmails: [],
    whitelistScore: 80,
    nlpScore: 20,
    riskScore: 100,
    breakdownType: 'combined',
    adminValidated: true,
    adminOverrideScore: 85,
    adminNotes: 'Skor di-override: domain mencurigakan tapi konten pesan tidak terlalu agresif.',
  },
  {
    id: 'T-0042',
    jenis: 'SMS',
    pesan: 'INFO: Transaksi kartu kredit CIMB Anda Rp 2.500.000 di Tokopedia berhasil. Bukan Anda? Balas TIDAK ke pesan ini.',
    pelapor: 'Maya Sari',
    email: 'maya.sari@gmail.com',
    tanggal: '2026-03-30T09:15:00',
    status: 'Closed',
    extractedUrls: [],
    extractedPhones: [],
    extractedEmails: [],
    whitelistScore: 0,
    nlpScore: 15,
    riskScore: 15,
    breakdownType: 'nlp_only',
    adminValidated: true,
    adminOverrideScore: null,
    adminNotes: 'False positive. Ini notifikasi resmi dari sistem CIMB Niaga.',
  },
  {
    id: 'T-0041',
    jenis: 'URL',
    pesan: 'https://octo-cimb-promo-cashback.co/daftar?ref=sms',
    pelapor: 'Eko Prasetyo',
    email: 'eko.p@gmail.com',
    tanggal: '2026-03-29T15:30:00',
    status: 'Closed',
    extractedUrls: ['octo-cimb-promo-cashback.co/daftar'],
    extractedPhones: [],
    extractedEmails: [],
    whitelistScore: 80,
    nlpScore: 0,
    riskScore: 80,
    breakdownType: 'combined',
    adminValidated: true,
    adminOverrideScore: null,
    adminNotes: 'Domain tidak terdaftar, dikonfirmasi phishing. Domain sudah di-takedown.',
  },
]

export const WEEKLY_TREND = [
  { hari: 'Sen', laporan: 23, risiko_tinggi: 9 },
  { hari: 'Sel', laporan: 17, risiko_tinggi: 5 },
  { hari: 'Rab', laporan: 34, risiko_tinggi: 14 },
  { hari: 'Kam', laporan: 25, risiko_tinggi: 8 },
  { hari: 'Jum', laporan: 38, risiko_tinggi: 16 },
  { hari: 'Sab', laporan: 15, risiko_tinggi: 4 },
  { hari: 'Min', laporan: 9,  risiko_tinggi: 2 },
]

export const MODUS_DATA = [
  { name: 'SMS phishing', value: 38 },
  { name: 'WhatsApp fraud', value: 29 },
  { name: 'Email spoofing', value: 20 },
  { name: 'URL langsung', value: 13 },
]

export const TIPS_EDUKASI = [
  { icon: '🔗', judul: 'Periksa URL dengan teliti', deskripsi: 'CIMB Niaga hanya menggunakan domain resmi cimbniaga.co.id. Waspada terhadap variasi seperti cimb-niaga[.]xyz atau domain yang menambahkan kata "verify", "update", atau "promo".', tag: 'URL & Domain', color: 'blue' },
  { icon: '🔐', judul: 'Jangan pernah bagikan OTP', deskripsi: 'Bank tidak pernah meminta kode OTP melalui telepon, SMS, atau chat — termasuk yang mengaku petugas CIMB Niaga. OTP hanya untuk konfirmasi transaksi yang kamu lakukan sendiri.', tag: 'OTP & Password', color: 'red' },
  { icon: '📧', judul: 'Verifikasi email pengirim', deskripsi: 'Email resmi CIMB Niaga selalu berakhiran @cimbniaga.co.id. Waspadai email dari domain yang mirip tapi berbeda, seperti @cimb-niaga.com atau @cimbniaga.net.', tag: 'Email', color: 'yellow' },
  { icon: '📱', judul: 'Gunakan aplikasi OCTO resmi', deskripsi: 'Unduh aplikasi OCTO by CIMB Niaga hanya dari Google Play Store atau App Store resmi. Jangan pernah menginstal APK dari link di SMS atau WhatsApp.', tag: 'Aplikasi', color: 'green' },
  { icon: '⚡', judul: 'Laporkan segera jika ada yang mencurigakan', deskripsi: 'Semakin cepat laporan masuk, semakin cepat tim kami dapat memblokir ancaman dan melindungi nasabah lain. Hubungi 14041 atau gunakan platform ini.', tag: 'Tindakan Cepat', color: 'purple' },
]

// ─────────────────────────────────────────────────────────────────────────────
// SIMULASI ANALISIS — Ganti dengan API call ke backend saat integrasi
//
// TODO: Replace dengan:
//   const res = await fetch('/api/analyze', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ jenis, pesan }),
//   })
//   return await res.json()
// ─────────────────────────────────────────────────────────────────────────────
export const simulateAnalysis = (jenis, pesan) => {
  return new Promise((resolve) => {
    // Step 1: Ekstraksi (800ms)
    // Step 2: Whitelist check (800ms)
    // Step 3: NLP (900ms)
    // Total ~2.5s

    // Regex ekstraksi — sama persis dengan yang akan dipakai backend
    const urlRegex = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+(?:\/[^\s]*)?)/gi
    const phoneRegex = /(?:\+62|0)[\d\-\s]{8,14}/g
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g

    const rawUrls    = [...new Set((pesan.match(urlRegex) || []).map(u => u.replace(/^https?:\/\//i,'')))]
    const rawPhones  = [...new Set(pesan.match(phoneRegex) || [])]
    const rawEmails  = [...new Set(pesan.match(emailRegex) || [])]

    // Whitelist check
    const isUrlClean    = rawUrls.every(u   => WHITELIST_URLS.some(w    => u.startsWith(w)))
    const isPhoneClean  = rawPhones.every(p => WHITELIST_PHONES.some(w  => p.includes(w)))
    const isEmailClean  = rawEmails.every(e => WHITELIST_EMAILS.includes(e.toLowerCase()))
    const hasExtracted  = rawUrls.length > 0 || rawPhones.length > 0 || rawEmails.length > 0

    const whitelistScore = (hasExtracted && (!isUrlClean || !isPhoneClean || !isEmailClean)) ? 80 : 0

    // NLP score simulasi — nanti diganti hasil IndoBERT finetuned
    const manipulatifKeywords = ['segera','cepat','darurat','diblokir','terblokir','kadaluarsa','menang','hadiah','gratis','cashback','verifikasi','konfirmasi','transfer','klik','tekan','daftar','klaim']
    const keywordHits = manipulatifKeywords.filter(k => pesan.toLowerCase().includes(k)).length
    const nlpScore = hasExtracted
      ? Math.min(20, keywordHits * 5)
      : Math.min(100, keywordHits * 25)

    const riskScore    = Math.min(100, whitelistScore + nlpScore)
    const breakdownType = hasExtracted ? 'combined' : 'nlp_only'

    // Tentukan klasifikasi
    let klasifikasi
    if (riskScore >= 70) klasifikasi = 'Phishing'
    else if (riskScore >= 40) klasifikasi = 'Mencurigakan'
    else klasifikasi = 'Aman'

    // Temuan
    const findings = []
    if (rawUrls.length > 0 && !isUrlClean)    findings.push(`URL "${rawUrls[0]}" tidak terdaftar di whitelist resmi CIMB Niaga`)
    if (rawPhones.length > 0 && !isPhoneClean) findings.push(`Nomor "${rawPhones[0]}" bukan nomor resmi CIMB Niaga`)
    if (rawEmails.length > 0 && !isEmailClean) findings.push(`Email pengirim "${rawEmails[0]}" bukan domain resmi CIMB Niaga`)
    if (nlpScore > 0) findings.push('Teks mengandung pola manipulatif: urgensi/iming-iming terdeteksi oleh model NLP')
    if (findings.length === 0) findings.push('Tidak ditemukan komponen mencurigakan')

    setTimeout(() => {
      resolve({
        extractedUrls:   rawUrls,
        extractedPhones: rawPhones,
        extractedEmails: rawEmails,
        whitelistScore,
        nlpScore,
        riskScore,
        breakdownType,
        klasifikasi,
        findings,
      })
    }, 2600)
  })
}
