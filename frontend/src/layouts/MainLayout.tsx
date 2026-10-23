import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import AIChatbot from '../components/chat/AIChatbot';

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      
      {/* Component Chatbot sẽ nổi (float) trên cùng */}
      <AIChatbot />
    </div>
  );
}