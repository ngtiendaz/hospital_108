'use client';
import React, { useEffect, useState } from 'react';
import { Plus, Search, User } from 'lucide-react';
import { BenhNhan } from '../model/patientModel';
import { patientController } from '../controller/patientController';
import PatientModal from './PatientModalView';

const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<BenhNhan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<BenhNhan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Tách riêng hàm fetchPatients để tái dùng
  const fetchPatients = async () => {
    const data = await patientController.getAll();
    setPatients(data);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // ✅ Lọc danh sách bệnh nhân
  const filteredPatients = patients.filter(
    (p) =>
      p.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.soCMND.includes(searchTerm)
  );

  // ✅ Khi bấm nút "Thêm nội trú"
  const handleAdd = (patient: BenhNhan) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  // ✅ Reload danh sách sau khi thêm
  const handleSave = async () => {
    await fetchPatients();
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm bệnh nhân..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600">Tổng bệnh nhân</p>
        <p className="text-2xl font-bold text-gray-800">{filteredPatients.length}</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bệnh nhân</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày sinh</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giới tính</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CCCD</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Địa chỉ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thêm nội trú</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr key={patient.maBenhNhan} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap flex items-center">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{patient.hoTen}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(patient.ngaySinh).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {patient.gioiTinh === 'M' ? 'Nam' : 'Nữ'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{patient.soCMND}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{patient.diaChi}</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <button
                      onClick={() => handleAdd(patient)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg flex items-center space-x-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Thêm nội trú</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedPatient && (
        <PatientModal
          patient={selectedPatient}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PatientList;
