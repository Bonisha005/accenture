import React, { useEffect, useState } from "react";
import axios from "axios";

const ModelVersionsPanel = () => {
  const [versions, setVersions] = useState([]);
  const [newVersion, setNewVersion] = useState({
    model_name: "",
    version: "",
    mse: "",
    r_squared: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchVersions();
  }, []);

  const fetchVersions = async () => {
    try {
      const response = await axios.get("/api/model_versions");
      const versionsData = response.data.model_versions ?? [];
      setVersions(versionsData);
    } catch (err) {
      console.error("Error fetching model versions", err);
      setVersions([]); // fallback to empty array on error
    }
  };

  const handleInputChange = (e) => {
    setNewVersion({ ...newVersion, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/model_versions", newVersion);
      setMessage("Model version added!");
      setNewVersion({ model_name: "", version: "", mse: "", r_squared: "" });
      fetchVersions();
    } catch (err) {
      console.error("Error adding model version", err);
      setMessage("Failed to add version.");
    }
  };

  return (
    <div className="bg-white rounded shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Model Versions</h2>

      <form onSubmit={handleSubmit} className="mb-4 grid grid-cols-2 gap-4">
        <input
          type="text"
          name="model_name"
          value={newVersion.model_name}
          onChange={handleInputChange}
          placeholder="Model Name"
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="text"
          name="version"
          value={newVersion.version}
          onChange={handleInputChange}
          placeholder="Version"
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="number"
          step="0.0001"
          name="mse"
          value={newVersion.mse}
          onChange={handleInputChange}
          placeholder="MSE"
          className="border rounded px-3 py-2"
        />
        <input
          type="number"
          step="0.0001"
          name="r_squared"
          value={newVersion.r_squared}
          onChange={handleInputChange}
          placeholder="R² Score"
          className="border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Model Version
        </button>
        {message && (
          <div className="col-span-2 text-green-600 text-sm mt-1">{message}</div>
        )}
      </form>

      <table className="w-full table-auto border-collapse mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">Model</th>
            <th className="border px-4 py-2">Version</th>
            <th className="border px-4 py-2">MSE</th>
            <th className="border px-4 py-2">R²</th>
            <th className="border px-4 py-2">Created At</th>
          </tr>
        </thead>
        <tbody>
        {Array.isArray(versions) && versions.map((v, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{v.model_name}</td>
                <td className="border px-4 py-2">{v.version}</td>
                <td className="border px-4 py-2">{v.mse ?? "-"}</td>
                <td className="border px-4 py-2">{v.r_squared ?? "-"}</td>
                <td className="border px-4 py-2">{new Date(v.created_at).toLocaleString()}</td>
            </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default ModelVersionsPanel;