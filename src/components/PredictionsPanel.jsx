import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';
import { FaRobot, FaChartLine } from 'react-icons/fa';

const mockPredictionHistory = [
  { timestamp: '2025-04-10', predicted_quantity: 95 },
  { timestamp: '2025-04-11', predicted_quantity: 102 },
  { timestamp: '2025-04-12', predicted_quantity: 98 },
  { timestamp: '2025-04-13', predicted_quantity: 110 },
  { timestamp: '2025-04-14', predicted_quantity: 120 },
];

const PredictionsPanel = () => {
  const [products, setProducts] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedStore, setSelectedStore] = useState('');
  const [demandResult, setDemandResult] = useState(null);
  const [priceResult, setPriceResult] = useState(null);
  const [inventoryResult, setInventoryResult] = useState(null);
  const [productStoreMap, setProductsStoreMap] = useState({});
  const [lastRunTimestamps, setLastRunTimestamps] = useState({
    demand: null,
    pricing: null,
    inventory: null
  });
  const [isAutoRunEnabled, setIsAutoRunEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const [demandInputs, setDemandInputs] = useState({
    seasonality_factors: 'medium',
    demand_trend: 'stable',
    promotions: 'no',
    price: 100
  });

  const [pricingInputs, setPricingInputs] = useState({
    competitor_prices: 100,
    discounts: 10,
    sales_volume: 1000,
    reviews: 100,
    return_rate: 5,
    storage_cost: 2,
    elasticity_index: 1.2
  });

  const [inventoryInputs, setInventoryInputs] = useState({
    lead_time: 7,
    stockout_freq: 3,
    reorder_point: 50,
    warehouse_cap: 1000,
    fulfillment_time: 5,
    days_until_expiry: 90
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        const productList = res.data.products;
        setProducts(productList);

        const map = {};
        productList.forEach(({ product_id, store_id }) => {
          if (!map[product_id]) map[product_id] = [];
          if (!map[product_id].includes(store_id)) {
            map[product_id].push(store_id);
          }
        });

        setProductsStoreMap(map);
        const defaultProduct = productList[0].product_id;
        const defaultStores = map[defaultProduct] || [];

        setSelectedProduct(defaultProduct);
        setFilteredStores(defaultStores);
        setSelectedStore(defaultStores.length > 0 ? defaultStores[0] : '');
      } catch (err) {
        console.error('Failed to load products:', err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchAutoRun = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/autorun_status');
        setIsAutoRunEnabled(res.data.auto_run);
      } catch (err) {
        console.error('Failed to fetch auto-run status:', err);
      }
    };
    fetchAutoRun();
  }, []);

  const toggleAutoRun = async () => {
    try {
      const newStatus = !isAutoRunEnabled;
      await axios.post('http://localhost:5000/api/set_autorun', { auto_run: newStatus });
      setIsAutoRunEnabled(newStatus);
    } catch (err) {
      console.error("Error updating auto-run status:", err);
    }
  };

  const handleProductChange = (e) => {
    const newProductId = parseInt(e.target.value);
    setSelectedProduct(newProductId);
    const stores = [...new Set(
      products.filter((p) => p.product_id === newProductId).map((p) => p.store_id)
    )];
    setFilteredStores(stores);
    setSelectedStore(stores.length > 0 ? stores[0] : '');
  };

  const handlePredict = async () => {
    if (!selectedProduct || !selectedStore) {
      alert("Please select a product and store.");
      return;
    }

    setLoading(true);
    try {
      const [demand, pricing, inventory] = await Promise.all([
        axios.post('http://localhost:5000/api/predict/demand', demandInputs),
        axios.post('http://localhost:5000/api/predict/pricing', pricingInputs),
        axios.post('http://localhost:5000/api/predict/inventory', inventoryInputs)
      ]);

      setDemandResult(demand.data);
      setPriceResult(pricing.data);
      setInventoryResult(inventory.data);

      setLastRunTimestamps({
        demand: demand.data.timestamp,
        pricing: pricing.data.timestamp,
        inventory: inventory.data.timestamp
      });
    } catch (err) {
      console.error('Prediction error:', err);
      alert('Prediction failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white shadow-xl rounded-lg p-8 space-y-8 border border-gray-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-semibold text-blue-900 tracking-tight flex items-center gap-3">
          <FaChartLine /> ML Predictions
        </h2>
        <button
          onClick={toggleAutoRun}
          className={`px-4 py-2 rounded-md shadow-md text-white font-medium tracking-wide flex items-center gap-2 transition duration-300 ${
            isAutoRunEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-500 hover:bg-gray-600'
          }`}
        >
          <FaRobot />
          {isAutoRunEnabled ? 'Auto-Run ON' : 'Auto-Run OFF'}
        </button>
      </div>

      {/* Product and Store Selectors */}
      <div className="flex flex-col md:flex-row gap-3">
        <select
          className="border border-gray-300 p-2 rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={selectedProduct}
          onChange={handleProductChange}
        >
          {[...new Set(products.map((p) => p.product_id))].map((id) => (
            <option key={id} value={id}>Product {id}</option>
          ))}
        </select>
        <select
          className="border border-gray-300 p-2 rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
        >
          {filteredStores.length > 0
            ? filteredStores.map((id) => <option key={id} value={id}>Store {id}</option>)
            : <option value="">No stores available</option>}
        </select>
      </div>

      {/* Input Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Demand */}
        <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm hover:shadow-md transition">
          <h3 className="font-bold mb-3 text-blue-700">Demand Inputs</h3>
          <select
            className="border border-gray-300 p-2 w-full rounded-md mb-2"
            value={demandInputs.seasonality_factors}
            onChange={(e) => setDemandInputs({ ...demandInputs, seasonality_factors: e.target.value })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="holiday">Holiday</option>
          </select>
          <select
            className="border border-gray-300 p-2 w-full rounded-md mb-2"
            value={demandInputs.demand_trend}
            onChange={(e) => setDemandInputs({ ...demandInputs, demand_trend: e.target.value })}
          >
            <option value="increasing">Increasing</option>
            <option value="stable">Stable</option>
            <option value="decreasing">Decreasing</option>
          </select>
          <select
            className="border border-gray-300 p-2 w-full rounded-md mb-2"
            value={demandInputs.promotions}
            onChange={(e) => setDemandInputs({ ...demandInputs, promotions: e.target.value })}
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <input
            type="number"
            className="border border-gray-300 p-2 w-full rounded-md"
            value={demandInputs.price}
            onChange={(e) => setDemandInputs({ ...demandInputs, price: parseFloat(e.target.value) })}
          />
        </div>

        {/* Pricing */}
        <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm hover:shadow-md transition">
          <h3 className="font-bold mb-3 text-green-700">Pricing Inputs</h3>
          {Object.keys(pricingInputs).map((key) => (
            <input
              key={key}
              type="number"
              className="border border-gray-300 p-2 w-full rounded-md mb-2"
              placeholder={key.replace(/_/g, " ")}
              value={pricingInputs[key]}
              onChange={(e) => setPricingInputs({ ...pricingInputs, [key]: parseFloat(e.target.value) })}
            />
          ))}
        </div>

        {/* Inventory */}
        <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm hover:shadow-md transition">
          <h3 className="font-bold mb-3 text-yellow-700">Inventory Inputs</h3>
          {Object.keys(inventoryInputs).map((key) => (
            <input
              key={key}
              type="number"
              className="border border-gray-300 p-2 w-full rounded-md mb-2"
              placeholder={key.replace(/_/g, " ")}
              value={inventoryInputs[key]}
              onChange={(e) => setInventoryInputs({ ...inventoryInputs, [key]: parseFloat(e.target.value) })}
            />
          ))}
        </div>
      </div>

      {/* Predict Button */}
      <button
        onClick={handlePredict}
        className={`mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Running..." : "Run Prediction"}
      </button>

      {/* Results */}
      <div className="grid md:grid-cols-3 gap-4">
        {demandResult && (
          <div className="bg-blue-100 p-4 rounded shadow">
            <h3 className="font-bold text-blue-800">Demand Forecast</h3>
            <p>Quantity: <strong>{demandResult.predicted_demand}</strong></p>
          </div>
        )}
        {priceResult && (
          <div className="bg-green-100 p-4 rounded shadow">
            <h3 className="font-bold text-green-800">Pricing Optimization</h3>
            <p>Price: <strong>${priceResult.predicted_price}</strong></p>
          </div>
        )}
        {inventoryResult && (
          <div className="bg-yellow-100 p-4 rounded shadow">
            <h3 className="font-bold text-yellow-800">Inventory Optimization</h3>
            <p>Stock Level: <strong>{inventoryResult.predicted_stock_level}</strong></p>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="bg-white border border-gray-200 p-4 rounded-lg shadow">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockPredictionHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="predicted_quantity" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PredictionsPanel;