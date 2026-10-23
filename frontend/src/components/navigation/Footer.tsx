import { Link } from 'react-router-dom';
import { Stethoscope, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="container-main grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {/* Brand */}
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary-600 mb-4">
            <Stethoscope className="w-8 h-8 text-primary-600" />
            <span>MediCare</span>
          </Link>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            Hệ thống đặt lịch khám bệnh thông minh. Ứng dụng công nghệ AI và Bệnh án điện tử để mang lại trải nghiệm y tế tốt nhất.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-bold text-gray-900 mb-4">Dịch vụ</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><Link to="/patient/booking" className="hover:text-primary-600 transition-colors">Đặt lịch khám trực tiếp</Link></li>
            <li><a href="#" className="hover:text-primary-600 transition-colors">Tra cứu bệnh án</a></li>
            <li><a href="#" className="hover:text-primary-600 transition-colors">Hỏi đáp y tế với AI</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-4">Hỗ trợ</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><a href="#" className="hover:text-primary-600 transition-colors">Hướng dẫn sử dụng</a></li>
            <li><a href="#" className="hover:text-primary-600 transition-colors">Câu hỏi thường gặp</a></li>
            <li><a href="#" className="hover:text-primary-600 transition-colors">Chính sách bảo mật</a></li>
            <li><a href="#" className="hover:text-primary-600 transition-colors">Điều khoản dịch vụ</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold text-gray-900 mb-4">Liên hệ</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary-500 shrink-0" />
              <span>123 Đường Y Tế, Phường 4, Quận 5, TP.HCM</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary-500 shrink-0" />
              <span>1900 1234</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary-500 shrink-0" />
              <span>support@medicare.vn</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-main border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
        <p>© 2026 MediCare. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-primary-600 transition-colors">Facebook</a>
          <a href="#" className="hover:text-primary-600 transition-colors">Zalo</a>
        </div>
      </div>
    </footer>
  );
}