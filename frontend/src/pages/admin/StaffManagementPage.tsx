import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserPlus, MoreVertical, X, Save, Lock, Unlock, Edit2, UserCog, Activity, ShieldAlert, Trash2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { getStaffList, toggleUserStatus, createStaff, updateStaff, getSpecialties, deleteStaff } from '../../services/adminService';

export default function StaffManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'Bác sĩ' | 'Điều dưỡng' | 'Admin'>('ALL');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<any>(null);

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('DOCTOR');
  const [newSpecialtyId, setNewSpecialtyId] = useState('');

  useEffect(() => {
    fetchStaff();
    fetchSpecialties();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try { setUsers(await getStaffList()); } 
    catch (error) { toast.error("Lỗi tải danh sách nhân sự"); } 
    finally { setLoading(false); }
  };

  const fetchSpecialties = async () => {
    try { 
      const data = await getSpecialties(); 
      setSpecialties(data.filter((s:any) => s.active || s.isActive)); 
      if(data.length > 0) setNewSpecialtyId(data[0].id);
    } catch (error) {}
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    if(!window.confirm(`Bạn có chắc muốn ${currentStatus ? 'KHÓA' : 'MỞ KHÓA'} tài khoản này?`)) return;
    toast.loading("Đang xử lý...", { id: "toggle" });
    try {
      await toggleUserStatus(id);
      fetchStaff();
      toast.success(`${currentStatus ? 'Đã khóa' : 'Đã mở khóa'} tài khoản thành công!`, { id: "toggle" });
    } catch (error) { toast.error("Lỗi xử lý. Vui lòng thử lại.", { id: "toggle" }); }
    setActiveDropdown(null);
  };

  const handleDeleteUser = async (id: string, name: string) => {
  if(!window.confirm(`⚠️ CẢNH BÁO: Bạn có chắc chắn muốn XÓA VĨNH VIỄN tài khoản của ${name} không?\n\nLưu ý: Chỉ có thể xóa tài khoản chưa phát sinh dữ liệu (chưa có ca khám/lịch trực).`)) return;
  toast.loading("Đang xóa...", { id: "delete" });
  try {
    await deleteStaff(id); // Sử dụng hàm từ adminService
    fetchStaff();
    toast.success("Đã xóa tài khoản thành công!", { id: "delete" });
  } catch (error: any) { 
    toast.error(error.response?.data || "Không thể xóa do lỗi ràng buộc dữ liệu.", { id: "delete", duration: 5000 }); 
  }
  setActiveDropdown(null);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.loading("Đang tạo tài khoản...", { id: "create" });
    try {
      await createStaff({
        fullName: newName, email: newEmail, role: newRole,
        specialtyId: newRole === 'DOCTOR' ? newSpecialtyId : ''
      });
      toast.success("Cấp tài khoản thành công!", { id: "create" });
      setIsAddModalOpen(false); setNewName(''); setNewEmail('');
      fetchStaff();
    } catch (error: any) { toast.error(error.response?.data || "Lỗi tạo tài khoản", { id: "create" }); }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.loading("Đang cập nhật...", { id: "update" });
    try {
      await updateStaff(editingUser.id, {
        fullName: editingUser.fullName, role: editingUser.role,
        specialtyId: editingUser.role === 'DOCTOR' ? editingUser.specialtyId : ''
      });
      toast.success("Cập nhật thành công!", { id: "update" });
      setEditingUser(null);
      fetchStaff();
    } catch (error: any) { toast.error(error.response?.data || "Lỗi cập nhật", { id: "update" }); }
  };

  const getVietnameseRole = (role: string) => {
    if (role === 'DOCTOR') return 'Bác sĩ';
    if (role === 'RECEPTIONIST') return 'Điều dưỡng';
    if (role === 'ADMIN') return 'Admin';
    return role;
  };

  const getSpecName = (id: string) => {
    if (!id) return '';
    const s = specialties.find(x => x.id === id);
    return s ? ` - Khoa ${s.name}` : '';
  };

  const filteredUsers = users.filter(u => {
    const matchRole = roleFilter === 'ALL' || getVietnameseRole(u.role) === roleFilter;
    const matchSearch = u.fullName?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <div className="space-y-4 pb-10 max-w-7xl mx-auto">
      <Toaster position="top-right"/>
      {activeDropdown && <div className="fixed inset-0 z-30" onClick={() => setActiveDropdown(null)}></div>}

      {/* 1. COMPACT HEADER CARD - Đồng bộ */}
      <div className="bg-white px-5 py-4 rounded-xl shadow-sm border border-slate-200 flex flex-row justify-between items-center relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600 rounded-l-xl"></div>
        <div className="pl-2">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Quản lý Nhân sự</h1>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">Danh sách tài khoản hệ thống và phân quyền truy cập.</p>
        </div>
        <div className="bg-primary-50 p-2 rounded-lg border border-primary-100 hidden sm:block">
          <UserCog className="w-5 h-5 text-primary-600" />
        </div>
      </div>

      {/* 2. COMPACT TOOLBAR - Filter & Search */}
      <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-fit overflow-x-auto">
          {['ALL', 'Bác sĩ', 'Điều dưỡng', 'Admin'].map((role) => (
            <button 
              key={role}
              onClick={() => setRoleFilter(role as any)} 
              className={`flex-none md:flex-1 flex items-center justify-center py-1.5 px-4 text-xs font-semibold rounded-md transition-all duration-200 whitespace-nowrap ${roleFilter === role ? 'bg-white text-primary-600 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {role === 'ALL' ? 'Tất cả vai trò' : role}
            </button>
          ))}
        </div>

        <div className="flex w-full md:w-auto items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Tìm kiếm nhân sự..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-50 transition-all text-xs font-medium text-slate-700 placeholder-slate-400" 
            />
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)} 
            className="flex-shrink-0 px-3 py-1.5 bg-primary-600 text-white rounded-lg flex items-center justify-center gap-1.5 text-xs font-semibold hover:bg-primary-700 transition-colors shadow-sm"
          >
            <UserPlus className="w-4 h-4" /> Cấp tài khoản
          </button>
        </div>
      </div>

      {/* 3. BẢNG DỮ LIỆU */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 gap-2 text-primary-600">
              <Activity className="w-6 h-6 animate-spin" />
              <span className="text-xs font-medium">Đang tải danh sách...</span>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-slate-500 bg-slate-50 border-b border-slate-200 text-xs">
                <tr>
                  <th className="px-6 py-3 font-semibold">Tài khoản Nhân sự</th>
                  <th className="px-6 py-3 font-semibold">Vai trò / Chuyên môn</th>
                  <th className="px-6 py-3 font-semibold text-center">Trạng thái</th>
                  <th className="px-6 py-3 font-semibold text-right">Điều khiển</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold uppercase ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : u.role === 'DOCTOR' ? 'bg-indigo-100 text-indigo-700' : 'bg-teal-100 text-teal-700'}`}>
                          {u.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{u.fullName}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 border rounded-md font-semibold text-[11px] ${u.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-100' : u.role === 'DOCTOR' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-teal-50 text-teal-700 border-teal-100'}`}>
                        {getVietnameseRole(u.role)}
                      </span>
                      {u.role === 'DOCTOR' && <span className="text-xs text-slate-500 ml-2 font-medium">{getSpecName(u.specialtyId)}</span>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${u.active ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>
                        {u.active ? 'Hoạt động' : 'Đã khóa'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button onClick={() => setActiveDropdown(activeDropdown === u.id ? null : u.id)} className="p-1.5 relative z-20 text-slate-400 hover:text-primary-600 transition-colors rounded-md hover:bg-slate-100">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      <AnimatePresence>
                        {activeDropdown === u.id && (
                          <motion.div initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -10 }} className="absolute right-10 top-10 w-48 bg-white border border-slate-200 shadow-xl z-50 rounded-xl overflow-hidden text-left py-1.5">
                            <button onClick={() => { setEditingUser(u); setActiveDropdown(null); }} className="w-full px-4 py-2 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors">
                              <Edit2 className="w-4 h-4 text-blue-500"/> Chỉnh sửa thông tin
                            </button>
                            <button onClick={() => handleToggleStatus(u.id, u.active)} className={`w-full px-4 py-2 hover:bg-slate-50 text-xs font-semibold flex items-center gap-2 transition-colors ${u.active ? 'text-amber-600' : 'text-emerald-600'}`}>
                              {u.active ? <><Lock className="w-4 h-4"/> Khóa tài khoản</> : <><Unlock className="w-4 h-4"/> Mở khóa tài khoản</>}
                            </button>
                            <div className="h-px bg-slate-100 my-1"></div>
                            {/* NÚT XÓA MỚI THÊM */}
                            <button onClick={() => handleDeleteUser(u.id, u.fullName)} className="w-full px-4 py-2 hover:bg-rose-50 text-xs font-bold text-rose-600 flex items-center gap-2 transition-colors">
                              <Trash2 className="w-4 h-4"/> Xóa tài khoản
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr><td colSpan={4} className="text-center py-10 text-slate-500 text-sm">Không tìm thấy nhân sự phù hợp.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL TẠO MỚI */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2"><UserPlus className="w-4 h-4 text-primary-600"/> Cấp tài khoản mới</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-200 p-1 rounded-md transition-colors"><X className="w-4 h-4"/></button>
              </div>
              <form onSubmit={handleCreateUser} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Họ và tên <span className="text-rose-500">*</span></label>
                  <input type="text" required value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Nhập họ tên nhân viên" className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary-500 bg-slate-50 focus:bg-white text-sm transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Email đăng nhập <span className="text-rose-500">*</span></label>
                  <input type="email" required value={newEmail} onChange={e=>setNewEmail(e.target.value)} placeholder="example@medicare.vn" className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary-500 bg-slate-50 focus:bg-white text-sm transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Vai trò hệ thống <span className="text-rose-500">*</span></label>
                  <select value={newRole} onChange={e=>setNewRole(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary-500 bg-slate-50 focus:bg-white text-sm font-medium text-slate-700 transition-colors">
                    <option value="DOCTOR">Bác sĩ</option>
                    <option value="RECEPTIONIST">Điều dưỡng (Lễ tân)</option>
                    <option value="ADMIN">Quản trị viên (Admin)</option>
                  </select>
                </div>
                {newRole === 'DOCTOR' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Trực thuộc Chuyên khoa <span className="text-rose-500">*</span></label>
                    <select value={newSpecialtyId} onChange={e=>setNewSpecialtyId(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary-500 bg-slate-50 focus:bg-white text-sm font-medium text-slate-700 transition-colors" required>
                      <option value="" disabled>-- Chọn chuyên khoa --</option>
                      {specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </motion.div>
                )}
                
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 flex items-start gap-2 mt-2">
                   <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5 shrink-0"/>
                   <p className="text-[11px] text-amber-700 font-medium leading-relaxed">Mật khẩu mặc định là <strong className="text-amber-900">123456</strong>. Nhân sự cần đăng nhập và tự đổi lại mật khẩu để bảo đảm an toàn.</p>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                  <button type="button" onClick={()=>setIsAddModalOpen(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors">Hủy</button>
                  <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-bold hover:bg-primary-700 transition-colors flex items-center gap-1.5"><UserPlus className="w-3.5 h-3.5"/> Cấp tài khoản</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL CẬP NHẬT */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setEditingUser(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2"><Edit2 className="w-4 h-4 text-blue-500"/> Chỉnh sửa thông tin</h3>
                <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-200 p-1 rounded-md transition-colors"><X className="w-4 h-4"/></button>
              </div>
              <form onSubmit={handleUpdateUser} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Tên nhân viên</label>
                  <input type="text" required value={editingUser.fullName} onChange={e=>setEditingUser({...editingUser, fullName: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary-500 bg-slate-50 focus:bg-white text-sm transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Tài khoản (Email)</label>
                  <input type="email" value={editingUser.email} disabled className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 text-sm cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Vai trò hệ thống</label>
                  <select value={editingUser.role} onChange={e=>setEditingUser({...editingUser, role: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary-500 bg-slate-50 focus:bg-white text-sm font-medium text-slate-700 transition-colors">
                    <option value="DOCTOR">Bác sĩ</option>
                    <option value="RECEPTIONIST">Điều dưỡng (Lễ tân)</option>
                    <option value="ADMIN">Quản trị viên (Admin)</option>
                  </select>
                </div>
                {editingUser.role === 'DOCTOR' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Chuyên khoa</label>
                    <select value={editingUser.specialtyId || ''} onChange={e=>setEditingUser({...editingUser, specialtyId: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary-500 bg-slate-50 focus:bg-white text-sm font-medium text-slate-700 transition-colors" required>
                      <option value="" disabled>-- Chọn chuyên khoa --</option>
                      {specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </motion.div>
                )}
                
                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 mt-4">
                  <button type="button" onClick={()=>setEditingUser(null)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors">Hủy thay đổi</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1.5"><Save className="w-3.5 h-3.5"/> Lưu thông tin</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}