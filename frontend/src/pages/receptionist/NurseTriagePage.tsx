import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Activity, Thermometer, Weight, HeartPulse, X, CheckCircle2, User, Phone, ClipboardList } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { getTodaysAppointments, savePatientVitals } from '../../services/receptionistService';

export default function NurseTriagePage() {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // State Modal và Form Sinh hiệu
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vitals, setVitals] = useState({
    heartRate: '',
    bloodPressure: '',
    temperature: '',
    weight: ''
  });

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const data = await getTodaysAppointments();
      // CHỈ LẤY NHỮNG BỆNH NHÂN ĐÃ CHECK-IN (Đang chờ đo sinh hiệu)
      const triageQueue = data.filter((apt: any) => apt.status === 'CHECKED_IN');
      setQueue(triageQueue);
    } catch (error) {
      toast.error("Không thể tải danh sách chờ sinh hiệu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQueue(); }, []);

  const filteredQueue = queue.filter(q => 
    q.patient.toLowerCase().includes(search.toLowerCase()) || 
    (q.phone && q.phone.includes(search))
  );

  const handleSubmitVitals = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;
    
    setIsSubmitting(true);
    try {
      await savePatientVitals(selectedPatient.id, vitals);
      toast.success("Đã ghi nhận sinh hiệu và cập nhật hồ sơ thành công!", {
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      });
      
      // Reset Modal và tải lại danh sách
      setSelectedPatient(null);
      setVitals({ heartRate: '', bloodPressure: '', temperature: '', weight: '' });
      fetchQueue();
    } catch (error: any) {
      toast.error("Có lỗi xảy ra: " + (error.response?.data || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1400px] mx-auto space-y-4 pb-8"
    >
      <Toaster position="top-right" />

      {/* HEADER COMPACT (LINE XANH ĐÃ LÀM MỎNG LẠI THÀNH w-1) */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center p-4 relative overflow-hidden gap-4">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600"></div>
        <div className="pl-3">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-tight">Tiền khám & Sinh hiệu</h1>
          <p className="text-slate-500 text-xs mt-0.5 font-medium flex items-center gap-1.5">
             <Activity className="w-3.5 h-3.5 text-primary-500"/> Đo đạc và ghi nhận chỉ số lâm sàng trước khi vào phòng khám
          </p>
        </div>
        <div className="w-full md:w-[320px] relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors">
             <Search className="w-4 h-4" />
          </div>
          <input 
            type="text" 
            placeholder="Tìm tên, SĐT bệnh nhân..." 
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold focus:bg-white focus:ring-2 focus:ring-primary-50 focus:border-primary-400 outline-none transition-all shadow-sm text-slate-700" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
      </div>

      {/* BẢNG DANH SÁCH BỆNH NHÂN CHỜ */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
             <div className="flex flex-col justify-center items-center h-[50vh] gap-3 text-slate-400">
               <Activity className="w-6 h-6 animate-spin text-primary-600" />
               <span className="text-xs font-semibold text-primary-600">Đang tải danh sách chờ...</span>
             </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-wider">
                  <th className="px-5 py-3 font-bold w-24">Giờ hẹn</th>
                  <th className="px-5 py-3 font-bold">Bệnh nhân</th>
                  <th className="px-5 py-3 font-bold">Bác sĩ phụ trách</th>
                  <th className="px-5 py-3 font-bold text-center">Trạng thái</th>
                  <th className="px-5 py-3 font-bold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[13px]">
                {filteredQueue.length === 0 ? (
                   <tr>
                     <td colSpan={5} className="text-center py-20">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3"><Activity className="w-6 h-6 text-slate-300"/></div>
                        <p className="text-slate-800 font-bold text-sm">Chưa có bệnh nhân chờ</p>
                        <p className="text-slate-500 font-medium text-xs mt-1">Các bệnh nhân Đã Check-in sẽ hiển thị tại đây.</p>
                     </td>
                   </tr>
                ) : (
                  filteredQueue.map((q, index) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={q.id} 
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-5 py-3 whitespace-nowrap">
                        <span className="font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md text-xs border border-slate-200">{q.time}</span>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                         <p className="font-bold text-slate-800 text-sm leading-tight">{q.patient}</p>
                         <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3 text-slate-400"/> {q.phone || 'Chưa cập nhật SĐT'}</p>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                         <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200"><User className="w-3.5 h-3.5"/></div>
                            <span className="font-bold text-slate-700 text-xs">BS. {q.doctor.replace("BS. BS. ", "BS. ")}</span>
                         </div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-center">
                         <span className="px-2.5 py-1 bg-amber-50 text-amber-600 rounded text-[9px] font-bold uppercase tracking-wider border border-amber-100 animate-pulse">Chờ Đo Mạch</span>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-right">
                        <button onClick={() => setSelectedPatient(q)} className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-primary-600 border border-transparent text-white rounded-md hover:bg-primary-700 font-bold text-[11px] shadow-sm transition-colors shadow-primary-500/20">
                          <ClipboardList className="w-3.5 h-3.5" /> Ghi Sinh Hiệu
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* --- MODAL NHẬP SINH HIỆU --- */}
      <AnimatePresence>
        {selectedPatient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={() => !isSubmitting && setSelectedPatient(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                   <Activity className="w-4 h-4 text-primary-600"/> Ghi nhận Lâm sàng
                </h3>
                <button onClick={() => !isSubmitting && setSelectedPatient(null)} className="text-slate-400 hover:text-slate-600 transition-colors p-1"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSubmitVitals} className="p-5 space-y-4">
                {/* THÔNG TIN BỆNH NHÂN */}
                <div className="bg-primary-50/50 p-4 rounded-lg border border-primary-100 flex justify-between items-center">
                  <div>
                    <p className="text-[9px] text-primary-600/70 uppercase font-bold tracking-widest mb-1">Bệnh nhân</p>
                    <p className="font-black text-sm text-slate-800 leading-none">{selectedPatient.patient}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-primary-600/70 uppercase font-bold tracking-widest mb-1">Bác sĩ khám</p>
                    <p className="font-bold text-xs text-primary-700 leading-none">BS. {selectedPatient.doctor.replace("BS. BS. ", "BS. ")}</p>
                  </div>
                </div>

                {/* KHUNG NHẬP LIỆU (CHIA 2 CỘT) */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Huyết áp */}
                  <div>
                    <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-wide"><HeartPulse className="w-3.5 h-3.5 text-rose-500" /> Huyết áp <span className="text-[9px] text-slate-400 lowercase">(mmHg)</span></label>
                    <input type="text" placeholder="VD: 120/80" value={vitals.bloodPressure} onChange={(e) => setVitals({...vitals, bloodPressure: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-md outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-white text-xs font-bold transition-colors" />
                  </div>
                  {/* Nhịp tim */}
                  <div>
                    <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-wide"><Activity className="w-3.5 h-3.5 text-rose-400" /> Nhịp tim <span className="text-[9px] text-slate-400 lowercase">(bpm)</span></label>
                    <input type="number" placeholder="VD: 85" value={vitals.heartRate} onChange={(e) => setVitals({...vitals, heartRate: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-md outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-white text-xs font-bold transition-colors" />
                  </div>
                  {/* Nhiệt độ */}
                  <div>
                    <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-wide"><Thermometer className="w-3.5 h-3.5 text-amber-500" /> Nhiệt độ <span className="text-[9px] text-slate-400 lowercase">(°C)</span></label>
                    <input type="number" step="0.1" placeholder="VD: 37.0" value={vitals.temperature} onChange={(e) => setVitals({...vitals, temperature: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-md outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-white text-xs font-bold transition-colors" />
                  </div>
                  {/* Cân nặng */}
                  <div>
                    <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-wide"><Weight className="w-3.5 h-3.5 text-sky-500" /> Cân nặng <span className="text-[9px] text-slate-400 lowercase">(kg)</span></label>
                    <input type="number" step="0.5" placeholder="VD: 60" value={vitals.weight} onChange={(e) => setVitals({...vitals, weight: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-md outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-white text-xs font-bold transition-colors" />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                  <button type="button" onClick={() => setSelectedPatient(null)} disabled={isSubmitting} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-md hover:bg-slate-50 font-bold text-xs shadow-sm transition-colors disabled:opacity-50">Hủy bỏ</button>
                  <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-md font-bold flex items-center gap-1.5 shadow-sm text-xs transition-colors disabled:opacity-50">
                    {isSubmitting ? <><Activity className="w-3.5 h-3.5 animate-spin" /> Đang xử lý...</> : <><CheckCircle2 className="w-3.5 h-3.5" /> Lưu & Hoàn tất</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}