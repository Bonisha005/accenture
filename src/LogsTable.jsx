import { useEffect, useState } from 'react';
import axios from 'axios';

function LogsTable({ refreshKey }) {
  const [logs, setLogs] = useState([]);
  const [agentFilter, setAgentFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const logsPerPage = 10;

  const fetchLogs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/logs');
      setLogs(res.data.logs);
    } catch (err) {
      console.error('Error fetching logs:', err);
    }
  };

  // polling every 5 seconds + refresh trigger
  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, [refreshKey]);

  const handleDelete = async () => {
    try {
      await axios.delete('http://localhost:5000/api/logs/cleanup');
      fetchLogs(); // reload after deletion
    } catch (err) {
      console.error('Failed to clear logs:', err);
    }
  };

  const filteredLogs = logs
    .filter(log =>
      log.agent_name.toLowerCase().includes(agentFilter.toLowerCase()) &&
      (log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.details.toLowerCase().includes(search.toLowerCase()))
    );

  const paginatedLogs = filteredLogs.slice(
    (page - 1) * logsPerPage,
    page * logsPerPage
  );

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Agent Logs</h2>
        <div className="flex space-x-2">
          <input
            className="border px-2 py-1"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            className="border px-2 py-1"
            placeholder="Filter by Agent"
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
          />
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Clear Logs
          </button>
        </div>
      </div>

      <table className="w-full text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Timestamp</th>
            <th className="border p-2">Agent</th>
            <th className="border p-2">Action</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Details</th>
          </tr>
        </thead>
        <tbody>
          {paginatedLogs.map((log, i) => (
            <tr key={i}>
              <td className="border p-2">{log.timestamp}</td>
              <td className="border p-2">{log.agent_name}</td>
              <td className="border p-2">{log.action}</td>
              <td className="border p-2">{log.status}</td>
              <td className="border p-2">{log.details}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between items-center">
        <span>
          Page {page} of {totalPages}
        </span>
        <div>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="mr-2 px-2 py-1 border rounded"
          >
            Prev
          </button>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-2 py-1 border rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogsTable;