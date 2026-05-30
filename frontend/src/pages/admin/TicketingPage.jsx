import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import AdminSidebar from '../../components/AdminSidebar'
import { RiskBadge, StatusBadge, JenisBadge, ScoreRing } from '../../components/Badges'
import { useTickets } from '../../context/TicketContext'

const STATUS_TABS = ['Semua', 'Open', 'Investigasi', 'Closed']

export default function TicketingPage() {
  const navigate = useNavigate()
  const { tickets } = useTickets()
  const [statusFilter, setStatusFilter] = useState('Semua')
  const [risikoFilter, setRisikoFilter] = useState('Semua')
  const [validasiFilter, setValidasiFilter] = useState('Semua')
  const [jenisFilter, setJenisFilter] = useState('Semua')
  const [search, setSearch] = useState('')

  const filtered = tickets
    .filter((t) => {
      const score = t.adminOverrideScore ?? t.riskScore
      const matchStatus   = statusFilter === 'Semua'  || t.status === statusFilter
      const matchRisiko   = risikoFilter === 'Semua'  || (risikoFilter === 'Tinggi' && score >= 70) || (risikoFilter === 'Sedang' && score >= 40 && score < 70) || (risikoFilter === 'Rendah' && score < 40)
      const matchValidasi = validasiFilter === 'Semua' || (validasiFilter === 'Pending' && !t.adminValidated) || (validasiFilter === 'Tervalidasi' && t.adminValidated)
      const matchJenis    = jenisFilter === 'Semua'   || t.jenis === jenisFilter
      const matchSearch   = !search || t.id.toLowerCase().includes(search.toLowerCase()) || t.pelapor?.toLowerCase().includes(search.toLowerCase()) || t.pesan?.toLowerCase().includes(search.toLowerCase())
      return matchStatus && matchRisiko && matchValidasi && matchJenis && matchSearch
    })
    .sort((a, b) => {
      // Sort by risk score descending (highest first for triage)
      const scoreA = a.adminOverrideScore ?? a.riskScore
      const scoreB = b.adminOverrideScore ?? b.riskScore
      return scoreB - scoreA
    })

  const counts = {
    Semua: tickets.length,
    Open: tickets.filter((t) => t.status === 'Open').length,
    Investigasi: tickets.filter((t) => t.status === 'Investigasi').length,
    Closed: tickets.filter((t) => t.status === 'Closed').length,
  }

  const formatDate = (iso) => new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="min-h-screen bg-[#900014] text-white flex flex-col">
      <div className="flex flex-1 overflow-auto">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="bg-white/10 backdrop-blur-sm border-b border-white/10 px-6 py-4">
          <h1 className="text-base font-bold text-white">Manajemen Tiket</h1>
          <p className="text-xs text-white/70">Semua laporan masuk — klik tiket untuk detail & validasi</p>
        </div>

        <div className="p-6 space-y-4">
          {/* Filters */}
          <div className="card p-4 bg-white/95">
            <div className="flex flex-wrap gap-3">
              <input type="text" className="input-field flex-1 min-w-48" placeholder="Cari ID tiket, pelapor, atau isi pesan..."
                value={search} onChange={(e) => setSearch(e.target.value)} />
              <select className="input-field w-36 bg-white" value={risikoFilter} onChange={(e) => setRisikoFilter(e.target.value)}>
                <option value="Semua">Semua Risiko</option>
                <option value="Tinggi">Risiko Tinggi</option>
                <option value="Sedang">Risiko Sedang</option>
                <option value="Rendah">Risiko Rendah</option>
              </select>
              <select className="input-field w-36 bg-white" value={validasiFilter} onChange={(e) => setValidasiFilter(e.target.value)}>
                <option value="Semua">Semua Status</option>
                <option value="Pending">⏳ Pending Validasi</option>
                <option value="Tervalidasi">✓ Tervalidasi</option>
              </select>
              <select className="input-field w-36 bg-white" value={jenisFilter} onChange={(e) => setJenisFilter(e.target.value)}>
                <option value="Semua">Semua Jenis</option>
                <option value="SMS">SMS</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Email">Email</option>
                <option value="URL">URL</option>
              </select>
            </div>
          </div>

          {/* Status tabs */}
          <div className="flex gap-1 bg-white/95 rounded-xl border border-white/20 p-1 w-fit">
            {STATUS_TABS.map((tab) => (
              <button key={tab} onClick={() => setStatusFilter(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${statusFilter === tab ? 'bg-cimb-red text-white' : 'text-gray-500 hover:text-gray-800'}`}>
                {tab}
                <span className={`ml-1.5 text-[10px] ${statusFilter === tab ? 'text-red-200' : 'text-gray-400'}`}>{counts[tab] || 0}</span>
              </button>
            ))}
          </div>

          {/* Ticket list */}
          <div className="card divide-y divide-gray-50 bg-white/95">
            {filtered.length === 0 && (
              <div className="py-14 text-center text-gray-400 text-sm">Tidak ada tiket ditemukan.</div>
            )}
            {filtered.map((t) => {
              const finalScore = t.adminOverrideScore ?? t.riskScore
              return (
                <div key={t.id} onClick={() => navigate(`/admin/ticketing/${t.id}`)}
                  className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors group">
                  <ScoreRing score={finalScore} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-mono text-gray-400">{t.id}</span>
                      <JenisBadge jenis={t.jenis} />
                      <StatusBadge status={t.status} />
                      {!t.adminValidated && (
                        <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded-full">⏳ Pending</span>
                      )}
                      {t.adminOverrideScore != null && (
                        <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-full">✏ Di-override</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-700 truncate">{t.pesan.substring(0, 80)}...</div>
                    <div className="text-xs text-gray-400 mt-0.5">{t.pelapor} · {formatDate(t.tanggal)}</div>
                  </div>
                  <RiskBadge score={finalScore} />
                  <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-sm">›</span>
                </div>
              )
            })}
          </div>

          <div className="text-xs text-white/70 text-right">
            Menampilkan {filtered.length} dari {tickets.length} tiket
          </div>
        </div>
      </main>
      </div>
    </div>
  )
}
