'use client';
import React, { useState, useEffect } from 'react';
import { dashboardController, DashboardStats } from '../controller/dashboardController'; // Đường dẫn tới controller
import { Bed, FileText, Stethoscope, UserCheck } from 'lucide-react'; // ✨ Thêm icon UserCheck

const DashboardView: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await dashboardController.getDashboardData();
      setStats(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Đang tải dữ liệu Dashboard...</div>;
  }

  if (!stats) {
    return <div className="text-center py-20 text-red-500">Không thể tải được dữ liệu.</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Tổng quan Dashboard</h1>

      {/* --- PHẦN THỐNG KÊ TỔNG QUAN (KPIs) --- */}
      {/* ✨ THAY ĐỔI 1: Cập nhật grid layout để có 4 cột trên màn hình lớn */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card Bệnh nhân nội trú */}
        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center space-x-4">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
            <Bed className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Bệnh nhân nội trú</p>
            <p className="text-3xl font-bold text-gray-800">{stats.soBenhNhanNoiTru}</p>
          </div>
        </div>

        {/* Card Hồ sơ bệnh án */}
        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center space-x-4">
          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
            <FileText className="w-7 h-7 text-emerald-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Hồ sơ bệnh án</p>
            <p className="text-3xl font-bold text-gray-800">{stats.soHoSoBenhAn}</p>
          </div>
        </div>

        {/* Card Y lệnh */}
        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center space-x-4">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
            <Stethoscope className="w-7 h-7 text-red-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Tổng số Y lệnh</p>
            <p className="text-3xl font-bold text-gray-800">{stats.soYLenh}</p>
          </div>
        </div>
        
        {/* ✨ THAY ĐỔI 2: Thêm card thống kê bệnh nhân xuất viện */}
        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center space-x-4">
          <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
            <UserCheck className="w-7 h-7 text-purple-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Đã xuất viện</p>
            <p className="text-3xl font-bold text-gray-800">{stats.soBenhNhanXuatVien}</p>
          </div>
        </div>
      </div>

      {/* --- PHẦN HOẠT ĐỘNG GẦN ĐÂY --- */}
      {/* ✨ THAY ĐỔI 3: Cập nhật grid layout để có 3 cột */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột Y lệnh gần đây */}
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Y lệnh gần đây</h2>
          <div className="space-y-3">
            {stats.yLenhGanDay.length > 0 ? (
              stats.yLenhGanDay.map(yLenh => (
                <div key={yLenh.maYLenh} className="p-3 border-l-4 border-blue-400 bg-gray-50 rounded-r-lg">
                  <p className="font-semibold text-gray-800">{yLenh.hoTen}</p>
                  <p className="text-sm text-gray-600 truncate">{yLenh.noiDung}</p>
                  <p className="text-xs text-gray-400 mt-1">BS: {yLenh.maBacSi} - {formatDate(yLenh.ngayGio)}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">Không có y lệnh nào gần đây.</p>
            )}
          </div>
        </div>

        {/* Cột Bệnh nhân mới nhập viện */}
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Bệnh nhân mới nhập viện</h2>
          <div className="space-y-3">
            {stats.benhNhanMoiNhapVien.length > 0 ? (
              stats.benhNhanMoiNhapVien.map(benhNhan => (
                <div key={benhNhan.maNhapVien} className="p-3 border-l-4 border-emerald-400 bg-gray-50 rounded-r-lg">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-800">{benhNhan.hoTen}</p>
                    <span className="text-xs text-gray-500">{formatDate(benhNhan.ngayNhapVien)}</span>
                  </div>
                  <p className="text-sm text-gray-600">Khoa: {benhNhan.khoaDieuTri}</p>
                  <p className="text-sm text-gray-600 truncate">Chẩn đoán: {benhNhan.chuanDoan}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">Không có bệnh nhân nào mới nhập viện.</p>
            )}
          </div>
        </div>
        
        {/* ✨ THAY ĐỔI 4: Thêm cột Bệnh nhân xuất viện gần đây */}
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Bệnh nhân xuất viện gần đây</h2>
          <div className="space-y-3">
            {stats.benhNhanXuatVienGanDay.length > 0 ? (
              stats.benhNhanXuatVienGanDay.map(xuatVien => (
                <div key={xuatVien.maXuatVien} className="p-3 border-l-4 border-purple-400 bg-gray-50 rounded-r-lg">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-800">{xuatVien.hoTen}</p>
                    <span className="text-xs text-gray-500">{formatDate(xuatVien.ngayRaVien)}</span>
                  </div>
                  <p className="text-sm text-gray-600">Trạng thái: {xuatVien.trangThai}</p>
                  <p className="text-sm text-gray-600 truncate" title={xuatVien.ghiChu}>Ghi chú: {xuatVien.ghiChu || 'Không có'}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">Chưa có bệnh nhân nào xuất viện gần đây.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardView;