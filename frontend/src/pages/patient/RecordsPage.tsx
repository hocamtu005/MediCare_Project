import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Search, Calendar, User, Activity, 
  ChevronDown, Pill, FileHeart, Download, Printer, Stethoscope, AlertCircle, Edit2, X, Save, Droplet, HeartPulse, Ruler, Scale
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import { getMyRecords, downloadRecordPdf } from '../../services/medicalRecordService';
import { getMyHealthProfile, updateMyHealthProfile } from '../../services/healthProfileService';

export default function MedicalRecordsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [healthProfile, setHealthProfile] = useState<any>({ bloodType: '--', bloodPressure: '--', height: '--', weight: '--' });
  const [isEditingHealth, setIsEditingHealth] = useState(false);
  const [healthForm, setHealthForm] = useState({ bloodType: '', bloodPressure: '', height: '', weight: '' });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [recordsData, healthData] = await Promise.all([
          getMyRecords(),
          getMyHealthProfile()
        ]);
        
        setRecords(recordsData);
        setHealthProfile(healthData);
        setHealthForm({
          bloodType: healthData.bloodType || '',
          bloodPressure: healthData.bloodPressure || '',
          height: healthData.height || '',
          weight: healthData.weight || ''
        });
      } catch (err: any) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError("Không thể kết nối đến máy chủ để tải hồ sơ. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateHealth = async () => {
    try {
      setIsUpdating(true);
      const updatedProfile = await updateMyHealthProfile(healthForm);
      setHealthProfile(updatedProfile);
      setIsEditingHealth(false);
      toast.success("Đã cập nhật chỉ số cơ thể!");
    } catch (err) {
      toast.error("Cập nhật thất bại. Vui lòng kiểm tra lại dữ liệu.");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredRecords = records.filter(record => 
    record.diagnosisIcd10?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.doctorName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDownloadPdf = async (recordId: string) => {
    toast.loading("Đang tạo file PDF...", { id: "pdf" });
    try {
      const blob = await downloadRecordPdf(recordId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `HoSoBenhAn_${recordId.substring(0,8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success("Tải xuống thành công!", { id: "pdf" });
    } catch (error) {
      toast.error("Lỗi khi tải PDF. Vui lòng thử lại.", { id: "pdf" });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-20 relative">
      <Toaster position="top-right" />

      {/* COMPACT HEADER & SEARCH */}
      <div className="bg-white px-5 py-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600 rounded-l-xl"></div>
        <div className="pl-2">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Hồ sơ bệnh án</h1>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">Lưu trữ lịch sử khám, đơn thuốc và chỉ số sức khỏe của bạn.</p>
        </div>
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm theo chẩn đoán, bác sĩ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-50 focus:border-primary-500 outline-none transition-all bg-slate-50 focus:bg-white text-sm font-medium text-slate-700"
          />
        </div>
      </div>

      {/* CHỈ SỐ CƠ THỂ VỚI MÀU SẮC PASTEL */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2"><Activity className="w-4 h-4 text-primary-600" /> Chỉ số cơ thể (Sinh hiệu cơ bản)</h3>
          <button 
            onClick={() => setIsEditingHealth(true)}
            className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1.5 bg-primary-50 px-3 py-1.5 rounded-md transition-colors border border-primary-100 shadow-sm"
          >
            <Edit2 className="w-3.5 h-3.5" /> Cập nhật
          </button>
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

      {loading && (
        <div className="flex flex-col justify-center items-center h-40 gap-2 text-primary-600 bg-white rounded-xl border border-slate-200">
          <Activity className="w-6 h-6 animate-spin" />
          <span className="text-xs font-medium">Đang tải hồ sơ bệnh án...</span>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 text-rose-600 p-4 rounded-xl flex items-center gap-2 border border-rose-100 text-sm font-medium shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0" /> {error}
        </div>
      )}

      {/* DANH SÁCH BỆNH ÁN CÓ CẤU TRÚC */}
      {!loading && !error && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2 mt-6 mb-3 px-2">
            <FileText className="w-4 h-4 text-primary-600" /> Lịch sử Khám bệnh
          </h3>

          {filteredRecords.length > 0 ? filteredRecords.map((record) => {
            const isExpanded = expandedId === record.id;
            const dateObj = new Date(record.createdAt);
            const formattedDate = dateObj.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
            
            return (
              <motion.div layout key={record.id} className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-primary-400 shadow-md ring-2 ring-primary-50' : 'border-slate-200 shadow-sm hover:border-primary-300'}`}>
                
                <div onClick={() => toggleExpand(record.id)} className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer bg-white group">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-sm border ${isExpanded ? 'bg-primary-600 text-white border-primary-600' : 'bg-slate-50 text-primary-600 border-slate-100 group-hover:bg-primary-50'}`}>
                      <FileHeart className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-base leading-tight mb-1">{record.diagnosisIcd10 || "Chưa có chẩn đoán"}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {formattedDate}</span>
                        <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-400" /> BS. {record.doctorName}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-1 rounded-md whitespace-nowrap">Đã hoàn tất</span>
                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} className="text-slate-400 bg-slate-50 p-1.5 rounded-lg border border-slate-100"><ChevronDown className="w-4 h-4" /></motion.div>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-slate-100 bg-slate-50">
                      <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Cột trái: Thông tin chuyên môn */}
                        <div className="space-y-4">
                          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <h4 className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-indigo-500" /> Chỉ định & Lời dặn</h4>
                            <p className="text-slate-700 text-sm font-medium">{record.objective || "Bác sĩ không ghi chú thêm."}</p>
                          </div>
                          
                          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <h4 className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1.5"><Pill className="w-3.5 h-3.5 text-rose-500" /> Đơn thuốc / Phác đồ</h4>
                            <p className="text-slate-700 text-sm font-medium">{record.plan || "Chưa có thông tin đơn thuốc."}</p>
                          </div>
                        </div>

                        {/* Cột phải: Sinh hiệu đo tại phòng khám & Thao tác */}
                        <div className="space-y-4 flex flex-col justify-between">
                          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <h4 className="text-[11px] font-bold text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-1.5"><Stethoscope className="w-3.5 h-3.5 text-teal-500" /> Sinh hiệu lúc khám</h4>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                               <div className="flex items-center gap-2 text-slate-600">
                                 <HeartPulse className="w-4 h-4 text-slate-400"/> HA: 
                                 <span className="font-bold text-slate-800">
                                   {record.vitals ? (() => { try { return JSON.parse(record.vitals).bloodPressure || '--'; } catch { return '--'; } })() : '--'}
                                 </span>
                               </div>
                               <div className="flex items-center gap-2 text-slate-600">
                                 <Activity className="w-4 h-4 text-slate-400"/> Nhịp: 
                                 <span className="font-bold text-slate-800">
                                   {record.vitals ? (() => { try { return JSON.parse(record.vitals).heartRate || '--'; } catch { return '--'; } })() : '--'}
                                 </span>
                               </div>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-3 italic">* Dữ liệu sinh hiệu được điều dưỡng đo trước khi vào phòng khám.</p>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-primary-600 font-bold py-2.5 rounded-xl transition-colors text-xs shadow-sm">
                              <Printer className="w-4 h-4" /> In Bệnh án
                            </button>
                            <button onClick={() => handleDownloadPdf(record.id)} className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 rounded-xl transition-colors text-xs shadow-md">
                              <Download className="w-4 h-4" /> Tải Toa thuốc (PDF)
                            </button>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          }) : (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-500 text-sm font-medium">Bạn chưa có hồ sơ bệnh án nào trùng khớp.</p>
            </div>
          )}
        </div> 
      )}

      {/* MODAL CẬP NHẬT CHỈ SỐ CƠ THỂ */}
      <AnimatePresence>
        {isEditingHealth && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditingHealth(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200"
            >
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide flex items-center gap-2"><Edit2 className="w-4 h-4 text-primary-600"/> Cập nhật Chỉ số</h3>
                <button onClick={() => setIsEditingHealth(false)} className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-md shadow-sm border border-slate-200"><X className="w-4 h-4" /></button>
              </div>
              
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Nhóm máu</label>
                  <input type="text" value={healthForm.bloodType} onChange={(e) => setHealthForm({...healthForm, bloodType: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-50 focus:border-primary-500 outline-none text-sm font-medium bg-slate-50 focus:bg-white transition-colors" placeholder="VD: O+, AB-" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Huyết áp trung bình</label>
                  <input type="text" value={healthForm.bloodPressure} onChange={(e) => setHealthForm({...healthForm, bloodPressure: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-50 focus:border-primary-500 outline-none text-sm font-medium bg-slate-50 focus:bg-white transition-colors" placeholder="VD: 120/80" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Chiều cao (cm)</label>
                    <input type="number" value={healthForm.height} onChange={(e) => setHealthForm({...healthForm, height: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-50 focus:border-primary-500 outline-none text-sm font-medium bg-slate-50 focus:bg-white transition-colors" placeholder="170" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Cân nặng (kg)</label>
                    <input type="number" value={healthForm.weight} onChange={(e) => setHealthForm({...healthForm, weight: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-50 focus:border-primary-500 outline-none text-sm font-medium bg-slate-50 focus:bg-white transition-colors" placeholder="65" />
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
                <button onClick={() => setIsEditingHealth(false)} className="px-4 py-2 rounded-lg font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-xs">Hủy bỏ</button>
                <button 
                  onClick={handleUpdateHealth}
                  disabled={isUpdating}
                  className="px-4 py-2 rounded-lg font-bold text-white bg-primary-600 hover:bg-primary-700 transition-colors flex items-center gap-1.5 text-xs shadow-sm disabled:opacity-70"
                >
                  {isUpdating ? <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span> : <Save className="w-3.5 h-3.5" />}
                  Lưu thay đổi
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}