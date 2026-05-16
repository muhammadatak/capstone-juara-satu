import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useTickets } from '../../context/TicketContext'
import smsIcon from '../../assets/sms.png'
import waIcon from '../../assets/wa.png'
import emailIcon from '../../assets/email.png'
import linkIcon from '../../assets/link.png'

// ─── Konfigurasi field dinamis per jenis ─────────────────────────────────────
const JENIS_CONFIG = {
  SMS: {
    icon: smsIcon,
    label: 'SMS',
    desc: 'Pesan teks masuk ke HP',
    hint: null,
    fields: [
      {
        id: 'nomorPengirim',
        label: 'Nomor pengirim (termasuk kode negara)',
        type: 'text',
        placeholder: 'Contoh: +6281234567890',
        required: true,
      },
      {
        id: 'pesan',
        label: 'Isi pesan',
        type: 'textarea',
        placeholder: 'Tempel isi SMS mencurigakan di sini...\n\nContoh:\n"Yth Nasabah, akun Anda dibekukan. Klik http://... untuk verifikasi"',
        required: true,
        isMain: true,
      },
      {
        id: 'linkUrl',
        label: 'Link / URL (jika ada)',
        type: 'text',
        placeholder: 'https://...',
        required: false,
      },
    ],
  },
  WhatsApp: {
    icon: waIcon,
    label: 'WhatsApp',
    desc: 'Chat WA dari nomor tak dikenal',
    hint: {
      title: 'Pesan WhatsApp Penipuan',
      body: 'Mohon sertakan nomor telepon yang terkait dengan akun WhatsApp pengirim pesan phishing. Lampirkan juga isi percakapan, nomor pengirim, dan tautan yang ada. Jelaskan bagaimana pesan tersebut menyesatkan atau berbahaya.',
    },
    fields: [
      {
        id: 'nomorPengirim',
        label: 'Nomor pengirim (termasuk kode negara)',
        type: 'text',
        placeholder: 'Contoh: +6281234567890',
        required: true,
      },
      {
        id: 'pesan',
        label: 'Isi pesan WhatsApp',
        type: 'textarea',
        placeholder: 'Tempel isi pesan WhatsApp mencurigakan...\n\nContoh:\n"Selamat! Anda menang hadiah Rp 5.000.000. Klaim di bit.ly/..."',
        required: true,
        isMain: true,
      },
      {
        id: 'deskripsi',
        label: 'Deskripsi aktivitas penipuan (opsional)',
        type: 'textarea',
        placeholder: 'Jelaskan lebih detail bagaimana pesan ini menyesatkan atau mencurigakan...',
        required: false,
        rows: 3,
      },
    ],
  },
  Email: {
    icon: emailIcon,
    label: 'Email',
    desc: 'Email phishing yang diterima',
    hint: {
      title: 'Email',
      body: 'Untuk serangan berbasis email, harap sertakan bukti tambahan termasuk header email asli jika memungkinkan.',
    },
    fields: [
      {
        id: 'emailPengirim',
        label: 'Alamat email pengirim',
        type: 'email',
        placeholder: 'Contoh: security-alert@cimb-fake.com',
        required: true,
      },
      {
        id: 'pesan',
        label: 'Isi email / pesan mencurigakan',
        type: 'textarea',
        placeholder: 'Tempel isi email mencurigakan di sini...\n\nBisa include baris "Dari:", "Subjek:", dan isi email untuk analisis lebih akurat.',
        required: true,
        isMain: true,
      },
      {
        id: 'linkUrl',
        label: 'Link / URL dalam email (jika ada)',
        type: 'text',
        placeholder: 'https://...',
        required: false,
      },
    ],
  },
  URL: {
    icon: linkIcon,
    label: 'URL / Link',
    desc: 'Tautan langsung yang dicurigai',
    hint: null,
    fields: [
      {
        id: 'pesan',
        label: 'URL / Link mencurigakan',
        type: 'text',
        placeholder: 'https://cimb-verify-secure.xyz/login',
        required: true,
        isMain: true,
      },
      {
        id: 'deskripsi',
        label: 'Bagaimana Anda menemukan link ini?',
        type: 'textarea',
        placeholder: 'Ceritakan bagaimana Anda menemukan atau menerima link ini...\n\nContoh: diklik dari SMS, muncul di hasil Google, dikirim via WA, dll.',
        required: true,
        rows: 4,
      },
    ],
  },
}

const JENIS_OPTIONS = Object.entries(JENIS_CONFIG).map(([id, cfg]) => ({ id, ...cfg }))

