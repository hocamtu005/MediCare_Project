import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stethoscope, Calendar as CalendarIcon, Clock, User,
  CheckCircle2, ChevronRight, Activity, MapPin, ShieldCheck, ArrowLeft, Heart, Brain, Star, History, FileText, AlertTriangle, XCircle, Clock4, PlayCircle, Eye, X
} from 'lucide-react';
import { getSpecialties, getDoctorsBySpecialty, bookAppointment, getAvailableSlots, cancelAppointment } from '../../services/bookingService';
import { getMyAppointments } from '../../services/userService';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

// Helper UI functions
const getSpecialtyUI = (name: string) => {
  if (name.toLowerCase().includes('tim')) return { icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-200' };
  if (name.toLowerCase().includes('thần kinh')) return { icon: Brain, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200' };
  if (name.toLowerCase().includes('nhi')) return { icon: Stethoscope, color: 'text-sky-500', bg: 'bg-sky-50', border: 'border-sky-200' };
  return { icon: Activity, color: 'text-teal-500', bg: 'bg-teal-50', border: 'border-teal-200' };
};

const getDoctorUI = (name: string) => {
  if (name.includes('Tim')) return { exp: '15 năm kinh nghiệm - Chuyên khoa cấp II', rating: 4.9, reviews: 120, avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=256&q=80' };
  if (name.includes('Não')) return { exp: '12 năm kinh nghiệm - Tiến sĩ Y khoa', rating: 4.8, reviews: 85, avatar: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&dpr=1' };
  if (name.includes('Nhi')) return { exp: '9 năm kinh nghiệm - Thạc sĩ Y khoa', rating: 4.9, reviews: 210, avatar: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&dpr=1' };
  return { exp: '10 năm kinh nghiệm - Bác sĩ CKI', rating: 4.7, reviews: 156, avatar: 'https://images.pexels.com/photos/8460124/pexels-photo-8460124.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&dpr=1' };
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'PENDING': return <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[11px] font-bold uppercase tracking-wider border border-amber-200"><Clock4 className="w-3.5 h-3.5" /> Chờ duyệt</span>;
    case 'CONFIRMED': return <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[11px] font-bold uppercase tracking-wider border border-blue-200"><CheckCircle2 className="w-3.5 h-3.5" /> Xác nhận</span>;
    case 'IN_PROGRESS': return <span className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-[11px] font-bold uppercase tracking-wider border border-purple-200"><PlayCircle className="w-3.5 h-3.5" /> Đang khám</span>;
    case 'COMPLETED': return <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[11px] font-bold uppercase tracking-wider border border-emerald-200"><CheckCircle2 className="w-3.5 h-3.5" /> Đã khám</span>;
    case 'CANCELLED': return <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-[11px] font-bold uppercase tracking-wider border border-rose-200"><XCircle className="w-3.5 h-3.5" /> Đã hủy</span>;
    default: return <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[11px] font-bold uppercase tracking-wider border border-slate-200">{status}</span>;
  }
};

const formatDateTime = (dateString: string) => {
  if (!dateString) return { date: '-', time: '-' };
  const d = new Date(dateString);
  return {
    date: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    time: d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  };
};

export default function BookingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'NEW_BOOKING' | 'HISTORY'>('NEW_BOOKING');

  // --- STATES ĐẶT LỊCH ---
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]); 
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<any>(null); 
  const [reason, setReason] = useState<string>(''); 
  
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // --- STATES LỊCH SỬ ---
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [selectedApt, setSelectedApt] = useState<any>(null);
  const [isCanceling, setIsCanceling] = useState(false);

  // --- EFFECTS ---
  useEffect(() => {
    getSpecialties().then(setSpecialties).catch(console.error);
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (activeTab === 'HISTORY') {
      fetchHistory();
    }
  }, [activeTab]);

  useEffect(() => {
    if (selectedSpecialty) getDoctorsBySpecialty(selectedSpecialty).then(setDoctors).catch(console.error);
  }, [selectedSpecialty]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      setIsLoadingSlots(true);
      setSelectedSlot(null); 
      getAvailableSlots(selectedDoctor, selectedDate)
        .then(slots => setAvailableSlots(slots))
        .catch(() => setAvailableSlots([]))
        .finally(() => setIsLoadingSlots(false));
    }
  }, [selectedDoctor, selectedDate]);

  useEffect(() => {
    if (selectedSpecialty && !selectedDoctor) window.scrollTo({ top: 400, behavior: 'smooth' });
    if (selectedDoctor && !selectedSlot) window.scrollTo({ top: 800, behavior: 'smooth' });
    if (selectedSlot) window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }, [selectedSpecialty, selectedDoctor, selectedSlot]);

  // --- HANDLERS ---
  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await getMyAppointments();
      setAppointments(data);
    } catch (error) {
      toast.error("Lỗi tải lịch sử khám bệnh");
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleBooking = async () => {
    if (!reason.trim()) { toast.error("Vui lòng nhập Triệu chứng / Lý do khám!"); return; }
    if (!selectedSlot) { toast.error("Vui lòng chọn khung giờ khám!"); return; }

    try {
      setIsConfirming(true);
      await bookAppointment(selectedDoctor, selectedSlot.id, reason);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      toast.error(error.response?.data || "Lỗi đặt lịch. Khung giờ này có thể đã được đặt.");
    } finally {
      setIsConfirming(false);
    }
  };

  const handleCancelAppointment = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy lịch khám này không?")) return;
    try {
      setIsCanceling(true);
      await cancelAppointment(id);
      toast.success("Đã hủy lịch khám thành công!");
      await fetchHistory();
      setSelectedApt(null);
    } catch (error: any) {
      toast.error(error.response?.data || "Hủy lịch thất bại");
    } finally {
      setIsCanceling(false);
    }
  };

  const resetBooking = () => {
    setSelectedSpecialty(null); setSelectedDoctor(null);
    setSelectedSlot(null); setReason(''); setAvailableSlots([]);
    setIsSuccess(false);
    setActiveTab('NEW_BOOKING');
  };

  const canCancel = (dateString: string) => {
    if (!dateString) return false;
    const aptDate = new Date(dateString);
    const now = new Date();
    return (aptDate.getTime() - now.getTime()) / (1000 * 60 * 60) >= 2;
  };

  const selectedDoctorData = doctors.find(doc => doc.id === selectedDoctor);
  const morningSlots = availableSlots.filter(s => parseInt(s.startTime.split(':')[0]) < 12);
  const afternoonSlots = availableSlots.filter(s => parseInt(s.startTime.split(':')[0]) >= 12);

  if (isSuccess) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200 text-center max-w-2xl mx-auto mt-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </motion.div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Đặt lịch thành công!</h2>
        <p className="text-slate-500 mb-8 text-sm font-medium">Yêu cầu của bạn đã được gửi tới phòng khám MediCare.</p>
       
        <div className="bg-slate-50 p-6 rounded-xl text-left mb-8 border border-slate-100 shadow-inner">
          <div className="flex justify-between border-b border-slate-200 pb-3 mb-3">
            <span className="text-slate-500 text-sm font-medium">Thời gian:</span>
            <span className="font-bold text-slate-800">{selectedSlot?.startTime?.substring(0, 5)} - {selectedDate.split('-').reverse().join('/')}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-3 mb-3">
            <span className="text-slate-500 text-sm font-medium">Bác sĩ phụ trách:</span>
            <span className="font-bold text-slate-800">BS. {selectedDoctorData?.fullName}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-slate-500 text-sm font-medium">Lý do khám:</span>
            <span className="font-medium text-slate-800 bg-white p-3 rounded-lg border border-slate-200 text-sm">{reason}</span>
          </div>
        </div>

        <button onClick={() => { setIsSuccess(false); setActiveTab('HISTORY'); resetBooking(); }} className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2">
          <History className="w-5 h-5" /> Xem lịch sử đặt lịch
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <Toaster position="top-right" />

      {/* COMPACT HEADER CARD */}
      <div className="bg-white px-5 py-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center relative overflow-hidden gap-4">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600 rounded-l-xl"></div>
        <div className="pl-2">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Quản lý Lịch hẹn</h1>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">Đặt lịch khám trực tuyến hoặc theo dõi tiến trình khám bệnh của bạn.</p>
        </div>
        
        {/* TABS CONTROL */}
        <div className="flex bg-slate-100 p-1 rounded-lg w-full sm:w-auto">
          <button 
            onClick={() => setActiveTab('NEW_BOOKING')} 
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 py-1.5 px-5 text-xs font-semibold rounded-md transition-all duration-200 ${activeTab === 'NEW_BOOKING' ? 'bg-white text-primary-600 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <CalendarIcon className="w-4 h-4" /> Đặt lịch khám
          </button>
          <button 
            onClick={() => setActiveTab('HISTORY')} 
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 py-1.5 px-5 text-xs font-semibold rounded-md transition-all duration-200 ${activeTab === 'HISTORY' ? 'bg-white text-primary-600 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <History className="w-4 h-4" /> Lịch sử hẹn
          </button>
        </div>
      </div>

      {activeTab === 'NEW_BOOKING' ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex justify-end">
             {selectedSpecialty && (
               <button onClick={resetBooking} className="flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-rose-100 shadow-sm">
                 <ArrowLeft className="w-3.5 h-3.5" /> Đặt lại từ đầu
               </button>
             )}
          </div>

          {/* BƯỚC 1: CHUYÊN KHOA */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6 relative z-10 border-b border-slate-100 pb-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-sm ${selectedSpecialty ? 'bg-emerald-500 text-white' : 'bg-primary-100 text-primary-700'}`}>
                {selectedSpecialty ? <CheckCircle2 className="w-4 h-4" /> : '1'}
              </div>
              <h2 className="text-base font-bold text-slate-800 uppercase tracking-wide">Chọn chuyên khoa</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
              {specialties.map(spec => {
                const isSelected = selectedSpecialty === spec.id;
                const ui = getSpecialtyUI(spec.name);
                const IconComponent = ui.icon;

                return (
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    key={spec.id}
                    onClick={() => { setSelectedSpecialty(spec.id); setSelectedDoctor(null); setSelectedSlot(null); }}
                    className={`flex flex-col items-center justify-center p-5 rounded-xl border transition-all duration-300 ${
                      isSelected ? `border-primary-500 bg-primary-50/30 shadow-md ring-2 ring-primary-100` : `border-slate-100 hover:\${ui.border} hover:bg-slate-50 hover:shadow-sm bg-white`
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${isSelected ? 'bg-primary-600 text-white shadow-sm' : `${ui.bg}${ui.color}`}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className={`font-bold text-xs md:text-sm text-center ${isSelected ? 'text-primary-700' : 'text-slate-600'}`}>
                      {spec.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </section>

          {/* BƯỚC 2: BÁC SĨ */}
          <AnimatePresence>
            {selectedSpecialty && (
              <motion.section initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-sm ${selectedDoctor ? 'bg-emerald-500 text-white' : 'bg-primary-100 text-primary-700'}`}>
                    {selectedDoctor ? <CheckCircle2 className="w-4 h-4" /> : '2'}
                  </div>
                  <h2 className="text-base font-bold text-slate-800 uppercase tracking-wide">Chọn bác sĩ</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {doctors.length > 0 ? doctors.map(doc => {
                    const isSelected = selectedDoctor === doc.id;
                    const docUI = getDoctorUI(doc.fullName);

                    return (
                      <motion.div
                        whileHover={{ y: -2 }} key={doc.id}
                        onClick={() => { setSelectedDoctor(doc.id); setSelectedSlot(null); }}
                        className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                          isSelected ? 'border-primary-500 bg-primary-50/40 shadow-md ring-2 ring-primary-100' : 'border-slate-100 hover:border-primary-300 hover:shadow-sm bg-white'
                        }`}
                      >
                        <img src={docUI.avatar} alt={doc.fullName} className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shadow-sm border border-slate-100" />
                        <div className="flex-1 w-full">
                          <div className="flex justify-between items-start mb-0.5">
                            <h3 className="font-bold text-slate-800 text-sm md:text-base">BS. {doc.fullName}</h3>
                            {isSelected && <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0" />}
                          </div>
                          <p className="text-xs text-slate-500 mb-2 font-medium">{docUI.exp}</p>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded flex items-center gap-1">
                              <Star className="w-3 h-3 fill-amber-500 stroke-amber-500" /> {docUI.rating} ({docUI.reviews})
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }) : (
                    <div className="col-span-2 text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                       <User className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                       <p className="text-slate-500 text-sm font-medium">Chưa có bác sĩ nào trực thuộc chuyên khoa này.</p>
                    </div>
                  )}
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* BƯỚC 3: THỜI GIAN VÀ XÁC NHẬN */}
          <AnimatePresence>
            {selectedDoctor && (
              <motion.section initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} className="space-y-6">
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-sm ${selectedSlot ? 'bg-emerald-500 text-white' : 'bg-primary-100 text-primary-700'}`}>
                      {selectedSlot ? <CheckCircle2 className="w-4 h-4" /> : '3'}
                    </div>
                    <h2 className="text-base font-bold text-slate-800 uppercase tracking-wide">Chọn thời gian khám</h2>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-slate-100 pb-5 md:pb-0 md:pr-6">
                      <label className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                        <CalendarIcon className="w-4 h-4 text-primary-600" /> Ngày mong muốn
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(null); }}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-50 outline-none text-slate-700 bg-slate-50 focus:bg-white text-sm font-medium transition-colors shadow-sm"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5 uppercase tracking-wide">
                        <Clock className="w-4 h-4 text-primary-600" /> Giờ trống (Ngày {selectedDate ? selectedDate.split('-').reverse().join('/') : '...'})
                      </label>
                      
                      {!selectedDate ? (
                        <div className="bg-slate-50 p-5 rounded-lg border border-dashed border-slate-200 text-center text-slate-500 text-xs font-medium">
                          Vui lòng chọn ngày bên trái để xem các khung giờ trống.
                        </div>
                      ) : isLoadingSlots ? (
                        <div className="bg-slate-50 p-5 rounded-lg border border-slate-100 text-center text-primary-600 font-bold text-xs flex items-center justify-center gap-2">
                          <Clock className="w-4 h-4 animate-spin" /> Đang kiểm tra lịch trống...
                        </div>
                      ) : availableSlots.length === 0 ? (
                        <div className="bg-amber-50 p-5 rounded-lg border border-amber-100 text-center text-amber-700 text-xs font-bold">
                          Bác sĩ hiện không có ca khám hoặc đã kín lịch trong ngày này.
                        </div>
                      ) : (
                        <div className="space-y-5">
                          {morningSlots.length > 0 && (
                            <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Buổi Sáng</p>
                              <div className="flex flex-wrap gap-2.5">
                                {morningSlots.map(slot => (
                                  <button
                                    key={slot.id} 
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all shadow-sm ${
                                      selectedSlot?.id === slot.id ? 'bg-primary-600 text-white ring-2 ring-primary-200 border border-primary-600' : 'bg-white border border-slate-200 text-slate-600 hover:border-primary-400 hover:text-primary-600'
                                    }`}
                                  >
                                    {slot.startTime.substring(0, 5)}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {afternoonSlots.length > 0 && (
                            <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Buổi Chiều</p>
                              <div className="flex flex-wrap gap-2.5">
                                {afternoonSlots.map(slot => (
                                  <button
                                    key={slot.id} 
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all shadow-sm ${
                                      selectedSlot?.id === slot.id ? 'bg-primary-600 text-white ring-2 ring-primary-200 border border-primary-600' : 'bg-white border border-slate-200 text-slate-600 hover:border-primary-400 hover:text-primary-600'
                                    }`}
                                  >
                                    {slot.startTime.substring(0, 5)}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {selectedSlot && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800 text-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row items-stretch justify-between gap-6 relative overflow-hidden border border-slate-700">
                      <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
                        <Stethoscope className="w-48 h-48 -mt-8 -mr-8" />
                      </div>

                      <div className="relative z-10 w-full md:w-1/3 border-b md:border-b-0 md:border-r border-slate-700 pb-5 md:pb-0 md:pr-5">
                        <p className="text-primary-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">Thông tin đặt hẹn</p>
                        <h3 className="text-lg font-bold mb-3 text-white">BS. {selectedDoctorData?.fullName}</h3>
                        <div className="flex flex-col gap-2 text-xs text-slate-300 font-medium">
                          <span className="flex items-center gap-2"><CalendarIcon className="w-3.5 h-3.5 text-slate-400" /> Ngày: {selectedDate.split('-').reverse().join('/')}</span>
                          <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-slate-400" /> Giờ khám: <span className="text-white font-bold">{selectedSlot.startTime.substring(0, 5)}</span></span>
                          <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-400" /> Địa điểm: MediCare Clinic</span>
                        </div>
                      </div>

                      <div className="relative z-10 flex-1 flex flex-col justify-between">
                        <div className="mb-4">
                          <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">Triệu chứng / Lý do khám <span className="text-rose-400">*</span></label>
                          <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Mô tả ngắn gọn tình trạng sức khỏe của bạn..."
                            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg outline-none focus:border-primary-500 text-white placeholder-slate-500 h-20 resize-none text-sm transition-colors shadow-inner"
                          />
                        </div>
                        
                        <button
                          onClick={handleBooking}
                          disabled={isConfirming}
                          className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-lg shadow-md flex items-center justify-center gap-2 text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {isConfirming ? <><Activity className="w-4 h-4 animate-spin" /> Đang xử lý...</> : <>Xác nhận Đặt lịch <ChevronRight className="w-4 h-4" /></>}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.section>
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* ================== TAB LỊCH SỬ ĐẶT LỊCH ================== */
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {loadingHistory ? (
            <div className="flex flex-col justify-center items-center h-64 gap-2 text-primary-600 bg-white rounded-xl border border-slate-200">
               <Activity className="w-6 h-6 animate-spin" />
               <span className="text-xs font-medium">Đang tải lịch sử khám...</span>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm font-medium">Bạn chưa có lịch sử đặt lịch nào.</p>
              <button onClick={() => setActiveTab('NEW_BOOKING')} className="mt-4 px-5 py-2 bg-primary-50 text-primary-700 font-bold text-xs rounded-lg hover:bg-primary-100 transition-colors">Đặt lịch ngay</button>
            </div>
          ) : (
            <div className="grid gap-3">
              {appointments.map((apt) => {
                const { date, time } = formatDateTime(apt.appointmentDate);
                return (
                  <div 
                    key={apt.id} 
                    onClick={() => setSelectedApt(apt)}
                    className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-primary-400 hover:shadow-md cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 text-primary-600 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-primary-50 group-hover:border-primary-100 transition-colors">
                        <CalendarIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Bác sĩ phụ trách</p>
                        <h3 className="font-bold text-slate-800 text-base mb-1">{apt.doctorName}</h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 font-medium">
                          <span className="flex items-center gap-1.5"><CalendarIcon className="w-3.5 h-3.5 text-slate-400" /> {date}</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> {time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
                      {getStatusBadge(apt.status)}
                      <button className="text-xs font-bold text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-primary-50 px-2.5 py-1.5 rounded-lg">
                        Chi tiết <ChevronRight className="w-3.5 h-3.5"/>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {/* POPUP CHI TIẾT LỊCH HẸN */}
      <AnimatePresence>
        {selectedApt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedApt(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200">
              
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide flex items-center gap-2"><FileText className="w-4 h-4 text-primary-600"/> Phiếu Khám Bệnh</h3>
                <button onClick={() => setSelectedApt(null)} className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-md shadow-sm border border-slate-200"><X className="w-4 h-4" /></button>
              </div>
              
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-wide">Mã định danh</span>
                  <span className="font-mono font-bold text-primary-700 bg-primary-50 border border-primary-100 px-2 py-0.5 rounded text-xs">#{selectedApt.id.substring(0,8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-wide flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Thời gian</span>
                  <span className="font-bold text-slate-800 text-sm text-right">{formatDateTime(selectedApt.appointmentDate).time} <br/> <span className="text-xs text-slate-500 font-medium">{formatDateTime(selectedApt.appointmentDate).date}</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-wide flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Bác sĩ</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedApt.doctorName}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-wide flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Địa điểm</span>
                  <span className="font-bold text-slate-800 text-sm">Phòng khám MediCare</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-wide">Trạng thái</span>
                  {getStatusBadge(selectedApt.status)}
                </div>

                {(selectedApt.reason || selectedApt.notes) && (
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl mt-2 text-xs text-slate-700">
                    <strong className="block text-slate-800 mb-1">Triệu chứng khai báo:</strong> 
                    {selectedApt.reason || selectedApt.notes}
                  </div>
                )}

                {/* LOGIC NÚT HỦY LỊCH */}
                {(selectedApt.status === 'PENDING' || selectedApt.status === 'CONFIRMED') && (
                  <div className="pt-4 mt-4 border-t border-slate-100">
                    {canCancel(selectedApt.appointmentDate) ? (
                      <button 
                        onClick={() => handleCancelAppointment(selectedApt.id)}
                        disabled={isCanceling}
                        className="w-full py-2.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 font-bold text-xs rounded-xl flex justify-center items-center gap-1.5 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <XCircle className="w-4 h-4" /> {isCanceling ? 'Đang hủy lịch...' : 'Yêu cầu Hủy lịch khám'}
                      </button>
                    ) : (
                      <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" /> 
                        <p className="text-[10px] text-amber-700 font-medium leading-relaxed">Đã quá thời gian cho phép hủy lịch trực tuyến (yêu cầu hủy trước 2 tiếng). Vui lòng liên hệ Hotline nếu cần hỗ trợ.</p>
                      </div>
                    )}
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