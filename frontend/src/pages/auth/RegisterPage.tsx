import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Đã sửa lại đúng thư viện
import { Mail, Lock, User, UserPlus, HeartPulse } from 'lucide-react';
import authApi from '../../api/authApi';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authApi.register({
        fullName,
        email,
        password,
        role: 'PATIENT' 
      });
      alert('Tuyệt vời! Bạn đã có tài khoản. Hệ thống đang chuyển hướng...');
      navigate('/login');
    } catch (err: any) {
      alert('Đăng ký chưa thành công: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-[1.5rem] shadow-2xl shadow-teal-900/5 border border-white max-w-[360px] mx-auto w-full">
      
      {/* Header Form */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-50 text-teal-600 mb-3 shadow-inner">
          <HeartPulse className="w-6 h-6" />
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-1.5 tracking-tight">Chào bạn mới!</h2>
        <p className="text-gray-500 text-sm font-medium">Thiết lập hồ sơ y tế cá nhân trọn đời.</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Họ và tên của bạn</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <User className="h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
            </div>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-50 focus:border-teal-500 text-sm transition-all bg-gray-50 focus:bg-white outline-none font-medium"
              placeholder="VD: Nguyễn Văn A"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Email đăng nhập</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-50 focus:border-teal-500 text-sm transition-all bg-gray-50 focus:bg-white outline-none font-medium"
              placeholder="nhapemail@medicare.vn"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Mật khẩu bảo mật</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-50 focus:border-teal-500 text-sm transition-all bg-gray-50 focus:bg-white outline-none font-medium"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-600 hover:to-teal-500 text-white py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-teal-500/30 hover:-translate-y-0.5 mt-6 disabled:opacity-70 disabled:hover:translate-y-0 text-sm"
        >
          {isLoading ? 'Đang tạo hồ sơ...' : 'Đăng ký tài khoản'} 
          {!isLoading && <UserPlus className="w-4 h-4" />}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-gray-600 font-medium">
        Đã có hồ sơ tại MediCare?{' '}
        <Link to="/login" className="font-bold text-teal-600 hover:text-teal-800 transition-colors border-b border-teal-600 pb-0.5 ml-1">
          Đăng nhập ngay
        </Link>
      </div>
    </div>
  );
}