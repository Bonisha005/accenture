import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DemandTable = ({refreshKey }) => {
  const [demandData, setDemandData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/demand')
      .then(response => setDemandData(response.data))
      .catch(error => console.error('Error fetching demand data:', error));
  }, [refreshKey]);
  console.log("Demand data:", demandData);
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Demand Forecasting</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {demandData.length > 0 && Object.keys(demandData[0]).map((key) => (
                <th key={key} className="px-4 py-2 border">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {demandData.map((row, idx) => (
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

export default DemandTable;