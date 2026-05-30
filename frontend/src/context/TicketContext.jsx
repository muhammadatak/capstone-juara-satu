import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const TicketContext = createContext(null)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

const TYPE_LABEL = {
  sms: 'SMS',
  whatsapp: 'WhatsApp',
  email: 'Email',
  url: 'URL',
}

const STATUS_TO_UI = {
  on_review: 'Open',
  reviewed: 'Closed',
}

const STATUS_TO_BACKEND = {
  Open: 'on_review',
  Investigasi: 'on_review',
  Closed: 'reviewed',
}

// Kontrak minimal field dari backend per endpoint.
const REQUIRED_API_FIELDS = {
  admin: ['id', 'uuid', 'type', 'content', 'fullname', 'sender_email', 'risk_score', 'status', 'created_at'],
  public: ['uuid', 'type', 'content', 'fullname', 'sender_email', 'risk_score', 'status', 'created_at'],
}

// Mapping API -> UI (agar field turunan jelas dan konsisten).
const API_TO_UI_FIELD_MAP = {
  id: 'id',
  uuid: 'uuid',
  type: 'jenis',
  content: 'pesan',
  fullname: 'pelapor',
  sender_email: 'pelaporEmail',
  email: 'phishingEmail',
  phone_number: 'fieldValues.nomorPengirim',
  url: 'fieldValues.linkUrl',
  created_at: 'tanggal',
  status: 'status',
  risk_score: 'riskScore',
  admin_note: 'adminNotes',
  ai_suggestion: 'aiSuggestion',
  whitelist_check: 'whitelistCheck',
}

const ALLOWED_BACKEND_TYPES = new Set(Object.keys(TYPE_LABEL))
const ALLOWED_BACKEND_STATUS = new Set(Object.keys(STATUS_TO_UI))

const assertTicketContract = (raw, source) => {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error(`Format tiket backend tidak valid (${source})`)
  }

  const required = REQUIRED_API_FIELDS[source] || REQUIRED_API_FIELDS.admin
  const missing = required.filter((field) => raw[field] === undefined)
  if (missing.length > 0) {
    throw new Error(`Field wajib tiket tidak lengkap (${source}): ${missing.join(', ')}`)
  }

  if (!ALLOWED_BACKEND_TYPES.has(raw.type)) {
    throw new Error(`Nilai "type" tidak dikenal: ${raw.type}`)
  }
  if (!ALLOWED_BACKEND_STATUS.has(raw.status)) {
    throw new Error(`Nilai "status" tidak dikenal: ${raw.status}`)
  }
  if (Number.isNaN(Number(raw.risk_score))) {
    throw new Error(`Nilai "risk_score" bukan angka valid: ${raw.risk_score}`)
  }
  if (Number.isNaN(new Date(raw.created_at).getTime())) {
    throw new Error(`Nilai "created_at" bukan tanggal valid: ${raw.created_at}`)
  }
}

const sortByDateDesc = (items) =>
  [...items].sort(
    (a, b) => new Date(b.tanggal || 0).getTime() - new Date(a.tanggal || 0).getTime()
  )

const toUiTicket = (raw, source = 'admin') => {
  assertTicketContract(raw, source)
  const riskScore = Number(raw.risk_score ?? 0)
  const uiStatus = STATUS_TO_UI[raw.status] || raw.status
  const whitelistCheck = raw.whitelist_check || {}
  return {
    // Endpoint public saat ini belum selalu kirim id, jadi uuid dipakai sebagai fallback identifier UI.
    id: String(raw.id ?? raw.uuid),
    uuid: raw.uuid,
    jenis: TYPE_LABEL[raw.type] || raw.type,
    pesan: raw.content || '',
    fieldValues: {
      nomorPengirim: raw.phone_number || '',
      linkUrl: raw.url || '',
    },
    pelapor: raw.fullname || '',
    email: raw.sender_email || '',
    phishingEmail: raw.email || '',
    whitelistCheck: {
      isWhitelisted: Boolean(whitelistCheck?.is_whitelisted),
      whitelistValue: whitelistCheck?.whitelist_value ?? '',
    },
    riskScore,
    tanggal: raw.created_at,
    status: uiStatus,
    backendStatus: raw.status,
    adminValidated: raw.status === 'reviewed',
    adminOverrideScore: null,
    adminNotes: raw.admin_note || '',
    aiSuggestion: raw.ai_suggestion || '',
  }
}

