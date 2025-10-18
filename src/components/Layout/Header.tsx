'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, UserPlus, Stethoscope, LogOut } from 'lucide-react';
import { dashboardController, DashboardStats } from '../../modules/Dashboard/controller/dashboardController';

// ✨ THAY ĐỔI 1: Định nghĩa một cấu trúc chung cho tất cả các loại thông báo
interface UnifiedNotification {
  id: string;
  type: 'nhapvien' | 'ylenh' | 'xuatvien';
  personName: string;
  date: Date;
}

interface HeaderProps {
  setIsOpen: (open: boolean) => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ setIsOpen, title }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  // ✨ THAY ĐỔI 2: State mới để lưu danh sách thông báo đã được hợp nhất và sắp xếp
  const [sortedNotifications, setSortedNotifications] = useState<UnifiedNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const notificationRef = useRef<HTMLDivElement>(null);

  // ✨ THAY ĐỔI 3: Cập nhật useEffect để lấy và xử lý dữ liệu định kỳ
  useEffect(() => {
    const fetchAndProcessNotifications = async () => {
      const data = await dashboardController.getDashboardData();

      // Hợp nhất 3 nguồn dữ liệu vào một mảng duy nhất với cấu trúc chung
      const newPatients = data.benhNhanMoiNhapVien.map(bn => ({
        id: `nhapvien-${bn.maNhapVien}`,
        type: 'nhapvien' as const,
        personName: bn.hoTen,
        date: new Date(bn.ngayNhapVien),
      }));

      const newYLenh = data.yLenhGanDay.map(yl => ({
        id: `ylenh-${yl.maYLenh}`,
        type: 'ylenh' as const,
        personName: yl.hoTen,
        date: new Date(yl.ngayGio),
      }));

      const newDischarges = data.benhNhanXuatVienGanDay.map(xv => ({
        id: `xuatvien-${xv.maXuatVien}`,
        type: 'xuatvien' as const,
        personName: xv.hoTen,
        date: new Date(xv.ngayRaVien),
      }));

      // Gộp tất cả vào một mảng và sắp xếp theo ngày (mới nhất trước)
      const allNotifications = [...newPatients, ...newYLenh, ...newDischarges];
      allNotifications.sort((a, b) => b.date.getTime() - a.date.getTime());

      setSortedNotifications(allNotifications);
      setLoading(false); // Hoàn tất tải lần đầu
    };

    // Chạy lần đầu tiên ngay lập tức
    fetchAndProcessNotifications();

    // Thiết lập một interval để tự động cập nhật sau mỗi 30 giây
    const intervalId = setInterval(fetchAndProcessNotifications, 30000);

    // Dọn dẹp interval khi component bị unmount để tránh rò rỉ bộ nhớ
    return () => clearInterval(intervalId);
  }, []); // Mảng dependency rỗng đảm bảo effect này chỉ chạy một lần khi mount

  // Xử lý việc đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN');
  };

  const getNotificationDetails = (notification: UnifiedNotification) => {
    switch (notification.type) {
      case 'nhapvien':
        return {
          icon: <UserPlus className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />,
          text: <><strong>Nhập viện mới:</strong> {notification.personName}</>
        };
      case 'ylenh':
        return {
          icon: <Stethoscope className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />,
          text: <><strong>Y lệnh mới</strong> cho {notification.personName}</>
        };
      case 'xuatvien':
        return {
          icon: <LogOut className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />,
          text: <><strong>Đã xuất viện:</strong> {notification.personName}</>
        };
      default:
        return { icon: null, text: '' };
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => setIsOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative" ref={notificationRef}>
            <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 rounded-lg hover:bg-gray-100 relative">
              <Bell className="w-6 h-6 text-gray-600" />
              {sortedNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  {sortedNotifications.length}
                </span>
              )}
            </button>
            
            {/* ✨ THAY ĐỔI 4: Dropdown giờ đây render một danh sách đã được hợp nhất */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border z-20 animate-fade-in-down">
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-gray-800">Thông báo</h3>
                </div>
                <div className="max-h-96 overflow-y-auto p-2">
                  {loading ? (
                    <p className="text-center text-gray-500 py-4">Đang tải...</p>
                  ) : sortedNotifications.length > 0 ? (
                    sortedNotifications.map(notification => {
                      const details = getNotificationDetails(notification);
                      return (
                        <div key={notification.id} className="p-3 hover:bg-gray-50 rounded-lg">
                          <div className="flex items-start gap-3">
                            {details.icon}
                            <div>
                              <p className="text-sm text-gray-800">{details.text}</p>
                              <p className="text-xs text-gray-500">{formatDate(notification.date)}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center text-gray-500 py-4">Không có thông báo mới.</p>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">A</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;