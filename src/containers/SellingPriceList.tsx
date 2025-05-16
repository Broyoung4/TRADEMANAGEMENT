// SellingPriceList.js
"use client";
import React, { useState, useEffect } from "react";

const SellingPriceList = ({ inventory, onBack, onUpdatePrice, formatCurrency, isDarkMode }) => { // Added isDarkMode
  const [priceInputs, setPriceInputs] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const initialPrices = {};
    if (inventory) { // Ensure inventory is not null/undefined before iterating
      inventory.forEach(item => {
        initialPrices[item._id] = item.defaultSellingPricePerUnit ? String(item.defaultSellingPricePerUnit) : "";
      });
    }
    setPriceInputs(initialPrices);
  }, [inventory]);

  const handlePriceChange = (itemId, value) => {
    setPriceInputs(prev => ({ ...prev, [itemId]: value }));
  };

  const handleSavePrice = async (itemId) => {
    const newPriceStr = priceInputs[itemId];
    const success = await onUpdatePrice(itemId, newPriceStr);
    if (success) {
      // Feedback is handled by onUpdatePrice
    }
  };

  // This check should come after hooks, which it does.
  // And inventory prop should be checked before trying to filter.
  const filteredInventory = inventory ? inventory.filter(item =>
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Initial loading state or if inventory is null/undefined
  if (!inventory) {
    return (
      <div className={`p-4 md:p-8 font-sans min-h-screen ${isDarkMode ? "bg-gray-900 text-gray-300" : "bg-slate-50 text-slate-900"}`}>
        <header className="mb-10">
          <h1 className={`text-3xl lg:text-4xl font-bold ${isDarkMode ? "text-orange-400" : "text-orange-600"}`}>Manage Selling Prices</h1>
          <button
            onClick={onBack}
            className={`mt-4 font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out ${isDarkMode ? "bg-sky-600 hover:bg-sky-700 text-white" : "bg-sky-600 hover:bg-sky-700 text-white"}`}
          >
            Back to Dashboard
          </button>
        </header>
        <p className={isDarkMode ? "text-slate-400" : "text-slate-500"}>Loading inventory...</p>
      </div>
    );
  }

  return (
    <div className={`p-4 md:p-8 font-sans min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-gray-900 text-gray-200" : "bg-slate-50 text-slate-900"}`}>
      <header className="mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <h1 className={`text-3xl lg:text-4xl font-bold ${isDarkMode ? "text-orange-400" : "text-orange-600"}`}>Manage Item Selling Prices</h1>
          <button
            onClick={onBack}
            className={`mt-4 sm:mt-0 font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out ${isDarkMode ? "bg-sky-600 hover:bg-sky-700 text-white" : "bg-sky-600 hover:bg-sky-700 text-white"}`}
          >
            Back to Dashboard
          </button>
        </div>
        <p className={`${isDarkMode ? "text-slate-400" : "text-slate-600"} mt-2`}>
          Set or update the default selling price (per selling unit) for your inventory items.
        </p>
      </header>

      <section className={`${isDarkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow-lg transition-colors duration-300`}>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search items by name..."
            className={`w-full p-3 border rounded-lg transition-colors duration-200 ${isDarkMode ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500" : "border-slate-300 placeholder-slate-400 focus:ring-orange-500 focus:border-orange-500"}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {inventory.length === 0 ? (
            <p className={`${isDarkMode ? "text-slate-400" : "text-slate-500"} py-4 text-center`}>No inventory items found. Add items in the dashboard.</p>
        ) : filteredInventory.length === 0 && searchTerm ? (
             <p className={`${isDarkMode ? "text-slate-400" : "text-slate-500"} py-4 text-center`}>No items match your search &quot;{searchTerm}&quot;.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className={`min-w-full divide-y ${isDarkMode ? "divide-gray-700" : "divide-slate-300"}`}>
              <thead className={`${isDarkMode ? "bg-gray-700" : "bg-slate-100"}`}>
                <tr>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>Item Name</th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>Selling Unit</th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>Current Cost (per Selling Unit)</th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>Current Selling Price</th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>New Selling Price</th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`${isDarkMode ? "bg-gray-800 divide-gray-700" : "bg-white divide-slate-200"}`}>
                {filteredInventory.map((item) => {
                  const costPricePerStockUnit = Number(item.price) || 0;
                  const conversionFactor = Number(item.conversionFactor) || 1;
                  const costPricePerSellingUnit = costPricePerStockUnit / conversionFactor;

                  return (
                    <tr key={item._id} className={`${isDarkMode ? "hover:bg-gray-750" : "hover:bg-slate-50"} transition-colors duration-150`}>
                      <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? "text-gray-100" : "text-slate-900"}`}>{item.itemName}</td>
                      <td className={`px-4 py-4 whitespace-nowrap text-sm ${isDarkMode ? "text-gray-300" : "text-slate-500"}`}>{item.sellingUnit || item.stockUnit}</td>
                      <td className={`px-4 py-4 whitespace-nowrap text-sm ${isDarkMode ? "text-gray-300" : "text-slate-500"}`}>{formatCurrency(costPricePerSellingUnit)}</td>
                      <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-slate-500"}`}>{item.defaultSellingPricePerUnit > 0 ? formatCurrency(item.defaultSellingPricePerUnit) : "N/A"}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          value={priceInputs[item._id] || ""}
                          onChange={(e) => handlePriceChange(item._id, e.target.value)}
                          placeholder="Set new price"
                          min="0"
                          step="0.01"
                          className={`p-2 border rounded-lg w-36 transition-colors duration-200 ${isDarkMode ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500" : "border-slate-300 placeholder-slate-400 focus:ring-orange-500 focus:border-orange-500"}`}
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleSavePrice(item._id)}
                          disabled={!priceInputs[item._id] || parseFloat(priceInputs[item._id]) < 0 || priceInputs[item._id] === String(item.defaultSellingPricePerUnit)}
                          className={`font-semibold py-2 px-4 rounded-lg shadow-sm transition duration-150 ${isDarkMode ? "text-white bg-sky-500 hover:bg-sky-600 disabled:bg-gray-600 disabled:text-gray-400" : "text-white bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed"}`}
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default SellingPriceList;