# Frontend (PhishGuard)

## Kontrak data tiket (backend -> frontend)

Transformasi data tiket dipusatkan di `src/context/TicketContext.jsx` lewat fungsi `toUiTicket`.

### Field API minimal yang divalidasi

1. **Admin endpoints** (`GET /admin/tickets/ticket`, `PATCH /admin/tickets/{id}`):  
`id`, `uuid`, `type`, `content`, `fullname`, `email`, `risk_score`, `status`, `created_at`
2. **Public create endpoint** (`POST /tickets`):  
`uuid`, `type`, `content`, `fullname`, `email`, `risk_score`, `status`, `created_at`

Jika field wajib tidak ada atau format tidak valid (`type`, `status`, `risk_score`, `created_at`), frontend akan melempar error kontrak respons.

### Mapping API -> UI

- `id` -> `id` (fallback ke `uuid` untuk respons public yang belum mengirim `id`)
- `uuid` -> `uuid`
- `type` -> `jenis`
- `content` -> `pesan`
- `fullname` -> `pelapor`
- `email` -> `email`
- `phone_number` -> `fieldValues.nomorPengirim`
- `url` -> `fieldValues.linkUrl`
- `created_at` -> `tanggal`
- `status` -> `status` (`on_review` => `Open`, `reviewed` => `Closed`)
- `risk_score` -> `riskScore`
- `admin_note` -> `adminNotes`

### Catatan penting

Frontend tidak lagi membuat field analisis sintetis (`whitelistScore`, `nlpScore`, `breakdownType`, `findings`, `klasifikasi`) dari sisi UI. Tampilan skor sekarang mengikuti nilai backend (`risk_score`) secara langsung.
