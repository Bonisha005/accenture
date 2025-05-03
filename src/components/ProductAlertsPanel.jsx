import { useEffect, useState } from 'react';
import axios from 'axios';

const ProductAlertsPanel = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/alerts');
        setAlerts(res.data.alerts);
      } catch (err) {
        console.error('Failed to fetch alerts:', err);
      }
    };

    fetchAlerts();
  }, []);

  return (
    <div className="bg-yellow-100 p-4 rounded shadow mb-6">
      <h2 className="text-lg font-bold text-yellow-800 mb-2">Product Alerts</h2>
      {alerts.length === 0 ? (
        <p className="text-gray-700">No alerts at this time.</p>
      ) : (
        <ul className="space-y-2">
          {alerts.map((alert, idx) => (
            <li key={idx} className="bg-white border border-yellow-300 p-3 rounded shadow-sm">
              <strong>{alert.type}</strong> - Product <span className="font-mono">{alert.product_id}</span> @ Store <span className="font-mono">{alert.store_id}</span><br />
              <span className="text-sm text-gray-600">{alert.message}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductAlertsPanel;