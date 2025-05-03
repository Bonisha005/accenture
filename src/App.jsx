import { useState } from 'react';
import './App.css';
import './index.css';
import Sidebar from './components/Sidebar';
import LogsTable from './components/LogsTable';
import DemandTable from './components/DemandTable';
import InventoryTable from './components/InventoryTable';
import PricingTable from './components/PricingTable';
import UploadCSV from './components/UploadCSV';
import RunAgents from './components/RunAgents';
import PredictionsPanel from './components/PredictionsPanel';
import ProductAlertsPanel from './components/ProductAlertsPanel';
import DashboardPage from './components/DashboardPage';
import RoleSwitcher from './components/RoleSwitcher';
import ModelVersionsPanel from './components/ModelVersionsPanel';

import { FaBars } from 'react-icons/fa';
import { UserProvider } from './context/UserContext';

function App() {
  const [section, setSection] = useState('logs');
  const [showSidebar, setShowSidebar] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAgentComplete = () => {
    setRefreshKey(prev => prev + 1);
  };

  const renderSection = () => {
    switch (section) {
      case 'upload':
        return <UploadCSV />;
      case 'runAgents':
        return <RunAgents onAgentComplete={handleAgentComplete} />;
      case 'predictions':
        return <PredictionsPanel />;
      case 'demand':
        return <DemandTable refreshKey={refreshKey} />;
      case 'inventory':
        return <InventoryTable refreshKey={refreshKey} />;
      case 'pricing':
        return <PricingTable refreshKey={refreshKey} />;
      default:
        return <LogsTable refreshKey={refreshKey} />;
    }
  };

  return (
    <UserProvider>
      <div className="flex bg-gray-100 min-h-screen">
        <Sidebar
          setSection={setSection}
          current={section}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
        />

        <div className="flex-1 ml-0 md:ml-64">
          {/* Mobile Header */}
          <div className="md:hidden bg-white p-4 shadow flex items-center">
            <button
              onClick={() => setShowSidebar(true)}
              className="text-gray-700 text-xl"
            >
              <FaBars />
            </button>
            <h2 className="ml-4 text-lg font-semibold">Retail Agent Dashboard</h2>
          </div>

          {/* Page Header */}
          <header className="bg-indigo-700 text-white text-center py-6 shadow">
            <h1 className="text-3xl font-bold">AI-Powered Retail Dashboard</h1>
            <p className="text-sm font-light mt-1">Forecast | Optimize | Automate</p>
          </header>

          <main className="p-6 space-y-6">
            <RoleSwitcher />
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <UploadCSV />
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <RunAgents onAgentComplete={handleAgentComplete} />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <ProductAlertsPanel />
              <PredictionsPanel />
              <ModelVersionsPanel />
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              {renderSection()}
            </div>
          </main>
        </div>
      </div>
    </UserProvider>
  );
}

export default App;