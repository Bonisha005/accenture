import React, { useState } from "react";
import axios from "axios";

const RunAgents = () => {
  const [logs, setLogs] = useState({});
  const [loading, setLoading] = useState({});

  const handleRun = async (agent) => {
    setLoading((prev) => ({ ...prev, [agent]: true }));
    try {
      const res = await axios.get(`http://localhost:5000/run/${agent}`);
      setLogs((prevLogs) => ({
        ...prevLogs,
        [agent]: res.data.message || "Ran successfully",
      }));
    } catch (err) {
      setLogs((prevLogs) => ({
        ...prevLogs,
        [agent]: `Error: ${err.response?.data?.error || err.message}`,
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [agent]: false }));
    }
  };

  const agents = [
    { id: "store", name: "Store Agent", color: "bg-blue-600" },
    { id: "warehouse", name: "Warehouse Agent", color: "bg-green-600" },
    { id: "forecast", name: "Forecast Agent", color: "bg-yellow-500 text-black" },
    { id: "pricing", name: "Pricing Agent", color: "bg-purple-600" },
    { id: "orchestrator", name: "Orchestrator Agent", color: "bg-red-600" },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Run Agents</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent) => (
          <div key={agent.id} className="space-y-2">
            <button
              className={`${agent.color} px-4 py-2 rounded text-white font-medium hover:opacity-90 w-full`}
              onClick={() => handleRun(agent.id)}
              disabled={loading[agent.id]}
            >
              {loading[agent.id] ? `Running ${agent.name}...` : agent.name}
            </button>
            {logs[agent.id] && (
              <div className="text-sm bg-gray-100 p-3 rounded border text-gray-700">
                <strong>Output:</strong> {logs[agent.id]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RunAgents;