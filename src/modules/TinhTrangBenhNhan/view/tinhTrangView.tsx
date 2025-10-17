'use client';

import React, { useState, useEffect } from 'react';



// Import models

import { HoSoBenhAn } from '../../MedicalRecords/model/medicalRecordModel';

import { TinhTrangSucKhoe } from '../model/tinhTrangModel';



// Import controllers

import { hoSoBenhAnController } from '../../MedicalRecords/controller/medicalRecordController';

import { tinhTrangSucKhoeController } from '../controller/tinhTrangController';

// Import icons
import { FileText, User, Calendar, Plus, Search, ArrowLeft, Send, Activity, BookText, Stethoscope } from 'lucide-react';

const TinhTrangSucKhoeView: React.FC = () => {
  // --- STATE QUẢN LÝ CHUNG ---
  const [medicalRecords, setMedicalRecords] = useState<HoSoBenhAn[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<HoSoBenhAn | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // --- STATE CHO TRANG CHI TIẾT ---
  const [healthStatuses, setHealthStatuses] = useState<TinhTrangSucKhoe[]>([]);
  const [statusesLoading, setStatusesLoading] = useState(true);
  const [newStatus, setNewStatus] = useState({ tinhTrang: '', ghiChu: '' });

  // --- TẢI DỮ LIỆU ---

  // Tải danh sách hồ sơ bệnh án khi component được mount
  useEffect(() => {
    const loadRecords = async () => {
      setLoading(true);
      const data = await hoSoBenhAnController.getAll();
      setMedicalRecords(data);
      setLoading(false);
    };
    loadRecords();
  }, []);

  // Tải danh sách tình trạng sức khỏe khi một bệnh án được chọn
  useEffect(() => {
    if (!selectedRecord) return;

    const loadHealthStatuses = async () => {
      setStatusesLoading(true);
      const data = await tinhTrangSucKhoeController.getByMaBenhAn(selectedRecord.maBenhAn);
      const sortedData = data.sort((a, b) => new Date(b.ngay).getTime() - new Date(a.ngay).getTime());
      setHealthStatuses(sortedData);
      setStatusesLoading(false);
    };
    loadHealthStatuses();
  }, [selectedRecord]); // Chạy lại khi selectedRecord thay đổi

  // --- HÀM XỬ LÝ SỰ KIỆN ---

  const handleSelectRecord = (record: HoSoBenhAn) => {
    setSelectedRecord(record);
  };

  const handleGoBackToList = () => {
    setSelectedRecord(null);
    setHealthStatuses([]); // Xóa dữ liệu cũ
  };

  const handleAddStatus = async () => {
    if (!selectedRecord || !newStatus.tinhTrang) {
      alert('Vui lòng nhập tình trạng sức khỏe.');
      return;
    }

    const payload = {
      maBenhAn: selectedRecord.maBenhAn,
      ngay: new Date().toISOString().slice(0, 10), // Luôn là ngày hôm nay
      tinhTrang: newStatus.tinhTrang,
      ghiChu: newStatus.ghiChu,
    };

    const success = await tinhTrangSucKhoeController.update(payload);

    if (success) {
      alert('✅ Cập nhật tình trạng sức khỏe thành công!');
      setNewStatus({ tinhTrang: '', ghiChu: '' }); // Reset form
      // Tải lại danh sách tình trạng để hiển thị dữ liệu mới
      const data = await tinhTrangSucKhoeController.getByMaBenhAn(selectedRecord.maBenhAn);
      const sortedData = data.sort((a, b) => new Date(b.ngay).getTime() - new Date(a.ngay).getTime());
      setHealthStatuses(sortedData);
    } else {
      alert('❌ Lỗi khi cập nhật tình trạng sức khỏe!');
    }
  };

  // Lọc danh sách bệnh án dựa trên tìm kiếm
  const filteredRecords = medicalRecords.filter(record =>
    record.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.maBenhAn.toString().includes(searchTerm)
  );

  // --- RENDER GIAO DIỆN ---

  // Giao diện loading ban đầu
  if (loading) {
    return <div className="text-center py-20 text-gray-500">Đang tải danh sách bệnh án...</div>;
  }

  // Giao diện trang chi tiết
  if (selectedRecord) {
    return (
      <div className="space-y-6">
        <button
          onClick={handleGoBackToList}
          className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-800 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại danh sách</span>
        </button>

        {/* ✨ THAY ĐỔI: Khối thông tin bệnh án đã được mở rộng */}
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{selectedRecord.hoTen}</h1>
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-gray-400" /> Mã Bệnh Án: <strong>{selectedRecord.maBenhAn}</strong></div>
                <div className="flex items-center gap-2"><User className="w-4 h-4 text-gray-400" /> Mã Bệnh Nhân: <strong>{selectedRecord.maBenhNhan}</strong></div>
              </div>
            </div>
            <div className="flex-shrink-0 mt-2 sm:mt-0">
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${selectedRecord.trangThai === 'Đã xuất viện' ? 'bg-gray-100 text-gray-700' : 'bg-green-100 text-green-800'}`}>
                {selectedRecord.trangThai || 'N/A'}
              </span>
            </div>
          </div>

          <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <h4 className="font-semibold text-gray-500 mb-1 flex items-center gap-2"><Stethoscope size={16}/>Tóm tắt bệnh án</h4>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{selectedRecord.tomTatBenhAn || 'Chưa có thông tin'}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-500 mb-1 flex items-center gap-2"><BookText size={16}/>Tiền sử bệnh</h4>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{selectedRecord.tienSuBenh || 'Chưa có thông tin'}</p>
            </div>
            <div className="md:col-span-2">
              <h4 className="font-semibold text-gray-500 mb-1 flex items-center gap-2"><Activity size={16}/>Kết quả điều trị</h4>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{selectedRecord.ketQuaDieuTri || 'Chưa có thông tin'}</p>
            </div>
          </div>
        </div>

        {/* Form thêm tình trạng sức khỏe mới */}
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
          <h2 className="text-lg font-semibold">Cập nhật tình trạng sức khỏe hôm nay</h2>
          <div className="space-y-3">
            <textarea
              value={newStatus.tinhTrang}
              onChange={(e) => setNewStatus({ ...newStatus, tinhTrang: e.target.value })}
              placeholder="Tình trạng (ví dụ: Sốt nhẹ, ho khan...)"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              rows={2}
            />
            <textarea
              value={newStatus.ghiChu}
              onChange={(e) => setNewStatus({ ...newStatus, ghiChu: e.target.value })}
              placeholder="Ghi chú (ví dụ: Đã cho uống thuốc hạ sốt...)"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              rows={2}
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleAddStatus}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Gửi cập nhật</span>
            </button>
          </div>
        </div>
        
        {/* Lịch sử tình trạng sức khỏe */}
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Lịch sử theo dõi</h2>
            {statusesLoading ? (
                <p className="text-center text-gray-500 py-10">Đang tải lịch sử...</p>
            ) : healthStatuses.length > 0 ? (
                healthStatuses.map((status, index) => (
                    <div key={index} className="bg-white p-5 rounded-lg border flex gap-4 items-start">
                        <div className="flex-shrink-0 text-center border-r pr-4 w-20">
                           <p className="text-sm text-gray-500">{new Date(status.ngay).getFullYear()}</p>
                           <p className="text-xl font-bold text-emerald-600">{new Date(status.ngay).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</p>
                        </div>
                        <div className="space-y-2 text-sm flex-grow">
                            <div className="flex items-start gap-2">
                                <Activity className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                                <div><strong className="font-medium text-gray-800">Tình trạng:</strong> {status.tinhTrang}</div>
                            </div>
                            <div className="flex items-start gap-2">
                                <BookText className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" />
                                <div><strong className="font-medium text-gray-800">Ghi chú:</strong> {status.ghiChu}</div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500 py-10 bg-white rounded-lg border">Chưa có cập nhật nào cho bệnh án này.</p>
            )}
        </div>
      </div>
    );
  }

  // Giao diện danh sách bệnh án (mặc định)
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-xl font-bold text-gray-800">Chọn Bệnh Án để xem Tình Trạng</h1>
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm bệnh án..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 w-full sm:w-auto"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <div
              key={record.maBenhAn}
              onClick={() => handleSelectRecord(record)}
              className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-lg hover:border-emerald-400 transition-all duration-300 cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-7 h-7 text-emerald-600" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-gray-900">{record.hoTen}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                      <span>Mã BA: <strong>{record.maBenhAn}</strong></span>
                      <span>Mã BN: <strong>{record.maBenhNhan}</strong></span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 pt-1">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${record.trangThai === 'Đã xuất viện' ? 'bg-gray-100 text-gray-700' : 'bg-green-100 text-green-800'}`}>
                    {record.trangThai || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-1 py-12">
            Không tìm thấy hồ sơ bệnh án nào.
          </p>
        )}
      </div>
    </div>
  );
};

export default TinhTrangSucKhoeView;