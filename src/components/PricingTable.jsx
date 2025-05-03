import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PricingTable = ({ refreshKey }) => {
  const [pricingData, setPricingData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/pricing')
      .then(response => setPricingData(response.data))
      .catch(error => console.error('Error fetching pricing data:', error));
  }, [refreshKey]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Pricing Optimization</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {pricingData.length > 0 && Object.keys(pricingData[0]).map((key) => (
                <th key={key} className="px-4 py-2 border">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pricingData.map((row, idx) => (
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

export default PricingTable;