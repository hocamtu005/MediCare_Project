const fs = require('fs');
const path = require('path');

const files = {
  "src/index.css": `@import "tailwindcss";

@theme {
  --color-primary-50:  #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;

  --color-teal-50:  #f0fdfa;
  --color-teal-100: #ccfbf1;
  --color-teal-500: #14b8a6;
  --color-teal-600: #0d9488;

  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --shadow-card: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-card-hover: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-modal: 0 25px 50px -12px rgb(0 0 0 / 0.25);
}

*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
body { font-family: var(--font-sans); background-color: #f8fafc; color: #0f172a; line-height: 1.6; }
.container-main { max-width: 1280px; margin-inline: auto; padding-inline: 1rem; }
@media (min-width: 640px) { .container-main { padding-inline: 1.5rem; } }
@media (min-width: 1024px) { .container-main { padding-inline: 2rem; } }
.gradient-text { background: linear-gradient(to right, var(--color-primary-600), var(--color-teal-500)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
`,

  "src/main.tsx": `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
`,

  "src/contexts/AuthContext.tsx": `import { createContext, useContext, useState, ReactNode } from 'react'

export type UserRole = 'patient' | 'doctor' | 'receptionist' | 'admin'
export interface User { id: string; fullName: string; email: string; role: UserRole }

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = async (email: string) => {
    // Mock login
    const roles: Record<string, UserRole> = {
      'patient@medbook.vn': 'patient',
      'doctor@medbook.vn': 'doctor',
      'admin@medbook.vn': 'admin',
      'lectan@medbook.vn': 'receptionist'
    }
    const role = roles[email] || 'patient'
    setUser({ id: '1', fullName: 'Người dùng Demo', email, role })
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth outside provider')
  return ctx
}
`,

  "src/App.tsx": `import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import MainLayout from './layouts/MainLayout'
import LandingPage from './pages/public/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import DashboardLayout from './layouts/DashboardLayout'
import DoctorDashboard from './pages/doctor/DashboardPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
          </Route>
          <Route path="/auth/dang-nhap" element={<LoginPage />} />
          
          <Route element={<DashboardLayout role="doctor" />}>
            <Route path="/bac-si" element={<DoctorDashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
`,

  "src/layouts/MainLayout.tsx": `import { Outlet } from 'react-router-dom'
import Navbar from '../components/navigation/Navbar'

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
`,

  "src/components/navigation/Navbar.tsx": `import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-main flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold text-primary-600">MedBook</Link>
        <nav className="flex gap-4">
          <Link to="/" className="text-gray-600 hover:text-primary-600">Trang chủ</Link>
          <Link to="/dat-lich" className="text-gray-600 hover:text-primary-600">Đặt lịch</Link>
        </nav>
        <div>
          {isAuthenticated ? (
            <button onClick={logout} className="text-red-600">Đăng xuất</button>
          ) : (
            <Link to="/auth/dang-nhap" className="px-4 py-2 bg-primary-600 text-white rounded-xl">Đăng nhập</Link>
          )}
        </div>
      </div>
    </header>
  )
}
`,

  "src/pages/public/LandingPage.tsx": `export default function LandingPage() {
  return (
    <div className="py-20 text-center container-main">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Hệ thống khám bệnh <span className="text-primary-600">thông minh</span>
      </h1>
      <p className="text-gray-600 max-w-xl mx-auto">
        Đặt lịch dễ dàng, không cần chờ đợi. Trải nghiệm y tế tiện lợi với MedBook.
      </p>
    </div>
  )
}
`,
  "src/pages/auth/LoginPage.tsx": `import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e: any) => {
    e.preventDefault()
    await login(email, '123456')
    navigate('/bac-si')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h2>
        <input 
          type="email" 
          value={email} 
          onChange={e => setEmail(e.target.value)}
          placeholder="Email" 
          className="w-full px-4 py-2 border rounded-xl mb-4" 
        />
        <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded-xl">Đăng nhập</button>
      </form>
    </div>
  )
}
`,
  "src/layouts/DashboardLayout.tsx": `import { Outlet } from 'react-router-dom'

export default function DashboardLayout({ role }: { role: string }) {
  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-primary-700 text-white p-4">
        <h2 className="text-xl font-bold mb-8">MedBook</h2>
        <nav>
          <ul><li className="mb-2">Tổng quan</li></ul>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
`,
  "src/pages/doctor/DashboardPage.tsx": `export default function DoctorDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Bảng điều khiển Bác sĩ</h1>
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <p>Thống kê bệnh nhân hôm nay: 12</p>
      </div>
    </div>
  )
}
`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Wrote ' + filePath);
}
