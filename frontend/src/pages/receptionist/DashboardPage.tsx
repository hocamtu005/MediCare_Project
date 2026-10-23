import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, UserCheck, Receipt, Wallet, Activity, Calendar as CalendarIcon, Clock, Stethoscope, Mail, PieChart, MapPin
} from 'lucide-react';
import { getDashboardStats, getTodaysDoctorSchedules } from '../../services/receptionistService';

export default function NurseDashboard() {
  const [stats, setStats] = useState<any>({
    totalPatients: 0, waitingCount: 0, completedCount: 0, totalRevenue: 0,
    revenueBySpecialty: [] // Dữ liệu thật từ API
  });
  const [doctorSchedules, setDoctorSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-CA'));

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setLoading(true);
        // TRUYỀN NGÀY XUỐNG API (Nhớ sửa service của bạn để nhận params date)
        const [statsData, schedulesData] = await Promise.all([
          getDashboardStats(selectedDate), 
          getTodaysDoctorSchedules()
        ]);
        
        setStats({
          ...statsData,
          revenueBySpecialty: statsData.revenueBySpecialty || []
        });
        setDoctorSchedules(schedulesData);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu tổng quan", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOverviewData();
  }, [selectedDate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#14b8a6'];

  let currentOffset = 25;
  const donutSegments = stats.revenueBySpecialty.map((item: any, index: number) => {
    const color = CHART_COLORS[index % CHART_COLORS.length];
    const offset = currentOffset;
    currentOffset -= item.percentage;
    return { ...item, color, offset };
  });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[50vh] gap-3 text-primary-600">
        <Activity className="animate-spin w-6 h-6" />
        <span className="text-xs font-semibold animate-pulse">Đang đồng bộ dữ liệu...</span>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1400px] mx-auto space-y-4 pb-8"
    >
      {/* HEADER COMPACT */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between p-4 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600"></div>
        <div className="pl-3">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-tight">Tổng quan Hoạt động</h1>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">Giám sát doanh thu và theo dõi lịch trực của Bác sĩ.</p>
        </div>
        <div className="mt-3 sm:mt-0 flex items-center gap-2">
           <div className="flex items-center gap-1.5 text-slate-600 font-medium text-xs bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
              <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
              Hôm nay, {currentTime.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
           </div>
           <div className="flex items-center gap-1.5 text-primary-700 font-bold text-xs bg-primary-50 px-3 py-1.5 rounded-md border border-primary-100">
              <Clock className="w-3.5 h-3.5" />
              {currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
           </div>
        </div>
      </div>

      {/* THẺ THỐNG KÊ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3 transition-hover hover:border-blue-200 hover:shadow-md">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-md flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-slate-400 font-bold text-[9px] uppercase tracking-wider mb-0.5">Tổng bệnh nhân</p>
            <h3 className="text-xl font-black text-slate-800 leading-none">{stats.totalPatients} <span className="text-[10px] font-medium text-slate-400">người</span></h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3 transition-hover hover:border-amber-200 hover:shadow-md">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-md flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-slate-400 font-bold text-[9px] uppercase tracking-wider mb-0.5">Đang chờ & Khám</p>
            <h3 className="text-xl font-black text-slate-800 leading-none">{stats.waitingCount} <span className="text-[10px] font-medium text-slate-400">người</span></h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3 transition-hover hover:border-emerald-200 hover:shadow-md">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-md flex items-center justify-center shrink-0">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <p className="text-slate-400 font-bold text-[9px] uppercase tracking-wider mb-0.5">Chờ Thu Phí</p>
            <h3 className="text-xl font-black text-slate-800 leading-none">{stats.completedCount} <span className="text-[10px] font-medium text-slate-400">người</span></h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3 transition-hover hover:border-purple-200 hover:shadow-md">
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-md flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <p className="text-slate-400 font-bold text-[9px] uppercase tracking-wider mb-0.5">Tổng thu thực tế</p>
            <h3 className="text-lg font-black text-purple-700 leading-none mt-0.5">{formatCurrency(stats.totalRevenue)}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* === CỘT TRÁI: DANH SÁCH BÁC SĨ (Chiếm 8/12) === */}
        <div className="lg:col-span-8 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
               <Stethoscope className="w-4 h-4 text-primary-600"/>
               <h2 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide">Danh sách Bác sĩ trực</h2>
            </div>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-100 text-slate-400 text-[10px] uppercase tracking-wider">
                  <th className="px-4 py-3 font-bold">Thông tin Bác sĩ</th>
                  <th className="px-4 py-3 font-bold">Phòng khám</th>
                  <th className="px-4 py-3 font-bold text-center">Ca làm việc</th>
                  <th className="px-4 py-3 font-bold text-right">Tình trạng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {doctorSchedules.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10">
                       <p className="text-slate-500 font-medium text-xs">Chưa có lịch trực nào.</p>
                    </td>
                  </tr>
                ) : (
                  doctorSchedules.map((doc, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-2.5">
                         <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0 border border-indigo-100">
                               {doc.doctorName.replace("BS. ", "").charAt(0)}
                            </div>
                            <div>
                               <span className="font-bold text-slate-800 block text-[13px]">BS. {doc.doctorName.replace("BS. BS. ", "BS. ")}</span>
                               <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1 mt-0.5"><Mail className="w-3 h-3"/> {doc.doctorEmail}</span>
                            </div>
                         </div>
                      </td>
                      <td className="px-4 py-2.5">
                         <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-sky-50 text-sky-700 font-bold border border-sky-100 text-[10px]">
                           <MapPin className="w-3 h-3 text-sky-500" /> P. Khám 0{idx + 1}
                         </span>
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-bold border border-slate-200 text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> {doc.shiftTime}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                         {doc.patientCount >= 10 ? (
                            <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-1 rounded border border-rose-100">
                              Đông ({doc.patientCount})
                            </span>
                         ) : (
                            <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                              Trống ca ({doc.patientCount})
                            </span>
                         )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* === CỘT PHẢI: BIỂU ĐỒ TRÒN COMPACT (4/12) === */}
        <div className="lg:col-span-4 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between gap-2 bg-slate-50/50">
            <div className="flex items-center gap-1.5 shrink-0">
               <PieChart className="w-4 h-4 text-purple-600"/>
               <h2 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide">Doanh thu theo chuyên khoa</h2>
            </div>
            <div className="relative">
               <input 
                 type="date" 
                 value={selectedDate}
                 onChange={(e) => setSelectedDate(e.target.value)}
                 className="bg-white border border-slate-200 text-primary-700 text-[10px] font-bold py-1 px-2 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 cursor-pointer shadow-sm"
               />
            </div>
          </div>

          <div className="p-4 flex-1 flex flex-col items-center justify-center">
             <div className="relative w-40 h-40 mb-4">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
                  {/* Nếu không có doanh thu -> vẽ vòng màu xám */}
                  {stats.totalRevenue === 0 || donutSegments.length === 0 ? (
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#e2e8f0" strokeWidth="4" strokeDasharray="100 0" />
                  ) : (
                    donutSegments.map((segment: any, index: number) => (
                      <circle 
                        key={index}
                        cx="18" cy="18" r="15.915" fill="transparent" 
                        stroke={segment.color} 
                        strokeWidth="4" 
                        strokeDasharray={`${segment.percentage} ${100 - segment.percentage}`} 
                        strokeDashoffset={segment.offset} 
                        className="transition-all duration-1000 ease-out"
                      />
                    ))
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Tổng thu</span>
                  <span className="text-xs font-black text-slate-800">{stats.totalRevenue > 0 ? '100%' : '0đ'}</span>
                </div>
             </div>

             <div className="w-full space-y-2">
                {stats.totalRevenue === 0 || donutSegments.length === 0 ? (
                  <p className="text-center text-xs font-medium text-slate-400 italic">Chưa có doanh thu.</p>
                ) : (
                  donutSegments.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between px-2">
                       <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }}></div>
                          <span className="text-[11px] font-bold text-slate-600">{item.name}</span>
                       </div>
                       <div className="text-right">
                          <span className="text-[11px] font-bold text-slate-800 block">{item.percentage}%</span>
                          <span className="text-[9px] font-medium text-slate-400">{formatCurrency(item.value)}</span>
                       </div>
                    </div>
                  ))
                )}
             </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}