'use client';
import React, { useState, useEffect } from 'react';
import { YLenh } from '../model/yLenhModel';
import { yLenhController } from '../controller/yLenhController';
import { FileText, Pencil, Trash2, Save, X, Upload } from 'lucide-react';

const YLenhList: React.FC = () => {
  const [yLenhList, setYLenhList] = useState<YLenh[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>('');
  const [editFile, setEditFile] = useState<File | null>(null);

  const loadYLenh = async () => {
    setLoading(true);
    const data = await yLenhController.getAll();
    setYLenhList(data);
    setLoading(false);
  };

  useEffect(() => {
    loadYLenh();
  }, []);

  const handleEdit = (item: YLenh) => {
    setEditingId(item.maYLenh);
    setEditContent(item.noiDung);
    setEditFile(null); // reset file khi bấm sửa
  };

  const handleSave = async (id: number) => {
    if (!editContent) return alert('Nội dung y lệnh không được để trống');
    const success = await yLenhController.update(id, { noiDung: editContent, file: editFile || undefined });
    if (success) {
      alert('✅ Cập nhật y lệnh thành công!');
      setEditingId(null);
      setEditContent('');
      setEditFile(null);
      await loadYLenh();
    } else {
      alert('❌ Lỗi khi cập nhật y lệnh!');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditContent('');
    setEditFile(null);
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

  if (loading)
    return (
      <div className="flex justify-center items-center py-20 text-gray-500">
        Đang tải danh sách phác đồ y lệnh...
      </div>
    );

  return (
    <div className="space-y-4">
      {yLenhList.length === 0 && (
        <p className="text-center text-gray-500 py-10">Không có phác đồ y lệnh nào.</p>
      )}

      {yLenhList.map((item) => (
        <div
          key={item.maYLenh}
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 w-full"
        >
          {/* Header: Mã + trạng thái */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Y Lệnh #{item.maYLenh}</h3>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                item.trangThai === 'Đang thực hiện'
                  ? 'bg-green-100 text-green-800'
                  : item.trangThai === 'Chờ thực hiện'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {item.trangThai}
            </span>
          </div>

          {/* Nội dung */}
          <div className="mb-4">
            {editingId === item.maYLenh ? (
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              />
            ) : (
              <p className="text-gray-700 text-sm whitespace-pre-wrap">{item.noiDung}</p>
            )}
          </div>

          {/* File đính kèm */}
          <div className="mb-4">
            {item.fileData && !editingId && (
              <div className="flex items-center space-x-2 text-blue-600">
                <FileText className="w-5 h-5" />
                <a
                  href={item.fileData}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-800"
                >
                  Xem file đính kèm
                </a>
              </div>
            )}

            {editingId === item.maYLenh && (
              <div className="flex items-center space-x-2">
                <label className="flex items-center space-x-1 cursor-pointer text-blue-600 hover:text-blue-800">
                  <Upload className="w-5 h-5" />
                  <span>Upload file mới</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                  />
                </label>
                {editFile && <span className="text-gray-700 text-sm">{editFile.name}</span>}
              </div>
            )}

            {!item.fileData && !editingId && (
              <p className="text-gray-400 italic text-sm">Không có file đính kèm</p>
            )}
          </div>

          {/* Nút Sửa/Xóa hoặc Lưu/Hủy */}
          <div className="flex space-x-3">
            {editingId === item.maYLenh ? (
              <>
                <button
                  onClick={() => handleSave(item.maYLenh)}
                  className="flex items-center space-x-1 px-4 py-2 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-1 px-4 py-2 text-gray-700 border border-gray-400 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Hủy</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleEdit(item)}
                  className="flex items-center space-x-1 px-4 py-2 text-blue-600 border border-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Sửa</span>
                </button>
                <button
                  onClick={() => handleDelete(item.maYLenh)}
                  className="flex items-center space-x-1 px-4 py-2 text-red-600 border border-red-500 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xóa</span>
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default YLenhList;
