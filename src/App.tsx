import React, { useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './modules/Dashboard/view/DashboardView';
import PatientList from './modules/Patients/view/PatientListView';
import MedicalRecordList from './modules/MedicalRecords/view/MedicalRecordListView';
import CostList from './modules/Costs/view/CostListView';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getTabTitle = () => {
    const titles = {
      dashboard: 'Dashboard',
      patients: 'Quản lý Bệnh nhân',
      records: 'Hồ sơ Bệnh án Điện tử',
      costs: 'Chi phí & Viện phí'
    };
    return titles[activeTab as keyof typeof titles] || 'Dashboard';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'patients':
        return <PatientList />;
      case 'records':
        return <MedicalRecordList />;
      case 'costs':
        return <CostList />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header setIsOpen={setSidebarOpen} title={getTabTitle()} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;