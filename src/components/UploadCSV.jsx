import React, { useState } from "react";
import axios from "axios";

const UploadCSV = () => {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("demand"); // default
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", fileType);

    try {
      const response = await axios.post("http://localhost:5000/upload-csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus(`Success: ${response.data.message}`);
    } catch (err) {
      setStatus(`Error: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className="p-4 border rounded bg-white shadow mb-6">
      <h2 className="text-lg font-semibold mb-2">Upload CSV File</h2>
      
      <div className="mb-2">
        <label className="mr-2">Select CSV Type:</label>
        <select
          className="border rounded p-1"
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
        >
          <option value="demand">Demand Forecasting</option>
          <option value="inventory">Inventory Monitoring</option>
          <option value="pricing">Pricing Optimization</option>
        </select>
      </div>

      <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
      <button className="ml-2 px-4 py-1 bg-blue-500 text-white rounded" onClick={handleUpload}>
        Upload
      </button>
      {status && <p className="mt-2 text-sm">{status}</p>}
    </div>
  );
};

export default UploadCSV;