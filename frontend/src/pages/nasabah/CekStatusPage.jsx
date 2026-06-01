import { useState } from 'react'
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
  const [inputId, setInputId] = useState('')
  const [searched, setSearched] = useState(false)
  const [ticket, setTicket] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCek = async () => {
    if (!inputId.trim()) return
    const normalized = inputId.trim().toUpperCase()
    setIsLoading(true)
    setError('')
    try {
      const found = await fetchPublicTicket(normalized)
      setTicket(found || null)
      setSearched(true)
    } catch (err) {
      setTicket(null)
      setSearched(true)
      const backendMessage = err?.response?.data?.detail
      const message =
        backendMessage === 'Ticket not found'
          ? 'Tiket tidak ditemukan'
          : backendMessage || err?.message || 'Tiket tidak ditemukan'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const finalScore = ticket ? (ticket.adminOverrideScore ?? ticket.riskScore) : 0
  const scoreColor = finalScore >= 70 ? 'text-red-700' : finalScore >= 40 ? 'text-amber-700' : 'text-green-700'
  const scoreLabel = finalScore >= 70 ? 'Bahaya' : finalScore >= 40 ? 'Waspada' : 'Aman'
  const meterScore = Math.max(0, Math.min(finalScore, 100))
  const meterPosition = Math.min(98, Math.max(2, meterScore))
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
  const aiRows = parseAiRows(ticket?.aiSuggestion)
  const aiRowsReady = aiRows.length === 3
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
                <div className="p-6 grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Informasi Laporan</p>
                    <p className="text-sm font-medium text-gray-700 mb-3 truncate">{reporterName}</p>
                    <div className="space-y-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">Tanggal Laporan</p>
                        <p className="text-xs text-gray-600">{new Date(reportDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">Jenis Laporan</p>
                        <p className="text-xs text-gray-600">{reportType}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2">Risk Meter</p>
                    <div className="flex flex-col items-end gap-2 min-w-[180px]">
                      <div className="w-full">
                        <div className="relative h-2 rounded-full bg-gradient-to-r from-green-500 via-yellow-400 to-red-500">
                          <span
                            className="absolute -top-1 h-4 w-4 rounded-full border-2 border-white bg-gray-800"
                            style={{ left: `${meterPosition}%`, transform: 'translateX(-50%)' }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                          <span>0</span>
                          <span>50</span>
                          <span>100</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Risk Score <span className={`font-semibold ${scoreColor}`}>{meterScore}/100</span> · {scoreLabel}
                      </div>
                      <div className="text-xs text-gray-500">
                        Hasil Analisis: <span className={`font-semibold ${decisionClass}`}>{decisionLabel}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {ticket.adminValidated ? (
                  <div className="mx-6 mb-4 rounded-lg border border-gray-300 bg-gray-100 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-700">Pesan Admin</p>
                    <p className="text-xs text-gray-700 mt-1">{ticket.adminNotes || 'Admin sudah memvalidasi laporan ini. Silakan pantau status sampai laporan selesai.'}</p>
                  </div>
                ) : (
                  <div className="mx-6 mb-4 rounded-lg border border-orange-200 bg-orange-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">Versi Status: Menunggu Validasi Admin</p>
                    <p className="text-xs text-orange-800 mt-1">Laporan masih dalam antrean review admin. Ringkasan AI bersifat awal dan dapat berubah setelah validasi.</p>
                  </div>
                )}
                <div className="mx-6 mb-6 rounded-lg border border-gray-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">Ringkasan AI</p>
                  <div className="space-y-2 text-xs text-gray-600">
                    {aiRowsReady ? aiRows.map((row, index) => (
                      <div key={`${row.label ?? 'row'}-${index}`} className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                        <div className="w-24 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                          {row.label || `Baris ${index + 1}`}
                        </div>
                        <div className="text-gray-700 leading-relaxed">{row.text}</div>
                      </div>
                    )) : (
                      <div className="text-gray-500">Ringkasan AI belum tersedia.</div>
                    )}
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
                  onClick={() => {
                    setInputId('')
                    setTicket(null)
                    setSearched(false)
                    setError('')
                    setIsLoading(false)
                  }}
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
