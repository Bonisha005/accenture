import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer
} from 'recharts';

function PredictionsChart() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/logs?agent=forecast_agent&limit=50');
        const parsed = res.data.logs.map(log => {
          try {
            const parsedInput = JSON.parse(log.input);
            const parsedOutput = log.output.match(/\d+/g);
            return {
              timestamp: new Date(log.timestamp).toLocaleTimeString(),
              product_id: parsedInput.product_id,
              store_id: parsedInput.store_id,
              predicted_quantity: parsedOutput ? parseInt(parsedOutput[0]) : 0
            };
          } catch (err) {
            console.error("Parse error in log:", log, err);
            return null;
          }
        }).filter(Boolean);

        setLogs(parsed);
      } catch (err) {
        console.error("Error loading prediction logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Demand Forecast Trend</h2>
      {loading ? (
        <p className="text-gray-500">Loading predictions...</p>
      ) : logs.length === 0 ? (
        <p className="text-gray-500">No prediction data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={logs} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="predicted_quantity"
              stroke="#6366f1"
              strokeWidth={2}
              name="Predicted Quantity"
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default PredictionsChart;