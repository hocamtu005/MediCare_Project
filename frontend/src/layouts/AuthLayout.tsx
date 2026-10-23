import { Outlet, Link } from 'react-router-dom';
import { Stethoscope, ArrowLeft, ShieldCheck, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      
      {/* Cột trái - Hình ảnh & Branding (Ẩn trên thiết bị di động) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary-900">
        {/* Ảnh Background phòng khám của Tú */}
        <img
          src="/pkmedicare.png"
          alt="Không gian phòng khám MediCare"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Lớp phủ Gradient mượt mà */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/80 to-teal-900/90 mix-blend-multiply"></div>
        
        {/* Nội dung Cột trái */}
        <div className="relative z-10 p-12 flex flex-col justify-between h-full text-white w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white w-fit hover:opacity-80 transition-opacity">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span>MediCare</span>
          </Link>
          
          {/* Thông điệp & Chữ */}
          <div className="mb-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium text-sm mb-6">
                <HeartPulse className="w-4 h-4 text-rose-400" />
                Đồng hành cùng sức khỏe của bạn
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-[1.2] tracking-tight">
                An tâm khám bệnh, <br />
                <span className="text-teal-300">lưu trữ trọn đời.</span>
              </h1>
              <p className="text-primary-100 text-lg max-w-md leading-relaxed font-medium">
                Tạo tài khoản một lần để đặt lịch nhanh chóng, không chờ đợi và lưu giữ kết quả khám bệnh an toàn trên điện thoại của chính bạn.
              </p>
            </motion.div>

            {/* Thẻ nổi (Floating Badge) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-10 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl max-w-sm flex items-start gap-4"
            >
              <div className="bg-teal-500/20 p-2 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-teal-300" />
              </div>
              <div>
                <h4 className="font-bold text-white mb-1">Bảo mật tuyệt đối</h4>
                <p className="text-sm text-primary-100">Dữ liệu y tế của bạn được mã hóa an toàn theo tiêu chuẩn.</p>
              </div>
            </motion.div>
          </div>
          
          {/* Footer nhỏ */}
          <div className="text-sm text-primary-200/80 font-medium flex justify-between items-center pr-8">
            <span>© 2026 MediCare. All rights reserved.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Bảo mật</a>
              <a href="#" className="hover:text-white transition-colors">Hỗ trợ</a>
            </div>
          </div>
        </div>
      </div>

      {/* Cột phải - Container chứa Form (Hiển thị Outlet) */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative bg-slate-50/50">
        {/* Nút quay lại trang chủ (Mobile & Desktop) */}
        <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-bold">Về trang chủ</span>
        </Link>
        
        <div className="w-full max-w-md mt-12 lg:mt-0">
          {/* Logo cho bản Mobile */}
          <div className="lg:hidden flex flex-col items-center justify-center gap-3 mb-10">
            <div className="bg-primary-50 p-3 rounded-2xl text-primary-600">
              <Stethoscope className="w-8 h-8" />
            </div>
            <span className="text-2xl font-extrabold text-gray-900">MediCare</span>
          </div>
          
          {/* Outlet sẽ render LoginPage hoặc RegisterPage */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}