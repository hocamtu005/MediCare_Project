import { useState, useEffect, useMemo } from 'react';
import { Clock, User, CheckCircle2, ClipboardEdit, X, Search, PhoneCall, PlayCircle, FileText, XCircle, Activity, Stethoscope } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { getDoctorSchedule, getPendingAppointments, createMedicalRecord, updateAppointmentStatus, downloadPrescriptionPdf } from '../../services/doctorService';

export default function DoctorSchedulePage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // 4 Trạng thái của luồng làm việc mới
  const [activeTab, setActiveTab] = useState<'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED'>('PENDING');

  const [selectedApt, setSelectedApt] = useState<any>(null);
  const [emrForm, setEmrForm] = useState({ diagnosis: '', prescription: '', advice: '', vitals: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gộp 2 API: Lấy lịch đã duyệt và Yêu cầu chờ duyệt
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [scheduleData, pendingData] = await Promise.all([
        getDoctorSchedule(),
        getPendingAppointments()
      ]);
      
      const combined = [...pendingData, ...scheduleData];
      const uniqueAppointments = Array.from(new Map(combined.map(item => [item.id, item])).values());
      
      setAppointments(uniqueAppointments);
    } catch (error) {
      toast.error("Không thể tải danh sách!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllData(); }, []);

  // Xử lý Duyệt / Từ chối yêu cầu mới
  const handleRequestAction = async (id: string, status: string) => {
    try {
      await updateAppointmentStatus(id, status);
      toast.success(status === 'CONFIRMED' ? "Đã duyệt lịch hẹn!" : "Đã từ chối lịch hẹn!");
      await fetchAllData();
      if (status === 'CONFIRMED') setActiveTab('CONFIRMED');
    } catch (error) {
      toast.error("Lỗi thao tác!");
    }
  };

  const handleCallPatient = async (id: string) => {
    try {
      await updateAppointmentStatus(id, 'IN_PROGRESS');
      toast.success("Đã gọi bệnh nhân vào phòng khám!");
      await fetchAllData();
      setActiveTab('IN_PROGRESS');
    } catch (error: any) {
      toast.error("Không thể gọi bệnh nhân!");
    }
  };

  const handleCompleteEMR = async () => {
    if (!emrForm.diagnosis.trim()) { toast.error("Vui lòng điền chẩn đoán lâm sàng!"); return; }
    if (!window.confirm("Lưu hồ sơ và kết thúc ca khám?")) return;

    try {
      setIsSubmitting(true);
      const combinedNotes = `Sinh hiệu: ${emrForm.vitals || 'Không ghi nhận'} | Lời dặn: ${emrForm.advice}`;
      await createMedicalRecord({
        appointmentId: selectedApt.id, patientId: selectedApt.patientId,
        diagnosis: emrForm.diagnosis, treatmentPlan: emrForm.prescription, notes: combinedNotes
      });
      await updateAppointmentStatus(selectedApt.id, 'COMPLETED');
      toast.success("Đã hoàn tất ca khám và lưu hồ sơ EMR!");
      await fetchAllData();
      closeModal();
      setActiveTab('COMPLETED');
    } catch (error: any) {
      toast.error("Lưu hồ sơ thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPDF = async (appointmentId: string, patientName: string) => {
    try {
      toast.loading("Đang tạo file PDF...", { id: "pdf" });
      const blob = await downloadPrescriptionPdf(appointmentId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Toa_Thuoc_${patientName.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click(); link.parentNode?.removeChild(link);
      toast.success("Tải Toa thuốc thành công!", { id: "pdf" });
    } catch (error) {
      toast.error("Lỗi khi tải PDF!", { id: "pdf" });
    }
  };

  const closeModal = () => { setSelectedApt(null); setEmrForm({ diagnosis: '', prescription: '', advice: '', vitals: '' }); };

  // Lọc nâng cao kết hợp Tab và Text Search
  const filteredAppointments = useMemo(() => {
    let list = appointments.filter(apt => {
      if (activeTab === 'CONFIRMED') {
        return ['CONFIRMED', 'CHECKED_IN', 'TRIAGED'].includes(apt.status);
      }
      return apt.status === activeTab;
    });

    if (search) {
      list = list.filter(apt => 
        apt.patientName.toLowerCase().includes(search.toLowerCase()) || 
        (apt.patientPhone && apt.patientPhone.includes(search))
      );
    }
    return list;
  }, [appointments, activeTab, search]);

  const countPending = appointments.filter(a => a.status === 'PENDING').length;
  const countWaiting = appointments.filter(a => ['CONFIRMED', 'CHECKED_IN', 'TRIAGED'].includes(a.status)).length;
  const countInProgress = appointments.filter(a => a.status === 'IN_PROGRESS').length;
  const countCompleted = appointments.filter(a => a.status === 'COMPLETED').length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1400px] mx-auto space-y-4 pb-10"
    >
      <Toaster position="top-right" />
      
      {/* HEADER COMPACT THEO CHUẨN MỚI */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center p-4 relative overflow-hidden gap-4">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600"></div>
        <div className="pl-2">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-tight">Khám bệnh</h1>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">Duyệt lịch ➔ Gọi bệnh nhân ➔ Khám bệnh ➔ Lập EMR.</p>
        </div>
        <div className="w-full md:w-[320px] relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors">
             <Search className="w-4 h-4" />
          </div>
          <input 
            type="text" 
            placeholder="Tìm tên, SĐT bệnh nhân..." 
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all shadow-sm text-slate-700" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
      </div>

      {/* TABS ĐIỀU HƯỚNG DẠNG SEGMENTED CONTROL */}
      <div className="bg-slate-100 p-1 rounded-lg inline-flex items-center gap-1 border border-slate-200/60 overflow-x-auto w-full sm:w-auto">
         <button 
           onClick={() => { setActiveTab('PENDING'); setSearch(''); }}
           className={`px-4 py-1.5 text-[13px] transition-all rounded-md flex items-center gap-2 whitespace-nowrap ${
             activeTab === 'PENDING' 
             ? 'bg-white text-rose-600 font-bold shadow-sm border border-slate-200/50' 
             : 'text-slate-500 font-medium hover:text-slate-700 hover:bg-slate-200/50'
           }`}
         >
           Yêu cầu mới <span className={`px-1.5 py-0.5 rounded text-[10px] ${activeTab === 'PENDING' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-500'}`}>{countPending}</span>
         </button>
         <button 
           onClick={() => { setActiveTab('CONFIRMED'); setSearch(''); }}
           className={`px-4 py-1.5 text-[13px] transition-all rounded-md flex items-center gap-2 whitespace-nowrap ${
             activeTab === 'CONFIRMED' 
             ? 'bg-white text-primary-700 font-bold shadow-sm border border-slate-200/50' 
             : 'text-slate-500 font-medium hover:text-slate-700 hover:bg-slate-200/50'
           }`}
         >
           Chờ khám <span className={`px-1.5 py-0.5 rounded text-[10px] ${activeTab === 'CONFIRMED' ? 'bg-primary-100 text-primary-700' : 'bg-slate-200 text-slate-500'}`}>{countWaiting}</span>
         </button>
         <button 
           onClick={() => { setActiveTab('IN_PROGRESS'); setSearch(''); }}
           className={`px-4 py-1.5 text-[13px] transition-all rounded-md flex items-center gap-2 whitespace-nowrap ${
             activeTab === 'IN_PROGRESS' 
             ? 'bg-white text-amber-600 font-bold shadow-sm border border-slate-200/50' 
             : 'text-slate-500 font-medium hover:text-slate-700 hover:bg-slate-200/50'
           }`}
         >
           Đang khám <span className={`px-1.5 py-0.5 rounded text-[10px] ${activeTab === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-500'}`}>{countInProgress}</span>
         </button>
         <button 
           onClick={() => { setActiveTab('COMPLETED'); setSearch(''); }}
           className={`px-4 py-1.5 text-[13px] transition-all rounded-md flex items-center gap-2 whitespace-nowrap ${
             activeTab === 'COMPLETED' 
             ? 'bg-white text-emerald-600 font-bold shadow-sm border border-slate-200/50' 
             : 'text-slate-500 font-medium hover:text-slate-700 hover:bg-slate-200/50'
           }`}
         >
           Đã hoàn tất <span className={`px-1.5 py-0.5 rounded text-[10px] ${activeTab === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>{countCompleted}</span>
         </button>
      </div>

      {/* KHU VỰC HIỂN THỊ DỮ LIỆU */}
      {loading ? (
        <div className="flex flex-col justify-center items-center h-[40vh] gap-3 text-primary-600">
          <Activity className="w-6 h-6 animate-spin" />
          <span className="text-xs font-semibold">Đang tải danh sách...</span>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-slate-200 border-dashed shadow-sm">
          <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-bold text-sm">Không có ca khám nào.</p>
          <p className="text-slate-400 font-medium text-xs mt-1">Danh sách trống trong thẻ bạn đang chọn.</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
           <motion.div 
             key={activeTab}
             initial={{ opacity: 0, y: 5 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -5 }}
             transition={{ duration: 0.15 }}
             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
           >
             {filteredAppointments.map((apt) => (
               <div key={apt.id} className={`bg-white p-4 rounded-lg shadow-sm border flex flex-col transition-hover hover:shadow-md ${apt.status === 'IN_PROGRESS' ? 'border-amber-300 ring-2 ring-amber-50' : apt.status === 'PENDING' ? 'border-rose-200 bg-rose-50/10' : 'border-slate-200'}`}>
                 
                 <div className="flex justify-between items-start mb-3">
                   <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-md flex items-center justify-center shrink-0 border border-slate-200">
                     <User className="w-5 h-5" />
                   </div>
                   
                   {/* BADGE TRẠNG THÁI (NHỎ GỌN HƠN) */}
                   {apt.status === 'PENDING' && <span className="bg-rose-50 text-rose-600 text-[9px] font-bold px-2 py-0.5 rounded border border-rose-100 animate-pulse uppercase tracking-wider">Cần duyệt</span>}
                   {apt.status === 'CONFIRMED' && <span className="bg-slate-100 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wider">Chưa đến</span>}
                   {apt.status === 'CHECKED_IN' && <span className="bg-amber-50 text-amber-600 text-[9px] font-bold px-2 py-0.5 rounded border border-amber-100 uppercase tracking-wider">Đã Check-in</span>}
                   {apt.status === 'TRIAGED' && <span className="bg-purple-50 text-purple-600 text-[9px] font-bold px-2 py-0.5 rounded border border-purple-100 uppercase tracking-wider">Đã sinh hiệu</span>}
                   {apt.status === 'IN_PROGRESS' && <span className="bg-amber-100 text-amber-700 text-[9px] font-bold px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1 animate-pulse uppercase tracking-wider"><PlayCircle className="w-3 h-3" /> Đang khám</span>}
                   {apt.status === 'COMPLETED' && <span className="bg-emerald-50 text-emerald-600 text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1 uppercase tracking-wider"><CheckCircle2 className="w-3 h-3" /> Hoàn tất</span>}
                 </div>
                 
                 <h3 className="font-bold text-slate-800 text-sm leading-tight mb-1 truncate">{apt.patientName}</h3>
                 <p className="text-[11px] text-slate-500 mb-3 font-medium flex items-center gap-1.5"><PhoneCall className="w-3 h-3 text-slate-400"/> {apt.patientPhone || 'Chưa cập nhật'}</p>
                 
                 <div className="bg-slate-50 p-2.5 rounded-md mb-4 border border-slate-100 flex-1">
                   <p className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5 mb-1.5 border-b border-slate-200/60 pb-1.5"><Clock className="w-3 h-3 text-primary-500" /> {new Date(apt.appointmentDate).toLocaleString('vi-VN', {hour: '2-digit', minute:'2-digit', day:'2-digit', month:'2-digit'})}</p>
                   <p className="text-[11px] text-slate-600 line-clamp-2 leading-snug"><strong className="text-slate-800">Lý do:</strong> {apt.reason || 'Không cung cấp lý do khám.'}</p>
                 </div>

                 {/* CÁC NÚT THAO TÁC (ACTIONS) NẰM GỌN BÊN DƯỚI */}
                 <div className="mt-auto">
                   {apt.status === 'PENDING' && (
                     <div className="flex gap-2 w-full">
                       <button onClick={() => handleRequestAction(apt.id, 'CANCELLED')} className="flex-1 py-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold rounded-md text-[11px] flex items-center justify-center gap-1 transition-colors"><XCircle className="w-3.5 h-3.5" /> Từ chối</button>
                       <button onClick={() => handleRequestAction(apt.id, 'CONFIRMED')} className="flex-1 py-2 bg-primary-600 border border-transparent text-white hover:bg-primary-700 font-bold rounded-md text-[11px] flex items-center justify-center gap-1 transition-colors"><CheckCircle2 className="w-3.5 h-3.5" /> Duyệt lịch</button>
                     </div>
                   )}
                   {['CONFIRMED', 'CHECKED_IN', 'TRIAGED'].includes(apt.status) && (
                     <button onClick={() => handleCallPatient(apt.id)} className="w-full py-2 bg-primary-600 text-white hover:bg-primary-700 font-bold rounded-md text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-sm shadow-primary-500/20">
                       <PhoneCall className="w-3.5 h-3.5" /> Bắt đầu Khám
                     </button>
                   )}
                   {apt.status === 'IN_PROGRESS' && (
                     <button onClick={() => setSelectedApt(apt)} className="w-full py-2 bg-amber-500 text-white hover:bg-amber-600 font-bold rounded-md text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-sm shadow-amber-500/20">
                       <ClipboardEdit className="w-3.5 h-3.5" /> Điền Hồ sơ EMR
                     </button>
                   )}
                   {apt.status === 'COMPLETED' && (
                     <button onClick={() => handleDownloadPDF(apt.id, apt.patientName)} className="w-full py-2 bg-white border border-emerald-200 text-emerald-600 hover:bg-emerald-50 font-bold rounded-md text-[11px] flex items-center justify-center gap-1.5 transition-colors">
                       <FileText className="w-3.5 h-3.5" /> In Toa Thuốc (PDF)
                     </button>
                   )}
                 </div>
               </div>
             ))}
           </motion.div>
        </AnimatePresence>
      )}

      {/* --- MODAL EMR (THIẾT KẾ LẠI GỌN GÀNG, BÓNG BẨY) --- */}
      <AnimatePresence>
        {selectedApt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeModal} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
              
              {/* HEADER MODAL */}
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded flex items-center justify-center border border-primary-200"><Stethoscope className="w-4 h-4"/></div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Hồ sơ Bệnh án EMR (SOAP)</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Bệnh nhân: <strong className="text-slate-800">{selectedApt.patientName}</strong></p>
                  </div>
                </div>
                <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors p-1 bg-white border border-slate-200 rounded-md"><X className="w-4 h-4" /></button>
              </div>
              
              {/* BODY MODAL */}
              <div className="p-5 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-2 gap-5 bg-white">
                {/* Cột trái (Thông tin đầu vào & Chẩn đoán) */}
                <div className="space-y-4">
                  <div className="bg-sky-50 p-3 rounded-md border border-sky-100 text-[11px] leading-snug">
                    <p className="text-sky-800"><strong className="text-sky-900 uppercase tracking-wider">S (Subjective) - Lý do khám:</strong> <br/>{selectedApt.reason || 'Bệnh nhân không cung cấp trước lý do.'}</p>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Sinh hiệu (Vitals)</label>
                    <input type="text" value={emrForm.vitals} onChange={e => setEmrForm({...emrForm, vitals: e.target.value})} placeholder="Nhập sinh hiệu... (VD: HA 120/80, Mạch 80...)" className="w-full px-3 py-2 border border-slate-200 rounded-md outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-xs transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-wide">A (Assessment) - Chẩn đoán <span className="text-rose-500">*</span></label>
                    <textarea value={emrForm.diagnosis} onChange={e => setEmrForm({...emrForm, diagnosis: e.target.value})} placeholder="Nhập chẩn đoán lâm sàng..." className="w-full px-3 py-2 border border-slate-200 rounded-md outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-xs transition-colors h-28 resize-none leading-relaxed" />
                  </div>
                </div>

                {/* Cột phải (Phác đồ & Lời dặn) */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-wide">P (Plan) - Phác đồ / Đơn thuốc</label>
                    <textarea value={emrForm.prescription} onChange={e => setEmrForm({...emrForm, prescription: e.target.value})} placeholder="Kê đơn thuốc hoặc phương án điều trị..." className="w-full px-3 py-2 border border-slate-200 rounded-md outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-xs transition-colors h-40 resize-none leading-relaxed" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Lời dặn của Bác sĩ</label>
                    <textarea value={emrForm.advice} onChange={e => setEmrForm({...emrForm, advice: e.target.value})} placeholder="Lời khuyên nghỉ ngơi, ăn uống..." className="w-full px-3 py-2 border border-slate-200 rounded-md outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-xs transition-colors h-16 resize-none leading-relaxed" />
                  </div>
                </div>
              </div>

              {/* FOOTER MODAL */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2 shrink-0">
                <button onClick={closeModal} className="px-4 py-2 border border-slate-200 bg-white rounded-md font-bold text-xs text-slate-600 hover:bg-slate-50 transition-colors">Đóng lại</button>
                <button onClick={handleCompleteEMR} disabled={isSubmitting} className="px-4 py-2 rounded-md font-bold bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 flex items-center gap-1.5 text-xs transition-colors shadow-sm">
                  {isSubmitting ? <><Activity className="w-3.5 h-3.5 animate-spin" /> Đang lưu...</> : <><CheckCircle2 className="w-3.5 h-3.5" /> Lưu EMR & Hoàn tất</>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}