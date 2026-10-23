import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, FileText, ArrowRight, Clock, 
  PlusCircle, HeartPulse, User, MapPin, ChevronRight, Activity, Droplet, Ruler, Scale
} from 'lucide-react';

import { getMyAppointments } from '../../services/userService';
import { getMyHealthProfile } from '../../services/healthProfileService';
import { getMyRecords } from '../../services/medicalRecordService';

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const [upcomingApt, setUpcomingApt] = useState<any>(null);
  const [healthProfile, setHealthProfile] = useState<any>({});
  const [recentRecords, setRecentRecords] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [aptsData, healthData, recordsData] = await Promise.all([
          getMyAppointments(),
          getMyHealthProfile(),
          getMyRecords()
        ]);

        const futureApts = aptsData.filter((apt: any) => 
          apt.status === 'PENDING' || apt.status === 'CONFIRMED'
        );
        
        if (futureApts.length > 0) {
          const sorted = futureApts.sort((a: any, b: any) => 
            new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
          );
          setUpcomingApt(sorted[0]);
        }

        setHealthProfile(healthData);
        setRecentRecords(recordsData.slice(0, 3)); // Lấy 3 bệnh án mới nhất
      } catch (error) {
        console.error("Lỗi tải dữ liệu Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDateTime = (dateString: string) => {
    if (!dateString) return { date: '--/--/----', time: '--:--' };
    const d = new Date(dateString);
    return {
      date: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      time: d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-3 text-primary-600">
        <Activity className="animate-spin w-8 h-8" />
        <span className="text-sm font-medium">Đang tải dữ liệu tổng quan...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      
      {/* HERO BANNER & QUICK ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-primary-600 to-primary-800 p-8 rounded-2xl text-white shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">Chào mừng bạn trở lại! 👋</h1>
          <p className="text-primary-100 max-w-lg text-sm md:text-base font-medium leading-relaxed">Theo dõi lịch trình khám, quản lý hồ sơ bệnh án và chăm sóc sức khỏe chủ động cùng MediCare.</p>
        </div>
        <div className="relative z-10 flex shrink-0">
          <button 
            onClick={() => navigate('/patient/booking')}
            className="bg-white text-primary-700 hover:bg-slate-50 px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95 text-sm"
          >
            <PlusCircle className="w-5 h-5" /> Đặt lịch khám ngay
          </button>
        </div>
        <HeartPulse className="absolute -right-8 -bottom-8 w-64 h-64 text-white opacity-10 rotate-12 pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ================= CỘT TRÁI (LỊCH KHÁM & SỨC KHỎE - Chiếm 8 cột) ================= */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. LỊCH KHÁM SẮP TỚI */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary-600" /> Lịch khám tiếp theo
              </h2>
              <Link to="/patient/booking" className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 bg-primary-50 px-3 py-1.5 rounded-md transition-colors">
                Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {upcomingApt ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100/50 p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <div className="flex items-start gap-4 relative z-10">
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-indigo-50/50 shrink-0">
                    <div className="text-center w-12">
                      <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Tháng {new Date(upcomingApt.appointmentDate).getMonth() + 1}</div>
                      <div className="text-2xl font-black text-slate-800 leading-none mt-1">{new Date(upcomingApt.appointmentDate).getDate()}</div>
                    </div>
                  </div>
                  <div>
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2 ${upcomingApt.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {upcomingApt.status === 'CONFIRMED' ? 'Đã xác nhận' : 'Đang chờ duyệt'}
                    </span>
                    <h3 className="font-bold text-base text-slate-800 mb-1.5">BS. {upcomingApt.doctorName}</h3>
                    <div className="space-y-1 text-xs font-medium text-slate-600">
                      <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-indigo-400" /> {formatDateTime(upcomingApt.appointmentDate).time}</p>
                      <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-indigo-400" /> Phòng khám MediCare Center</p>
                    </div>
                  </div>
                </div>
                <div className="relative z-10 flex sm:flex-col justify-end gap-2 w-full sm:w-auto mt-2 sm:mt-0 border-t sm:border-t-0 border-indigo-100/50 pt-4 sm:pt-0">
                  <button onClick={() => navigate('/patient/booking')} className="w-full sm:w-auto text-xs font-bold bg-white text-indigo-700 border border-indigo-100 px-4 py-2.5 rounded-lg hover:bg-indigo-50 transition-colors shadow-sm text-center">
                    Chi tiết lịch hẹn
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-100">
                  <Calendar className="w-5 h-5 text-slate-300" />
                </div>
                <p className="text-slate-500 text-sm font-medium mb-3">Bạn chưa có lịch khám nào sắp tới.</p>
                <button onClick={() => navigate('/patient/booking')} className="text-xs font-bold text-white bg-primary-600 px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors shadow-sm">Đặt lịch ngay</button>
              </div>
            )}
          </div>

          {/* 2. CHỈ SỐ CƠ THỂ */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" /> Tổng quan sức khỏe
              </h2>
              <Link to="/patient/profile" className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 bg-primary-50 px-3 py-1.5 rounded-md transition-colors">
                Cập nhật <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex flex-col items-center justify-center text-center p-4 bg-rose-50 rounded-xl border border-rose-100 shadow-sm">
                <Droplet className="w-6 h-6 text-rose-500 mb-2" />
                <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider mb-0.5">Nhóm máu</span>
                <span className="font-black text-rose-700 text-xl">{healthProfile.bloodType || '--'}</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-4 bg-purple-50 rounded-xl border border-purple-100 shadow-sm">
                <HeartPulse className="w-6 h-6 text-purple-500 mb-2" />
                <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider mb-0.5">Huyết áp</span>
                <span className="font-black text-purple-700 text-xl">{healthProfile.bloodPressure || '--'}</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-4 bg-sky-50 rounded-xl border border-sky-100 shadow-sm">
                <Ruler className="w-6 h-6 text-sky-500 mb-2" />
                <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider mb-0.5">Chiều cao</span>
                <span className="font-black text-sky-700 text-xl">{healthProfile.height ? `${healthProfile.height} cm` : '--'}</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-4 bg-amber-50 rounded-xl border border-amber-100 shadow-sm">
                <Scale className="w-6 h-6 text-amber-500 mb-2" />
                <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider mb-0.5">Cân nặng</span>
                <span className="font-black text-amber-700 text-xl">{healthProfile.weight ? `${healthProfile.weight} kg` : '--'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* ================= CỘT PHẢI (HỒ SƠ BỆNH ÁN GẦN ĐÂY - Chiếm 4 cột) ================= */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-500" /> Bệnh án gần đây
            </h2>
          </div>

          <div className="flex-1 space-y-3">
            {recentRecords.length > 0 ? (
              recentRecords.map((record) => (
                <div key={record.id} className="group p-4 rounded-xl border border-slate-100 hover:border-primary-300 hover:bg-primary-50/50 transition-all cursor-pointer shadow-sm" onClick={() => navigate('/patient/records')}>
                  <div className="flex justify-between items-start mb-1.5">
                    <h3 className="font-bold text-sm text-slate-800 group-hover:text-primary-700 line-clamp-2 leading-tight">
                      {record.diagnosisIcd10 || "Chưa có chẩn đoán"}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-medium mb-3">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-slate-400"/> {formatDateTime(record.createdAt).date}</span>
                    <span className="flex items-center gap-1"><User className="w-3 h-3 text-slate-400"/> BS. {record.doctorName}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                     <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded">Hoàn tất</span>
                     <span className="flex items-center text-[10px] font-bold text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        Xem chi tiết <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                     </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-100">
                  <FileText className="w-5 h-5 text-slate-300" />
                </div>
                <p className="text-slate-500 text-sm font-medium">Bạn chưa có hồ sơ bệnh án nào.</p>
              </div>
            )}
          </div>
          
          {recentRecords.length > 0 && (
            <button onClick={() => navigate('/patient/records')} className="mt-5 w-full py-2.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-800 font-bold rounded-lg transition-colors text-xs shadow-sm">
              Xem toàn bộ Hồ sơ Bệnh án
            </button>
          )}
        </div>

      </div>
    </div>
  );
}