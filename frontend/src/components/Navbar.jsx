import { Link, useLocation } from 'react-router-dom'

const LANDING_TOP_NAV = [
  { label: 'Personal' },
  { label: 'Business' },
  { label: 'CIMB Preferred & Private' },
  { label: 'CIMB Niaga Syariah' },
  { label: 'Investor' },
  { label: 'About Us' },
  { label: 'Laporan Phising', to: '/laporan' },
]

export default function Navbar() {
  const location = useLocation()

  return (
    <nav className="sticky top-0 z-50 border-b border-white/20 bg-[#6f0211]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2 text-[10px] font-semibold md:text-xs">
          <Link to="/" className="rounded-full bg-black/30 px-2 py-1">CIMB NIAGA</Link>
          <div className="hidden items-center gap-2 md:flex">
            {LANDING_TOP_NAV.map((item) => (
              item.to ? (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`rounded-full border px-2.5 py-1 transition ${
                    location.pathname.startsWith(item.to)
                      ? 'border-white/40 bg-white/20 text-white'
                      : 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.label}
                  className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 transition hover:bg-white/20"
                  type="button"
                >
                  {item.label}
                </button>
              )
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Link to="/admin" className="rounded-full border border-white/30 px-3 py-1 hover:bg-white/10">Login</Link>
          <button className="rounded-full border border-white/30 px-2 py-1 hover:bg-white/10" type="button">ID</button>
        </div>
      </div>
    </nav>
  )
}
