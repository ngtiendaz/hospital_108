import React, { useState } from 'react';
import { Plus, Search, FileText, User, Calendar } from 'lucide-react';
import { mockMedicalRecords, mockPatients } from '../../data/mockData';
import { MedicalRecord } from '../../types';

const MedicalRecordList: React.FC = () => {
  const [records] = useState<MedicalRecord[]>(mockMedicalRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  const filteredRecords = records.filter(record => {
    const patient = mockPatients.find(p => p.id === record.patientId);
    const patientName = patient?.fullName || '';
    return patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           record.recordCode.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getPatientName = (patientId: string) => {
    const patient = mockPatients.find(p => p.id === patientId);
    return patient?.fullName || 'N/A';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
        
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Thêm hồ sơ mới</span>
        </button>
      </div>

      {/* Records Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRecords.map((record) => (
          <div
            key={record.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
            onClick={() => setSelectedRecord(record)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{record.recordCode}</h3>
                  <p className="text-sm text-gray-500">Mã bệnh án</p>
                </div>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Đang điều trị
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <User className="w-4 h-4 mr-2" />
                <span>{getPatientName(record.patientId)}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Ngày tạo: {formatDate(record.createdDate)}</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-800 mb-1">Chẩn đoán ban đầu:</p>
              <p className="text-sm text-gray-600 line-clamp-2">{record.initialDiagnosis}</p>
            </div>

            <div className="mt-3 text-xs text-gray-500 flex justify-between">
              <span>Cập nhật: {formatDate(record.lastUpdated)}</span>
              <span>Nhấn để xem chi tiết</span>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed View Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedRecord.recordCode}</h2>
                  <p className="text-gray-600">Bệnh nhân: {getPatientName(selectedRecord.patientId)}</p>
                </div>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Thông tin cơ bản</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Ngày tạo</label>
                      <p className="text-gray-800">{formatDate(selectedRecord.createdDate)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Cập nhật lần cuối</label>
                      <p className="text-gray-800">{formatDate(selectedRecord.lastUpdated)}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Tiền sử bệnh lý</h3>
                  <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
                    {selectedRecord.medicalHistory}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Chẩn đoán ban đầu</h3>
                <p className="text-gray-700 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  {selectedRecord.initialDiagnosis}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Phác đồ điều trị</h3>
                <p className="text-gray-700 bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  {selectedRecord.treatmentPlan}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Kết quả cận lâm sàng</h3>
                <div className="space-y-2">
                  {selectedRecord.testResults.map((result, index) => (
                    <div key={index} className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                      <p className="text-gray-700 text-sm">{result}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Ghi chú bác sĩ</h3>
                  <p className="text-gray-700 text-sm bg-purple-50 p-3 rounded-lg">
                    {selectedRecord.doctorNotes}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Ghi chú điều dưỡng</h3>
                  <p className="text-gray-700 text-sm bg-orange-50 p-3 rounded-lg">
                    {selectedRecord.nurseNotes}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Đóng
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecordList;