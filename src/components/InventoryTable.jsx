import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InventoryTable = ({ refreshKey }) => {
  const [inventoryData, setInventoryData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/inventory')
      .then(response => setInventoryData(response.data))
      .catch(error => console.error('Error fetching inventory data:', error));
  }, [refreshKey]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Inventory Monitoring</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {inventoryData.length > 0 && Object.keys(inventoryData[0]).map((key) => (
                <th key={key} className="px-4 py-2 border">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inventoryData.map((row, idx) => (
              <tr key={idx}>
                {Object.values(row).map((val, i) => (
                  <td key={i} className="px-4 py-2 border">{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;