export function TicketProvider({ children }) {
  const [tickets, setTickets] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const refreshTickets = async () => {
    setIsLoading(true)
    setError('')
    try {
      const { data } = await api.get('/admin/tickets/ticket')
      if (!Array.isArray(data)) {
        throw new Error('Format respons daftar tiket tidak valid: expected array')
      }
      setTickets(sortByDateDesc(data.map((ticket) => toUiTicket(ticket, 'admin'))))
    } catch (err) {
      console.error('refreshTickets failed:', err)
      const message = err?.response?.data?.detail || err?.message || 'Gagal memuat data tiket'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    queueMicrotask(() => {
      refreshTickets()
    })
  }, [])

  const submitTicket = async (payload) => {
    const { data } = await api.post('/tickets', payload)
    const created = toUiTicket(data, 'public')
    setTickets((prev) => sortByDateDesc([created, ...prev]))
    return created
  }

  const patchTicket = async (id, payload) => {
    const { data } = await api.patch(`/admin/tickets/${id}`, payload)
    const updated = toUiTicket(data, 'admin')
    setTickets((prev) =>
      sortByDateDesc(prev.map((t) => (t.id === String(id) ? updated : t)))
    )
    return updated
  }

  const validateTicket = async (id, { notes }) =>
    patchTicket(id, {
      status: 'reviewed',
      admin_note: notes?.trim() || null,
    })

  const updateStatus = async (id, status) =>
    patchTicket(id, {
      status: STATUS_TO_BACKEND[status] || status,
    })

  const getTicketById = (id) => tickets.find((t) => t.id === id)

  const stats = useMemo(() => {
    // Calculate trend for last 7 days
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    // Create day labels (last 7 days)
    const dayLabels = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      dayLabels.push(d.toLocaleDateString('id-ID', { weekday: 'short' }))
    }
    
    // Group tickets by day for last 7 days
    const trendByDay = {}
    dayLabels.forEach((label) => {
      trendByDay[label] = { total: 0, risikoTinggi: 0 }
    })
    
    tickets.forEach((t) => {
      const ticketDate = new Date(t.tanggal)
      if (ticketDate >= sevenDaysAgo) {
        const dayLabel = ticketDate.toLocaleDateString('id-ID', { weekday: 'short' })
        if (trendByDay[dayLabel]) {
          trendByDay[dayLabel].total++
          if (t.riskScore >= 70) {
            trendByDay[dayLabel].risikoTinggi++
          }
        }
      }
    })
    
    const weeklyTrend = dayLabels.map((hari) => ({
      hari,
      laporan: trendByDay[hari].total,
      risiko_tinggi: trendByDay[hari].risikoTinggi,
    }))
    
    // Calculate distribution by type (jenis)
    const modesCounts = {}
    tickets.forEach((t) => {
      modesCounts[t.jenis] = (modesCounts[t.jenis] || 0) + 1
    })
    
    const total = Object.values(modesCounts).reduce((a, b) => a + b, 0)
    const modesDistribution = Object.entries(modesCounts)
      .map(([name, count]) => ({
        name,
        value: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.value - a.value)
    
    return {
      total: tickets.length,
      open: tickets.filter((t) => t.status === 'Open').length,
      investigasi: tickets.filter((t) => t.status === 'Investigasi').length,
      closed: tickets.filter((t) => t.status === 'Closed').length,
      risikoTinggi: tickets.filter((t) => t.riskScore >= 70).length,
      belumDivalidasi: tickets.filter((t) => !t.adminValidated).length,
      weeklyTrend,
      modesDistribution,
    }
  }, [tickets])

  return (
    <TicketContext.Provider
      value={{
        tickets,
        isLoading,
        error,
        apiToUiFieldMap: API_TO_UI_FIELD_MAP,
        refreshTickets,
        submitTicket,
        validateTicket,
        updateStatus,
        getTicketById,
        stats,
      }}
    >
      {children}
    </TicketContext.Provider>
  )
}

export function useTickets() {
  return useContext(TicketContext)
}
