import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, FileText, Calendar, Clock, UserPlus, CheckCircle2, AlertCircle, Activity } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { createWalkInAppointment } from '../../services/receptionistService';

export default function NurseBookingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    doctorEmail: '',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    reason: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.doctorEmail || !formData.time) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!", {
        icon: <AlertCircle className="w-5 h-5 text-red-500" />
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const dateTimeString = `${formData.date}T${formData.time}:00`;
      
      await createWalkInAppointment({
        ...formData,
        time: dateTimeString
      });

      toast.success("Đăng ký thành công! Đã chuyển vào hàng đợi.", {
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      });
      
      setFormData({
        fullName: '', phone: '', doctorEmail: '',
        date: new Date().toISOString().split('T')[0], time: '14:00', reason: ''
      });
      
    } catch (error: any) {
      toast.error("Có lỗi xảy ra: " + (error.response?.data || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1200px] mx-auto space-y-6 pb-10"
    >
      <Toaster position="top-right" />

      {/* HEADER COMPACT */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 relative overflow-hidden flex items-center justify-between">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600"></div>
        <div className="pl-2">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-tight">Tiếp nhận Khách vãng lai</h1>
          <p className="text-slate-500 text-xs mt-1 font-medium">Đăng ký khám trực tiếp tại quầy (Không đặt lịch trước).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CỘT TRÁI: THÔNG TIN TRỰC QUAN (Chiếm 4/12) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-xl border border-primary-200 shadow-sm relative overflow-hidden h-full flex flex-col justify-center">
             <UserPlus className="absolute -right-6 -top-6 w-32 h-32 text-primary-500/10 rotate-12" />
             <div className="relative z-10 text-center">
               <div className="w-16 h-16 bg-white text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-primary-100">
                 <UserPlus className="w-8 h-8" />
               </div>
               <h2 className="text-lg font-black text-primary-800 leading-tight">Phiếu Đăng Ký<br/>Khám Bệnh</h2>
               <p className="text-xs text-primary-600/80 mt-2 font-medium px-4">
                 Hệ thống sẽ tự động tạo hồ sơ nếu đây là bệnh nhân mới. Thông tin sẽ được đồng bộ ngay lập tức.
               </p>
             </div>
          </div>
        </div>

        {/* CỘT PHẢI: FORM NHẬP LIỆU (Chiếm 8/12) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Tên bệnh nhân */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Họ và tên bệnh nhân <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="text" placeholder="VD: Nguyễn Văn A" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-md outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-slate-50 focus:bg-white text-sm transition-colors" />
                </div>
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Số điện thoại <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="text" placeholder="VD: 0987654321" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-md outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-slate-50 focus:bg-white text-sm transition-colors" />
                </div>
              </div>

              {/* Bác sĩ phụ trách */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Email Bác sĩ phụ trách <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="email" placeholder="VD: doctor@medicare.vn" value={formData.doctorEmail} onChange={e => setFormData({...formData, doctorEmail: e.target.value})} className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-md outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-slate-50 focus:bg-white text-sm transition-colors" />
                </div>
              </div>

              {/* Ngày khám */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Ngày khám <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-md outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-slate-50 focus:bg-white text-sm transition-colors" />
                </div>
              </div>

              {/* Giờ khám */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Giờ khám <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-md outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-slate-50 focus:bg-white text-sm transition-colors" />
                </div>
              </div>

              {/* Lý do khám */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Lý do khám sơ bộ</label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <textarea placeholder="Triệu chứng của bệnh nhân..." value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-md outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-slate-50 focus:bg-white text-sm transition-colors h-20 resize-none" />
                </div>
              </div>
            </div>

            {/* Nút Submit */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="px-6 py-2.5 bg-primary-600 text-white rounded-md font-bold text-sm flex items-center gap-2 hover:bg-primary-700 transition-colors shadow-sm disabled:opacity-70"
              >
                {isSubmitting ? (
                  <><Activity className="w-4 h-4 animate-spin" /> Đang xử lý...</>
                ) : (
                  <><CheckCircle2 className="w-4 h-4" /> Xác nhận & Đưa vào hàng đợi</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}