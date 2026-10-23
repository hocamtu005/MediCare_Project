import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Heart, Brain, Baby,
  Stethoscope, ShieldCheck, PlayCircle, Users, CheckCircle2, Star, Clock, MapPin, Phone, CalendarDays
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    if (user.role === 'PATIENT') return <Navigate to="/patient/dashboard" replace />;
    if (user.role === 'DOCTOR') return <Navigate to="/doctor/schedule" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'RECEPTIONIST') return <Navigate to="/receptionist/dashboard" replace />;
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-white pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-primary-100 blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-teal-100 blur-3xl opacity-60"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-8">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary-50 to-blue-50 text-primary-700 font-bold text-sm border border-primary-100 shadow-sm">
                <CalendarDays className="w-4 h-4 text-primary-600" />
                Hệ thống đặt lịch khám bệnh
              </motion.div>
              
              <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-gray-900 leading-[1.2]">
                An tâm khám bệnh, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-teal-500">
                  không cần chờ đợi.
                </span>
              </motion.h1>
              
              <motion.p variants={fadeUp} className="text-lg text-gray-600 leading-relaxed max-w-lg font-medium">
                Hiểu rằng đi khám bệnh thường mệt mỏi, MediCare mang đến trải nghiệm nhẹ nhàng hơn. Đặt lịch trước ở nhà, đến là khám ngay với các bác sĩ chuyên khoa giỏi và máy móc hiện đại.
              </motion.p>
              
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/login" className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-primary-500/40 hover:-translate-y-1 text-lg group">
                  Đặt khám ngay <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#specialties" className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-white border-2 border-gray-100 text-gray-700 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700 rounded-2xl font-bold transition-all hover:-translate-y-1 text-lg">
                  Xem chuyên khoa
                </a>
              </motion.div>

              <motion.div variants={fadeUp} className="pt-6 flex items-center gap-4 text-sm text-gray-500 font-medium">
                <div className="flex -space-x-3">
                  <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Patient" />
                  <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="Patient" />
                  <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=100&q=80" alt="Patient" />
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700 shadow-sm">+5k</div>
                </div>
                <p>Hơn 5,000+ bệnh nhân đã tin chọn tháng qua</p>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative lg:pl-10"
            >
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-[6px] border-white z-20 aspect-[4/3] group">
                <img 
                  src="/hero.jpg" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </div>

              <motion.div 
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1 }}
                className="absolute -bottom-6 -left-6 lg:left-0 z-30 bg-white p-5 rounded-2xl shadow-xl border border-gray-100 max-w-[280px]"
              >
                <div className="flex gap-1 text-amber-400 mb-2">
                  <Star className="w-5 h-5 fill-current"/><Star className="w-5 h-5 fill-current"/><Star className="w-5 h-5 fill-current"/><Star className="w-5 h-5 fill-current"/><Star className="w-5 h-5 fill-current"/>
                </div>
                <p className="text-sm text-gray-700 font-medium leading-relaxed">
                  "Bác sĩ khám rất kỹ và nhẹ nhàng. Đặt lịch trên web xong tới đọc tên là vào khám luôn, không phải chờ đợi mệt mỏi."
                </p>
                <p className="text-xs text-gray-400 mt-3 font-bold">— Chị Ngọc Mai (Quận 5)</p>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. CHUYÊN KHOA TRỌNG TÂM (Layout mới ghép ảnh bskhamnhi.png) */}
      <section id="specialties" className="py-24 bg-gradient-to-b from-slate-50 to-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row gap-12 items-stretch">
            
            {/* Cột trái: Tiêu đề + Ảnh nền bác sĩ nhi */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="lg:w-5/12 flex flex-col">
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                  Bạn hoặc người thân <br/>đang cảm thấy <span className="text-primary-600">không khỏe?</span>
                </h2>
                <p className="text-gray-600 text-lg font-medium">Đừng để những cơn đau kéo dài làm giảm chất lượng cuộc sống. Lựa chọn chuyên khoa phù hợp để chúng tôi hỗ trợ bạn ngay hôm nay.</p>
              </div>
              
              {/* Box chứa ảnh bskhamnhi.png */}
              <div className="relative mt-auto rounded-[2rem] overflow-hidden shadow-xl border-4 border-white bg-blue-50 group aspect-[4/3] sm:aspect-auto sm:flex-1">
                <img 
                  src="/bskhamnhi.png" 
                  alt="Bác sĩ khám nhi" 
                  className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800' }} // Fallback nếu chưa có ảnh
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-sm">
                    <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-green-500" /> Bác sĩ tận tâm, chuyên môn cao
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Cột phải: 4 Thẻ chuyên khoa */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* 1. Tim Mạch */}
              <motion.div variants={fadeUp} whileHover={{ y: -5 }} className="bg-white rounded-3xl p-6 shadow-sm border border-rose-100 hover:shadow-xl hover:border-rose-300 transition-all group flex flex-col h-full relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-rose-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 z-0"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-rose-100 to-rose-200 text-rose-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                      <Heart className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">Tim mạch - Huyết áp</h3>
                  </div>
                  <p className="text-sm text-gray-600 font-medium mb-3">Triệu chứng: <span className="text-gray-500 font-normal">Đau thắt ngực, khó thở, huyết áp cao/thấp, tim đập nhanh...</span></p>
                  <p className="text-sm text-gray-500 mb-6 bg-gray-50 p-3 rounded-xl border border-gray-100">Siêu âm tim 4D, Holter điện tâm đồ 24h, tầm soát nguy cơ đột quỵ sớm.</p>
                </div>
                <div className="mt-auto relative z-10">
                  <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-rose-600 hover:text-rose-800 transition-colors">
                    Khám chuyên khoa <ArrowRight className="w-4 h-4"/>
                  </Link>
                </div>
              </motion.div>

              {/* 2. Thần Kinh */}
              <motion.div variants={fadeUp} whileHover={{ y: -5 }} className="bg-white rounded-3xl p-6 shadow-sm border border-purple-100 hover:shadow-xl hover:border-purple-300 transition-all group flex flex-col h-full relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-purple-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 z-0"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                      <Brain className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">Nội Thần kinh</h3>
                  </div>
                  <p className="text-sm text-gray-600 font-medium mb-3">Triệu chứng: <span className="text-gray-500 font-normal">Đau đầu dai dẳng, mất ngủ, chóng mặt, tê bì tay chân...</span></p>
                  <p className="text-sm text-gray-500 mb-6 bg-gray-50 p-3 rounded-xl border border-gray-100">Đo điện não đồ (EEG), điều trị rối loạn tiền đình, suy nhược thần kinh.</p>
                </div>
                <div className="mt-auto relative z-10">
                  <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-800 transition-colors">
                    Khám chuyên khoa <ArrowRight className="w-4 h-4"/>
                  </Link>
                </div>
              </motion.div>

              {/* 3. Nhi Khoa */}
              <motion.div variants={fadeUp} whileHover={{ y: -5 }} className="bg-white rounded-3xl p-6 shadow-sm border border-cyan-100 hover:shadow-xl hover:border-cyan-300 transition-all group flex flex-col h-full relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-cyan-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 z-0"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-100 to-cyan-200 text-cyan-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                      <Baby className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">Nhi Khoa</h3>
                  </div>
                  <p className="text-sm text-gray-600 font-medium mb-3">Triệu chứng: <span className="text-gray-500 font-normal">Sốt cao, ho kéo dài, biếng ăn, nôn trớ, tiêu chảy, phát ban...</span></p>
                  <p className="text-sm text-gray-500 mb-6 bg-gray-50 p-3 rounded-xl border border-gray-100">Khám dinh dưỡng, tư vấn tiêm chủng, điều trị bệnh hô hấp - tiêu hóa trẻ em.</p>
                </div>
                <div className="mt-auto relative z-10">
                  <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-cyan-600 hover:text-cyan-800 transition-colors">
                    Khám chuyên khoa <ArrowRight className="w-4 h-4"/>
                  </Link>
                </div>
              </motion.div>

              {/* 4. Nội Tổng Quát */}
              <motion.div variants={fadeUp} whileHover={{ y: -5 }} className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100 hover:shadow-xl hover:border-emerald-300 transition-all group flex flex-col h-full relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 z-0"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                      <Stethoscope className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">Nội Tổng quát</h3>
                  </div>
                  <p className="text-sm text-gray-600 font-medium mb-3">Triệu chứng: <span className="text-gray-500 font-normal">Mệt mỏi vô cớ, sụt cân, đau dạ dày, viêm họng, tiểu đường...</span></p>
                  <p className="text-sm text-gray-500 mb-6 bg-gray-50 p-3 rounded-xl border border-gray-100">Xét nghiệm máu tổng quát, siêu âm ổ bụng, tầm soát các bệnh lý nội khoa.</p>
                </div>
                <div className="mt-auto relative z-10">
                  <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-800 transition-colors">
                    Khám chuyên khoa <ArrowRight className="w-4 h-4"/>
                  </Link>
                </div>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </section>

      {/* 3. LÝ DO CHỌN MEDICARE */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="grid grid-cols-2 gap-5 relative">
              <div className="absolute -inset-4 bg-primary-50 rounded-[3rem] transform -rotate-2 -z-10"></div>
              <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800" alt="Sảnh phòng khám sạch sẽ" className="rounded-3xl w-full h-72 object-cover mt-10 shadow-lg border-[4px] border-white" />
              <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800" alt="Bác sĩ trao đổi cùng bệnh nhân" className="rounded-3xl w-full h-72 object-cover shadow-lg border-[4px] border-white" />
            </div>

            <div className="space-y-10">
              <div>
                <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">Đi khám bệnh <span className="text-primary-600">nhẹ nhàng hơn</span> bạn nghĩ</h2>
                <p className="text-gray-600 text-lg font-medium">Chúng tôi loại bỏ hoàn toàn cảnh xếp hàng chen chúc hay giấy tờ phức tạp, để bạn tập trung hoàn toàn vào việc phục hồi sức khỏe.</p>
              </div>

              <div className="space-y-8">
                <div className="flex gap-5 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Đúng giờ, không chờ đợi</h4>
                    <p className="text-gray-600">Hệ thống phân luồng thông minh. Bạn đặt lịch lúc 9h, bạn sẽ được gặp bác sĩ đúng 9h. Không mất nửa ngày chầu chực.</p>
                  </div>
                </div>

                <div className="flex gap-5 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-teal-50 rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-8 h-8 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Bác sĩ tư vấn kỹ lưỡng</h4>
                    <p className="text-gray-600">Mỗi ca khám kéo dài ít nhất 15-20 phút. Bác sĩ lắng nghe mọi triệu chứng và giải thích rõ ràng bệnh án chứ không "khám lướt".</p>
                  </div>
                </div>

                <div className="flex gap-5 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Hồ sơ sức khỏe trọn đời</h4>
                    <p className="text-gray-600">Toàn bộ toa thuốc, kết quả xét nghiệm đều được lưu an toàn trên tài khoản của bạn. Mở điện thoại ra là có ngay.</p>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION CUỐI TRANG */}
      <section className="py-24 bg-primary-50 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-200 rounded-full blur-3xl opacity-50"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center bg-white p-10 md:p-14 rounded-[3rem] shadow-xl border border-white">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">Sức khỏe là ưu tiên số một. <br className="hidden sm:block"/>Hãy để chúng tôi chăm lo cho bạn!</h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto font-medium">Nếu bạn không rõ triệu chứng của mình thuộc chuyên khoa nào, hãy nhắn tin cho <span className="font-bold text-primary-600">Trợ lý ảo AI</span> ở góc phải màn hình để được tư vấn miễn phí.</p>
          <Link to="/login" className="inline-flex justify-center items-center gap-2 px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-primary-500/30 hover:-translate-y-1 text-lg">
            Đặt lịch khám trực tuyến <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-600 font-bold bg-gray-50 inline-flex mx-auto p-4 rounded-2xl">
            <span className="flex items-center gap-2"><Phone className="w-5 h-5 text-primary-500"/> Hotline: 1900 1234</span>
            <span className="hidden sm:block text-gray-300">|</span>
            <span className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary-500"/> 123 Đường Y Tế, Quận 5</span>
          </div>
        </div>
      </section>

    </div>
  );
}