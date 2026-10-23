import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, Phone, User, X, Activity, Stethoscope, Clock, CalendarDays } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { getDoctorSchedule, getPatientMedicalRecords } from '../../services/doctorService';

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  
  // State quản lý Popup EMR
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [emrHistory, setEmrHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingEmr, setLoadingEmr] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const appointments = await getDoctorSchedule();
        const patientMap = new Map();
        
        appointments.forEach((apt: any) => {
          const name = apt.patientName || 'Không xác định';
          if (!patientMap.has(name)) {
            patientMap.set(name, {
              id: apt.patientId,
              name: name,
              totalVisits: 0,
              lastVisit: apt.appointmentDate,
              condition: apt.reason || 'Chưa có thông tin',
              phone: apt.patientPhone || 'Chưa cập nhật',
            });
          }
          const p = patientMap.get(name);
          p.totalVisits += 1;
          if (new Date(apt.appointmentDate) > new Date(p.lastVisit)) {
            p.lastVisit = apt.appointmentDate;
          }
        });
        setPatients(Array.from(patientMap.values()));
      } catch (error) {
        toast.error("Lỗi tải danh sách bệnh nhân!");
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const handleViewEMR = async (patient: any) => {
    setSelectedPatient(patient);
    setLoadingEmr(true);
    try {
      const records = await getPatientMedicalRecords(patient.id);
      setEmrHistory(records);
    } catch (error) {
      toast.error("Lỗi tải lịch sử EMR!");
    } finally {
      setLoadingEmr(false);
    }
  };

  const filteredPatients = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || (p.phone && p.phone.includes(search)));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1400px] mx-auto space-y-4 pb-10"
    >
      <Toaster position="top-right" />

      {/* HEADER COMPACT */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center p-4 relative overflow-hidden gap-4">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600"></div>
        <div className="pl-2">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-tight">Danh sách Bệnh nhân</h1>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">Quản lý và tra cứu hồ sơ bệnh án điện tử (EMR) của bệnh nhân.</p>
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

      {/* BẢNG DANH SÁCH BỆNH NHÂN */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
             <div className="flex flex-col justify-center items-center h-[50vh] gap-3 text-primary-600">
               <Activity className="w-6 h-6 animate-spin" />
               <span className="text-xs font-semibold">Đang tải danh sách bệnh nhân...</span>
             </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-wider">
                  <th className="px-5 py-3 font-bold">Bệnh nhân</th>
                  <th className="px-5 py-3 font-bold">Liên hệ</th>
                  <th className="px-5 py-3 font-bold text-center">Số lần khám</th>
                  <th className="px-5 py-3 font-bold">Khám gần nhất</th>
                  <th className="px-5 py-3 font-bold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[13px]">
                {filteredPatients.length === 0 ? (
                   <tr>
                     <td colSpan={5} className="text-center py-20">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3"><Users className="w-6 h-6 text-slate-300"/></div>
                        <p className="text-slate-800 font-bold text-sm">Chưa có dữ liệu</p>
                        <p className="text-slate-500 font-medium text-xs mt-1">Không tìm thấy bệnh nhân nào khớp với tìm kiếm.</p>
                     </td>
                   </tr>
                ) : (
                  filteredPatients.map((p, index) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={p.id} 
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-5 py-3 whitespace-nowrap">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center font-bold text-xs border border-primary-100">
                               {p.name.charAt(0)}
                            </div>
                            <span className="font-bold text-slate-800 text-sm">{p.name}</span>
                         </div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                         <p className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5"><Phone className="w-3 h-3 text-slate-400"/> {p.phone}</p>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-center">
                         <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-[11px] font-bold border border-slate-200">{p.totalVisits} lần</span>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-slate-600 font-medium text-[11px]">
                         {new Date(p.lastVisit).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-right">
                        <button onClick={() => handleViewEMR(p)} className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-primary-200 text-primary-600 rounded-md hover:bg-primary-50 font-bold text-[11px] shadow-sm transition-colors">
                          <FileText className="w-3.5 h-3.5" /> Xem EMR
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

      {/* --- MODAL XEM HỒ SƠ EMR --- */}
      <AnimatePresence>
        {selectedPatient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedPatient(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
              
              {/* HEADER MODAL */}
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded flex items-center justify-center border border-primary-200"><FileText className="w-4 h-4"/></div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Hồ sơ Bệnh án Điện tử (EMR)</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Bệnh nhân: <strong className="text-primary-700">{selectedPatient.name}</strong></p>
                  </div>
                </div>
                <button onClick={() => setSelectedPatient(null)} className="text-slate-400 hover:text-slate-600 transition-colors p-1 bg-white border border-slate-200 rounded-md"><X className="w-4 h-4" /></button>
              </div>

              {/* BODY MODAL LỊCH SỬ KHÁM */}
              <div className="p-5 overflow-y-auto flex-1 bg-slate-50/30">
                <h4 className="font-bold text-slate-800 text-[13px] uppercase tracking-wide mb-4 flex items-center gap-2">
                   <Clock className="w-4 h-4 text-primary-600"/> Lịch sử Khám bệnh
                </h4>
                
                {loadingEmr ? (
                  <div className="flex flex-col justify-center items-center py-10 gap-3 text-primary-600">
                     <Activity className="w-5 h-5 animate-spin" />
                     <span className="text-[11px] font-semibold">Đang tải dữ liệu hồ sơ...</span>
                  </div>
                ) : emrHistory.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg border border-slate-200 border-dashed">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500 text-xs font-medium">Bệnh nhân chưa có lịch sử khám bệnh.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {emrHistory.map((record: any) => (
                      <div key={record.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-300"></div>
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-3 pl-2">
                          <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5 text-primary-500"/> {new Date(record.createdAt).toLocaleDateString('vi-VN')}</span>
                          <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">BS. {record.doctorName.replace("BS. BS. ", "BS. ")}</span>
                        </div>
                        
                        <div className="space-y-3 text-xs text-slate-700 pl-2">
                          <p className="bg-slate-50 p-2.5 rounded-md border border-slate-100"><strong className="text-slate-800">Chẩn đoán (ICD-10):</strong> <span className="text-rose-600 font-medium">{record.diagnosis || 'N/A'}</span></p>
                          <div className="bg-primary-50/50 p-3 rounded-md border border-primary-100">
                            <strong className="text-primary-800 block mb-1">Phác đồ / Đơn thuốc / Lời dặn:</strong>
                            <p className="whitespace-pre-wrap leading-relaxed">{record.treatmentPlan || 'Không có ghi chú thêm.'}</p>
                          </div>
                          {record.notes && (
                            <div className="bg-amber-50/50 p-3 rounded-md border border-amber-100">
                               <strong className="text-amber-800 block mb-1">Ghi chú & Sinh hiệu:</strong>
                               <p className="whitespace-pre-wrap leading-relaxed">{record.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}