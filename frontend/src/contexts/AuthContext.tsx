import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import authApi from '../api/authApi';

export type UserRole = 'ADMIN' | 'DOCTOR' | 'RECEPTIONIST' | 'PATIENT';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean; // Thêm trạng thái loading để tránh chớp màn hình khi tải lại
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // KHỞI TẠO USER TỪ LOCAL STORAGE ĐỂ KHÔNG BỊ MẤT KHI F5
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [isLoading, setIsLoading] = useState(true);

  // Kiểm tra token và user khi khởi chạy ứng dụng
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const response = await authApi.login({ email, password: pass });
      
      localStorage.setItem('token', response.data.token);

      const userData = {
        id: response.data.id,
        fullName: response.data.fullName,
        email: response.data.email,
        role: response.data.role,
        avatarUrl: response.data.avatarUrl
      };
      
      // LƯU USER VÀO LOCAL STORAGE
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
    } catch (error: any) {
      throw new Error('Sai email hoặc mật khẩu. Vui lòng kiểm tra lại!');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading }}>
      {!isLoading && children} {/* Chỉ render UI khi đã nạp xong trạng thái đăng nhập */}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}