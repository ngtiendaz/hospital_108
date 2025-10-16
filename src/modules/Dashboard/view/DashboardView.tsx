import React from 'react';
import { Users, UserCheck, DollarSign, TrendingUp, Activity } from 'lucide-react';
import StatsCard from './StatsCard';
import { mockPatients, mockCosts } from '../../../data/mockData';

const Dashboard: React.FC = () => {
  const stats = {
    totalPatients: mockPatients.length,
    treatingPatients: mockPatients.filter(p => p.status === 'treating').length,
    preparingDischarge: mockPatients.filter(p => p.status === 'preparing_discharge').length,
    dischargedPatients: mockPatients.filter(p => p.status === 'discharged').length,
    totalRevenue: mockCosts.reduce((sum, cost) => sum + cost.totalCost, 0),
    pendingPayments: mockCosts.reduce((sum, cost) => sum + cost.remainingPayment, 0),
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const recentPatients = mockPatients.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Tổng bệnh nhân"
          value={stats.totalPatients}
          icon={Users}
          color="emerald"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Đang điều trị"
          value={stats.treatingPatients}
          icon={Activity}
          color="blue"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Chuẩn bị ra viện"
          value={stats.preparingDischarge}
          icon={UserCheck}
          color="orange"
        />
        <StatsCard
          title="Tổng doanh thu"
          value={formatCurrency(stats.totalRevenue)}
          icon={DollarSign}
          color="purple"
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-emerald-500" />
            Phân bố theo khoa
          </h3>
          <div className="space-y-4">
            {['Nội', 'Ngoại', 'Sản', 'Nhi'].map(dept => {
              const count = mockPatients.filter(p => p.department === dept).length;
              const percentage = (count / mockPatients.length) * 100;
              return (
                <div key={dept} className="flex items-center justify-between">
                  <span className="text-gray-600">{dept}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800 w-8">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Patients */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-500" />
            Bệnh nhân mới nhất
          </h3>
          <div className="space-y-3">
            {recentPatients.map(patient => (
              <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{patient.fullName}</p>
                  <p className="text-sm text-gray-500">Khoa {patient.department} - Phòng {patient.roomNumber}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  patient.status === 'treating' ? 'bg-blue-100 text-blue-800' :
                  patient.status === 'preparing_discharge' ? 'bg-orange-100 text-orange-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {patient.status === 'treating' ? 'Điều trị' :
                   patient.status === 'preparing_discharge' ? 'Chuẩn bị ra viện' :
                   'Đã ra viện'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-purple-500" />
          Tổng quan tài chính
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(stats.totalRevenue)}</p>
            <p className="text-gray-600">Tổng doanh thu</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(stats.totalRevenue - stats.pendingPayments)}
            </p>
            <p className="text-gray-600">Đã thanh toán</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{formatCurrency(stats.pendingPayments)}</p>
            <p className="text-gray-600">Còn phải thu</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
