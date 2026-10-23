import { useState, useEffect } from 'react';
import { Users, CalendarCheck, Activity, Stethoscope, TrendingUp, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getAdminDashboardStats } from '../../services/adminService';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    chartData: [] // Dữ liệu 12 tháng thật từ API
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboardStats()
      .then(data => setStats(data))
      .catch(() => toast.error("Không thể tải dữ liệu thống kê"))
      .finally(() => setLoading(false));
  }, []);

  // Custom Tooltip cho Biểu đồ
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 text-white p-3 rounded-lg shadow-xl text-xs border border-slate-700 pointer-events-none">
          <p className="font-bold mb-1 tracking-wide uppercase">{label} / {new Date().getFullYear()}</p>
          <p className="text-primary-300 font-medium">Doanh thu: <span className="font-bold text-white">{payload[0].value} Triệu VNĐ</span></p>
          <p className="text-slate-400 mt-1">Số ca hoàn tất: <span className="text-slate-200 font-bold">{payload[0].payload.appointments}</span> ca</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4 pb-10 max-w-7xl mx-auto">
      {/* 1. COMPACT HEADER CARD - Đồng bộ với toàn hệ thống */}
      <div className="bg-white px-5 py-4 rounded-xl shadow-sm border border-slate-200 flex flex-row justify-between items-center relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600 rounded-l-xl"></div>
        <div className="pl-2">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Tổng quan</h1>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">Giám sát doanh thu thực tế và chỉ số vận hành phòng khám.</p>
        </div>
        <div className="bg-primary-50 p-2 rounded-lg border border-primary-100 hidden sm:block">
          <BarChart3 className="w-5 h-5 text-primary-600" />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-64 gap-2 text-primary-600">
          <Activity className="w-6 h-6 animate-spin" />
          <span className="text-xs font-medium">Đang đồng bộ dữ liệu...</span>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* 2. KHU VỰC 4 THẺ CHỈ SỐ LÀM LẠI CHO ĐỒNG BỘ */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { title: 'Tổng Bệnh nhân', value: stats.totalPatients, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', hover: 'hover:border-blue-300' },
              { title: 'Bác sĩ Hoạt động', value: stats.totalDoctors, icon: Stethoscope, color: 'text-indigo-600', bg: 'bg-indigo-50', hover: 'hover:border-indigo-300' },
              { title: 'Tổng Lượt Khám', value: stats.totalAppointments, icon: CalendarCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', hover: 'hover:border-emerald-300' },
              { title: 'Lịch Chờ Duyệt', value: stats.pendingAppointments, icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50', hover: 'hover:border-amber-300' },
            ].map((stat, index) => (
              <div key={index} className={`bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3 transition-colors cursor-default ${stat.hover}`}>
                <div className={`p-2.5 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.title}</p>
                  <h3 className="text-xl font-extrabold text-slate-800 mt-0.5">{stat.value}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* 3. KHU VỰC BIỂU ĐỒ 12 THÁNG BẰNG RECHARTS */}
          <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-primary-600" />
                  <h3 className="text-base font-bold text-slate-800 uppercase tracking-wide">Biểu đồ Doanh thu (Triệu VNĐ)</h3>
                </div>
                <p className="text-xs text-slate-500 font-medium">Thống kê thực tế 12 tháng trong năm {new Date().getFullYear()}</p>
              </div>
            </div>
            
            <div className="h-[300px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                  <Bar 
                    dataKey="revenue" 
                    fill="#3b82f6" 
                    radius={[4, 4, 4, 4]} 
                    barSize={28}
                    activeBar={{ fill: '#2563eb' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}