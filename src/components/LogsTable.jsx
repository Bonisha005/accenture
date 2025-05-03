import React, { useEffect, useState } from 'react';

function LogsTable() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/logs')  // Make sure the port matches Flask!
      .then((res) => res.json())
      .then((data) => setLogs(data.logs))
      .catch((err) => console.error('Error fetching logs:', err));
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Agent Logs</h2>
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Agent</th>
            <th className="p-2">Action</th>
            <th className="p-2">Message</th>
            <th className="p-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td className="p-2">{log.agent_name}</td>
              <td className="p-2">{log.action}</td>
              <td className="p-2">{log.message}</td>
              <td className="p-2">{log.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LogsTable;