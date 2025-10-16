'use client';
import React, { useEffect, useState } from 'react';
import { X, Search, User } from 'lucide-react';
import { BenhNhanNoiTru } from '../model/benhNhanNoiTruModel';
import { benhNhanNoiTruController } from '../controller/benhNhanNoiTruController';

interface Props {
  onSelect: (benhNhan: BenhNhanNoiTru) => void;
  onClose: () => void;
}

const BenhNhanNoiTruModal: React.FC<Props> = ({ onSelect, onClose }) => {
  const [benhNhans, setBenhNhans] = useState<BenhNhanNoiTru[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await benhNhanNoiTruController.getAll();
        if (Array.isArray(data)) {
          setBenhNhans(data);
        } else {
          console.error('Dữ liệu trả về không hợp lệ:', data);
          setBenhNhans([]);
        }
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu bệnh nhân:', err);
      }
    };
    fetchData();
  }, []);

  const filtered = benhNhans.filter((b) => {
    const hoTen = (b.hoTen ?? '').toString().toLowerCase();
    const maBenhNhan = (b.maBenhNhan ?? '').toString().toLowerCase();
    const keyword = searchTerm.toLowerCase();
    return hoTen.includes(keyword) || maBenhNhan.includes(keyword);
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-5xl p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Danh sách bệnh nhân nội trú
        </h2>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm bệnh nhân..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto max-h-[60vh] border rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Bệnh nhân</th>
                <th className="px-6 py-3">Ngày nhập viện</th>
                <th className="px-6 py-3">Khoa điều trị</th>
                <th className="px-6 py-3">Phòng</th>
                <th className="px-6 py-3">Giường</th>
                <th className="px-6 py-3">Chuẩn đoán</th>
                <th className="px-6 py-3">Trạng thái</th>
                <th className="px-6 py-3 text-center">Chọn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.length > 0 ? (
                filtered.map((b) => (
                  <tr key={b.maNhapVien ?? Math.random()} className="hover:bg-gray-50">
                    <td className="px-6 py-3 flex items-center">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="ml-3 font-medium text-gray-900">{b.hoTen ?? '-'}</span>
                    </td>
                    <td className="px-6 py-3">
                      {b.ngayNhapVien
                        ? new Date(b.ngayNhapVien).toLocaleDateString('vi-VN')
                        : '-'}
                    </td>
                    <td className="px-6 py-3">{b.khoaDieuTri ?? '-'}</td>
                    <td className="px-6 py-3">{b.phong ?? '-'}</td>
                    <td className="px-6 py-3">{b.giuong ?? '-'}</td>
                    <td className="px-6 py-3">{b.chuanDoan ?? '-'}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          b.trangThai === 'Đang điều trị'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {b.trangThai ?? '-'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <button
                        onClick={() => onSelect(b)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-3 py-1 rounded-lg"
                      >
                        Chọn
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500">
                    Không tìm thấy bệnh nhân nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BenhNhanNoiTruModal;
