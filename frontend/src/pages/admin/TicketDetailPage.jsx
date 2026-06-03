import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AdminSidebar from '../../components/AdminSidebar'
import { StatusBadge, ValidationBadge, JenisBadge, ScoreRing, DecisionBadge, AutoClassificationBadge } from '../../components/Badges'
import { useTickets } from '../../context/TicketContext'

// Label mapping untuk field tambahan per jenis
const FIELD_LABELS = {
  nomorPengirim: 'Nomor Pengirim',
  emailPengirim: 'Email Pengirim',
  linkUrl:       'Link / URL Tambahan',
  deskripsi:     'Deskripsi Tambahan',
}

export default function TicketDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getTicketById, validateTicket, updateStatus } = useTickets()
  const ticket = getTicketById(id)

  const [overrideMode, setOverrideMode]   = useState(false)
  const [overrideScore, setOverrideScore] = useState('')
  const [adminNotes, setAdminNotes]       = useState('')
  const [adminDecision, setAdminDecision] = useState('')
  const [confirmSaved, setConfirmSaved]   = useState(false)

  if (!ticket) return (
    <div className="min-h-screen bg-[#900014] text-white flex">
      <AdminSidebar />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-base font-semibold text-gray-700 mb-3">Tiket tidak ditemukan</h2>
          <button className="px-3 py-1.5 bg-white text-[#900014] rounded-md text-sm font-medium border border-gray-200 shadow-sm" onClick={() => navigate('/admin/ticketing')}>Kembali</button>
        </div>
      </main>
    </div>
  )

  const finalScore = ticket.adminOverrideScore ?? ticket.riskScore

  const canValidate = adminDecision === 'phising' || adminDecision === 'legit'

  const handleValidate = (withOverride) => {
    if (!canValidate) return
    validateTicket(ticket.id, {
      overrideScore: withOverride && overrideScore !== '' ? parseInt(overrideScore) : null,
      notes: adminNotes,
      decision: adminDecision,
    })
    setConfirmSaved(true)
    setTimeout(() => setConfirmSaved(false), 3000)
    setOverrideMode(false)
    setOverrideScore('')
  }

  const formatDate = (iso) => new Date(iso).toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  // Ambil field tambahan (bukan pesan utama) yang terisi
  const extraFields = Object.entries(ticket.fieldValues || {}).filter(
    ([key, val]) => key !== 'pesan' && val && val.trim()
  )

  const parseAiRows = (text) => {
    if (!text) return []
    return text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const cleaned = line.replace(/^\d+\)\s*|^\d+\.\s*/, '').trim()
        const [labelPart, ...rest] = cleaned.split(':')
        if (rest.length === 0) {
          return { label: null, text: cleaned }
        }
        return { label: labelPart.trim(), text: rest.join(':').trim() }
      })
  }

  const aiRows = parseAiRows(ticket.aiSuggestion)
  const aiRowsReady = aiRows.length === 3
  const hasCrawlData = Boolean(ticket.crawlFinalUrl || ticket.crawlScreenshotUrl)

  return (
    <div className="min-h-screen bg-[#900014] text-white flex">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">

        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate('/admin/ticketing')} className="px-3 py-1.5 bg-white text-[#900014] rounded-md text-sm font-medium border border-gray-200 shadow-sm">
            Kembali
          </button>
          <div className="w-px h-5 bg-gray-200" />
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-bold font-mono text-gray-800">{ticket.uuid}</span>
            <JenisBadge jenis={ticket.jenis} />
            <AutoClassificationBadge classification={ticket.autoClassification} />
            <StatusBadge status={ticket.status} />
            <ValidationBadge validated={ticket.adminValidated} />
            <DecisionBadge decision={ticket.adminDecision} />
            {ticket.adminOverrideScore != null && (
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                Override {ticket.riskScore} to {ticket.adminOverrideScore}
              </span>
            )}
          </div>
        </div>

        <div className="p-6 max-w-4xl space-y-5">

          {/* Save confirmation */}
          {confirmSaved && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2 text-green-700 text-sm">
              <span>Berhasil</span> Validasi berhasil disimpan. Status tiket diperbarui.
            </div>
          )}

          {/* ─── VALIDATION PANEL ──────────────────────────────────────── */}
          {!ticket.adminValidated ? (
            <div className="card p-5 border-2 border-orange-200 bg-white text-gray-800">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-bold text-orange-800">Panel Validasi Admin</h3>
              </div>
              <p className="text-xs text-orange-700 mb-4">
                Risk level: <strong className="uppercase">{ticket.autoClassification || '—'}</strong>.
                Review laporan di bawah, kemudian konfirmasi keputusan sebelum tiket dilanjutkan.
              </p>

              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Keputusan admin <span className="text-red-500">*</span>
                </label>
                <select
                  className="input-field text-xs bg-white"
                  value={adminDecision}
                  onChange={(e) => setAdminDecision(e.target.value)}
                >
                  <option value="">Pilih keputusan...</option>
                  <option value="phising">Phising</option>
                  <option value="legit">Legit</option>
                </select>
                {!canValidate && (
                  <p className="text-[11px] text-red-500 mt-1">Keputusan admin wajib dipilih.</p>
                )}
              </div>

              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Catatan admin (opsional)
                </label>
                <textarea
                  rows={2}
                  className="input-field resize-none text-xs"
                  placeholder="Tambahkan catatan investigasi, alasan override, atau temuan tambahan..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>

              {overrideMode && (
                <div className="mb-4 bg-white rounded-lg border border-gray-200 p-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Override skor risiko (0–100)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number" min={0} max={100}
                      className="input-field w-28 text-sm"
                      placeholder="Contoh: 75"
                      value={overrideScore}
                      onChange={(e) => setOverrideScore(e.target.value)}
                    />
                    <span className="text-xs text-gray-400">Skor asli: {ticket.riskScore}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <button className="btn-red text-sm" onClick={() => handleValidate(overrideMode && overrideScore !== '')} disabled={!canValidate}>
                  {overrideMode && overrideScore !== ''
                    ? `Konfirmasi dengan skor ${overrideScore}`
                    : 'Konfirmasi skor otomatis'}
                </button>
                <button
                  className={`text-sm px-4 py-2.5 rounded-lg border font-medium transition-colors ${
                    overrideMode ? 'border-gray-300 text-gray-600 hover:bg-gray-50' : 'border-blue-300 text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => { setOverrideMode((v) => !v); setOverrideScore('') }}
                >
                  {overrideMode ? 'Batal override' : 'Override skor'}
                </button>
              </div>
            </div>
          ) : (
            <div className="card p-4 border border-green-200 bg-white text-gray-800">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-green-800">Sudah divalidasi admin</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Update status:</span>
                  <select
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white"
                    value={ticket.status}
                    onChange={(e) => updateStatus(ticket.id, e.target.value)}
                  >
                    <option value="Open">Open</option>
                    <option value="Investigasi">Investigasi</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
              {ticket.adminNotes && (
                <p className="text-xs text-green-700 mt-2 italic">"{ticket.adminNotes}"</p>
              )}
            </div>
          )}

          {/* ─── SCORE OVERVIEW ────────────────────────────────────────── */}
          <div className={`card p-5 flex items-center gap-5 border-2 bg-white text-gray-800 ${
            ticket.autoClassification === 'tinggi' ? 'border-red-200'
            : ticket.autoClassification === 'sedang' ? 'border-amber-200'
            : 'border-green-200'
          }`}>
            <ScoreRing score={finalScore} />
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-0.5">ML Score</div>
              <div className={`text-xl font-bold ${
                finalScore >= 70 ? 'text-red-700' : finalScore >= 40 ? 'text-amber-700' : 'text-green-700'
              }`}>
                {finalScore}/100
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <AutoClassificationBadge classification={ticket.autoClassification} />
                <span className="text-xs text-gray-500">
                  Whitelist: {ticket.whitelistCheck?.isWhitelisted
                    ? ticket.whitelistCheck?.whitelistValue || 'Terdaftar'
                    : 'Tidak terdaftar'}
                </span>
                {ticket.adminOverrideScore != null && (
                  <span className="text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-xs">
                    Override {ticket.riskScore} → {ticket.adminOverrideScore}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ─── GRID INFO ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Info laporan */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                Info Laporan
              </h3>
              <dl className="space-y-3">
                {[
                  { label: 'Pelapor',  value: ticket.pelapor || '—' },
                  { label: 'Email Pelapor', value: ticket.email || '—', mono: true },
                  { label: 'Email Phishing', value: ticket.phishingEmail || '—', mono: true },
                  { label: 'Jenis',    value: <JenisBadge jenis={ticket.jenis} /> },
                  { label: 'Status',   value: <StatusBadge status={ticket.status} /> },
                  { label: 'Tanggal',  value: formatDate(ticket.tanggal), small: true },
                ].map(({ label, value, mono, small }) => (
                  <div key={label}>
                    <dt className="text-xs text-gray-400 mb-0.5">{label}</dt>
                    <dd className={`${mono ? 'font-mono text-xs' : small ? 'text-xs' : 'text-sm'} font-medium text-gray-800`}>
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Ekstraksi otomatis */}
            <div className="card p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                  Hasil Whitelist Check
                </h3>
                <div className="rounded-lg p-3 bg-amber-50 border border-amber-100">
                  <div className="text-xs text-gray-500 mb-1">Nilai whitelist</div>
                  <div className="font-mono text-xs text-gray-700 break-all">
                    {ticket.whitelistCheck?.whitelistValue || '-'}
                  </div>
                  <div className="mt-2 text-xs font-semibold text-amber-700">
                    {ticket.whitelistCheck?.isWhitelisted ? 'Whitelist' : 'Tidak di whitelist'}
                  </div>
                </div>

                {hasCrawlData && (
                  <div className="card p-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                    Hasil Crawl URL
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Final URL</div>
                      {ticket.crawlFinalUrl ? (
                        <a
                          href={ticket.crawlFinalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-mono text-blue-700 break-all hover:underline"
                        >
                          {ticket.crawlFinalUrl}
                        </a>
                      ) : (
                        <div className="text-xs text-gray-500">Belum tersedia.</div>
                      )}
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-2">Screenshot</div>
                      {ticket.crawlScreenshotUrl ? (
                        <a href={ticket.crawlScreenshotUrl} target="_blank" rel="noreferrer">
                          <img
                            src={ticket.crawlScreenshotUrl}
                            alt="Screenshot hasil crawl"
                            className="w-full max-w-2xl rounded-lg border border-gray-200"
                            loading="lazy"
                          />
                        </a>
                      ) : (
                        <div className="text-xs text-gray-500">Belum tersedia.</div>
                      )}
                    </div>
                  </div>
                  </div>
                )}
              </div>
          </div>

          {/* ─── DATA TAMBAHAN DARI PELAPOR ────────────────────────────── */}
          {extraFields.length > 0 && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                Data Tambahan dari Pelapor
              </h3>
              <dl className="space-y-4">
                {extraFields.map(([key, val]) => (
                  <div key={key}>
                    <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      {FIELD_LABELS[key] || key}
                    </dt>
                    <dd className={`text-sm text-gray-800 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100 ${
                      key === 'nomorPengirim' || key === 'emailPengirim' || key === 'linkUrl'
                        ? 'font-mono text-xs'
                        : 'leading-relaxed'
                    }`}>
                      {val}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* ─── PESAN ASLI ────────────────────────────────────────────── */}
          <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Pesan Asli dari Pelapor
            </h3>
            <pre className="text-xs text-gray-700 bg-gray-50 rounded-xl p-4 whitespace-pre-wrap font-sans leading-relaxed border border-gray-100">
              {ticket.pesan}
            </pre>
          </div>

        </div>
      </main>
    </div>
  )
}
