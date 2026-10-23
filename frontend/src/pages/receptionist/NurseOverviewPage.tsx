import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, UserCheck, CreditCard, X, Receipt, Printer, Phone, User, Activity, Stethoscope, Banknote, CheckCircle2, ArrowRight, Clock, Calendar as CalendarIcon
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { getTodaysAppointments, checkInPatient, processPayment, downloadReceiptPdf, getDashboardStats } from '../../services/receptionistService';

export default function NurseOverviewPage() {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Nút chuyển đổi Tab: RECEPTION (Tiếp nhận) hoặc PAYMENT (Thanh toán) chuẩn thiết kế Admin
  const [activeView, setActiveView] = useState<'RECEPTION' | 'PAYMENT'>('RECEPTION');
  const [revenueStats, setRevenueStats] = useState({ totalRevenue: 0, completedCount: 0 });

  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [modalType, setModalType] = useState<'NONE' | 'CHECKIN' | 'PAYMENT'>('NONE');
  const [checkinNote, setCheckinNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appointmentsData, statsData] = await Promise.all([
        getTodaysAppointments(),
        getDashboardStats()
      ]);
      setQueue(appointmentsData);
      setRevenueStats({ totalRevenue: statsData.totalRevenue, completedCount: statsData.completedCount });
    } catch (error) {
      toast.error("Không thể đồng bộ dữ liệu với hệ thống.");
    } finally {
      setLoading(false);
    }
  };

  const currentList = useMemo(() => {
    let filtered = queue.filter(q => 
      q.patient.toLowerCase().includes(search.toLowerCase()) || 
      (q.phone && q.phone.includes(search))
    );

    if (activeView === 'RECEPTION') {
      // Tiếp nhận: Chỉ hiện ca CHƯA KHÁM
      return filtered.filter(q => ['PENDING', 'CONFIRMED', 'CHECKED_IN', 'TRIAGED', 'IN_PROGRESS'].includes(q.status));
    } else {
      // Thanh toán: Chỉ hiện ca ĐÃ KHÁM XONG
      return filtered.filter(q => ['COMPLETED', 'PAID'].includes(q.status));
    }
  }, [queue, search, activeView]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[9px] font-bold uppercase tracking-wider border border-slate-200">Chưa duyệt</span>;
      case 'CONFIRMED': return <span className="px-2 py-1 bg-sky-50 text-sky-600 rounded text-[9px] font-bold uppercase tracking-wider border border-sky-100">Mới đến</span>;
      case 'CHECKED_IN': return <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded text-[9px] font-bold uppercase tracking-wider border border-amber-100">Đã Check-in</span>;
      case 'TRIAGED': return <span className="px-2 py-1 bg-orange-50 text-orange-600 rounded text-[9px] font-bold uppercase tracking-wider border border-orange-100">Đã Sinh hiệu</span>;
      case 'IN_PROGRESS': return <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded text-[9px] font-bold uppercase tracking-wider border border-purple-100">Đang Khám</span>;
      case 'COMPLETED': return <span className="px-2 py-1 bg-rose-50 text-rose-600 rounded text-[9px] font-bold uppercase tracking-wider border border-rose-100">Chờ Thu Tiền</span>;
      case 'PAID': return <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[9px] font-bold uppercase tracking-wider border border-emerald-100">Hoàn tất</span>;
      default: return <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[9px] font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    setActionLoading(true);
    try {
      if (modalType === 'CHECKIN') {
        toast.loading("Đang xử lý tiếp đón...", { id: "action" });
        await checkInPatient(selectedPatient.id, checkinNote);
        toast.success("Tiếp đón thành công!", { id: "action" });
      } else if (modalType === 'PAYMENT') {
        toast.loading("Đang xử lý thanh toán...", { id: "action" });
        await processPayment(selectedPatient.id);
        
        toast.loading("Đang xuất biên lai...", { id: "action" });
        const blob = await downloadReceiptPdf(selectedPatient.id);
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `BienLai_${selectedPatient.patient.replace(/\s+/g, '_')}.pdf`);
        document.body.appendChild(link);
        link.click(); 
        link.parentNode?.removeChild(link);
        
        toast.success("Thanh toán & Xuất biên lai thành công!", { id: "action" });
      }
      
      fetchData(); 
      setModalType('NONE');
      setCheckinNote('');
    } catch (error: any) {
      toast.error(error.response?.data || "Có lỗi xảy ra khi xử lý!", { id: "action" });
    } finally {
      setActionLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    if (!amount) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="space-y-4 relative max-w-[1400px] mx-auto pb-8">
      <Toaster position="top-right" />
      
      {/* HEADER COMPACT */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600"></div>
        <div className="pl-2">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-tight">Tiếp đón & Thanh toán</h1>
          <p className="text-slate-500 text-xs mt-1 font-medium">Quản lý luồng bệnh nhân theo thời gian thực.</p>
        </div>
      </div>

      {/* TOOLBAR: TAB CHUẨN ADMIN & THANH TÌM KIẾM */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        
        {/* NÚT TAB (Y hệt giao diện Quản lý Nhân sự) */}
        <div className="bg-slate-100 p-1 rounded-lg inline-flex items-center gap-1 border border-slate-200/60">
           <button 
             onClick={() => { setActiveView('RECEPTION'); setSearch(''); }}
             className={`px-5 py-1.5 text-[13px] transition-all rounded-md ${
               activeView === 'RECEPTION' 
               ? 'bg-white text-primary-700 font-bold shadow-sm border border-slate-200/50' 
               : 'text-slate-500 font-medium hover:text-slate-700 hover:bg-slate-200/50'
             }`}
           >
             Tiếp nhận bệnh nhân
           </button>
           <button 
             onClick={() => { setActiveView('PAYMENT'); setSearch(''); }}
             className={`px-5 py-1.5 text-[13px] transition-all rounded-md ${
               activeView === 'PAYMENT' 
               ? 'bg-white text-primary-700 font-bold shadow-sm border border-slate-200/50' 
               : 'text-slate-500 font-medium hover:text-slate-700 hover:bg-slate-200/50'
             }`}
           >
             Thanh toán viện phí
           </button>
        </div>

        {/* SEARCH BAR */}
        <div className="w-full md:w-[320px] relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
             <Search className="w-4 h-4" />
          </div>
          <input 
            type="text" 
            placeholder="Tìm tên, SĐT bệnh nhân..." 
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all shadow-sm text-slate-700" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
      </div>

      {/* KHU VỰC HIỂN THỊ DỮ LIỆU CHÍNH */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeView}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-4"
        >
          {/* BẢNG DANH SÁCH BỆNH NHÂN */}
          <div className={`bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden ${activeView === 'RECEPTION' ? 'lg:col-span-12' : 'lg:col-span-9'}`}>
            <div className="overflow-x-auto">
              {loading ? (
                 <div className="flex flex-col justify-center items-center h-[40vh] gap-3 text-primary-600">
                   <Activity className="w-6 h-6 animate-spin" />
                   <span className="text-xs font-semibold">Đang đồng bộ dữ liệu...</span>
                 </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-wider">
                      <th className="px-5 py-3 font-bold">Giờ hẹn</th>
                      <th className="px-5 py-3 font-bold">Bệnh nhân</th>
                      <th className="px-5 py-3 font-bold">Bác sĩ phụ trách</th>
                      <th className="px-5 py-3 font-bold text-center">Trạng thái</th>
                      <th className="px-5 py-3 font-bold text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[13px]">
                    {currentList.length === 0 ? (
                       <tr>
                         <td colSpan={5} className="text-center py-16">
                            <p className="text-slate-600 font-bold text-sm">Chưa có dữ liệu</p>
                            <p className="text-slate-400 font-medium text-xs mt-1">Danh sách trống theo phân loại hiện tại.</p>
                         </td>
                       </tr>
                    ) : (
                      currentList.map((q) => (
                        <tr key={q.id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="px-5 py-3 whitespace-nowrap">
                            <span className="font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded text-xs border border-slate-200">{q.time}</span>
                          </td>
                          <td className="px-5 py-3 whitespace-nowrap">
                             <p className="font-bold text-slate-800 text-sm leading-tight">{q.patient}</p>
                             <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3 text-slate-400"/> {q.phone || 'Chưa cập nhật'}</p>
                          </td>
                          <td className="px-5 py-3 whitespace-nowrap">
                             <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200"><User className="w-3.5 h-3.5"/></div>
                                <span className="font-bold text-slate-700 text-xs">BS. {q.doctor.replace("BS. BS. ", "BS. ")}</span>
                             </div>
                          </td>
                          <td className="px-5 py-3 whitespace-nowrap text-center">{getStatusBadge(q.status)}</td>
                          <td className="px-5 py-3 whitespace-nowrap text-right">
                            {/* HIỂN THỊ NÚT THAO TÁC THEO TAB */}
                            {activeView === 'RECEPTION' && (q.status === 'CONFIRMED' || q.status === 'PENDING') && (
                              <button onClick={() => { setSelectedPatient(q); setModalType('CHECKIN'); }} className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-primary-200 text-primary-600 rounded-md hover:bg-primary-50 font-bold text-[11px] shadow-sm transition-colors">
                                Xác nhận Tiếp đón <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                            
                            {activeView === 'PAYMENT' && q.status === 'COMPLETED' && (
                              <button onClick={() => { setSelectedPatient(q); setModalType('PAYMENT'); }} className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 border border-transparent text-white rounded-md hover:bg-emerald-700 font-bold text-[11px] shadow-sm transition-colors">
                                <CreditCard className="w-3 h-3" /> Thu tiền & In bill
                              </button>
                            )}

                            {((activeView === 'RECEPTION' && !['CONFIRMED', 'PENDING'].includes(q.status)) || (activeView === 'PAYMENT' && q.status !== 'COMPLETED')) && (
                               <span className="text-[11px] text-slate-400 font-medium italic">Không thao tác</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* === CỘT PHẢI: TỔNG KẾT DOANH THU (CHỈ HIỆN Ở TAB THANH TOÁN) === */}
          {activeView === 'PAYMENT' && (
             <div className="lg:col-span-3 space-y-4">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg shadow-sm border border-emerald-200 p-4 relative overflow-hidden">
                   <div className="absolute -right-4 -top-4 text-emerald-500/10"><Banknote className="w-20 h-20 rotate-12"/></div>
                   <div className="relative z-10">
                     <p className="text-emerald-700 font-bold text-[9px] uppercase tracking-wider mb-1">Tổng thu phòng khám hôm nay</p>
                     <h3 className="text-xl font-black text-emerald-800 leading-tight">{formatCurrency(revenueStats.totalRevenue)}</h3>
                   </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                   <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tiến độ thu</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100"><Clock className="w-4 h-4"/></div>
                      <div>
                         <p className="font-bold text-slate-800 text-sm">{revenueStats.completedCount}</p>
                         <p className="text-[10px] text-slate-500 font-medium">Ca đang chờ nợ phí</p>
                      </div>
                   </div>
                </div>
             </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* --- MODALS (POPUP THAO TÁC) --- */}
      <AnimatePresence>
        {modalType !== 'NONE' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={() => !actionLoading && setModalType('NONE')} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                   {modalType === 'CHECKIN' ? <><UserCheck className="w-4 h-4 text-primary-600"/> Xác nhận Tiếp đón</> : <><Receipt className="w-4 h-4 text-emerald-600"/> Xác nhận Thu tiền</>}
                </h3>
                <button onClick={() => !actionLoading && setModalType('NONE')} className="text-slate-400 hover:text-slate-600 transition-colors p-1"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleAction} className="p-5 space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Thông tin Bệnh nhân</p>
                  <p className="font-bold text-lg text-slate-800 mb-0.5 leading-none">{selectedPatient?.patient}</p>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-2.5"><Phone className="w-3.5 h-3.5 text-slate-400"/> {selectedPatient?.phone}</p>
                  <div className="border-t border-slate-200 pt-2.5">
                     <p className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5"><Stethoscope className="w-3.5 h-3.5 text-primary-500"/> Bác sĩ khám: <strong className="text-slate-800">BS. {selectedPatient?.doctor.replace("BS. BS. ", "BS. ")}</strong></p>
                  </div>
                </div>

                {modalType === 'CHECKIN' && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Ghi chú cho Bác sĩ (Tùy chọn)</label>
                    <input 
                      type="text" 
                      placeholder="Ghi chú thêm..." 
                      value={checkinNote}
                      onChange={(e) => setCheckinNote(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-white text-xs font-medium transition-colors" 
                    />
                  </div>
                )}

                {modalType === 'PAYMENT' && (
                  <div className="space-y-2 bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
                    <div className="flex justify-between items-center text-xs font-medium text-slate-600">
                      <span>Phí khám bệnh & dịch vụ:</span>
                      <span className="font-bold text-slate-800">{formatCurrency(selectedPatient?.fee)}</span>
                    </div>
                    <div className="border-t border-emerald-200/60 pt-2.5 flex justify-between items-center">
                      <span className="font-bold text-emerald-800 text-[11px] uppercase tracking-wider">Tổng cần thu:</span>
                      <span className="font-black text-xl text-emerald-600 leading-none">{formatCurrency(selectedPatient?.fee)}</span>
                    </div>
                  </div>
                )}

                <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                  <button type="button" onClick={() => setModalType('NONE')} disabled={actionLoading} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-md hover:bg-slate-50 font-bold text-xs shadow-sm transition-colors disabled:opacity-50">Đóng</button>
                  <button type="submit" disabled={actionLoading} className={`px-4 py-2 text-white rounded-md font-bold flex items-center gap-1.5 shadow-sm text-xs transition-colors disabled:opacity-50 ${modalType === 'CHECKIN' ? 'bg-primary-600 hover:bg-primary-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                    {actionLoading ? (
                      <><Activity className="w-3 h-3 animate-spin" /> Đang xử lý...</>
                    ) : modalType === 'CHECKIN' ? (
                      <><UserCheck className="w-3 h-3" /> Đẩy bệnh nhân vào Khám</>
                    ) : (
                      <><Printer className="w-3 h-3" /> Thu tiền & In biên lai</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}