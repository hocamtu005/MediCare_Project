import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../contexts/AuthContext';
import { Menu, Bell } from 'lucide-react';
// IMPORT CHATBOT VÀO ĐÂY
import AIChatbot from '../components/chat/AIChatbot'; 

export default function DashboardLayout({ role }: { role: UserRole }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  // Tự động đổi tên Header tùy theo vai trò đăng nhập
  const getHeaderTitle = () => {
    switch (role) {
      case 'PATIENT': return 'Cổng thông tin Bệnh nhân';
      case 'DOCTOR': return 'Cổng làm việc Bác sĩ';
      case 'RECEPTIONIST': return 'Cổng thông tin Điều dưỡng';
      case 'ADMIN': return 'Trung tâm Quản trị hệ thống';
      default: return 'Không gian làm việc';
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans relative">
      <Sidebar role={role} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-8 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 hidden sm:block">
              {getHeaderTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-5">
            <button className="text-gray-400 hover:text-primary-600 transition-colors relative p-1">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-5 border-l border-gray-200 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-9 h-9 bg-gradient-to-tr from-primary-500 to-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-bold text-gray-800 leading-tight">{user?.fullName}</p>
                <p className="text-xs text-gray-500">{role}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto pb-12">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Gắn AI Chatbot nổi lên trên cùng, chỉ hiển thị cho Bệnh nhân */}
      {role === 'PATIENT' && <AIChatbot />}
    </div>
  );
}