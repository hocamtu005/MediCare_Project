import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, LogIn, AlertCircle, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      setError('');
      await login(email, password || '123456');
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-[1.5rem] shadow-2xl shadow-primary-900/5 border border-white max-w-[360px] mx-auto w-full">
      
      {/* Header Form */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 text-primary-600 mb-3 shadow-inner">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-1.5 tracking-tight">Đăng nhập</h2>
        <p className="text-gray-500 text-sm font-medium">Truy cập hồ sơ & đặt lịch khám.</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl flex items-start gap-2 text-xs font-medium animate-pulse">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> 
          <span>{error}</span>
        </div>
      )}

      {/* Form Đăng nhập */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Email đăng nhập</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-600">
              <Mail className="h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-50 focus:border-primary-500 text-sm transition-all bg-gray-50 focus:bg-white outline-none font-medium"
              placeholder="nhapemail@medicare.vn"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-gray-700">Mật khẩu</label>
            <a href="#" className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors">Quên mật khẩu?</a>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-50 focus:border-primary-500 text-sm transition-all bg-gray-50 focus:bg-white outline-none font-medium"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-primary-500/30 hover:-translate-y-0.5 mt-6 disabled:opacity-70 disabled:hover:translate-y-0 text-sm"
        >
          {isLoading ? 'Đang xử lý...' : 'Đăng nhập vào hệ thống'} 
          {!isLoading && <LogIn className="w-4 h-4" />}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-gray-600 font-medium">
        Bạn là bệnh nhân mới?{' '}
        <Link to="/register" className="font-bold text-primary-600 hover:text-primary-800 transition-colors border-b border-primary-600 pb-0.5 ml-1">
          Tạo tài khoản ngay
        </Link>
      </div>
    </div>
  );
}