import React from "react";
import DemandTable from "./DemandTable";
import InventoryTable from "./InventoryTable";
import PricingTable from "./PricingTable";
import PredictionsPanel from './PredictionsPanel';
import PredictionsChart from './PredictionsChart';
import AutoRunToggle from './AutoRunToggle';
import PricingPredictor from "./PricingPredictor";

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-10">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-4">
        Retail AI Dashboard
      </h1>

      {/* Grid of Forecasting Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Demand Forecasting</h2>
          <DemandTable />
        </section>

        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Inventory Monitoring</h2>
          <InventoryTable />
        </section>

        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Pricing Optimization</h2>
          <PricingTable />
        </section>
      </div>

      {/* Prediction and Tuning Section */}
      <div className="space-y-6">
        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Predictions Overview</h2>
          <PredictionsPanel />
        </section>

        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Prediction Chart</h2>
          <PredictionsChart />
        </section>

        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Automation & Price Tuning</h2>
          <AutoRunToggle />
          <PricingPredictor />
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;