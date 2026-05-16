import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import AdminSidebar from '../../components/AdminSidebar'
import { RiskBadge, StatusBadge, ValidationBadge, JenisBadge } from '../../components/Badges'
import { useTickets } from '../../context/TicketContext'
import { WEEKLY_TREND, MODUS_DATA } from '../../data/dummyData'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow text-xs">
      <div className="font-semibold text-gray-700 mb-1">{label}</div>
      {payload.map((p) => <div key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</div>)}
    </div>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { tickets, stats } = useTickets()
  const recent = tickets.slice(0, 6)

  const formatDate = (iso) => new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

  return (
    <div className="min-h-screen bg-[#900014] text-white flex">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-base font-bold text-gray-800">Dashboard Monitoring</h1>
          <p className="text-xs text-gray-400">Overview insiden phishing & fraud</p>
        </div>

        <div className="p-6 space-y-5">
          {/* Metric cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: 'Total Laporan',      value: stats.total,           sub: 'Semua waktu',       color: 'text-gray-800' },
              { label: 'Risiko Tinggi',      value: stats.risikoTinggi,    sub: 'Skor ≥ 70',         color: 'text-red-600' },
              { label: 'Open',               value: stats.open,            sub: 'Belum ditangani',    color: 'text-blue-600' },
              { label: 'Investigasi',        value: stats.investigasi,     sub: 'Sedang diproses',   color: 'text-amber-600' },
              { label: 'Pending Validasi',   value: stats.belumDivalidasi, sub: 'Perlu konfirmasi',  color: 'text-orange-600' },
            ].map((m) => (
              <div key={m.label} className={`card p-4 ${m.label === 'Pending Validasi' && stats.belumDivalidasi > 0 ? 'ring-1 ring-orange-300 bg-orange-50/30' : ''}`}>
                <div className="text-xs text-gray-500 mb-1">{m.label}</div>
                <div className={`text-2xl font-bold ${m.color}`}>{m.value}</div>
                <div className="text-xs text-gray-400 mt-0.5">{m.sub}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="card p-5 lg:col-span-2">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Tren Laporan 7 Hari Terakhir</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={WEEKLY_TREND} barSize={16}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hari" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="laporan" name="Total" fill="#C1272D" radius={[3,3,0,0]} />
                  <Bar dataKey="risiko_tinggi" name="Risiko Tinggi" fill="#fca5a5" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Distribusi Modus</h3>
              <div className="space-y-3">
                {MODUS_DATA.map((m) => (
                  <div key={m.name}>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>{m.name}</span><span className="font-semibold">{m.value}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-cimb-red rounded-full" style={{ width: `${m.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent tickets */}
          <div className="card">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700">Tiket Terbaru</h3>
              <button onClick={() => navigate('/admin/ticketing')} className="text-xs text-cimb-red hover:underline">Lihat semua →</button>
            </div>
            <div className="divide-y divide-gray-50">
              {recent.map((t) => (
                <div key={t.id} onClick={() => navigate(`/admin/ticketing/${t.id}`)}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="text-xs font-mono text-gray-400 w-16 flex-shrink-0">{t.id}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-800 truncate">{t.pesan.substring(0, 70)}...</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <JenisBadge jenis={t.jenis} />
                      <span className="text-xs text-gray-400">{formatDate(t.tanggal)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <RiskBadge score={t.adminOverrideScore ?? t.riskScore} />
                    {!t.adminValidated && (
                      <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded-full">⏳</span>
                    )}
                  </div>
                  <span className="text-gray-300 text-sm">›</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Akurasi Model ML', value: '87%', sub: 'Target min. 70% ✓', accent: 'border-l-red-500' },
              { label: 'Avg. Response Time', value: '2.1h', sub: 'Target < 4 jam ✓', accent: 'border-l-blue-500' },
              { label: 'Closed Minggu Ini', value: stats.closed, sub: `Dari ${stats.total} total`, accent: 'border-l-green-500' },
            ].map((s) => (
              <div key={s.label} className={`card p-4 border-l-4 ${s.accent}`}>
                <div className="text-xs text-gray-500 mb-1">{s.label}</div>
                <div className="text-xl font-bold text-gray-800">{s.value}</div>
                <div className="text-xs text-gray-400">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
