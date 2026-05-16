import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTickets } from '../context/TicketContext'

const navItems = [
  { path: '/admin/dashboard',  label: 'Dashboard',  icon: '◧' },
  { path: '/admin/ticketing',  label: 'Ticketing',   icon: '≡' },
]

export default function AdminSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { stats } = useTickets()

  const handleLogout = () => { logout(); navigate('/admin') }

  return (
    <aside className="w-56 bg-gray-900 text-white flex flex-col min-h-screen flex-shrink-0">
      <div className="px-5 py-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-cimb-red rounded flex items-center justify-center">
            <span className="text-white font-black text-sm">C</span>
          </div>
          <div>
            <div className="text-white font-bold text-sm">PhishGuard</div>
            <div className="text-gray-400 text-[9px]">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="px-4 py-3 border-b border-gray-700 space-y-2">
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-gray-800 rounded-lg py-2">
            <div className="text-red-400 font-bold text-lg">{stats.open}</div>
            <div className="text-gray-400 text-[10px]">Open</div>
          </div>
          <div className="bg-gray-800 rounded-lg py-2">
            <div className="text-amber-400 font-bold text-lg">{stats.investigasi}</div>
            <div className="text-gray-400 text-[10px]">Investigasi</div>
          </div>
        </div>
        {stats.belumDivalidasi > 0 && (
          <div className="bg-orange-900/40 border border-orange-700/50 rounded-lg py-2 text-center">
            <div className="text-orange-400 font-bold text-lg">{stats.belumDivalidasi}</div>
            <div className="text-orange-300 text-[10px]">Pending validasi</div>
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              location.pathname.startsWith(item.path)
                ? 'bg-cimb-red text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
            {item.path === '/admin/ticketing' && stats.belumDivalidasi > 0 && (
              <span className="ml-auto bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {stats.belumDivalidasi}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-gray-700">
        <div className="text-xs text-gray-400 mb-0.5">Masuk sebagai</div>
        <div className="text-sm font-medium text-white truncate mb-3">{user?.email}</div>
        <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-red-400 transition-colors">
          Keluar →
        </button>
      </div>
    </aside>
  )
}
