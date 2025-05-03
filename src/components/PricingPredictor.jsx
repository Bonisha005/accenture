import React, { useState } from 'react';
import axios from 'axios';

function PricingPredictor() {
  const [formData, setFormData] = useState({
    competitor_prices: '',
    discounts: '',
    sales_volume: '',
    reviews: '',
    return_rate: '',
    storage_cost: '',
    elasticity_index: ''
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/api/predict/pricing', {
        ...formData,
        competitor_prices: parseFloat(formData.competitor_prices),
        discounts: parseFloat(formData.discounts),
        sales_volume: parseFloat(formData.sales_volume),
        reviews: parseFloat(formData.reviews),
        return_rate: parseFloat(formData.return_rate),
        storage_cost: parseFloat(formData.storage_cost),
        elasticity_index: parseFloat(formData.elasticity_index)
      });
      setPrediction(response.data.predicted_price);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-md w-full max-w-md">
      <h2 className="text-lg font-bold mb-4">Predict Price</h2>
      {Object.keys(formData).map((field) => (
        <div key={field} className="mb-2">
          <label className="block capitalize">{field.replace(/_/g, ' ')}</label>
          <input
            type="number"
            step="any"
            name={field}
            value={formData[field]}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
      >
        Predict
      </button>

      {prediction && (
        <div className="mt-4 text-green-600">
          Predicted Price: <strong>{prediction}</strong>
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-600">
          Error: {error}
        </div>
      )}
    </div>
  );
}

export default PricingPredictor;