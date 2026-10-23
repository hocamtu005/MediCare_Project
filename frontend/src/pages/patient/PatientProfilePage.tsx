import { useState, useEffect, useRef } from 'react';
import { Save, User, Camera, HeartPulse, Lock, ShieldCheck, Contact, Phone, MapPin, CalendarDays, Activity } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { getPatientProfile, updatePatientProfile } from '../../services/patientService';
import { changePassword } from '../../services/userService';

export default function PatientProfilePage() {
  const [form, setForm] = useState({
    fullName: '', phone: '', avatarUrl: '', gender: '', dateOfBirth: '', 
    idNumber: '', address: '', bloodType: '', allergies: '', chronicConditions: ''
  });
  const [preview, setPreview] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    getPatientProfile().then(data => {
      setForm(prev => ({ ...prev, ...data }));
      setPreview(data.avatarUrl || '');
    }).catch(console.error);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      toast.loading("Đang lưu hồ sơ...", { id: "profile" });
      await updatePatientProfile(form, selectedFile);
      
      const newData = await getPatientProfile();
      setForm(prev => ({ ...prev, ...newData }));
      setSelectedFile(null);
      
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userObj = JSON.parse(userStr);
        userObj.fullName = form.fullName;
        localStorage.setItem('user', JSON.stringify(userObj));
      }
      
      toast.success("Cập nhật hồ sơ thành công!", { id: "profile" });
    } catch (error) {
      toast.error("Lỗi cập nhật hồ sơ!", { id: "profile" });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp!', { id: 'password' });
      return;
    }
    try {
      setIsSavingPassword(true);
      toast.loading("Đang đổi mật khẩu...", { id: "password" });
      await changePassword({ oldPassword: passwords.oldPassword, newPassword: passwords.newPassword });
      toast.success('Đổi mật khẩu thành công!', { id: 'password' });
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.response?.data || 'Đổi mật khẩu thất bại!', { id: 'password' });
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <Toaster position="top-right" />
      
      {/* COMPACT HEADER */}
      <div className="bg-white px-5 py-4 rounded-xl shadow-sm border border-slate-200 flex flex-row justify-between items-center relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600 rounded-l-xl"></div>
        <div className="pl-2">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Hồ sơ Cá nhân</h1>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">Quản lý thông tin liên hệ, dữ liệu y tế cơ sở và bảo mật tài khoản.</p>
        </div>
        <div className="bg-primary-50 p-2 rounded-lg border border-primary-100 hidden sm:block">
          <Contact className="w-5 h-5 text-primary-600" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ================= CỘT TRÁI (AVATAR & MẬT KHẨU) ================= */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center text-center">
            <div 
              className="relative w-32 h-32 rounded-full bg-slate-50 border-4 border-white shadow-md overflow-hidden flex items-center justify-center cursor-pointer group mb-5"
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <img src={preview} alt="Avatar" className="w-full h-full object-cover group-hover:opacity-70 transition-opacity" />
              ) : (
                <User className="w-12 h-12 text-slate-300 group-hover:scale-110 transition-transform" />
              )}
              <div className="absolute inset-0 bg-slate-900/40 hidden group-hover:flex items-center justify-center transition-all">
                 <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">{form.fullName || 'Chưa cập nhật tên'}</h3>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider mb-5">Tài khoản Bệnh nhân</span>
            
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()} 
              className="px-4 py-2.5 w-full bg-primary-50 border border-primary-100 text-primary-700 text-xs font-bold rounded-lg hover:bg-primary-100 transition-colors shadow-sm"
            >
              Tải ảnh đại diện mới
            </button>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
          </div>

          <form onSubmit={handleChangePassword} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <h2 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-2 uppercase tracking-wide border-b border-slate-100 pb-3">
                <ShieldCheck className="w-4 h-4 text-primary-600"/> Bảo mật tài khoản
             </h2>
             <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mật khẩu hiện tại</label>
                  <input type="password" value={passwords.oldPassword} onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})} required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-50 outline-none text-sm transition-all bg-slate-50 focus:bg-white" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mật khẩu mới</label>
                  <input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-50 outline-none text-sm transition-all bg-slate-50 focus:bg-white" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Xác nhận mật khẩu mới</label>
                  <input type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-50 outline-none text-sm transition-all bg-slate-50 focus:bg-white" placeholder="••••••••" />
                </div>
                <button type="submit" disabled={isSavingPassword || !passwords.oldPassword || !passwords.newPassword} className="w-full mt-2 py-2.5 bg-slate-800 text-white hover:bg-slate-900 text-xs font-bold rounded-lg flex justify-center items-center gap-2 transition-colors disabled:opacity-50 shadow-sm">
                  <Lock className="w-3.5 h-3.5" /> {isSavingPassword ? 'Đang xác thực...' : 'Đổi Mật khẩu'}
                </button>
             </div>
          </form>
        </div>


        {/* ================= CỘT PHẢI (THÔNG TIN HỒ SƠ) ================= */}
        <div className="lg:col-span-8">
          <form onSubmit={handleSubmitProfile} className="space-y-6">
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-2 pb-3 border-b border-slate-100 uppercase tracking-wide">
                <User className="w-4 h-4 text-primary-600"/> Thông tin Hành chính
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Họ và tên <span className="text-rose-500">*</span></label>
                  <input type="text" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} required className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-50 bg-slate-50 focus:bg-white text-sm font-medium transition-colors" />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                      Số điện thoại liên hệ
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone className="w-4 h-4 text-slate-400"/></div>
                      <input 
                        type="text" 
                        value={form.phone} 
                        onChange={e => setForm({...form, phone: e.target.value})}
                        className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-50 bg-slate-50 focus:bg-white text-sm font-medium transition-colors" 
                        placeholder="Nhập số điện thoại của bạn"
                      />
                    </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Giới tính</label>
                  <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-50 bg-slate-50 focus:bg-white text-sm font-medium transition-colors cursor-pointer">
                    <option value="">-- Chọn giới tính --</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Ngày sinh</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><CalendarDays className="w-4 h-4 text-slate-400"/></div>
                    <input type="date" value={form.dateOfBirth} onChange={e => setForm({...form, dateOfBirth: e.target.value})} className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-50 bg-slate-50 focus:bg-white text-sm font-medium transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Số CCCD / Mã định danh</label>
                  <input type="text" value={form.idNumber} onChange={e => setForm({...form, idNumber: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-50 bg-slate-50 focus:bg-white text-sm font-medium transition-colors" placeholder="Dùng khi đăng ký BHYT (trống nếu là trẻ em)" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Địa chỉ liên lạc</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MapPin className="w-4 h-4 text-slate-400"/></div>
                    <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-50 bg-slate-50 focus:bg-white text-sm font-medium transition-colors" placeholder="Số nhà, đường, phường/xã..." />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-rose-50/50 p-6 rounded-xl border border-rose-100 shadow-sm">
              <h2 className="text-sm font-bold text-rose-700 mb-5 flex items-center gap-2 pb-3 border-b border-rose-200/50 uppercase tracking-wide">
                <HeartPulse className="w-4 h-4"/> Thông tin Y tế Cơ sở
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-rose-800 mb-1.5">Nhóm máu</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Activity className="w-4 h-4 text-rose-400"/></div>
                    <select value={form.bloodType} onChange={e => setForm({...form, bloodType: e.target.value})} className="w-full md:w-1/3 pl-9 pr-4 py-2.5 border border-rose-200 rounded-lg outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 bg-white text-sm font-medium transition-colors cursor-pointer text-rose-700">
                      <option value="">-- Chưa xác định --</option>
                      <option value="A">Nhóm máu A</option>
                      <option value="B">Nhóm máu B</option>
                      <option value="AB">Nhóm máu AB</option>
                      <option value="O">Nhóm máu O</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-rose-800 mb-1.5">Dị ứng (Thuốc, thức ăn, hóa chất)</label>
                  <textarea value={form.allergies} onChange={e => setForm({...form, allergies: e.target.value})} className="w-full p-4 border border-rose-200 rounded-lg h-24 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 resize-none text-sm font-medium transition-colors bg-white placeholder-rose-300" placeholder="VD: Dị ứng Penicillin, dị ứng hải sản... (Để trống nếu không có)" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-rose-800 mb-1.5">Bệnh lý nền & Thuốc đang dùng</label>
                  <textarea value={form.chronicConditions} onChange={e => setForm({...form, chronicConditions: e.target.value})} className="w-full p-4 border border-rose-200 rounded-lg h-24 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 resize-none text-sm font-medium transition-colors bg-white placeholder-rose-300" placeholder="VD: Cao huyết áp (đang uống Amlodipine 5mg/ngày), Tiểu đường tuýp 2..." />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-2">
              <button type="submit" className="px-6 py-2.5 bg-primary-600 text-white text-xs font-bold rounded-lg hover:bg-primary-700 flex items-center gap-2 shadow-md transition-all active:scale-95">
                <Save className="w-4 h-4"/> Lưu thay đổi Hồ sơ
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}