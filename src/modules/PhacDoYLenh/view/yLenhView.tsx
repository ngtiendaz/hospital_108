'use client';
import React, { useState, useEffect } from 'react';
import { YLenh } from '../model/yLenhModel';
import { yLenhController } from '../controller/yLenhController';
import { FileText, Pencil, Trash2, Save, X, Upload, Search, Plus, User, BedDouble, DoorOpen, Calendar } from 'lucide-react';

// ✨ THAY ĐỔI: Bỏ `ngayGio` khỏi state của form
const initialFormState = {
  maBenhAn: '',
  maBacSi: '',
  noiDung: '',
  trangThai: 'Chờ thực hiện',
};

const YLenhList: React.FC = () => {
  const [yLenhList, setYLenhList] = useState<YLenh[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(initialFormState);
  const [formFile, setFormFile] = useState<File | null>(null);

  const loadYLenh = async () => {
    setLoading(true);
    const data = await yLenhController.getAll();
    setYLenhList(data);
    setLoading(false);
  };

  useEffect(() => { loadYLenh(); }, []);
  
  const formatDate = (isoString?: string) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData(initialFormState); // Không cần set ngày nữa
    setFormFile(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (item: YLenh) => {
    setEditingId(item.maYLenh);
    // ✨ THAY ĐỔI: Không cần set `ngayGio` vào form
    setFormData({
      maBenhAn: String(item.maBenhAn),
      maBacSi: item.maBacSi,
      noiDung: item.noiDung,
      trangThai: item.trangThai,
    });
    setFormFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData(initialFormState);
    setFormFile(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async () => {
    // ✨ THAY ĐỔI: Bỏ check `ngayGio`
    if (!formData.maBenhAn || !formData.maBacSi || !formData.noiDung) {
      alert('❌ Vui lòng điền đầy đủ các trường bắt buộc!');
      return;
    }

    // ✨ THAY ĐỔI: Tự động tạo ngày hôm nay và gửi đi
    const payload = {
      maBenhAn: parseInt(formData.maBenhAn, 10),
      maBacSi: formData.maBacSi,
      ngayGio: new Date().toISOString().slice(0, 10), // Luôn là ngày hôm nay
      noiDung: formData.noiDung,
      trangThai: formData.trangThai,
      file: formFile || undefined,
    };
    
    let success = false;
    if (editingId) {
      success = await yLenhController.update(editingId, payload);
    } else {
      success = await yLenhController.create(payload);
    }

    if (success) {
      alert(`✅ ${editingId ? 'Cập nhật' : 'Thêm mới'} y lệnh thành công!`);
      handleCloseModal();
      await loadYLenh();
    } else {
      alert(`❌ Lỗi khi ${editingId ? 'cập nhật' : 'thêm mới'} y lệnh!`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa y lệnh này không?')) return;
    const success = await yLenhController.delete(id);
    if (success) {
      alert('✅ Xóa y lệnh thành công!');
      await loadYLenh();
    } else {
      alert('❌ Lỗi khi xóa y lệnh!');
    }
  };

  const filteredYLenhList = yLenhList.filter((item) =>
    item.noiDung.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.maBacSi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.maYLenh.toString().includes(searchTerm)
  );

  if (loading) {
    return <div className="flex justify-center items-center py-20 text-gray-500">Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header và Search */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" placeholder="Tìm kiếm theo nội dung, tên BN..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 w-full sm:w-auto" />
        </div>
        <button onClick={handleOpenAddModal} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Thêm y lệnh mới</span>
        </button>
      </div>

      {/* Modal Thêm/Sửa */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-lg space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
              {editingId ? `Chỉnh Sửa Y Lệnh #${editingId}` : 'Thêm Y Lệnh Mới'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã Bệnh Án (*)</label>
                <input type="number" name="maBenhAn" value={formData.maBenhAn} onChange={handleFormChange} className="w-full p-2 border rounded-lg" disabled={!!editingId} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã Bác Sĩ (*)</label>
                <input type="text" name="maBacSi" value={formData.maBacSi} onChange={handleFormChange} className="w-full p-2 border rounded-lg" />
              </div>
              
              {/* ✨ THAY ĐỔI: Xóa input ngày giờ khỏi giao diện */}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng Thái</label>
                <select name="trangThai" value={formData.trangThai} onChange={handleFormChange} className="w-full p-2 border rounded-lg bg-white">
                  <option value="Chờ thực hiện">Chờ thực hiện</option>
                  <option value="Đang thực hiện">Đang thực hiện</option>
                  <option value="Đã thực hiện">Đã thực hiện</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nội Dung (*)</label>
              <textarea name="noiDung" value={formData.noiDung} onChange={handleFormChange} className="w-full p-2 border rounded-lg" rows={3} />
            </div>

            <div>
              <label className="flex items-center space-x-2 cursor-pointer text-blue-600 w-fit">
                <Upload className="w-5 h-5" />
                <span>Upload file đính kèm</span>
                <input type="file" className="hidden" onChange={(e) => setFormFile(e.target.files?.[0] || null)} />
              </label>
              {formFile && <span className="text-gray-700 text-sm block mt-2">File đã chọn: {formFile.name}</span>}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button onClick={handleCloseModal} className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-100">Hủy</button>
              <button onClick={handleFormSubmit} className="px-4 py-2 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700">Lưu</button>
            </div>
          </div>
        </div>
      )}

      {/* Danh sách Y Lệnh */}
      <div className="space-y-4">
        {filteredYLenhList.length === 0 && (
          <p className="text-center text-gray-500 py-10">{searchTerm ? 'Không tìm thấy kết quả.' : 'Không có y lệnh nào.'}</p>
        )}
        {filteredYLenhList.map((item) => (
          <div key={item.maYLenh} className="bg-white border rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-grow">
                 <h3 className="text-lg font-semibold text-gray-800">Y Lệnh #{item.maYLenh}</h3>
                 <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <Calendar className="w-3 h-3"/> {formatDate(item.ngayGio)}
                 </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${ item.trangThai === 'Đang thực hiện' ? 'bg-blue-100 text-blue-800' : item.trangThai === 'Chờ thực hiện' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800' }`}>
                {item.trangThai}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 text-sm text-gray-600 border-t border-b py-4 my-4">
              <div className="flex items-center gap-2"><User className="w-4 h-4 text-gray-500" /> <div><strong>Bệnh nhân:</strong> {item.hoTen}</div></div>
              <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-gray-500" /> <div><strong>Mã Bệnh Án:</strong> {item.maBenhAn}</div></div>
              <div className="flex items-center gap-2"><User className="w-4 h-4 text-gray-500" /> <div><strong>Bác sĩ:</strong> {item.maBacSi}</div></div>
              <div className="flex items-center gap-2"><DoorOpen className="w-4 h-4 text-gray-500" /> <div><strong>Phòng:</strong> {item.phong}</div></div>
              <div className="flex items-center gap-2"><BedDouble className="w-4 h-4 text-gray-500" /> <div><strong>Giường:</strong> {item.giuong}</div></div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-800 mb-1">Nội dung y lệnh:</p>
              <p className="text-gray-700 text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">{item.noiDung}</p>
            </div>
            
            <div>
              {item.fileData ? (
                <div className="flex items-center space-x-2 text-blue-600">
                  <FileText className="w-5 h-5" /><a href={item.fileData} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800 text-sm">Xem file đính kèm</a>
                </div>
              ) : (<p className="text-gray-400 italic text-sm">Không có file đính kèm</p>)}
            </div>

            <div className="flex space-x-3 pt-4 border-t mt-4">
              <button onClick={() => handleOpenEditModal(item)} className="flex items-center space-x-2 px-4 py-2 text-blue-600 border border-blue-500 rounded-lg hover:bg-blue-50 text-sm">
                <Pencil className="w-4 h-4" /> <span>Sửa</span>
              </button>
              <button onClick={() => handleDelete(item.maYLenh)} className="flex items-center space-x-2 px-4 py-2 text-red-600 border border-red-500 rounded-lg hover:bg-red-50 text-sm">
                <Trash2 className="w-4 h-4" /> <span>Xóa</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YLenhList;