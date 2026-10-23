import { useState, useEffect } from 'react';
import { Users, CalendarCheck, Search, Clock, FileText, Activity, UserCircle2, ShieldCheck, ChevronRight } from 'lucide-react';
import { getAdminPatients, getAdminAppointments, getPatientEMR, updateAppointmentStatus } from '../../services/adminService';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function RecordManagementPage() {
  const [activeTab, setActiveTab] = useState<'APPOINTMENTS' | 'PATIENTS'>('APPOINTMENTS');
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  
  // State cho EMR Modal
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [patientRecords, setPatientRecords] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'PATIENTS') {
        setPatients(await getAdminPatients());
      } else {
        setAppointments(await getAdminAppointments());
      }
    } catch (error) {
      toast.error("Lỗi tải dữ liệu. Vui lòng kiểm tra kết nối.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      toast.success("Đã cập nhật trạng thái");
      fetchData();
    } catch (error) {
      toast.error("Cập nhật thất bại");
    }
  };

  const openEMRModal = async (patient: any) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
    try {
      const records = await getPatientEMR(patient.id);
      setPatientRecords(records);
    } catch (error) {
      toast.error("Không thể tải hồ sơ bệnh án");
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'PENDING': return <span className="px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded text-[10px] font-bold uppercase tracking-wider">Chờ duyệt</span>;
      case 'CONFIRMED': return <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded text-[10px] font-bold uppercase tracking-wider">Đã duyệt</span>;
      case 'CHECKED_IN': return <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded text-[10px] font-bold uppercase tracking-wider">Check-in</span>;
      case 'IN_PROGRESS': return <span className="px-2 py-0.5 bg-purple-50 text-purple-600 border border-purple-200 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><Activity className="w-3 h-3 animate-pulse"/> Đang khám</span>;
      case 'COMPLETED': return <span className="px-2 py-0.5 bg-teal-50 text-teal-600 border border-teal-200 rounded text-[10px] font-bold uppercase tracking-wider">Khám xong</span>;
      case 'PAID': return <span className="px-2 py-0.5 bg-green-50 text-green-600 border border-green-200 rounded text-[10px] font-bold uppercase tracking-wider">Đã thanh toán</span>;
      case 'CANCELLED': return <span className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-200 rounded text-[10px] font-bold uppercase tracking-wider">Đã hủy</span>;
      default: return <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[10px] font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  const filteredPatients = patients.filter(p => p.fullName?.toLowerCase().includes(search.toLowerCase()) || p.email?.toLowerCase().includes(search.toLowerCase()));
  const filteredAppointments = appointments.filter(a => a.patientName?.toLowerCase().includes(search.toLowerCase()) || a.doctorName?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4 pb-10 max-w-7xl mx-auto"> {/* Giảm space-y-5 xuống space-y-4 */}
      <Toaster position="top-right"/>
      
      {/* 1. COMPACT HEADER CARD - Nhỏ gọn, tinh tế */}
      <div className="bg-white px-5 py-4 rounded-xl shadow-sm border border-slate-200 flex flex-row justify-between items-center relative overflow-hidden">
        {/* Dải màu bên trái thanh mảnh */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600 rounded-l-xl"></div>
        
        <div className="pl-2">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Hồ sơ Bệnh nhân</h1>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">Điều phối ca khám và quản lý Bệnh án Điện tử (EMR).</p>
        </div>
        
        {/* Icon nhỏ gọn */}
        <div className="bg-primary-50 p-2 rounded-lg border border-primary-100 hidden sm:block">
          <FileText className="w-5 h-5 text-primary-600" />
        </div>
      </div>

      {/* 2. COMPACT TOOLBAR */}
      <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-3">
        {/* Tabs Control */}
        <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-fit">
          <button 
            onClick={() => {setActiveTab('APPOINTMENTS'); setSearch('');}} 
            className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 py-1.5 px-4 text-xs font-semibold rounded-md transition-all duration-200 ${activeTab === 'APPOINTMENTS' ? 'bg-white text-primary-600 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Clock className="w-3.5 h-3.5" /> Ca khám
          </button>
          <button 
            onClick={() => {setActiveTab('PATIENTS'); setSearch('');}} 
            className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 py-1.5 px-4 text-xs font-semibold rounded-md transition-all duration-200 ${activeTab === 'PATIENTS' ? 'bg-white text-primary-600 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Users className="w-3.5 h-3.5" /> Bệnh nhân
          </button>
        </div>

        {/* Search Input - Nhỏ gọn hơn */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder={`Tìm kiếm ${activeTab === 'PATIENTS' ? 'bệnh nhân...' : 'ca khám...'}`} 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-50 transition-all text-xs font-medium text-slate-700 placeholder-slate-400" 
          />
        </div>
      </div>

      {/* 3. BẢNG DỮ LIỆU */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 gap-2 text-primary-600">
              <Activity className="w-6 h-6 animate-spin" />
              <span className="text-xs font-medium">Đang tải dữ liệu...</span>
            </div>
          ) : activeTab === 'PATIENTS' ? (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-slate-500 bg-slate-50 border-b border-slate-200 text-xs">
                <tr>
                  <th className="px-5 py-3 font-semibold">Hồ sơ Bệnh nhân</th>
                  <th className="px-5 py-3 font-semibold">Liên lạc</th>
                  <th className="px-5 py-3 font-semibold text-center">Trạng thái</th>
                  <th className="px-5 py-3 font-semibold text-center">Bệnh án (EMR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredPatients.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center text-primary-600">
                          <UserCircle2 className="w-4 h-4"/>
                        </div>
                        <span className="font-bold text-slate-800">{p.fullName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-600 font-medium text-xs">{p.email}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${p.active ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>{p.active ? 'Hoạt động' : 'Đã khóa'}</span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button onClick={() => openEMRModal(p)} className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white text-slate-700 hover:bg-slate-50 hover:text-primary-600 font-semibold rounded-md transition-colors border border-slate-200 hover:border-primary-300 shadow-sm text-xs">
                        <FileText className="w-3.5 h-3.5" /> Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredPatients.length === 0 && (
                  <tr><td colSpan={4} className="text-center py-8 text-slate-500 text-sm">Không tìm thấy dữ liệu.</td></tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-slate-500 bg-slate-50 border-b border-slate-200 text-xs">
                <tr>
                  <th className="px-5 py-3 font-semibold">Chi tiết Ca khám</th>
                  <th className="px-5 py-3 font-semibold">Bác sĩ phụ trách</th>
                  <th className="px-5 py-3 font-semibold">Thời gian</th>
                  <th className="px-5 py-3 font-semibold">Trạng thái</th>
                  <th className="px-5 py-3 font-semibold text-center">Điều phối</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredAppointments.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-bold text-slate-800">{a.patientName}</p>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5 truncate max-w-[180px]" title={a.reason}>{a.reason || "Không ghi chú"}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded font-semibold text-[11px]">
                        <ShieldCheck className="w-3 h-3" /> BS. {a.doctorName}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-600 font-medium text-xs">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400"/>
                        {a.appointmentDate !== "Chưa xếp lịch" ? a.appointmentDate.replace('T', ' ') : 'Chưa xếp lịch'}
                      </div>
                    </td>
                    <td className="px-5 py-3">{getStatusBadge(a.status)}</td>
                    <td className="px-5 py-3 text-center">
                      <select 
                        value={a.status}
                        onChange={(e) => handleStatusChange(a.id, e.target.value)}
                        className="px-2.5 py-1.5 border border-slate-200 rounded-md bg-white font-semibold text-slate-700 hover:border-primary-400 focus:border-primary-500 outline-none cursor-pointer text-xs shadow-sm transition-colors"
                      >
                        <option value="PENDING">Chờ duyệt</option>
                        <option value="CONFIRMED">Duyệt ca</option>
                        <option value="CANCELLED">Hủy ca</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {filteredAppointments.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-8 text-slate-500 text-sm">Không có ca khám nào.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 4. MODAL XEM EMR */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white w-full max-w-4xl max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
              
              {/* Modal Header */}
              <div className="px-6 py-4 bg-slate-800 text-white flex justify-between items-center border-b border-slate-700">
                <div>
                  <h2 className="text-base font-bold flex items-center gap-2 tracking-wide"><FileText className="w-4 h-4 text-primary-400" /> HỒ SƠ BỆNH ÁN (EMR)</h2>
                  <p className="text-slate-300 text-xs font-medium mt-0.5">Bệnh nhân: <span className="text-white font-bold">{selectedPatient?.fullName}</span></p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-7 h-7 bg-slate-700 hover:bg-slate-600 rounded flex items-center justify-center font-bold transition-colors text-sm">X</button>
              </div>

              {/* Modal Body */}
              <div className="p-5 overflow-y-auto bg-slate-50 flex-1">
                {patientRecords.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                    <Activity className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                    <p className="text-slate-500 font-bold text-base">Chưa có bệnh án</p>
                    <p className="text-slate-400 text-xs mt-1">Bệnh nhân này chưa có dữ liệu khám bệnh.</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {patientRecords.map((record, index) => (
                      <div key={record.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500"></div>
                        
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                          <span className="font-bold text-primary-700 bg-primary-50 px-3 py-1 rounded text-xs border border-primary-100">Lần khám {patientRecords.length - index}</span>
                          <span className="text-slate-500 font-semibold text-xs flex items-center gap-1.5"><CalendarCheck className="w-3.5 h-3.5 text-slate-400"/> {record.date.substring(0,10)} <span className="text-slate-300">|</span> <span className="text-slate-700">{record.doctorName}</span></span>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          {/* Chẩn đoán */}
                          <div>
                            <h4 className="font-bold text-slate-800 mb-1.5 text-[10px] uppercase tracking-wider flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Chẩn đoán (A)</h4>
                            <p className="text-slate-800 bg-slate-50 p-2.5 rounded-lg font-bold border border-slate-100 text-sm">{record.diagnosis || "Chưa cập nhật"}</p>
                          </div>
                          {/* Sinh hiệu */}
                          <div>
                            <h4 className="font-bold text-slate-800 mb-1.5 text-[10px] uppercase tracking-wider flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Sinh hiệu (V)</h4>
                            <p className="text-slate-800 bg-slate-50 p-2.5 rounded-lg font-medium border border-slate-100 text-sm">{record.vitals || "Chưa đo"}</p>
                          </div>
                          {/* Lâm sàng */}
                          <div className="md:col-span-2">
                            <h4 className="font-bold text-slate-800 mb-1.5 text-[10px] uppercase tracking-wider flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Diễn tiến Lâm sàng (S & O)</h4>
                            <div className="bg-slate-50 p-3 rounded-lg font-medium border border-slate-100 text-sm">
                              <p className="text-slate-800 mb-1.5 flex items-start gap-2"><ChevronRight className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0"/> <span className="text-slate-500 min-w-[70px]">Bệnh sử:</span> {record.subjective || "-"}</p>
                              <p className="text-slate-800 flex items-start gap-2"><ChevronRight className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0"/> <span className="text-slate-500 min-w-[70px]">Khám:</span> {record.objective || "-"}</p>
                            </div>
                          </div>
                          {/* Phác đồ */}
                          <div className="md:col-span-2">
                            <h4 className="font-bold text-slate-800 mb-1.5 text-[10px] uppercase tracking-wider flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Phác đồ & Chỉ định (P)</h4>
                            <p className="text-slate-800 bg-slate-50 p-3 rounded-lg font-medium whitespace-pre-line leading-relaxed border border-slate-100 text-sm">{record.plan || "Không có chỉ định"}</p>
                          </div>
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
    </div>
  );
}