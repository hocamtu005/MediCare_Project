import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Calendar, Users, FileText, 
  LogOut, Stethoscope, ClipboardList, X, History, Clock, User, Building2,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '../../contexts/AuthContext';

interface SidebarProps {
  role: UserRole;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export default function Sidebar({ role, isOpen, setIsOpen }: SidebarProps) {
  const { logout } = useAuth();
  const location = useLocation();

  const getMenu = () => {
    switch (role) {
      case 'PATIENT':
        return [
          { title: 'Tổng quan', path: '/patient/dashboard', icon: LayoutDashboard },
          { title: 'Đặt lịch', path: '/patient/booking', icon: Calendar },
          { title: 'Hồ sơ bệnh án', path: '/patient/records', icon: FileText },
          { title: 'Hồ sơ cá nhân', path: '/patient/profile', icon: User },
        ];
      case 'DOCTOR':
        return [
          { title: 'Tổng quan', path: '/doctor/dashboard', icon: LayoutDashboard },
          { title: 'Khám bệnh', path: '/doctor/schedule', icon: Calendar },
          { title: 'Bệnh nhân', path: '/doctor/patients', icon: Users },
          { title: 'Hồ sơ cá nhân', path: '/doctor/profile', icon: User },
        ];
      case 'RECEPTIONIST':
        return [
          { title: 'Tổng quan', path: '/receptionist/dashboard', icon: LayoutDashboard },
          { title: 'Tiếp nhận & Thanh toán', path: '/receptionist/appointments', icon: ClipboardList },
          { title: 'Đặt lịch hộ', path: '/receptionist/book-for-patient', icon: Calendar },
          { title: 'Tiền khám & Sinh hiệu', path: '/receptionist/triage', icon: Stethoscope },
        ];
      case 'ADMIN':
        return [
          { title: 'Tổng quan', path: '/admin/dashboard', icon: LayoutDashboard },
          { title: 'Quản lý Nhân sự', path: '/admin/staff', icon: Users },
          { title: 'Phân công Lịch trực', path: '/admin/schedules', icon: Calendar },
          { title: 'Cơ sở & Chuyên khoa', path: '/admin/clinics', icon: Building2 },
          { title: 'Hồ sơ Bệnh nhân', path: '/admin/records', icon: ClipboardList },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenu();

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} lg:static`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary-600">
            <Stethoscope className="w-7 h-7 text-primary-600" />
            <span>MediCare</span>
          </Link>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-1.5 scrollbar-hide">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname.includes(item.path) && item.path !== '#';
            
            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive 
                    ? 'bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-100' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-slate-400'}`} />
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 shrink-0">
          <button 
            onClick={logout}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors border border-transparent hover:border-rose-100 shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất tài khoản
          </button>
        </div>
      </aside>
    </>
  );
}