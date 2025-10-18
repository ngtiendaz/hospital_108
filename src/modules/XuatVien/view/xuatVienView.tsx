'use client';
import React, { useState, useEffect } from 'react';
import {
  Search,
  User,
  Calendar,
  FileText,
  CheckCircle,
  Info,
  X,
  ClipboardList,
  Printer,
  Plus
} from 'lucide-react';
import { xuatVienController } from '../controller/xuatVienController'; 
import { XuatVien } from '../model/xuatVienModel';
import { hoSoBenhAnController } from '../../MedicalRecords/controller/medicalRecordController';
import { HoSoBenhAn } from '../../MedicalRecords/model/medicalRecordModel';

/**
 * Giao diện hiển thị danh sách và quản lý bệnh nhân đã xuất viện.
 */
const XuatVienView: React.FC = () => {
  // States
  const [dischargedList, setDischargedList] = useState<XuatVien[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<XuatVien | null>(null);
  const [showMedicalRecordModal, setShowMedicalRecordModal] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState<HoSoBenhAn[]>([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [dischargeForm, setDischargeForm] = useState<{
    maBenhAn: number;
    hoTen: string;
    ngayRaVien: string;
    trangThai: string;
    ghiChu: string;
  } | null>(null);

  // Load danh sách chính
  const loadDischargedRecords = async () => {
    setLoading(true);
    const data = await xuatVienController.getAll();
    setDischargedList(data);
    setLoading(false);
  };

  useEffect(() => {
    loadDischargedRecords();
  }, []);
  
  // Mở modal và tải hồ sơ có thể xuất viện
  const handleOpenAddModal = async () => {
    setShowMedicalRecordModal(true);
    setModalLoading(true);
    const allRecords = await hoSoBenhAnController.getAll();
    const activeRecords = allRecords.filter(r => r.trangThai === 'Đang điều trị');
    setMedicalRecords(activeRecords);
    setModalLoading(false);
  };

  // Chọn hồ sơ để xuất viện
  const handleSelectRecordForDischarge = (record: HoSoBenhAn) => {
    setShowMedicalRecordModal(false);
    setDischargeForm({
      maBenhAn: record.maBenhAn,
      hoTen: record.hoTen,
      ngayRaVien: new Date().toISOString().split('T')[0],
      trangThai: 'Đã xuất viện',
      ghiChu: '',
    });
  };

  // Lưu thông tin xuất viện
  const handleAddDischarge = async () => {
    if (!dischargeForm) return;
    const success = await xuatVienController.add({
      maBenhAn: dischargeForm.maBenhAn,
      ngayRaVien: dischargeForm.ngayRaVien,
      trangThai: dischargeForm.trangThai,
      ghiChu: dischargeForm.ghiChu,
    });
    
    if (success) {
      alert('✅ Thêm thông tin xuất viện thành công!');
      setDischargeForm(null);
      await loadDischargedRecords();
    } else {
      alert('❌ Lỗi khi thêm thông tin xuất viện!');
    }
  };

  // Lọc danh sách
  const filteredRecords = dischargedList.filter((record) => {
    const search = searchTerm.toLowerCase();
    return (
      record.hoTen?.toLowerCase().includes(search) ||
      record.maBenhAn?.toString().toLowerCase().includes(search) ||
      record.maBenhNhan?.toLowerCase().includes(search) ||
      record.soCMND?.toLowerCase().includes(search)
    );
  });
  
  const handleExportPDF = () => {
    alert("Chức năng xuất PDF đang được phát triển!");
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch (error) {
      return 'Ngày không hợp lệ';
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Đang tải danh sách...</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header và Thanh tìm kiếm */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Danh sách Bệnh nhân Đã xuất viện</h1>
            <p className="text-gray-500 mt-1">Xem lại thông tin các ca đã hoàn tất điều trị.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên, mã bệnh nhân..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
            />
          </div>
          <button
            onClick={handleOpenAddModal}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            <span>Thêm Bệnh nhân Xuất viện</span>
          </button>
        </div>
      </div>
      
      {/* Bảng danh sách */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border">
         <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3">STT</th>
                <th scope="col" className="px-6 py-3">Mã Bệnh Án</th>
                <th scope="col" className="px-6 py-3">Họ Tên Bệnh Nhân</th>
                <th scope="col" className="px-6 py-3">Ngày Ra Viện</th>
                <th scope="col" className="px-6 py-3">Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record, index) => (
                  <tr
                    key={record.maXuatVien}
                    className="bg-white border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedRecord(record)}
                  >
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{record.maBenhAn}</td>
                    <td className="px-6 py-4">{record.hoTen}</td>
                    <td className="px-6 py-4">{formatDate(record.ngayRaVien)}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        <CheckCircle className="w-3.5 h-3.5"/>
                        {record.trangThai}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 py-12">
                    Không tìm thấy hồ sơ xuất viện nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CHI TIẾT */}
      {selectedRecord && (
         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Thông tin xuất viện</h2>
                <p className="text-gray-600">Bệnh nhân: <span className="font-semibold">{selectedRecord.hoTen}</span></p>
              </div>
              <button onClick={() => setSelectedRecord(null)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 md:p-8 space-y-6 bg-white">
              <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center"><User className="w-5 h-5 mr-2 text-blue-600" />Thông tin cá nhân</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-gray-700'>
                      <p><span className='font-medium'>Mã bệnh nhân:</span> {selectedRecord.maBenhNhan}</p>
                      <p><span className='font-medium'>Số CMND/CCCD:</span> {selectedRecord.soCMND}</p>
                      <p><span className='font-medium'>Ngày sinh:</span> {formatDate(selectedRecord.ngaySinh)}</p>
                      <p><span className='font-medium'>Giới tính:</span> {selectedRecord.gioiTinh}</p>
                  </div>
              </div>
              <div className="p-4 bg-green-50/50 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center"><ClipboardList className="w-5 h-5 mr-2 text-green-600" />Chi tiết xuất viện</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-gray-700'>
                  <p><span className='font-medium'>Mã bệnh án:</span> {selectedRecord.maBenhAn}</p>
                  <p><span className='font-medium'>Ngày ra viện:</span> {formatDate(selectedRecord.ngayRaVien)}</p>
                  <p className="md:col-span-2"><span className='font-medium'>Tình trạng lúc ra viện:</span> {selectedRecord.tinhTrang}</p>
                  <p className="md:col-span-2"><span className='font-medium'>Trạng thái hồ sơ:</span> {selectedRecord.trangThai}</p>
                </div>
              </div>
              <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center"><Info className="w-5 h-5 mr-2 text-yellow-600"/>Ghi chú</h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg min-h-[80px] whitespace-pre-wrap border">
                    {selectedRecord.ghiChu || 'Không có ghi chú.'}
                  </p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-between items-center sticky bottom-0 bg-white z-10">
              <button onClick={handleExportPDF} className="flex items-center gap-2 px-5 py-2 text-white font-semibold bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                <Printer className="w-4 h-4" /> Xuất PDF
              </button>
              <button onClick={() => setSelectedRecord(null)} className="px-6 py-2 text-white font-semibold bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: CHỌN HỒ SƠ BỆNH ÁN ĐỂ XUẤT VIỆN */}
      {showMedicalRecordModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-3xl max-h-[80vh] flex flex-col">
            <div className="p-5 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Chọn Hồ sơ Bệnh án để Xuất viện</h2>
              <button onClick={() => setShowMedicalRecordModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
            </div>
            <div className="p-5 overflow-y-auto">
              {modalLoading ? <p className="text-center">Đang tải hồ sơ...</p> : (
                <div className="space-y-3">
                  {medicalRecords.length > 0 ? medicalRecords.map(record => (
                    <div key={record.maBenhAn} onClick={() => handleSelectRecordForDischarge(record)}
                      className="p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-400 cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-gray-800">{record.hoTen}</p>
                        <p className="text-sm font-medium text-blue-600">Mã BA: {record.maBenhAn}</p>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Mã Bệnh nhân: {record.maBenhNhan}</p>
                    </div>
                  )) : <p className="text-center text-gray-500">Không có bệnh nhân nào đang điều trị để xuất viện.</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* MODAL 2: FORM NHẬP THÔNG TIN XUẤT VIỆN */}
      {dischargeForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-2xl">
            <div className="p-5 border-b">
              <h2 className="text-xl font-semibold">Thông tin Xuất viện</h2>
              {/* ✨✨✨ BẮT ĐẦU THAY ĐỔI TẠI ĐÂY ✨✨✨ */}
              <p className="text-sm text-gray-500 mt-1">
                Bệnh nhân: <span className="font-medium text-blue-700">{dischargeForm.hoTen}</span>
                <span className="mx-2">|</span>
                Mã Bệnh Án: <span className="font-medium text-blue-700">{dischargeForm.maBenhAn}</span>
              </p>
              {/* ✨✨✨ KẾT THÚC THAY ĐỔI TẠI ĐÂY ✨✨✨ */}
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày ra viện</label>
                <input
                  type="date"
                  value={dischargeForm.ngayRaVien}
                  onChange={(e) => setDischargeForm({ ...dischargeForm, ngayRaVien: e.target.value })}
                  className="w-full border p-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <textarea
                  placeholder="Bệnh nhân hồi phục tốt..."
                  value={dischargeForm.ghiChu}
                  onChange={(e) => setDischargeForm({ ...dischargeForm, ghiChu: e.target.value })}
                  className="w-full border p-2 rounded-lg min-h-[100px]"
                />
              </div>
            </div>
            <div className="p-4 flex justify-end space-x-3 border-t bg-gray-50 rounded-b-xl">
              <button onClick={handleAddDischarge} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">Lưu thông tin</button>
              <button onClick={() => setDischargeForm(null)} className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100">Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default XuatVienView;