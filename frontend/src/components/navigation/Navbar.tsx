import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Stethoscope, Home, CalendarDays } from 'lucide-react' 

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-main flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary-600">
          <Stethoscope className="w-7 h-7 text-primary-600" />
          <span>MediCare</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Nút Trang chủ */}
          <Link 
            to="/" 
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-gray-600 bg-transparent hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all duration-300"
          >
            <Home className="w-4 h-4" />
            <span>Trang chủ</span>
          </Link>

          {/* Nút Đặt lịch */}
          <Link 
            to="/login" 
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-gray-600 bg-transparent hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all duration-300"
          >
            <CalendarDays className="w-4 h-4" />
            <span>Đặt lịch</span>
          </Link>
        </div>

        <div>
          {isAuthenticated ? (
            <button onClick={logout} className="text-red-600 hover:text-red-700 font-medium transition-colors">Đăng xuất</button>
          ) : (
            <Link to="/login" className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors shadow-sm">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}