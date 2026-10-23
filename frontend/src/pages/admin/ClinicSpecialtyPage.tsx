import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, X, Save, Building2, Stethoscope, Trash2, DoorOpen, Check, Activity, MapPin } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { 
  getSpecialties, createSpecialty, updateSpecialty, deleteSpecialty,
  getClinics, createClinic, updateClinic,
  getRooms, createRoom, updateRoom, deleteRoom
} from '../../services/adminService';

export default function ClinicSpecialtyPage() {
  const [activeTab, setActiveTab] = useState<'SPECIALTY' | 'CLINIC'>('SPECIALTY');
  const [loading, setLoading] = useState(false);
  
  // --- STATES CHUYÊN KHOA ---
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [searchSpec, setSearchSpec] = useState('');
  const [isSpecModalOpen, setIsSpecModalOpen] = useState(false);
  const [editingSpec, setEditingSpec] = useState<any>(null);
  const [specForm, setSpecForm] = useState({ name: '', description: '', imageUrl: '' });

  // --- STATES CƠ SỞ ---
  const [clinics, setClinics] = useState<any[]>([]);
  const [searchClinic, setSearchClinic] = useState('');
  const [isClinicModalOpen, setIsClinicModalOpen] = useState(false);
  const [editingClinic, setEditingClinic] = useState<any>(null);
  const [clinicForm, setClinicForm] = useState({ name: '', address: '', phone: '', email: '' });

  // --- STATES PHÒNG KHÁM ---
  const [selectedClinicForRooms, setSelectedClinicForRooms] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [editingRoomName, setEditingRoomName] = useState('');

  useEffect(() => {
    if (activeTab === 'SPECIALTY') fetchSpecialties();
    if (activeTab === 'CLINIC') fetchClinics();
  }, [activeTab]);

  const fetchSpecialties = async () => {
    setLoading(true);
    try { setSpecialties(await getSpecialties()); } 
    catch (error) { toast.error("Lỗi tải chuyên khoa"); }
    finally { setLoading(false); }
  };

  const fetchClinics = async () => {
    setLoading(true);
    try { setClinics(await getClinics()); } 
    catch (error) { toast.error("Lỗi tải cơ sở"); }
    finally { setLoading(false); }
  };

  const loadRooms = async (clinic: any) => {
    setSelectedClinicForRooms(clinic);
    setEditingRoomId(null);
    try { setRooms(await getRooms(clinic.id)); } 
    catch (error) { toast.error("Lỗi tải danh sách phòng"); }
  };

  // --- HANDLERS ---
  const handleSpecSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.loading("Đang lưu...", { id: "saveSpec" });
    try {
      if (editingSpec) await updateSpecialty(editingSpec.id, specForm);
      else await createSpecialty(specForm);
      toast.success("Thành công!", { id: "saveSpec" });
      setIsSpecModalOpen(false); setEditingSpec(null); fetchSpecialties();
    } catch (error: any) { toast.error(error.response?.data || "Lỗi lưu", { id: "saveSpec" }); }
  };

  const handleDeleteSpec = async (id: string, name: string) => {
    if(!window.confirm(`Bạn có chắc muốn xóa chuyên khoa ${name}?`)) return;
    toast.loading("Đang xóa...", { id: "delSpec" });
    try {
      await deleteSpecialty(id);
      toast.success("Đã xóa chuyên khoa", { id: "delSpec" });
      fetchSpecialties();
    } catch (error: any) { toast.error(error.response?.data || "Lỗi xóa", { id: "delSpec" }); }
  };

  const handleClinicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.loading("Đang lưu...", { id: "saveClinic" });
    try {
      if (editingClinic) await updateClinic(editingClinic.id, clinicForm);
      else await createClinic(clinicForm);
      toast.success("Thành công!", { id: "saveClinic" });
      setIsClinicModalOpen(false); setEditingClinic(null); fetchClinics();
    } catch (error: any) { toast.error(error.response?.data || "Lỗi lưu", { id: "saveClinic" }); }
  };

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    toast.loading("Đang thêm phòng...", { id: "addRoom" });
    try {
      await createRoom(selectedClinicForRooms.id, { name: newRoomName });
      toast.success("Thêm phòng thành công!", { id: "addRoom" });
      setNewRoomName('');
      setRooms(await getRooms(selectedClinicForRooms.id));
    } catch (error: any) { toast.error(error.response?.data || "Lỗi thêm phòng", { id: "addRoom" }); }
  };

  const handleUpdateRoom = async (roomId: string) => {
    if (!editingRoomName.trim()) return;
    toast.loading("Đang cập nhật...", { id: "updateRoom" });
    try {
      await updateRoom(selectedClinicForRooms.id, roomId, { name: editingRoomName });
      toast.success("Đổi tên thành công!", { id: "updateRoom" });
      setEditingRoomId(null);
      setRooms(await getRooms(selectedClinicForRooms.id));
    } catch (error: any) { 
      const errData = error.response?.data;
      const errorMsg = typeof errData === 'string' ? errData : (errData?.message || "Lỗi cập nhật phòng");
      toast.error(errorMsg, { id: "updateRoom" }); 
    }
  };

  const handleDeleteRoom = async (id: string) => {
    if(!window.confirm("Bạn có chắc muốn xóa phòng này?")) return;
    
    toast.loading("Đang xóa phòng...", { id: "deleteRoom" });
    try {
      await deleteRoom(selectedClinicForRooms.id, id);
      toast.success("Đã xóa phòng thành công!", { id: "deleteRoom" });
      setRooms(await getRooms(selectedClinicForRooms.id));
    } catch (error: any) { 
      const errorMsg = error.response?.data || "";
      if (typeof errorMsg === 'string' && errorMsg.includes("violates foreign key constraint")) {
        toast.error("Phòng đang có lịch sử ca trực. Vui lòng dùng tính năng đổi tên (ví dụ: '[Đóng cửa] Tên phòng') thay vì xóa.", { id: "deleteRoom", duration: 6000 });
      } else {
        toast.error(errorMsg || "Lỗi xóa phòng", { id: "deleteRoom" }); 
      }
    }
  };

  const filteredSpecialties = specialties.filter(s => s.name?.toLowerCase().includes(searchSpec.toLowerCase()));
  const filteredClinics = clinics.filter(c => c.name?.toLowerCase().includes(searchClinic.toLowerCase()));

  return (
    <div className="space-y-4 pb-10 max-w-7xl mx-auto">
      <Toaster position="top-right"/>
      
      {/* 1. COMPACT HEADER CARD - Đồng bộ với RecordManagementPage */}
      <div className="bg-white px-5 py-4 rounded-xl shadow-sm border border-slate-200 flex flex-row justify-between items-center relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600 rounded-l-xl"></div>
        <div className="pl-2">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Cơ sở & Chuyên khoa</h1>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">Quản lý danh mục chuyên khoa và bản đồ phòng vật lý tại các chi nhánh.</p>
        </div>
        <div className="bg-primary-50 p-2 rounded-lg border border-primary-100 hidden sm:block">
          <Building2 className="w-5 h-5 text-primary-600" />
        </div>
      </div>

      {/* 2. COMPACT TOOLBAR - Tabs & Search */}
      <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-fit">
          <button 
            onClick={() => {setActiveTab('SPECIALTY'); setSearchSpec('');}} 
            className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 py-1.5 px-5 text-xs font-semibold rounded-md transition-all duration-200 ${activeTab === 'SPECIALTY' ? 'bg-white text-primary-600 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Stethoscope className="w-3.5 h-3.5" /> Chuyên khoa
          </button>
          <button 
            onClick={() => {setActiveTab('CLINIC'); setSearchClinic('');}} 
            className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 py-1.5 px-5 text-xs font-semibold rounded-md transition-all duration-200 ${activeTab === 'CLINIC' ? 'bg-white text-primary-600 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <MapPin className="w-3.5 h-3.5" /> Cơ sở Y tế
          </button>
        </div>

        <div className="flex w-full md:w-auto items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder={`Tìm kiếm ${activeTab === 'SPECIALTY' ? 'chuyên khoa...' : 'cơ sở...'}`} 
              value={activeTab === 'SPECIALTY' ? searchSpec : searchClinic} 
              onChange={(e) => activeTab === 'SPECIALTY' ? setSearchSpec(e.target.value) : setSearchClinic(e.target.value)} 
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-50 transition-all text-xs font-medium text-slate-700 placeholder-slate-400" 
            />
          </div>
          <button 
            onClick={() => { 
              if(activeTab === 'SPECIALTY') { setEditingSpec(null); setSpecForm({name: '', description: '', imageUrl: ''}); setIsSpecModalOpen(true); }
              else { setEditingClinic(null); setClinicForm({name: '', address: '', phone: '', email: ''}); setIsClinicModalOpen(true); }
            }} 
            className="flex-shrink-0 px-3 py-1.5 bg-primary-600 text-white rounded-lg flex items-center justify-center gap-1.5 text-xs font-semibold hover:bg-primary-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Thêm mới
          </button>
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
          ) : activeTab === 'SPECIALTY' ? (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-slate-500 bg-slate-50 border-b border-slate-200 text-xs">
                <tr>
                  <th className="px-6 py-3 font-semibold">Tên Chuyên khoa</th>
                  <th className="px-6 py-3 font-semibold text-right">Điều khiển</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredSpecialties.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                          <Stethoscope className="w-4 h-4"/>
                        </div>
                        <span className="font-bold text-slate-800">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setSpecForm({ name: item.name, description: item.description || '', imageUrl: item.imageUrl || '' }); setEditingSpec(item); setIsSpecModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Sửa">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteSpec(item.id, item.name)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Xóa">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredSpecialties.length === 0 && (<tr><td colSpan={2} className="text-center py-8 text-slate-500 text-sm">Không có dữ liệu.</td></tr>)}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-slate-500 bg-slate-50 border-b border-slate-200 text-xs">
                <tr>
                  <th className="px-6 py-3 font-semibold">Cơ sở / Chi nhánh</th>
                  <th className="px-6 py-3 font-semibold">Thông tin liên lạc</th>
                  <th className="px-6 py-3 font-semibold text-right">Điều khiển</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredClinics.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-indigo-500"/> {item.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm truncate" title={item.address}>{item.address}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium text-xs space-y-1">
                      <p>{item.phone || "-"}</p>
                      <p>{item.email || "-"}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => loadRooms(item)} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 font-semibold rounded-md text-xs transition-colors flex items-center gap-1.5">
                          <DoorOpen className="w-3.5 h-3.5"/> Quản lý Phòng
                        </button>
                        <div className="w-px h-4 bg-slate-200"></div>
                        <button onClick={() => { setClinicForm({ name: item.name, address: item.address, phone: item.phone || '', email: item.email || '' }); setEditingClinic(item); setIsClinicModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Sửa thông tin">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredClinics.length === 0 && (<tr><td colSpan={3} className="text-center py-8 text-slate-500 text-sm">Không có dữ liệu.</td></tr>)}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 4. MODALS */}
      {/* Modal Quản lý Phòng */}
      <AnimatePresence>
        {selectedClinicForRooms && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedClinicForRooms(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]">
              <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wide"><DoorOpen className="w-4 h-4 text-primary-600"/> QUẢN LÝ PHÒNG KHÁM</h3>
                <button onClick={() => setSelectedClinicForRooms(null)} className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-200 p-1 rounded-md transition-colors shadow-sm"><X className="w-4 h-4" /></button>
              </div>
              
              <div className="p-5 flex-1 overflow-y-auto">
                <p className="text-xs text-slate-500 font-medium mb-4 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5"/> Chi nhánh: <span className="text-slate-800 font-bold">{selectedClinicForRooms.name}</span></p>
                
                <form onSubmit={handleAddRoom} className="flex gap-2 mb-5">
                  <input type="text" value={newRoomName} onChange={e=>setNewRoomName(e.target.value)} placeholder="Tên phòng (VD: Phòng Nội 1)" className="flex-1 px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary-500 text-sm bg-slate-50 focus:bg-white transition-colors" required />
                  <button type="submit" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5"><Plus className="w-4 h-4"/> Thêm</button>
                </form>
                
                <div className="border border-slate-100 rounded-lg divide-y divide-slate-50">
                  {rooms.length === 0 ? (
                    <p className="p-6 text-center text-slate-400 text-xs">Chưa có phòng nào. Hãy tạo phòng mới phía trên.</p>
                  ) : (
                    rooms.map(r => (
                      <div key={r.id} className="flex justify-between items-center p-2.5 hover:bg-slate-50 transition-colors group">
                        {editingRoomId === r.id ? (
                          <div className="flex-1 flex items-center gap-2 mr-2">
                            <input
                              type="text"
                              value={editingRoomName}
                              onChange={(e) => setEditingRoomName(e.target.value)}
                              className="flex-1 px-2.5 py-1 border border-primary-300 rounded outline-none text-sm focus:ring-2 focus:ring-primary-100"
                              autoFocus
                              onKeyDown={(e) => e.key === 'Enter' && handleUpdateRoom(r.id)}
                            />
                            <button onClick={() => handleUpdateRoom(r.id)} className="text-emerald-600 bg-emerald-50 hover:bg-emerald-100 p-1.5 rounded transition-colors" title="Lưu"><Check className="w-3.5 h-3.5" /></button>
                            <button onClick={() => setEditingRoomId(null)} className="text-slate-500 bg-slate-100 hover:bg-slate-200 p-1.5 rounded transition-colors" title="Hủy"><X className="w-3.5 h-3.5" /></button>
                          </div>
                        ) : (
                          <>
                            <span className="font-semibold text-slate-700 text-sm">{r.name}</span>
                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setEditingRoomId(r.id); setEditingRoomName(r.name); }} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors" title="Đổi tên"><Edit2 className="w-3.5 h-3.5" /></button>
                              <button onClick={() => handleDeleteRoom(r.id)} className="text-rose-500 hover:bg-rose-50 p-1.5 rounded transition-colors" title="Xóa"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Chuyên khoa */}
      <AnimatePresence>
        {isSpecModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsSpecModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2"><Stethoscope className="w-4 h-4 text-primary-600"/> {editingSpec ? 'SỬA CHUYÊN KHOA' : 'THÊM CHUYÊN KHOA'}</h3>
              </div>
              <form onSubmit={handleSpecSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Tên chuyên khoa <span className="text-rose-500">*</span></label>
                  <input type="text" required value={specForm.name} onChange={e => setSpecForm({...specForm, name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary-500 bg-slate-50 focus:bg-white transition-colors text-sm" placeholder="VD: Nội thần kinh" />
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <button type="button" onClick={()=>setIsSpecModalOpen(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-xs font-bold">Hủy</button>
                  <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-xs font-bold flex items-center gap-1.5"><Save className="w-3.5 h-3.5"/> {editingSpec ? 'Cập nhật' : 'Lưu mới'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Cơ sở */}
      <AnimatePresence>
        {isClinicModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsClinicModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2"><MapPin className="w-4 h-4 text-primary-600"/> {editingClinic ? 'SỬA CƠ SỞ' : 'THÊM CƠ SỞ MỚI'}</h3>
              </div>
              <form onSubmit={handleClinicSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Tên cơ sở <span className="text-rose-500">*</span></label>
                  <input type="text" required value={clinicForm.name} onChange={e => setClinicForm({...clinicForm, name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary-500 bg-slate-50 focus:bg-white transition-colors text-sm" placeholder="VD: Phòng khám Đa khoa A" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Địa chỉ <span className="text-rose-500">*</span></label>
                  <input type="text" required value={clinicForm.address} onChange={e => setClinicForm({...clinicForm, address: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary-500 bg-slate-50 focus:bg-white transition-colors text-sm" placeholder="Số nhà, đường, phường, quận..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Số điện thoại</label>
                    <input type="text" value={clinicForm.phone} onChange={e => setClinicForm({...clinicForm, phone: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary-500 bg-slate-50 focus:bg-white transition-colors text-sm" placeholder="09xxxx" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Email liên hệ</label>
                    <input type="email" value={clinicForm.email} onChange={e => setClinicForm({...clinicForm, email: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary-500 bg-slate-50 focus:bg-white transition-colors text-sm" placeholder="contact@..." />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                  <button type="button" onClick={()=>setIsClinicModalOpen(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-xs font-bold">Hủy</button>
                  <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-xs font-bold flex items-center gap-1.5"><Save className="w-3.5 h-3.5"/> {editingClinic ? 'Cập nhật' : 'Lưu mới'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}