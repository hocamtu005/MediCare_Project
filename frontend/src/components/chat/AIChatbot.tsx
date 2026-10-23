import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, AlertTriangle, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatWithAI } from '../../services/aiService';
import { useNavigate } from 'react-router-dom';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { role: 'bot', text: 'Chào bạn! Mình là trợ lý AI MediCare. Bạn đang gặp triệu chứng gì hoặc muốn tìm bác sĩ khoa nào?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    
    setIsTyping(true);
    try {
      const res = await chatWithAI(userMsg);
      // Đảm bảo có res trả về mới render, tránh crash
      if (res) {
        setMessages(prev => [...prev, { role: 'bot', text: res.reply || 'Đã ghi nhận.', data: res }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Xin lỗi, tôi đang gặp sự cố kết nối với Backend. Vui lòng thử lại sau!' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }} className="bg-white w-80 sm:w-96 rounded-2xl shadow-2xl border border-gray-100 mb-4 overflow-hidden flex flex-col h-[500px]">
            {/* Header */}
            <div className="bg-primary-600 p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <h3 className="font-bold">Trợ lý AI MediCare</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-primary-700 p-1 rounded-full"><X className="w-5 h-5"/></button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
              <div className="text-center text-xs text-gray-400 mb-4">AI chỉ gợi ý chuyên khoa, không thay thế chẩn đoán y khoa.</div>
              {messages.map((m, i) => {
                // Tách biến an toàn tuyệt đối, ngăn crash React
                const isEmergency = m.data && m.data.isEmergency === true;
                const hasDoctors = m.data && Array.isArray(m.data.suggestedDoctors) && m.data.suggestedDoctors.length > 0;

                return (
                  <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-3 rounded-2xl max-w-[85%] text-sm ${m.role === 'user' ? 'bg-primary-600 text-white rounded-br-none' : isEmergency ? 'bg-red-50 text-red-700 border border-red-200 rounded-bl-none font-medium' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'}`}>
                      {isEmergency && <AlertTriangle className="w-5 h-5 mb-1 text-red-500 inline-block mr-1"/>}
                      {m.text}
                    </div>
                    
                    {/* Hiển thị danh sách bác sĩ nếu có */}
                    {hasDoctors && (
                      <div className="mt-2 space-y-2 w-[85%]">
                        {m.data.suggestedDoctors.map((doc: any) => (
                          <div key={doc.id || Math.random()} className="bg-white p-2 rounded-xl border border-primary-100 shadow-sm flex items-center gap-3">
                            <img src={doc.avatarUrl || 'https://via.placeholder.com/40'} alt="BS" className="w-10 h-10 rounded-full object-cover"/>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-900 line-clamp-1">{doc.fullName || 'Bác sĩ'}</p>
                              <button onClick={() => { setIsOpen(false); navigate('/patient/booking'); }} className="text-xs text-primary-600 font-medium flex items-center gap-1 mt-0.5 hover:underline">
                                <UserPlus className="w-3 h-3"/> Đặt lịch ngay
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {isTyping && (
                <div className="flex gap-1 items-center bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none w-16 shadow-sm">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
              <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} placeholder="Nhập triệu chứng của bạn..." className="flex-1 bg-gray-100 px-4 py-2.5 rounded-full text-sm outline-none focus:ring-2 focus:ring-primary-500"/>
              <button onClick={handleSend} disabled={!input.trim()} className="bg-primary-600 text-white p-2.5 rounded-full hover:bg-primary-700 disabled:opacity-50"><Send className="w-4 h-4"/></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nút Bong Bóng */}
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="bg-primary-600 text-white p-4 rounded-full shadow-2xl hover:bg-primary-700 hover:scale-110 transition-all flex items-center justify-center animate-bounce">
          <MessageSquare className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}