// ─── Dynamic Field Renderer ───────────────────────────────────────────────────
function DynamicField({ field, value, onChange, error }) {
  const baseClass = `input-field ${error ? 'border-red-400' : ''}`

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
        {!field.required && <span className="text-gray-400 text-xs ml-1"></span>}
      </label>

      {field.type === 'textarea' ? (
        <textarea
          rows={field.rows || 6}
          className={`${baseClass} resize-none ${field.isMain ? 'font-mono text-xs leading-relaxed' : 'text-sm'}`}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={field.type}
          className={`${baseClass} ${field.isMain ? 'font-mono text-sm' : ''}`}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LaporanPage() {
  const { submitTicket } = useTickets()

  // step: 0=dataDiri | 1=jenisInput | 2=inputDetail | 3=hasil
  const [step, setStep]               = useState(0)
  const [form, setForm]               = useState({ nama: '', email: '' })
  const [formErrors, setFormErrors]   = useState({})
  const [selectedJenis, setSelectedJenis] = useState(null)

  // fieldValues: { [fieldId]: string }
  const [fieldValues, setFieldValues] = useState({})
  const [fieldErrors, setFieldErrors] = useState({})

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [result, setResult]   = useState(null)
  const [ticketId, setTicketId] = useState(null)

  const jenisCfg = selectedJenis ? JENIS_CONFIG[selectedJenis] : null

  // Reset field values when jenis changes
  useEffect(() => {
    setFieldValues({})
    setFieldErrors({})
  }, [selectedJenis])

  // ─── Validation ──────────────────────────────────────────────────────────
  const validateStep0 = () => {
    const e = {}
    if (!form.nama.trim()) e.nama = 'Nama wajib diisi'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email tidak valid'
    setFormErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep2 = () => {
    if (!jenisCfg) return false
    const e = {}
    jenisCfg.fields.forEach((f) => {
      if (f.required && (!fieldValues[f.id] || fieldValues[f.id].trim().length < 3)) {
        e[f.id] = `${f.label.replace(' *', '')} wajib diisi`
      }
    })
    setFieldErrors(e)
    return Object.keys(e).length === 0
  }

  const submitLaporan = async () => {
    if (!jenisCfg || isSubmitting) return
    if (!validateStep2()) return

    setIsSubmitting(true)
    try {
      const mainField  = jenisCfg.fields.find((f) => f.isMain)
      const mainValue  = fieldValues[mainField?.id] || ''
      const extraParts = jenisCfg.fields
        .filter((f) => !f.isMain && fieldValues[f.id])
        .map((f) => fieldValues[f.id])
      const combined = [mainValue, ...extraParts].join(' ')
      const phishingSenderEmail =
        selectedJenis === 'Email' ? (fieldValues.emailPengirim?.trim() || null) : null

      const typeMap = {
        SMS: 'sms',
        WhatsApp: 'whatsapp',
        Email: 'email',
        URL: 'url',
      }

      const created = await submitTicket({
        fullname: form.nama.trim(),
        sender_email: form.email.trim(),
        email: phishingSenderEmail,
        content: combined,
        url: selectedJenis === 'URL' ? mainValue : (fieldValues.linkUrl || null),
        phone_number: fieldValues.nomorPengirim || null,
        type: typeMap[selectedJenis],
      })

      setResult({
        riskScore: created.riskScore || 0,
        klasifikasi: created.riskScore >= 70 ? 'Tinggi' : created.riskScore >= 40 ? 'Sedang' : 'Rendah',
        findings: [`Risk Score: ${created.riskScore}`],
        ticketId: created.uuid
      })
      setTicketId(created.uuid)
      setStep(3)
    } catch (error) {
      console.error('Error submitting laporan:', error)
      alert('Gagal mengirim laporan. Pastikan backend berjalan di http://localhost:8000')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetAll = () => {
    setStep(0); setForm({ nama: '', email: '' }); setSelectedJenis(null)
    setFieldValues({}); setFieldErrors({}); setResult(null); setTicketId(null)
    setIsSubmitting(false)
  }

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#900014] text-white flex flex-col">
      <Navbar />

      {/* Step indicator */}
      {step < 3 && (
        <div className="mt-10">
          <div className="max-w-xl mx-auto px-4 py-3">
            <div className="flex items-center gap-0">
              {['Data Diri', 'Jenis', 'Detail'].map((label, i) => (
                <div key={i} className="flex items-center flex-1 last:flex-none">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[14px] font-bold transition-colors ${
                      i < step ? 'bg-green-500 text-white' : i === step ? 'bg-white text-[#c1272d]' : 'bg-white/20 text-white'
                    }`}>
                      {i < step ? '✓' : i + 1}
                    </div>
                    <span className={`text-md font-medium ${i === step ? 'text-white' : i < step ? 'text-green-300' : 'text-white/50'}`}>
                      {label}
                    </span>
                  </div>
                  {i < 2 && <div className={`flex-1 mx-2 h-px ${i < step ? 'bg-green-400' : 'bg-white/20'}`} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 max-w-xl mx-auto px-4 py-7 w-full mb-10">

        {/* ─── STEP 0: DATA DIRI ─────────────────────────────────────────── */}
        {step === 0 && (
          <div className="card p-6 bg-white/95">
            <h2 className="text-base font-bold text-gray-800 mb-1">Identitas pelapor</h2>
            <p className="text-xs text-gray-400 mb-5">Diperlukan agar tim kami bisa menghubungi Anda jika diperlukan.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nama lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  className={`input-field ${formErrors.nama ? 'border-red-400' : ''}`}
                  placeholder="Nama Anda"
                  value={form.nama}
                  onChange={(e) => { setForm((p) => ({ ...p, nama: e.target.value })); setFormErrors((p) => ({ ...p, nama: '' })) }}
                />
                {formErrors.nama && <p className="text-red-500 text-xs mt-1">{formErrors.nama}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Alamat email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className={`input-field ${formErrors.email ? 'border-red-400' : ''}`}
                  placeholder="email@contoh.com"
                  value={form.email}
                  onChange={(e) => { setForm((p) => ({ ...p, email: e.target.value })); setFormErrors((p) => ({ ...p, email: '' })) }}
                />
                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="btn-red text-sm" onClick={() => validateStep0() && setStep(1)}>
                Lanjut →
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 1: JENIS PENGECEKAN ──────────────────────────────────── */}
        {step === 1 && (
          <div>
            <div className="mb-5">
              <h2 className="text-base font-bold text-white">Apa yang ingin dicek?</h2>
              <p className="text-xs text-white/70 mt-0.5">Pilih jenis pesan atau konten mencurigakan yang Anda terima.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {JENIS_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => { setSelectedJenis(opt.id); setStep(2) }}
                  className="card p-4 text-left hover:border-cimb-red hover:shadow-md transition-all group bg-white/95 flex gap-3 items-start"
                >
                  <img src={opt.icon} alt={opt.label} className="w-7 h-7 object-contain flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-gray-800 group-hover:text-cimb-red transition-colors">{opt.label}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
              <button className="mt-5 bg-white btn-gray text-sm" onClick={() => setStep(0)}>← Kembali</button>
          </div>
        )}

        {/* ─── STEP 2: DETAIL FORM DINAMIS ───────────────────────────────── */}
        {step === 2 && jenisCfg && (
          <div className="card p-6 bg-white/95">
            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
              <img src={jenisCfg.icon} alt={jenisCfg.label} className="w-6 h-6 object-contain" />
              <h2 className="text-base font-bold text-gray-800">{jenisCfg.label}</h2>
            </div>

            {/* Hint box jika ada */}
            {jenisCfg.hint && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5 mt-3">
                <p className="text-sm font-semibold text-gray-700 mb-1">{jenisCfg.hint.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{jenisCfg.hint.body}</p>
              </div>
            )}

            {!jenisCfg.hint && (
              <p className="text-xs text-gray-400 mb-5 mt-1">
                Sistem akan mengekstrak komponen mencurigakan dan menganalisis pola bahasa secara otomatis.
              </p>
            )}

            {/* Dynamic fields */}
            <div className="space-y-4">
              {jenisCfg.fields.map((field) => (
                <DynamicField
                  key={field.id}
                  field={field}
                  value={fieldValues[field.id] || ''}
                  onChange={(val) => {
                    setFieldValues((prev) => ({ ...prev, [field.id]: val }))
                    setFieldErrors((prev) => ({ ...prev, [field.id]: '' }))
                  }}
                  error={fieldErrors[field.id]}
                />
              ))}
            </div>

            <div className="mt-5 flex gap-3 justify-between">
              <button className="btn-gray text-sm" onClick={() => setStep(1)}>← Kembali</button>
              <button
                className="btn-red text-sm flex-1"
                disabled={isSubmitting}
                onClick={submitLaporan}
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim Laporan →'}
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 3: HASIL ─────────────────────────────────────────────── */}
        {step === 3 && result && (
          <div className="space-y-4">
            <div className="bg-blue-50/95 border border-blue-100 rounded-xl p-5">
              <div className="font-semibold text-blue-800 text-sm">Laporan berhasil dikirim</div>
              <p className="text-blue-700 text-xs mt-1">
                Nomor tiket Anda: <span className="font-mono font-bold">#{ticketId}</span>
              </p>
              <p className="text-blue-700 text-xs mt-1">
                Informasi selanjutnya akan kami kirimkan melalui email yang Anda daftarkan.
              </p>
            </div>

            <div className="flex">
              <button className="btn-gray text-sm w-full" onClick={resetAll}>Lapor lagi</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
