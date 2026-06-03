import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useTickets } from '../../context/TicketContext'

function StatusTimeline({ status, validated }) {
  const steps = [
    { key: 'submitted', label: 'Laporan Diterima', desc: 'Sistem menerima laporan dan membuat tiket secara otomatis.', always: true },
    { key: 'pending', label: 'Menunggu Validasi Admin', desc: 'Laporan menunggu review dari admin.', active: !validated, done: validated },
    { key: 'closed', label: 'Laporan Selesai', desc: 'Laporan telah ditangani dan ditutup oleh admin.', active: validated && status !== 'Closed', done: status === 'Closed' },
  ]

  return (
    <div className="space-y-0">
      {steps.map((step, idx) => {
        if (step.skip) return null
        const state = step.always ? 'done' : step.done ? 'done' : step.active ? 'active' : 'todo'
        const isLast = idx === steps.length - 1
        return (
          <div key={step.key} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold border-2 transition-all ${state === 'done' ? 'bg-green-500 border-green-500 text-white' : state === 'active' ? 'bg-cimb-red border-cimb-red text-white animate-pulse' : 'bg-white border-gray-300 text-gray-400'}`}>
                {state === 'done' ? '✓' : state === 'active' ? '?' : '?'}
              </div>
              {!isLast && <div className={`w-0.5 flex-1 my-1 min-h-6 ${state === 'done' ? 'bg-green-400' : 'bg-gray-200'}`} />}
            </div>
            <div className="pb-5 flex-1">
              <div className={`text-sm font-semibold ${state === 'done' ? 'text-green-700' : state === 'active' ? 'text-cimb-red' : 'text-gray-400'}`}>
                {step.label}
              </div>
              <div className={`text-xs mt-0.5 ${state === 'todo' ? 'text-gray-300' : 'text-gray-500'}`}>{step.desc}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function CekStatusPage() {
  const { fetchPublicTicket } = useTickets()
  const { ticketUuid } = useParams()
  const navigate = useNavigate()

  const [inputId, setInputId] = useState('')
  const [searched, setSearched] = useState(false)
  const [ticket, setTicket] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Auto-fetch jika UUID ada di URL (survive refresh)
  useEffect(() => {
    if (ticketUuid) {
      setIsLoading(true)
      setError('')
      const normalized = ticketUuid.trim().toUpperCase()
      fetchPublicTicket(normalized)
        .then((found) => {
          setTicket(found || null)
          setSearched(true)
        })
        .catch((err) => {
          setTicket(null)
          setSearched(true)
          const backendMessage = err?.response?.data?.detail
          setError(
            backendMessage === 'Ticket not found'
              ? 'Tiket tidak ditemukan'
              : backendMessage || err?.message || 'Tiket tidak ditemukan'
          )
        })
        .finally(() => setIsLoading(false))
    } else {
      // Reset saat kembali ke /cek-status tanpa UUID
      setInputId('')
      setTicket(null)
      setSearched(false)
      setError('')
      setIsLoading(false)
    }
  }, [ticketUuid])  // eslint-disable-line react-hooks/exhaustive-deps

  const handleCek = async () => {
    if (!inputId.trim()) return
    // Persist UUID di URL agar survive refresh
    navigate(`/cek-status/${inputId.trim().toUpperCase()}`, { replace: true })
  }

  const autoClass = ticket?.autoClassification || ''
  const mlScore = ticket?.riskScore ?? 0
  const decisionValue = ticket?.adminDecision
  const decisionLabel = decisionValue === 'phising'
    ? 'Phising'
    : decisionValue === 'legit'
      ? 'Legit'
      : 'Menunggu keputusan admin'
  const decisionClass = decisionValue === 'phising'
    ? 'text-red-700'
    : decisionValue === 'legit'
      ? 'text-green-700'
      : 'text-gray-500'
  const statusLabel = ticket?.adminValidated ? 'LAPORAN SELESAI' : 'MENUNGGU VALIDASI ADMIN'
  const statusBadgeClass = ticket?.adminValidated ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
  const reportDate = ticket?.createdAt ?? ticket?.tanggal
  const reportType = ticket?.type ?? ticket?.jenis
  const reporterName = ticket?.reporterName ?? ticket?.pelapor ?? 'Anonim'

  const classificationConfig = {
    tinggi: { label: 'Tinggi', bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', badge: 'bg-red-100 text-red-800', desc: 'Risiko tinggi — ML mendeteksi indikasi phishing dan sumber tidak dikenali.' },
    sedang: { label: 'Sedang', bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-800', desc: 'Risiko sedang — memerlukan pemeriksaan lebih lanjut oleh admin.' },
    rendah: { label: 'Rendah', bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700', badge: 'bg-green-100 text-green-800', desc: 'Risiko rendah — ML tidak mendeteksi ancaman dan sumber dikenal.' },
  }
  const cls = classificationConfig[autoClass] || null
  const hasCrawlData = Boolean(ticket?.crawlFinalUrl || ticket?.crawlScreenshotUrl)

  return (
    <div className="min-h-screen bg-[#900014] text-white flex flex-col">
      <Navbar />
      <div className="container-custom py-8 flex-1">
        <div className="max-w-xl mx-auto sticky top-4 z-20 space-y-4">
          <h1 className="text-2xl font-bold text-white text-center">Cek Status Laporan</h1>

          {!searched && (
          <div className="card p-6 shadow-lg">
            <label className="block text-sm font-semibold text-gray-700 mb-3">ID Tiket Laporan</label>
            <div className="flex gap-3">
              <input
                className="input-field flex-1 font-mono text-sm tracking-wide"
                placeholder="Contoh: TCK-20250531-0001"
                value={inputId}
                onChange={e => { setInputId(e.target.value); setSearched(false); setError(''); setTicket(null) }}
                onKeyDown={e => e.key === 'Enter' && handleCek()}
              />
              <button className="btn-red text-sm flex-shrink-0 px-5" onClick={handleCek} disabled={!inputId.trim() || isLoading}>
                {isLoading ? 'Memuat...' : 'Cek Status'}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              ID tiket diberikan saat Anda selesai mengirim laporan. Format: <span className="font-mono font-semibold">TCK-YYYYMMDD-XXXX</span> (contoh: TCK-20250531-0001).
            </p>
          </div>
          )}

          {searched && ticket && (
            <div className="animate-in fade-in duration-500">
              <div className="card mb-6 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                  <div>
                    <h2 className="font-bold text-gray-800">{ticket.id}</h2>
                    <p className="text-xs text-gray-500">{new Date(reportDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadgeClass}`}>
                      {statusLabel}
                    </div>
                  </div>
                </div>

                {/* Classification Badge */}
                {cls && (
                  <div className={`mx-6 mt-6 rounded-xl border-2 ${cls.border} ${cls.bg} p-4`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${cls.badge}`}>
                          {cls.label}
                        </span>
                        <span className="ml-2 text-xs text-gray-500">
                          ML Score: {mlScore}/100
                        </span>
                      </div>
                    </div>
                    <p className={`text-sm ${cls.text}`}>{cls.desc}</p>
                    <p className="text-xs text-gray-500 mt-1.5">
                      Whitelist: {ticket?.whitelistCheck?.isWhitelisted
                        ? ticket.whitelistCheck?.whitelistValue || 'Terdaftar'
                        : 'Tidak terdaftar'}
                    </p>
                  </div>
                )}

                {/* Admin decision */}
                {ticket.adminValidated && (
                  <div className="mx-6 mt-4 rounded-lg border border-gray-300 bg-gray-100 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-700">Keputusan Admin</p>
                    <p className={`text-sm font-bold mt-1 ${decisionClass}`}>{decisionLabel}</p>
                    {ticket.adminNotes && (
                      <p className="text-xs text-gray-700 mt-2 italic">"{ticket.adminNotes}"</p>
                    )}
                  </div>
                )}

                {!ticket.adminValidated && (
                  <div className="mx-6 mt-4 rounded-lg border border-orange-200 bg-orange-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">Menunggu Validasi Admin</p>
                    <p className="text-xs text-orange-800 mt-1">Laporan masih dalam antrean review admin.</p>
                  </div>
                )}

                {/* Isi Pesan */}
                <div className="mx-6 mt-4 rounded-lg border border-gray-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Isi Pesan</p>
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                    {ticket.pesan || '(Tidak ada pesan)'}
                  </pre>
                </div>

                {/* Link / URL */}
                {(ticket?.fieldValues?.linkUrl || ticket?.phishingEmail) && (
                  <div className="mx-6 mt-3 rounded-lg border border-gray-200 bg-white p-4">
                    {ticket?.fieldValues?.linkUrl && (
                      <div className={ticket?.phishingEmail ? 'mb-3' : ''}>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Link / URL</p>
                        <p className="text-xs font-mono text-blue-700 break-all">{ticket.fieldValues.linkUrl}</p>
                      </div>
                    )}
                    {ticket?.phishingEmail && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Email Pengirim</p>
                        <p className="text-xs font-mono text-gray-700">{ticket.phishingEmail}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Informasi Laporan */}
                <div className="mx-6 mt-3 mb-2 grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-gray-200 bg-white p-3">
                    <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">Pelapor</p>
                    <p className="text-xs font-medium text-gray-700 truncate">{reporterName}</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-3">
                    <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">Jenis Laporan</p>
                    <p className="text-xs font-medium text-gray-700">{reportType}</p>
                  </div>
                </div>

                {hasCrawlData && (
                  <div className="mx-6 mb-6 rounded-lg border border-gray-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">Hasil Crawl URL</p>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold mb-1">Final URL</p>
                        {ticket?.crawlFinalUrl ? (
                          <a
                            href={ticket.crawlFinalUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-mono text-blue-700 break-all hover:underline"
                          >
                            {ticket.crawlFinalUrl}
                          </a>
                        ) : (
                          <p className="text-xs text-gray-500">Belum tersedia.</p>
                        )}
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold mb-2">Screenshot</p>
                        {ticket?.crawlScreenshotUrl ? (
                          <a href={ticket.crawlScreenshotUrl} target="_blank" rel="noreferrer">
                            <img
                              src={ticket.crawlScreenshotUrl}
                              alt="Screenshot hasil crawl"
                              className="w-full max-w-2xl rounded-lg border border-gray-200"
                              loading="lazy"
                            />
                          </a>
                        ) : (
                          <p className="text-xs text-gray-500">Belum tersedia.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="card p-6">
                <h3 className="font-bold text-gray-800 mb-6">Status Laporan</h3>
                <StatusTimeline status={ticket.status} validated={ticket.adminValidated} />
              </div>

              <div className="mt-8 text-center bg-gray-100 p-6 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-sm text-gray-600 mb-4">Ingin cek status tiket lain?</p>
                <button
                  type="button"
                  onClick={() => navigate('/cek-status')}
                  className="px-4 py-2 bg-red-700 border border-gray-300 rounded-lg text-xs font-semibold hover:bg-red-600 transition-colors"
                >
                  Cek Status Ticket Lainnya
                </button>
              </div>
            </div>
          )}

          {searched && !ticket && (
            <div className="card p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">??</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Tiket Tidak Ditemukan</h2>
              <p className="text-sm text-gray-500 px-8">{error ? error : <>ID tiket <b>{inputId}</b> tidak ditemukan di sistem kami. Mohon periksa kembali nomor tiket Anda.</>}</p>
              <button
                onClick={() => setSearched(false)}
                className="mt-6 text-cimb-red font-semibold hover:underline"
              >
                Coba ID Lain
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
