'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Plus,
  Search,
  FileText,
  User,
  Calendar,
  Pencil,
  Trash2,
  Save,
  X,
  HeartPulse,
} from 'lucide-react';
import { hoSoBenhAnController } from '../controller/medicalRecordController';
import { HoSoBenhAn } from '../model/medicalRecordModel';
import BenhNhanNoiTruModal from '../../BenhNhanNoiTru/view/benhNhanNoiTruModal';
import { BenhNhanNoiTru } from '../../BenhNhanNoiTru/model/benhNhanNoiTruModel'; 

const MedicalRecordList: React.FC = () => {
  const [records, setRecords] = useState<HoSoBenhAn[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<HoSoBenhAn | null>(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<HoSoBenhAn>>({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newForm, setNewForm] = useState<Partial<HoSoBenhAn> | null>(null);

  const loadRecords = async () => {
    setLoading(true);
    const data = await hoSoBenhAnController.getAll();
    setRecords(data);
    setLoading(false);
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const filteredRecords = records.filter((record) => {
    const search = searchTerm.toLowerCase();
    return (
      record.maBenhAn?.toString().toLowerCase().includes(search) ||
      record.tomTatBenhAn?.toLowerCase().includes(search) ||
      record.hoTen?.toLowerCase().includes(search) ||
      record.maBenhNhan?.toLowerCase().includes(search)
    );
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleEdit = (record: HoSoBenhAn) => {
    setEditing(true);
    setEditForm({ ...record });
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditForm({});
  };

  const handleSaveEdit = async () => {
    if (!editForm.maBenhAn || !editForm.maNhapVien || !editForm.maBenhNhan || !editForm.hoTen) {
      return alert('Thiếu thông tin bệnh nhân hoặc hồ sơ để cập nhật!');
    }
    const payload = {
      maBenhNhan: editForm.maBenhNhan,
      hoTen: editForm.hoTen,
      maNhapVien: editForm.maNhapVien,
      ngayLap: editForm.ngayLap || new Date().toISOString(),
      tomTatBenhAn: editForm.tomTatBenhAn || '',
      tienSuBenh: editForm.tienSuBenh || '',
      ketQuaDieuTri: editForm.ketQuaDieuTri || '',
      trangThai: editForm.trangThai || 'Đang điều trị',
      HinhAnh: editForm.hinhAnhUrl || null,
    };
    const success = await hoSoBenhAnController.update(editForm.maBenhAn, payload);
    if (success) {
      alert('✅ Cập nhật hồ sơ thành công!');
      setEditing(false);
      setSelectedRecord(null);
      await loadRecords();
    } else {
      alert('❌ Lỗi khi cập nhật hồ sơ!');
    }
  };

  const handleDelete = async (id?: number) => {
    if (id === undefined) return;
    if (!confirm('Bạn có chắc muốn xóa hồ sơ này không?')) return;
    
    const success = await hoSoBenhAnController.delete(id);
    if (success) {
      alert('✅ Xóa hồ sơ thành công!');
      setSelectedRecord(null);
      await loadRecords();
    } else {
      alert('❌ Xóa hồ sơ thất bại!');
    }
  };

  const handleCreate = async () => {
    if (!newForm || !newForm.maNhapVien || !newForm.maBenhNhan || !newForm.hoTen) {
      return alert('Chưa chọn bệnh nhân hoặc thiếu thông tin cần thiết!');
    }
    const payload = {
      maBenhNhan: newForm.maBenhNhan,
      hoTen: newForm.hoTen,
      maNhapVien: newForm.maNhapVien,
      ngayLap: newForm.ngayLap || new Date().toISOString(),
      tomTatBenhAn: newForm.tomTatBenhAn || '',
      tienSuBenh: newForm.tienSuBenh || '',
      ketQuaDieuTri: newForm.ketQuaDieuTri || '',
      trangThai: newForm.trangThai || 'Đang điều trị',
      HinhAnh: newForm.hinhAnhUrl || null,
    };
    const success = await hoSoBenhAnController.add(payload);
    if (success) {
      alert('✅ Thêm hồ sơ thành công!');
      setNewForm(null);
      await loadRecords();
    } else {
      alert('❌ Lỗi khi thêm hồ sơ!');
    }
  };
  
  const handleSelectImage = (e: ChangeEvent<HTMLInputElement>, isNewForm = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageDataUrl = reader.result as string;
      if (isNewForm) {
        setNewForm((prev) => (prev ? { ...prev, hinhAnhUrl: imageDataUrl } : null));
      } else {
        setEditForm((prev) => ({ ...prev, hinhAnhUrl: imageDataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };
  
  if (loading) {
    return <div className="text-center py-10">Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header và Tìm kiếm */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã, tên bệnh nhân..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full sm:w-auto"
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Thêm hồ sơ mới</span>
        </button>
      </div>
      
      {/* Danh sách hồ sơ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <div
              key={record.maBenhAn}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => setSelectedRecord(record)}
            >
              {/* Content của card hồ sơ */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{record.hoTen}</h3>
                    <p className="text-sm text-gray-500">Mã BA: {record.maBenhAn} - Mã BN: {record.maBenhNhan}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${record.trangThai === 'Đã xuất viện' ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'}`}>
                  {record.trangThai || 'N/A'}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <HeartPulse className="w-4 h-4 mr-2 flex-shrink-0 text-red-500" />
                  <span className="font-medium">Tiền sử: </span>
                  <span className="ml-1 truncate" title={record.tienSuBenh}>{record.tienSuBenh || 'Chưa ghi nhận'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                  <span>Ngày lập: {formatDate(record.ngayLap)}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-1 lg:col-span-2 py-10">Không tìm thấy hồ sơ nào.</p>
        )}
      </div>

      {/* ✨✨✨ BẮT ĐẦU: MODAL CHI TIẾT & CHỈNH SỬA HỒ SƠ ✨✨✨ */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
            {/* Header của Modal */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Hồ sơ: {selectedRecord.hoTen}</h2>
                <p className="text-gray-600">Mã BA: {selectedRecord.maBenhAn} - Mã BN: {selectedRecord.maBenhNhan}</p>
              </div>
              <button
                onClick={() => { setSelectedRecord(null); handleCancelEdit(); }}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body của Modal */}
            <div className="p-6 space-y-6 flex-grow">
              {/* Vùng ảnh */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Hình ảnh hồ sơ</h3>
                {editing ? (
                  <div className="space-y-2">
                    <input type="file" accept="image/*" onChange={(e) => handleSelectImage(e)} className="text-sm" />
                    {editForm.hinhAnhUrl && <img src={editForm.hinhAnhUrl} alt="Preview" className="w-full max-h-64 object-contain rounded-lg border bg-gray-100"/>}
                  </div>
                ) : selectedRecord.hinhAnhUrl ? (
                  <img src={selectedRecord.hinhAnhUrl} alt={`Hình hồ sơ ${selectedRecord.maBenhAn}`} className="w-full max-h-64 object-contain rounded-lg border"/>
                ) : (
                  <p className="text-gray-400 italic">Không có hình ảnh</p>
                )}
              </div>

              {/* Thông tin bệnh nhân (không sửa) */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Thông tin bệnh nhân</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700'>
                      <p><span className='font-medium'>Họ tên:</span> {selectedRecord.hoTen}</p>
                      <p><span className='font-medium'>Mã bệnh nhân:</span> {selectedRecord.maBenhNhan}</p>
                      <p><span className='font-medium'>Mã nhập viện:</span> {selectedRecord.maNhapVien}</p>
                  </div>
              </div>

              {/* Các trường thông tin có thể chỉnh sửa */}
              {[
                { key: 'tomTatBenhAn', label: 'Tóm tắt bệnh án' },
                { key: 'tienSuBenh', label: 'Tiền sử bệnh' },
                { key: 'ketQuaDieuTri', label: 'Kết quả điều trị' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{label}</h3>
                  {editing ? (
                    <textarea
                      value={editForm[key as keyof HoSoBenhAn] as string || ''}
                      onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                      className="w-full p-3 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500 min-h-[100px]"
                      rows={4}
                    />
                  ) : (
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg min-h-[50px] whitespace-pre-wrap">
                      {selectedRecord[key as keyof HoSoBenhAn] as string || 'Chưa có thông tin'}
                    </p>
                  )}
                </div>
              ))}
              
              {/* Trường Trạng thái */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Trạng thái</h3>
                {editing ? (
                    <select
                        value={editForm.trangThai || 'Đang điều trị'}
                        onChange={(e) => setEditForm({ ...editForm, trangThai: e.target.value })}
                        className="w-full p-3 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                    >
                        <option value="Đang điều trị">Đang điều trị</option>
                        <option value="Đã xuất viện">Đã xuất viện</option>
                        <option value="Chuyển viện">Chuyển viện</option>
                    </select>
                ) : (
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {selectedRecord.trangThai || 'Chưa có thông tin'}
                  </p>
                )}
              </div>
            </div>

            {/* Footer của Modal với các nút hành động */}
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3 sticky bottom-0 bg-white z-10">
              {editing ? (
                <>
                  <button onClick={handleSaveEdit} className="flex items-center space-x-2 px-4 py-2 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"><Save className="w-4 h-4" /><span>Lưu</span></button>
                  <button onClick={handleCancelEdit} className="flex items-center space-x-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"><X className="w-4 h-4" /><span>Hủy</span></button>
                </>
              ) : (
                <>
                  <button onClick={() => handleEdit(selectedRecord)} className="flex items-center space-x-2 px-4 py-2 text-blue-600 border border-blue-500 rounded-lg hover:bg-blue-50 transition-colors"><Pencil className="w-4 h-4" /><span>Sửa</span></button>
                  <button onClick={() => handleDelete(selectedRecord.maBenhAn)} className="flex items-center space-x-2 px-4 py-2 text-red-600 border border-red-500 rounded-lg hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /><span>Xóa</span></button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {/* ✨✨✨ KẾT THÚC: MODAL CHI TIẾT & CHỈNH SỬA HỒ SƠ ✨✨✨ */}

      {/* Modal chọn bệnh nhân để thêm hồ sơ mới */}
      {showModal && (
        <BenhNhanNoiTruModal
          onClose={() => setShowModal(false)}
          onSelect={(benhNhan: BenhNhanNoiTru) => {
            if (!benhNhan.maBenhNhan || !benhNhan.hoTen) {
                alert("Thông tin bệnh nhân được chọn không đầy đủ!");
                return;
            }
            setShowModal(false);
            setNewForm({
              maNhapVien: parseInt(benhNhan.maNhapVien.toString(), 10), 
              maBenhNhan: benhNhan.maBenhNhan,
              hoTen: benhNhan.hoTen,
              ngayLap: new Date().toISOString().split('T')[0],
              tomTatBenhAn: '',
              tienSuBenh: '',
              ketQuaDieuTri: '',
              trangThai: 'Đang điều trị',
              hinhAnhUrl: '',
            });
          }}
        />
      )}
      
      {/* Form thêm hồ sơ mới */}
      {newForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-3xl">
             <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Tạo hồ sơ bệnh án mới</h2>
                <p className="text-sm text-gray-500">Bệnh nhân: <span className="font-medium text-emerald-700">{newForm.hoTen}</span> (Mã BN: {newForm.maBenhNhan})</p>
             </div>
             <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {[
                  { key: 'tomTatBenhAn', label: 'Tóm tắt bệnh án' },
                  { key: 'tienSuBenh', label: 'Tiền sử bệnh' },
                  { key: 'ketQuaDieuTri', label: 'Kết quả điều trị' },
              ].map(({key, label}) => (
                 <textarea
                  key={key}
                  placeholder={label + '...'}
                  value={newForm[key as keyof Partial<HoSoBenhAn>] as string || ''}
                  onChange={(e) => setNewForm({ ...newForm, [key]: e.target.value })}
                  className="w-full border p-3 rounded-lg min-h-[100px]"
                />
              ))}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Thêm hình ảnh</label>
                <input type="file" accept="image/*" onChange={(e) => handleSelectImage(e, true)} className="text-sm" />
                {newForm.hinhAnhUrl && <img src={newForm.hinhAnhUrl} alt="Preview" className="w-full max-h-64 object-contain rounded-lg border mt-2 bg-gray-100"/>}
              </div>
            </div>
            <div className="p-6 flex justify-end space-x-3 border-t">
              <button onClick={handleCreate} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg">Lưu hồ sơ</button>
              <button onClick={() => setNewForm(null)} className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecordList;