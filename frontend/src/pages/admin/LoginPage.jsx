import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import eyeOnIcon from '../../assets/eyeOn.png'
import eyeOffIcon from '../../assets/eyeOff.png'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, loginError } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    const ok = login(form.email, form.password)
    setLoading(false)
    if (ok) navigate('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-cimb-red rounded-2xl mb-3 shadow-lg">
            <span className="text-white font-black text-2xl">C</span>
          </div>
          <div className="text-xl font-bold text-gray-800">Admin Panel</div>
        </div>

        <div className="card p-7">
          <h2 className="text-md font-semibold text-gray-700 mb-5 text-center">Masuk Sebagai Admin</h2>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Email</label>
              <input type="email" className="input-field" placeholder="admin@cimbniaga.com"
                value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} className="input-field pr-24" placeholder="••••••"
                  value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required />
                <button type="button" onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5">
                  <img
                    src={showPass ? eyeOnIcon : eyeOffIcon}
                    alt={showPass ? 'Sembunyikan password' : 'Tampilkan password'}
                    className="w-5 h-5 object-contain"
                  />
                </button>
              </div>
            </div>
            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-red-700 text-xs">⚠ {loginError}</div>
            )}
            <button type="submit" disabled={loading} className="btn-red w-full flex items-center justify-center gap-2 mt-1">
              {loading ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Memverifikasi...</> : 'Masuk'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Bukan admin? <a href="/" className="text-cimb-red hover:underline">Kembali Ke Beranda</a>
        </p>
      </div>
    </div>
  )
}
