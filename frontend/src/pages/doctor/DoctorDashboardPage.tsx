import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle2, Bell, TrendingUp, CalendarDays, Clock, MapPin, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDashboardStats, getMySchedules } from '../../services/doctorService';

export default function DoctorDashboardPage() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    completedAppointments: 0,
    pendingRequests: 0,
    chartData: []
  });
  
  // State quản lý danh sách lịch trực
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboardStats(),
      getMySchedules()
    ])
    .then(([statsData, schedulesData]) => {
      setStats(statsData);
      setSchedules(schedulesData);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-3 text-primary-600">
        <Activity className="w-8 h-8 animate-spin" />
        <span className="text-sm font-bold animate-pulse">Đang tải dữ liệu Bác sĩ...</span>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1400px] mx-auto space-y-4 pb-10"
    >
      {/* HEADER COMPACT THEO CHUẨN HỆ THỐNG */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600"></div>
        <div className="pl-2">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-tight">Tổng quan</h1>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">Theo dõi hiệu suất khám chữa bệnh và lịch trực của bạn.</p>
        </div>
      </div>

      {/* ================= 3 THẺ CHỈ SỐ NHỎ GỌN ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center gap-4 hover:border-primary-200 transition-colors">
          <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-md flex items-center justify-center shrink-0 border border-sky-100">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Tổng bệnh nhân</p>
            <h3 className="text-2xl font-black text-slate-800 leading-none">{stats.totalPatients} <span className="text-[10px] text-slate-500 font-medium">người</span></h3>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center gap-4 hover:border-emerald-200 transition-colors">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-md flex items-center justify-center shrink-0 border border-emerald-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Ca khám hoàn tất</p>
            <h3 className="text-2xl font-black text-slate-800 leading-none">{stats.completedAppointments} <span className="text-[10px] text-slate-500 font-medium">ca</span></h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center gap-4 hover:border-amber-200 transition-colors">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-md flex items-center justify-center shrink-0 border border-amber-100">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Lịch hẹn chờ duyệt</p>
            <h3 className="text-2xl font-black text-slate-800 leading-none">{stats.pendingRequests} <span className="text-[10px] text-slate-500 font-medium">yêu cầu</span></h3>
          </div>
        </div>
      </div>

      {/* ================= KHU VỰC BỐ CỤC 2 CỘT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* CỘT TRÁI: BIỂU ĐỒ (Chiếm 8/12) */}
        <div className="lg:col-span-8 bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <TrendingUp className="w-4 h-4 text-primary-600" />
            <h3 className="font-bold text-slate-800 text-[13px] uppercase tracking-wide">Biểu đồ lượt khám 7 ngày qua</h3>
          </div>
          <div className="h-[300px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                <Bar dataKey="patients" name="Bệnh nhân" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CỘT PHẢI: LỊCH TRỰC SẮP TỚI (Chiếm 4/12) */}
        <div className="lg:col-span-4 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col h-[380px]">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50 shrink-0">
            <CalendarDays className="w-4 h-4 text-primary-600" />
            <h3 className="font-bold text-slate-800 text-[13px] uppercase tracking-wide">Lịch trực sắp tới</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {schedules.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                <CalendarDays className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-xs font-medium">Chưa có phân công lịch trực.</p>
              </div>
            ) : (
              schedules.map((sch) => (
                <div key={sch.id} className="flex flex-col p-3 border border-slate-100 rounded-lg hover:border-primary-200 hover:shadow-sm transition-all bg-white group">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary-50 text-primary-700 rounded-md flex flex-col items-center justify-center shrink-0 border border-primary-100">
                      <span className="text-[9px] font-bold uppercase tracking-wider">{new Date(sch.workDate).toLocaleDateString('vi-VN', { weekday: 'short' })}</span>
                      <span className="font-black text-base leading-none">{new Date(sch.workDate).getDate()}</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-xs leading-tight mb-1">
                        {new Date(sch.workDate).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <div className="flex items-center gap-1.5 font-bold text-primary-600 text-[11px] bg-primary-50/50 inline-flex px-1.5 py-0.5 rounded">
                        <Clock className="w-3 h-3"/> {sch.startTime} - {sch.endTime}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-slate-50 text-[11px] text-slate-600 flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0"/> 
                      <span>Thời lượng: <strong className="text-slate-800">{sch.slotDuration} phút/ca</strong></span>
                    </div>
                    
                    {sch.roomName && (
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5"/> 
                        <span className="leading-tight"><strong className="text-slate-800">{sch.roomName}</strong> <span className="text-slate-400">({sch.clinicName})</span></span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
}