import React from 'react';
import { FaTimes, FaListAlt, FaChartLine, FaBoxes, FaMoneyBillWave } from 'react-icons/fa';

const Sidebar = ({ setSection, current, showSidebar, setShowSidebar }) => {
  const navItems = [
    { key: 'logs', label: 'Logs', icon: <FaListAlt /> },
    { key: 'demand', label: 'Demand', icon: <FaChartLine /> },
    { key: 'inventory', label: 'Inventory', icon: <FaBoxes /> },
    { key: 'pricing', label: 'Pricing', icon: <FaMoneyBillWave /> }
  ];

  const renderNavItem = (item) => (
    <button
      key={item.key}
      onClick={() => setSection(item.key)}
      className={`flex items-center space-x-2 mb-2 px-4 py-2 rounded text-left transition-all ${
        current === item.key
          ? 'bg-blue-600 text-white'
          : 'bg-white hover:bg-blue-200 text-blue-800'
      }`}
    >
      {item.icon}
      <span>{item.label}</span>
    </button>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-blue-100 h-screen p-6 shadow-md">
        <h2 className="text-xl font-bold mb-6">AI-Powered Retail Dashboard</h2>
        {navItems.map(renderNavItem)}
      </div>

      {/* Mobile Sidebar */}
      {showSidebar && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
          onClick={() => setShowSidebar(false)}
        >
          <div
            className="w-64 bg-white h-full p-6 shadow-lg relative z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Menu</h2>
              <button onClick={() => setShowSidebar(false)} className="text-xl">
                <FaTimes />
              </button>
            </div>
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setSection(item.key);
                  setShowSidebar(false);
                }}
                className={`flex items-center space-x-2 mb-2 px-4 py-2 rounded text-left transition-all ${
                  current === item.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;