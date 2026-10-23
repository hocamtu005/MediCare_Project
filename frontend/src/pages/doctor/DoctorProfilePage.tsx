import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Save, User, UploadCloud, Phone, FileText, Activity } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { getDoctorProfile, updateDoctorProfile } from '../../services/doctorService';

export default function DoctorProfilePage() {
  const [form, setForm] = useState({ phone: '', bio: '', avatarUrl: '' });
  const [preview, setPreview] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getDoctorProfile().then(data => {
      setForm({ phone: data.phone || '', bio: data.bio || '', avatarUrl: data.avatarUrl || '' });
      setPreview(data.avatarUrl || '');
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      toast.loading("Đang lưu hồ sơ...", { id: "profile" });
      await updateDoctorProfile(form.phone, form.bio, selectedFile, form.avatarUrl);
      
      const newData = await getDoctorProfile();
      setForm({ phone: newData.phone || '', bio: newData.bio || '', avatarUrl: newData.avatarUrl || '' });
      setSelectedFile(null);
      
      toast.success("Cập nhật hồ sơ thành công!", { id: "profile" });
    } catch (error) {
      toast.error("Lỗi cập nhật hồ sơ!", { id: "profile" });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[50vh] gap-3 text-primary-600">
        <Activity className="w-6 h-6 animate-spin" />
        <span className="text-xs font-semibold">Đang tải hồ sơ...</span>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1400px] mx-auto space-y-4 pb-10"
    >
      <Toaster position="top-right" />
      
      {/* HEADER COMPACT - ĐÃ MỞ RỘNG FULL CHIỀU DÀI */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600"></div>
        <div className="pl-2">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-tight">Hồ sơ Cá nhân</h1>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">Cập nhật thông tin liên hệ và tiểu sử chuyên môn của bạn.</p>
        </div>
      </div>

      {/* FORM NHẬP LIỆU - GIỮ KÍCH THƯỚC VỪA PHẢI ĐỂ TRÁNH BỊ KÉO GIÃN QUÁ MỨC */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden max-w-4xl">
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          
          {/* Khu vực Avatar */}
          <div className="flex flex-col sm:flex-row items-center gap-5 pb-5 border-b border-slate-100">
            <div 
              className="relative w-20 h-20 rounded-full bg-slate-50 border border-slate-200 shadow-sm overflow-hidden flex items-center justify-center shrink-0 group cursor-pointer" 
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <img src={preview} alt="Avatar" className="w-full h-full object-cover group-hover:opacity-70 transition-opacity" />
              ) : (
                <User className="w-8 h-8 text-slate-300 group-hover:scale-110 transition-transform" />
              )}
              <div className="absolute inset-0 bg-slate-900/40 hidden group-hover:flex items-center justify-center">
                 <UploadCloud className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <div className="flex-1 w-full text-center sm:text-left">
              <h3 className="font-bold text-slate-800 text-[13px] mb-1">Ảnh đại diện</h3>
              <p className="text-[11px] text-slate-500 mb-2.5 font-medium">Định dạng JPG, PNG. Kích thước tối đa 5MB.</p>
              
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()} 
                className="px-3 py-1.5 bg-primary-50 text-primary-700 font-bold rounded-md hover:bg-primary-100 transition-colors inline-flex items-center gap-1.5 text-[11px] border border-primary-100"
              >
                <UploadCloud className="w-3.5 h-3.5"/> Tải ảnh lên
              </button>
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            </div>
          </div>

          <div className="space-y-4">
            {/* Số điện thoại */}
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                <Phone className="w-3.5 h-3.5 text-primary-500"/> Số điện thoại liên hệ
              </label>
              <input 
                type="text" 
                value={form.phone} 
                onChange={e => setForm({...form, phone: e.target.value})} 
                placeholder="VD: 0987654321"
                className="w-full px-3 py-2 border border-slate-200 rounded-md outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-slate-50 focus:bg-white text-xs font-medium transition-colors" 
              />
            </div>
            
            {/* Tiểu sử chuyên môn */}
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                <FileText className="w-3.5 h-3.5 text-primary-500"/> Tiểu sử chuyên môn (Bio)
              </label>
              <textarea 
                value={form.bio} 
                onChange={e => setForm({...form, bio: e.target.value})} 
                className="w-full px-3 py-2 border border-slate-200 rounded-md outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-slate-50 focus:bg-white text-xs font-medium transition-colors h-32 resize-none leading-relaxed" 
                placeholder="Kinh nghiệm làm việc, học vấn, chuyên môn..." 
              />
            </div>
          </div>
          
          <div className="pt-2 border-t border-slate-100 flex justify-end">
            <button 
              type="submit" 
              className="px-5 py-2 bg-primary-600 text-white font-bold rounded-md hover:bg-primary-700 flex items-center justify-center gap-1.5 transition-colors text-xs shadow-sm shadow-primary-500/20"
            >
              <Save className="w-3.5 h-3.5"/> Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}