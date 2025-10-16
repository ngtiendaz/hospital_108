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
} from 'lucide-react';
import { hoSoBenhAnController } from '../controller/medicalRecordController';
import { HoSoBenhAn } from '../model/medicalRecordModel';
import BenhNhanNoiTruModal from '../../BenhNhanNoiTru/view/benhNhanNoiTruModal';

const MedicalRecordList: React.FC = () => {
  const [records, setRecords] = useState<HoSoBenhAn[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<HoSoBenhAn | null>(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newForm, setNewForm] = useState<any | null>(null);

  // 📡 Load danh sách
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
    const maBenhAnStr = record.maBenhAn?.toString().toLowerCase() || '';
    const tomTatStr = record.tomTatBenhAn?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    return maBenhAnStr.includes(search) || tomTatStr.includes(search);
  });

  const formatDate = (dateString: string) => {
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
    if (!editForm.maBenhAn) return alert('Thiếu ID hồ sơ');
    const success = await hoSoBenhAnController.update(editForm.maBenhAn, editForm);
    if (success) {
      alert('✅ Cập nhật hồ sơ thành công!');
      setEditing(false);
      setSelectedRecord(null);
      await loadRecords();
    } else {
      alert('❌ Lỗi khi cập nhật hồ sơ!');
    }
  };
  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa hồ sơ này không?')) return;
    const success = await hoSoBenhAnController.delete(id);
    if (success) {
      alert('✅ Xóa hồ sơ thành công!');
      await loadRecords();
      setSelectedRecord(null);
    } else {
      alert('❌ Xóa hồ sơ thất bại!');
    }
  };

  // 💾 Lưu hồ sơ mới
  const handleCreate = async () => {
    if (!newForm || !newForm.maNhapVien) return alert('Chưa chọn bệnh nhân!');
    const success = await hoSoBenhAnController.add({
      maNhapVien: newForm.maNhapVien,
      ngayLap: newForm.ngayLap || new Date().toISOString(),
      tomTatBenhAn: newForm.tomTatBenhAn,
      tienSuBenh: newForm.tienSuBenh,
      ketQuaDieuTri: newForm.ketQuaDieuTri,
      trangThai: newForm.trangThai || 'Đang điều trị',
      HinhAnh: newForm.hinhAnhUrl || ''
    });
    if (success) {
      alert('✅ Thêm hồ sơ thành công!');
      setNewForm(null);
      await loadRecords();
    } else {
      alert('❌ Lỗi khi thêm hồ sơ!');
    }
  };

  // 🌟 Chọn ảnh từ máy và convert sang URL giả
  const handleSelectImage = (e: ChangeEvent<HTMLInputElement>, isNew = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (isNew) {
        setNewForm({ ...newForm, hinhAnhUrl: reader.result });
      } else {
        setEditForm({ ...editForm, hinhAnhUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-20 text-gray-500">
        Đang tải dữ liệu hồ sơ bệnh án...
      </div>
    );

  return (
    <div className="space-y-6">
      {/* 🔎 Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm hồ sơ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Thêm hồ sơ mới</span>
        </button>
      </div>

      {/* 📋 Danh sách hồ sơ (không hiển thị ảnh) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <div
              key={record.maBenhAn}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => setSelectedRecord(record)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{record.maBenhAn}</h3>
                    <p className="text-sm text-gray-500">Mã nhập viện: {record.maNhapVien}</p>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  {record.trangThai || 'Đang điều trị'}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span>{record.tienSuBenh || 'Không có thông tin'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Ngày lập: {formatDate(record.ngayLap)}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-800 mb-1">Tóm tắt bệnh án:</p>
                <p className="text-sm text-gray-600 line-clamp-2">{record.tomTatBenhAn}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-2 py-10">Không có hồ sơ nào.</p>
        )}
      </div>

      {/* 🧾 Modal chi tiết hồ sơ */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedRecord.maBenhAn}</h2>
                <p className="text-gray-600">Mã nhập viện: {selectedRecord.maNhapVien}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedRecord(null);
                  setEditing(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Hiển thị ảnh */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Hình ảnh hồ sơ</h3>
                {editing ? (
                  <div className="space-y-2">
                    <input type="file" accept="image/*" onChange={(e) => handleSelectImage(e)} />
                    {editForm.hinhAnhUrl && (
                      <img
                        src={editForm.hinhAnhUrl}
                        alt="Preview"
                        className="w-full max-h-64 object-contain rounded-lg border"
                      />
                    )}
                  </div>
                ) : selectedRecord.hinhAnhUrl ? (
                  <img
                    src={selectedRecord.hinhAnhUrl}
                    alt={`Hình hồ sơ ${selectedRecord.maBenhAn}`}
                    className="w-full max-h-64 object-contain rounded-lg border"
                  />
                ) : (
                  <p className="text-gray-400 italic">Không có hình ảnh</p>
                )}
              </div>

              {['tomTatBenhAn', 'tienSuBenh', 'ketQuaDieuTri', 'trangThai'].map((field) => (
                <div key={field}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {field === 'tomTatBenhAn'
                      ? 'Tóm tắt bệnh án'
                      : field === 'tienSuBenh'
                      ? 'Tiền sử bệnh'
                      : field === 'ketQuaDieuTri'
                      ? 'Kết quả điều trị'
                      : 'Trạng thái'}
                  </h3>
                  {editing ? (
                    <textarea
                      value={editForm[field]}
                      onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
                      className="w-full p-3 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  ) : (
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {selectedRecord[field as keyof HoSoBenhAn] || 'Không có dữ liệu'}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              {editing ? (
                <>
                  <button
                    onClick={handleSaveEdit}
                    className="flex items-center space-x-1 px-4 py-2 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Lưu</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center space-x-1 px-4 py-2 text-gray-700 border border-gray-400 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Hủy</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleEdit(selectedRecord)}
                    className="flex items-center space-x-1 px-4 py-2 text-blue-600 border border-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                    <span>Sửa</span>
                  </button>
                  <button
                    onClick={() => handleDelete(selectedRecord.maBenhAn)}
                    className="flex items-center space-x-1 px-4 py-2 text-red-600 border border-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Xóa</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 🩺 Modal chọn bệnh nhân để thêm hồ sơ mới */}
      {showModal && (
        <BenhNhanNoiTruModal
          onClose={() => setShowModal(false)}
          onSelect={(benhNhan) => {
            setShowModal(false);
            setNewForm({
              maNhapVien: benhNhan.maNhapVien,
              ngayLap: new Date().toISOString(),
              tomTatBenhAn: '',
              tienSuBenh: '',
              ketQuaDieuTri: '',
              trangThai: 'Đang điều trị',
              hinhAnhUrl: '',
            });
          }}
        />
      )}

      {/* 🆕 Form thêm hồ sơ mới */}
      {newForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-3xl space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Tạo hồ sơ bệnh án mới</h2>

            <div className="space-y-3">
              <textarea
                placeholder="Tóm tắt bệnh án..."
                value={newForm.tomTatBenhAn}
                onChange={(e) => setNewForm({ ...newForm, tomTatBenhAn: e.target.value })}
                className="w-full border p-3 rounded-lg"
              />
              <textarea
                placeholder="Tiền sử bệnh..."
                value={newForm.tienSuBenh}
                onChange={(e) => setNewForm({ ...newForm, tienSuBenh: e.target.value })}
                className="w-full border p-3 rounded-lg"
              />
              <textarea
                placeholder="Kết quả điều trị..."
                value={newForm.ketQuaDieuTri}
                onChange={(e) => setNewForm({ ...newForm, ketQuaDieuTri: e.target.value })}
                className="w-full border p-3 rounded-lg"
              />

              {/* Nút add ảnh */}
              <div className="space-y-2">
                <input type="file" accept="image/*" onChange={(e) => handleSelectImage(e, true)} />
                {newForm.hinhAnhUrl && (
                  <img
                    src={newForm.hinhAnhUrl}
                    alt="Preview"
                    className="w-full max-h-64 object-contain rounded-lg border"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCreate}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg"
              >
                Lưu hồ sơ
              </button>
              <button
                onClick={() => setNewForm(null)}
                className="border border-gray-400 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecordList;
