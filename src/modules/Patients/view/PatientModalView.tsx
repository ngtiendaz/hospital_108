import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { BenhNhan } from '../model/patientModel';
import { patientController } from '../controller/patientController';

interface PatientModalProps {
  patient: BenhNhan | null;
  onSave: () => void; // sau khi thêm xong, reload lại danh sách
  onClose: () => void;
}

const PatientModal: React.FC<PatientModalProps> = ({ patient, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    maBenhNhan: '',
    hoTen: '',
    ngaySinh: '',
    gioiTinh: '',
    soCMND: '',
    diaChi: '',
    ngayNhapVien: '',
    khoaDieuTri: '',
    phong: '',
    giuong: '',
    chuanDoan: '',
    maBacSi: '',
  });

  useEffect(() => {
    if (patient) {
      setFormData(prev => ({
        ...prev,
        ...patient,
        ngayNhapVien: new Date().toISOString().split('T')[0],
      }));
    }
  }, [patient]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Gom đúng dữ liệu cần gửi cho API nội trú
    const inpatientData = {
      maBenhNhan: formData.maBenhNhan,
      ngayNhapVien: formData.ngayNhapVien,
      khoaDieuTri: formData.khoaDieuTri,
      phong: formData.phong,
      giuong: formData.giuong,
      chuanDoan: formData.chuanDoan,
      maBacSi: formData.maBacSi,
    };

    const success = await patientController.addInpatient(inpatientData);
    if (success) {
      alert('✅ Thêm bệnh nhân nội trú thành công!');
      onSave(); // gọi reload danh sách
      onClose(); // đóng modal
    } else {
      alert('❌ Có lỗi khi thêm bệnh nhân nội trú!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Thêm bệnh nhân nội trú</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Thông tin có sẵn */}
          {patient && (
            <>
              {['maBenhNhan', 'hoTen', 'ngaySinh', 'gioiTinh', 'soCMND', 'diaChi'].map(field => (
                <div key={field}>
                  <label className="block text-sm text-gray-600 capitalize">{field}</label>
                  <input
                    type="text"
                    name={field}
                    value={(formData as any)[field]}
                    readOnly
                    className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                  />
                </div>
              ))}
            </>
          )}

          {/* Các trường nhập thêm */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Ngày nhập viện *</label>
            <input
              type="date"
              name="ngayNhapVien"
              value={formData.ngayNhapVien}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Khoa điều trị *</label>
            <input
              type="text"
              name="khoaDieuTri"
              value={formData.khoaDieuTri}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="VD: Nội tổng hợp"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Phòng *</label>
              <input
                type="text"
                name="phong"
                value={formData.phong}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Giường *</label>
              <input
                type="text"
                name="giuong"
                value={formData.giuong}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Chuẩn đoán *</label>
            <input
              type="text"
              name="chuanDoan"
              value={formData.chuanDoan}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mã bác sĩ *</label>
            <input
              type="text"
              name="maBacSi"
              value={formData.maBacSi}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Thêm bệnh nhân nội trú
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientModal;
