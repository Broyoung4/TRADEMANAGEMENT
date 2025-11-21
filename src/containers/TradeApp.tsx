"use client";
import React, { useState, useEffect } from "react";
import AnalyticsPage from "./AnalyticsPage"; // Assuming this exists
import SellingPriceList from "./SellingPriceList"; // Assuming this exists

// Helper to format currency
const formatCurrency = (amount) => {
  if (typeof amount !== "number" || isNaN(amount)) {
    return "N/A";
  }
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
};

export default function TradeApp() {
  const [inventory, setInventory] = useState([]);
  const [sales, setSales] = useState([]);
  const [currentView, setCurrentView] = useState("dashboard");
  const [inventorySearchTerm, setInventorySearchTerm] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode state

  // Form state for inventory
  const [itemNamed, setItemNamed] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [itemCostPrice, setItemCostPrice] = useState("");
  const [itemStockUnit, setItemStockUnit] = useState("");
  const [itemSellingUnit, setItemSellingUnit] = useState("");
  const [itemConversionFactor, setItemConversionFactor] = useState("1");
  const [itemDefaultSellingPrice, setItemDefaultSellingPrice] = useState("");

  const [editingItemId, setEditingItemId] = useState(null);

  // Form state for sales
  const [salesSearchTerm, setSalesSearchTerm] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [saleQuantity, setSaleQuantity] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");

  const [totalProfit, setTotalProfit] = useState(0);

  // Effect to apply dark mode class to HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Save theme preference to local storage
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    // Check local storage for saved theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false); // Default to light
    }

    const fetchData = async () => {
      try {
        const inventoryResponse = await fetch("/api/inventory");
        if (!inventoryResponse.ok)
          throw new Error(
            `Failed to fetch inventory: ${inventoryResponse.status}`
          );
        const inventoryData = await inventoryResponse.json();
        setInventory(
          inventoryData.map((item) => ({
            ...item,
            stockUnit: item.stockUnit || item.unit || "unit(s)",
            sellingUnit:
              item.sellingUnit || item.stockUnit || item.unit || "unit(s)",
            conversionFactor: Number(item.conversionFactor) || 1,
            price: Number(item.price) || 0,
            defaultSellingPricePerUnit:
              Number(item.defaultSellingPricePerUnit) || 0,
          }))
        );

        const salesResponse = await fetch("/api/sales");
        if (!salesResponse.ok)
          throw new Error(`Failed to fetch sales: ${salesResponse.status}`);
        const salesData = await salesResponse.json();
        setSales(salesData);

        const currentTotalProfit = salesData.reduce(
          (acc, sale) => acc + (sale.profit || 0),
          0
        );
        setTotalProfit(currentTotalProfit);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert(`Error fetching data: ${error.message}`);
      }
    };
    fetchData();
  }, []);

  const resetInventoryForm = () => {
    setEditingItemId(null);
    setItemNamed("");
    setItemQuantity("");
    setItemCostPrice("");
    setItemStockUnit("");
    setItemSellingUnit("");
    setItemConversionFactor("1");
    setItemDefaultSellingPrice("");
  };

  const handleUpdateSellingPriceInDB = async (itemId, newSellingPrice) => {
    const itemToUpdate = inventory.find((item) => item._id === itemId);
    if (!itemToUpdate) {
      alert("Item not found for updating selling price.");
      return false;
    }

    const priceNum = parseFloat(newSellingPrice);
    if (isNaN(priceNum) || priceNum < 0) {
      alert("Please enter a valid positive selling price.");
      return false;
    }

    try {
      const response = await fetch(`/api/inventory/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ defaultSellingPricePerUnit: priceNum }),
      });

      const updatedItemFromServer = await response.json();

      if (response.ok) {
        setInventory((prevInventory) =>
          prevInventory.map((item) =>
            item._id === itemId
              ? {
                  ...item,
                  defaultSellingPricePerUnit:
                    updatedItemFromServer.data?.defaultSellingPricePerUnit ??
                    priceNum,
                }
              : item
          )
        );
        alert(
          `Selling price for "${itemToUpdate.itemName}" updated successfully.`
        );
        return true;
      } else {
        alert(
          `Failed to update selling price: ${
            updatedItemFromServer.message || response.statusText
          }`
        );
        return false;
      }
    } catch (error) {
      console.error("Error updating selling price:", error);
      alert(`Error updating selling price: ${error.message}`);
      return false;
    }
  };

  const handleInventoryFormSubmit = async (e) => {
    e.preventDefault();
    if (editingItemId) {
      await handleUpdateInventoryItem();
    } else {
      await handleAddItemToInventory();
    }
  };

  const handleAddItemToInventory = async () => {
    if (!itemNamed || !itemQuantity || !itemCostPrice || !itemStockUnit) {
      alert(
        "Please fill in Item Name, Stock Quantity, Cost Price, and Stock Unit."
      );
      return;
    }
    const quantityToAdd = parseFloat(itemQuantity);
    const newCostPrice = parseFloat(itemCostPrice);
    const conversionFactor = parseFloat(itemConversionFactor);
    const defaultSellingPrice = itemDefaultSellingPrice
      ? parseFloat(itemDefaultSellingPrice)
      : undefined;

    if (isNaN(quantityToAdd) || quantityToAdd <= 0) {
      alert("Invalid quantity to add.");
      return;
    }
    if (isNaN(newCostPrice) || newCostPrice <= 0) {
      alert("Invalid cost price.");
      return;
    }
    if (isNaN(conversionFactor) || conversionFactor <= 0) {
      alert("Invalid conversion factor.");
      return;
    }
    if (
      defaultSellingPrice !== undefined &&
      (isNaN(defaultSellingPrice) || defaultSellingPrice < 0)
    ) {
      alert("Please enter a valid default selling price or leave it blank.");
      return;
    }

    const trimmedItemName = itemNamed.trim();
    const trimmedStockUnit = itemStockUnit.trim();
    const trimmedSellingUnit = itemSellingUnit.trim() || trimmedStockUnit;

    // --- Prepare Payload ---
    // Send all details; backend POST will handle create or update logic
    const itemPayload = {
      itemName: trimmedItemName,
      quantity: quantityToAdd, // Send the quantity *being added*
      price: newCostPrice, // Send the new cost price
      stockUnit: trimmedStockUnit,
      sellingUnit: trimmedSellingUnit,
      conversionFactor,
      defaultSellingPricePerUnit: defaultSellingPrice,
    };

    try {
      // --- Always POST ---
      // The backend /api/inventory POST route handles the logic
      // to check for existing items and update or create accordingly.
      const response = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemPayload),
      });

      const returnedItem = await response.json(); // Can be the new item or the updated existing one

      if (response.ok || response.status === 201) {
        // Check for 200 (updated) or 201 (created)
        // --- Update Local State ---
        const existingItemIndex = inventory.findIndex(
          (item) =>
            item.itemName.toLowerCase() === returnedItem.itemName.toLowerCase()
        );

        const itemWithCorrectTypes = {
          ...returnedItem,
          stockUnit: returnedItem.stockUnit || "unit(s)",
          sellingUnit:
            returnedItem.sellingUnit || returnedItem.stockUnit || "unit(s)",
          conversionFactor: Number(returnedItem.conversionFactor) || 1,
          price: Number(returnedItem.price) || 0,
          quantity: Number(returnedItem.quantity) || 0,
          defaultSellingPricePerUnit:
            Number(returnedItem.defaultSellingPricePerUnit) || 0,
        };

        if (existingItemIndex > -1) {
          // Item was updated, replace it in the state
          setInventory((prev) => {
            const updatedInventory = [...prev];
            updatedInventory[existingItemIndex] = itemWithCorrectTypes;
            return updatedInventory;
          });
          alert(
            `Updated "${returnedItem.itemName}": Quantity adjusted, price updated.`
          );
        } else {
          // Item was newly created, add it to the state
          setInventory((prev) => [...prev, itemWithCorrectTypes]);
          alert(`"${returnedItem.itemName}" added to inventory.`);
        }

        resetInventoryForm();
      } else {
        alert(
          `Failed operation: ${returnedItem.message || response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error processing inventory item:", error);
      alert(`Error processing inventory item: ${error.message}`);
    }
  };

  const handleSetEditItem = (item) => {
    setEditingItemId(item._id);
    setItemNamed(item.itemName);
    setItemQuantity(String(item.quantity)); // Quantity is not directly editable in form, but set for context
    setItemCostPrice(String(item.price));
    setItemStockUnit(item.stockUnit || item.unit || "unit(s)");
    setItemSellingUnit(
      item.sellingUnit || item.stockUnit || item.unit || "unit(s)"
    );
    setItemConversionFactor(String(item.conversionFactor || "1"));
    setItemDefaultSellingPrice(String(item.defaultSellingPricePerUnit || ""));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdateInventoryItem = async () => {
    const costPrice = parseFloat(itemCostPrice);
    const conversionFactor = parseFloat(itemConversionFactor);
    const defaultSellingPrice = itemDefaultSellingPrice
      ? parseFloat(itemDefaultSellingPrice)
      : undefined;

    if (!itemNamed.trim() || !itemStockUnit.trim()) {
      alert("Item name and stock unit cannot be empty.");
      return;
    }
    if (isNaN(costPrice) || costPrice <= 0) {
      alert("Invalid cost price for update.");
      return;
    }
    if (isNaN(conversionFactor) || conversionFactor <= 0) {
      alert("Invalid conversion factor for update.");
      return;
    }
    if (
      defaultSellingPrice !== undefined &&
      (isNaN(defaultSellingPrice) || defaultSellingPrice < 0)
    ) {
      alert(
        "Please enter a valid default selling price for update or leave it blank if not changing."
      );
      return;
    }

    const updatedItemPayload = {
      itemName: itemNamed.trim(),
      price: costPrice, // Cost price per stock unit
      stockUnit: itemStockUnit.trim(),
      sellingUnit: itemSellingUnit.trim() || itemStockUnit.trim(),
      conversionFactor,
      defaultSellingPricePerUnit: defaultSellingPrice, // Price per selling unit
    };

    try {
      const response = await fetch(`/api/inventory/${editingItemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItemPayload), // Note: Quantity is not part of this payload
      });
      const returnedUpdatedItemData = await response.json();
      const returnedUpdatedItem = returnedUpdatedItemData.data;

      if (response.ok && returnedUpdatedItem) {
        setInventory((prev) =>
          prev.map((item) =>
            item._id === editingItemId
              ? {
                  ...item, // Keep existing fields like quantity
                  ...returnedUpdatedItem, // Apply all updates from backend response
                  stockUnit:
                    returnedUpdatedItem.stockUnit ||
                    item.stockUnit ||
                    "unit(s)",
                  sellingUnit:
                    returnedUpdatedItem.sellingUnit ||
                    item.sellingUnit ||
                    "unit(s)",
                  conversionFactor:
                    Number(returnedUpdatedItem.conversionFactor) ||
                    item.conversionFactor ||
                    1,
                  defaultSellingPricePerUnit:
                    Number(returnedUpdatedItem.defaultSellingPricePerUnit) ??
                    item.defaultSellingPricePerUnit ??
                    0,
                }
              : item
          )
        );
        alert(`"${updatedItemPayload.itemName}" updated.`);
        resetInventoryForm();
      } else {
        alert(
          `Failed to update item: ${
            returnedUpdatedItemData.message || response.statusText
          }`
        );
      }
    } catch (error) {
      alert(`Error updating item: ${error.message}`);
    }
  };

  const handleDeleteInventoryItem = async (itemId) => {
    if (
      window.confirm("Are you sure you want to delete this inventory item?")
    ) {
      try {
        const response = await fetch(`/api/inventory/${itemId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setInventory((prev) => prev.filter((item) => item._id !== itemId));
          alert("Inventory item deleted.");
          if (editingItemId === itemId) resetInventoryForm();
        } else {
          const errorData = await response.text();
          alert(`Failed to delete item: ${errorData}`);
        }
      } catch (error) {
        alert(`Error deleting item: ${error.message}`);
      }
    }
  };

  const handleRecordSale = async (e) => {
    e.preventDefault();
    if (!selectedItemId || !saleQuantity || !sellingPrice) {
      alert(
        "Select item, enter quantity sold (in selling unit), and selling price (per selling unit)."
      );
      return;
    }

    const itemInInventory = inventory.find(
      (item) => item._id === selectedItemId
    );
    if (!itemInInventory) {
      alert("Selected item not found.");
      return;
    }

    const quantitySoldInSellingUnits = parseFloat(saleQuantity);
    const sellingPricePerSellingUnit = parseFloat(sellingPrice);
    const conversionFactor = Number(itemInInventory.conversionFactor) || 1;

    if (isNaN(quantitySoldInSellingUnits) || quantitySoldInSellingUnits <= 0) {
      alert("Invalid quantity sold.");
      return;
    }
    if (isNaN(sellingPricePerSellingUnit) || sellingPricePerSellingUnit < 0) {
      // Selling price can be 0
      alert("Invalid selling price.");
      return;
    }

    const availableInSellingUnits = itemInInventory.quantity * conversionFactor;
    if (quantitySoldInSellingUnits > availableInSellingUnits) {
      alert(
        `Not enough "${
          itemInInventory.itemName
        }" in stock. Available: ${availableInSellingUnits.toFixed(2)} ${
          itemInInventory.sellingUnit
        }(s).`
      );
      return;
    }

    const costPricePerStockUnit = itemInInventory.price;
    const costPricePerSellingUnit = costPricePerStockUnit / conversionFactor;
    const profitForThisSale =
      (sellingPricePerSellingUnit - costPricePerSellingUnit) *
      quantitySoldInSellingUnits;
    const quantitySoldInStockUnits =
      quantitySoldInSellingUnits / conversionFactor;

    const newSale = {
      itemId: selectedItemId,
      itemName: itemInInventory.itemName,
      quantitySold: quantitySoldInSellingUnits,
      sellingPrice: sellingPricePerSellingUnit,
      profit: profitForThisSale,
      unitSold: itemInInventory.sellingUnit,
      costPriceAtTimeOfSale: costPricePerSellingUnit, // Cost per selling unit
      saleDate: new Date().toISOString(), // Client-side date, server should preferably set its own
    };

    try {
      const response = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSale),
      });

      if (response.ok) {
        const createdSale = await response.json();
        setSales((prevSales) => [...prevSales, createdSale]);

        setInventory((prevInv) =>
          prevInv.map((item) =>
            item._id === selectedItemId
              ? {
                  ...item,
                  quantity: item.quantity - quantitySoldInStockUnits,
                }
              : item
          )
        );

        setTotalProfit((prevProfit) => prevProfit + profitForThisSale);
        alert(
          `Sale recorded for ${
            itemInInventory.itemName
          }. Profit: ${formatCurrency(profitForThisSale)}`
        );
        setSelectedItemId("");
        setSaleQuantity("");
        setSellingPrice("");
      } else {
        const errorData = await response.text(); // Or response.json() if your API sends JSON errors
        alert(`Failed to record sale: ${errorData.message || errorData}`);
      }
    } catch (error) {
      alert(`Error recording sale: ${error.message}`);
    }
  };

  const handleDeleteSale = async (saleId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this sale? This will adjust total profit. Restocking inventory is not automatic."
      )
    ) {
      const saleToDelete = sales.find((s) => s._id === saleId);
      if (!saleToDelete) {
        alert("Sale not found.");
        return;
      }

      try {
        const response = await fetch(`/api/sales/${saleId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setSales((prev) => prev.filter((s) => s._id !== saleId));
          setTotalProfit(
            (prevProfit) => prevProfit - (saleToDelete.profit || 0)
          );
          alert(
            "Sale record deleted. Total profit adjusted. Inventory NOT automatically restocked."
          );
        } else {
          const errorData = await response.text();
          alert(`Failed to delete sale: ${errorData}`);
        }
      } catch (error) {
        alert(`Error deleting sale: ${error.message}`);
      }
    }
  };

  // Filter inventory based on search term
  const itemsAvailableForSale = inventory.filter(
    (item) => item.quantity * (Number(item.conversionFactor) || 1) > 0.0001 // Check against a very small number for float precision
  );

  const filteredItemsForSale = itemsAvailableForSale.filter((item) =>
    item.itemName.toLowerCase().includes(salesSearchTerm.toLowerCase())
  );
  // Auto-populate selling price when an item is selected for sale and it has a default price
  useEffect(() => {
    if (selectedItemId) {
      const item = inventory.find((i) => i._id === selectedItemId);
      if (item && item.defaultSellingPricePerUnit > 0) {
        setSellingPrice(String(item.defaultSellingPricePerUnit));
      } else {
        setSellingPrice(""); // Clear if no default or item changes
      }
    }
  }, [selectedItemId, inventory]);

  // --- RENDER LOGIC ---
  const renderView = () => {
    if (currentView === "analytics") {
      return (
        <AnalyticsPage
          sales={sales}
          inventory={inventory}
          onBack={() => setCurrentView("dashboard")}
          formatCurrency={formatCurrency}
          isDarkMode={isDarkMode}
        />
      );
    }

    if (currentView === "priceList") {
      return (
        <SellingPriceList
          inventory={inventory}
          onBack={() => setCurrentView("dashboard")}
          onUpdatePrice={handleUpdateSellingPriceInDB}
          formatCurrency={formatCurrency}
          isDarkMode={isDarkMode}
        />
      );
    }

    return (
      <div
        className={`p-4 md:p-8 font-sans mt-12 min-h-screen transition-colors duration-300 ${
          isDarkMode
            ? "bg-gray-900 text-gray-200"
            : "bg-slate-50 text-slate-900"
        }`}
      >
        <header className="mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-2">
            <div className="text-center sm:text-left">
              <h1
                className={`text-3xl lg:text-4xl font-bold ${
                  isDarkMode ? "text-sky-400" : "text-sky-700"
                }`}
              >
                Trade Management Dashboard
              </h1>
              <p
                className={`mt-1 ${
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Manage your inventory, track sales, and calculate profits.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg shadow-md transition-colors duration-200 ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-yellow-400"
                    : "bg-white hover:bg-slate-200 text-indigo-600"
                }`}
                title="Toggle Theme"
              >
                {isDarkMode ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setCurrentView("priceList")}
                className={`${
                  isDarkMode
                    ? "bg-orange-600 hover:bg-orange-700"
                    : "bg-orange-500 hover:bg-orange-600"
                } text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200`}
              >
                Manage Selling Prices
              </button>
              <button
                onClick={() => setCurrentView("analytics")}
                disabled={sales.length === 0}
                className={`${
                  isDarkMode
                    ? "bg-purple-700 hover:bg-purple-800 focus:ring-purple-600"
                    : "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
                } text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:bg-slate-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed`}
                title={
                  sales.length === 0
                    ? "Record sales for analytics"
                    : "View Sales Analytics"
                }
              >
                View Analytics
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* --- INVENTORY MANAGEMENT SECTION --- */}
          <section
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } p-6 rounded-xl shadow-lg transition-colors duration-300`}
          >
            <h2
              className={`text-2xl font-semibold mb-6 ${
                isDarkMode
                  ? "text-sky-400 border-gray-700"
                  : "text-sky-600 border-slate-300"
              } border-b pb-3`}
            >
              {editingItemId ? "Edit Inventory Item" : "Add to Inventory"}
            </h2>
            <form onSubmit={handleInventoryFormSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="itemNamed"
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  } mb-1`}
                >
                  Item Name:
                </label>
                <input
                  type="text"
                  id="itemNamed"
                  value={itemNamed}
                  onChange={(e) => setItemNamed(e.target.value)}
                  placeholder="e.g., Flashband Bundle"
                  className={`w-full p-3 border rounded-lg transition-colors duration-200 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-sky-500 focus:border-sky-500"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-sky-600 focus:border-sky-600"
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="itemQuantity"
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-slate-300" : "text-slate-700"
                    } mb-1`}
                  >
                    {editingItemId
                      ? "Current Stock (View Only)"
                      : "Stock Quantity:"}
                  </label>
                  <input
                    type="number"
                    id="itemQuantity"
                    value={itemQuantity}
                    onChange={(e) => setItemQuantity(e.target.value)}
                    placeholder={editingItemId ? "N/A" : "e.g., 10"}
                    min="0.01"
                    step="any"
                    className={`w-full p-3 border rounded-lg transition-colors duration-200 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 disabled:bg-gray-600 disabled:text-gray-400"
                        : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 disabled:bg-slate-100 disabled:text-slate-500"
                    }`}
                    required={!editingItemId}
                    readOnly={!!editingItemId}
                    title={
                      editingItemId
                        ? "Stock quantity cannot be edited here. Record sales or new stock entries to adjust."
                        : "Initial quantity of the item in stock unit"
                    }
                  />
                  {editingItemId && (
                    <p
                      className={`text-xs ${
                        isDarkMode ? "text-slate-400" : "text-slate-500"
                      } mt-1`}
                    >
                      Stock quantity changes via sales or new stock entries.
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="itemCostPrice"
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-slate-300" : "text-slate-700"
                    } mb-1`}
                  >
                    Cost Price (per Stock Unit):
                  </label>
                  <input
                    type="number"
                    id="itemCostPrice"
                    value={itemCostPrice}
                    onChange={(e) => setItemCostPrice(e.target.value)}
                    placeholder="e.g., 10000"
                    min="0.01"
                    step="0.01"
                    className={`w-full p-3 border rounded-lg transition-colors duration-200 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-sky-500 focus:border-sky-500"
                        : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-sky-600 focus:border-sky-600"
                    }`}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="itemStockUnit"
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-slate-300" : "text-slate-700"
                    } mb-1`}
                  >
                    Stock Unit:
                  </label>
                  <input
                    type="text"
                    id="itemStockUnit"
                    value={itemStockUnit}
                    onChange={(e) => setItemStockUnit(e.target.value)}
                    placeholder="e.g., bundle"
                    className={`w-full p-3 border rounded-lg transition-colors duration-200 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-sky-500 focus:border-sky-500"
                        : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-sky-600 focus:border-sky-600"
                    }`}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="itemSellingUnit"
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-slate-300" : "text-slate-700"
                    } mb-1`}
                  >
                    Selling Unit (optional):
                  </label>
                  <input
                    type="text"
                    id="itemSellingUnit"
                    value={itemSellingUnit}
                    onChange={(e) => setItemSellingUnit(e.target.value)}
                    placeholder="e.g., piece"
                    className={`w-full p-3 border rounded-lg transition-colors duration-200 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-sky-500 focus:border-sky-500"
                        : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-sky-600 focus:border-sky-600"
                    }`}
                  />
                  {itemSellingUnit && itemSellingUnit !== itemStockUnit && (
                    <p
                      className={`text-xs ${
                        isDarkMode ? "text-slate-400" : "text-slate-500"
                      } mt-1`}
                    >
                      e.g. Sell &quot;pieces&quot; from a &quot;pack&quot;.
                    </p>
                  )}
                  {(!itemSellingUnit || itemSellingUnit === itemStockUnit) && (
                    <p
                      className={`text-xs ${
                        isDarkMode ? "text-slate-400" : "text-slate-500"
                      } mt-1`}
                    >
                      If same as stock unit, leave blank or set conversion to 1.
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="itemConversionFactor"
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-slate-300" : "text-slate-700"
                    } mb-1`}
                  >
                    Selling Units per Stock Unit:
                  </label>
                  <input
                    type="number"
                    id="itemConversionFactor"
                    value={itemConversionFactor}
                    onChange={(e) => setItemConversionFactor(e.target.value)}
                    placeholder="e.g., 10"
                    min="0.00001"
                    step="any"
                    className={`w-full p-3 border rounded-lg transition-colors duration-200 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 disabled:bg-gray-600 disabled:text-gray-400 focus:ring-sky-500 focus:border-sky-500"
                        : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 disabled:bg-slate-100 disabled:text-slate-500 focus:ring-sky-600 focus:border-sky-600"
                    }`}
                    required
                    disabled={
                      !itemSellingUnit || itemSellingUnit === itemStockUnit
                    }
                  />
                  {itemSellingUnit &&
                    itemSellingUnit !== itemStockUnit &&
                    !itemConversionFactor && (
                      <p
                        className={`text-xs text-red-500 dark:text-red-400 mt-1`}
                      >
                        Required if selling unit differs.
                      </p>
                    )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="itemDefaultSellingPrice"
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  } mb-1`}
                >
                  Default Selling Price (per Selling Unit, optional):
                </label>
                <input
                  type="number"
                  id="itemDefaultSellingPrice"
                  value={itemDefaultSellingPrice}
                  onChange={(e) => setItemDefaultSellingPrice(e.target.value)}
                  placeholder="e.g., 1500"
                  min="0"
                  step="0.01"
                  className={`w-full p-3 border rounded-lg transition-colors duration-200 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-sky-500 focus:border-sky-500"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-sky-600 focus:border-sky-600"
                  }`}
                />
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-slate-400" : "text-slate-500"
                  } mt-1`}
                >
                  Standard price per selling unit. Can be overridden at sale.
                  Manage all in &apos;Manage Selling Prices&apos;.
                </p>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  className={`flex-grow font-semibold py-3 px-4 rounded-lg transition-colors duration-200 ${
                    isDarkMode
                      ? "bg-sky-500 hover:bg-sky-600 text-white"
                      : "bg-sky-600 hover:bg-sky-700 text-white"
                  }`}
                >
                  {editingItemId
                    ? "Update Item Details"
                    : "Add Item to Inventory"}
                </button>
                {editingItemId && (
                  <button
                    type="button"
                    onClick={resetInventoryForm}
                    className={`flex-grow font-semibold py-3 px-4 rounded-lg transition-colors duration-200 ${
                      isDarkMode
                        ? "bg-gray-600 hover:bg-gray-500 text-white"
                        : "bg-slate-500 hover:bg-slate-600 text-white"
                    }`}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* --- SALES RECORDING SECTION --- */}
          <section
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } p-6 rounded-xl shadow-lg transition-colors duration-300`}
          >
            <h2
              className={`text-2xl font-semibold mb-6 ${
                isDarkMode
                  ? "text-emerald-400 border-gray-700"
                  : "text-emerald-600 border-slate-300"
              } border-b pb-3`}
            >
              Record a Sale
            </h2>
            {itemsAvailableForSale.length === 0 ? (
              <p
                className={`${
                  isDarkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {inventory.length === 0
                  ? "Add items to inventory first to record a sale."
                  : "All items are out of stock or have zero conversion factor. Add stock or check item details."}
              </p>
            ) : (
              <form onSubmit={handleRecordSale} className="space-y-4">
                <div>
                  <label
                    htmlFor="salesSearch"
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-slate-300" : "text-slate-700"
                    } mb-1`}
                  >
                    Search for an Item:
                  </label>
                  <input
                    type="text"
                    id="salesSearch"
                    placeholder="Type to search..."
                    className={`w-full p-3 border rounded-lg transition-colors duration-200 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-emerald-500 focus:border-emerald-500"
                        : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-emerald-600 focus:border-emerald-600"
                    }`}
                    value={salesSearchTerm}
                    onChange={(e) => setSalesSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="selectedItem"
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-slate-300" : "text-slate-700"
                    } mb-1`}
                  >
                    Select Item:
                  </label>
                  <select
                    id="selectedItem"
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                    className={`w-full p-3 border rounded-lg transition-colors duration-200 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-emerald-500 focus:border-emerald-500"
                        : "bg-white border-slate-300 text-slate-900 focus:ring-emerald-600 focus:border-emerald-600"
                    }`}
                    required
                  >
                    <option
                      value=""
                      disabled
                      className={isDarkMode ? "text-gray-500" : ""}
                    >
                      -- Select an item --
                    </option>
                                     {" "}
                    {filteredItemsForSale.map((item) => {
                      const conversion = Number(item.conversionFactor) || 1;
                      const availableInSelling = (
                        item.quantity * conversion
                      ).toFixed(2);
                      const defaultPriceInfo =
                        item.defaultSellingPricePerUnit > 0
                          ? ` (Def. Price: ${formatCurrency(
                              item.defaultSellingPricePerUnit
                            )})`
                          : "";
                      return (
                        <option key={item._id} value={item._id}>
                          {item.itemName} ({availableInSelling}{" "}
                          {item.sellingUnit} available)
                          {defaultPriceInfo}                     {" "}
                        </option>
                      );
                    })}
                  </select>
                  {filteredItemsForSale.length === 0 &&
                    itemsAvailableForSale.length > 0 && (
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-slate-400" : "text-slate-500"
                        } mt-1`}
                      >
                        No items match your search.
                      </p>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="saleQuantity"
                      className={`block text-sm font-medium ${
                        isDarkMode ? "text-slate-300" : "text-slate-700"
                      } mb-1`}
                    >
                      Quantity Sold (in selling unit):
                    </label>
                    <input
                      type="number"
                      id="saleQuantity"
                      value={saleQuantity}
                      onChange={(e) => setSaleQuantity(e.target.value)}
                      placeholder="e.g., 2"
                      min="0.001"
                      step="any"
                      className={`w-full p-3 border rounded-lg transition-colors duration-200 ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-emerald-500 focus:border-emerald-500"
                          : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-emerald-600 focus:border-emerald-600"
                      }`}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="sellingPrice"
                      className={`block text-sm font-medium ${
                        isDarkMode ? "text-slate-300" : "text-slate-700"
                      } mb-1`}
                    >
                      Selling Price (per selling unit):
                    </label>
                    <input
                      type="number"
                      id="sellingPrice"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(e.target.value)}
                      placeholder="e.g., 150"
                      min="0" // Price can be zero for giveaways/promos
                      step="0.01"
                      className={`w-full p-3 border rounded-lg transition-colors duration-200 ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-emerald-500 focus:border-emerald-500"
                          : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-emerald-600 focus:border-emerald-600"
                      }`}
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className={`w-full font-semibold py-3 px-4 rounded-lg transition-colors duration-200 ${
                    isDarkMode
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  } disabled:bg-slate-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed`}
                  disabled={
                    !selectedItemId ||
                    itemsAvailableForSale.length === 0 ||
                    !saleQuantity ||
                    !sellingPrice
                  }
                >
                  Record Sale
                </button>
              </form>
            )}
          </section>
        </div>

        {/* --- INVENTORY DISPLAY SECTION --- */}
        <section
          className={`mt-10 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-xl shadow-lg transition-colors duration-300`}
        >
          <div
            className={`flex flex-col sm:flex-row justify-between items-center mb-6 ${
              isDarkMode ? "border-gray-700" : "border-slate-300"
            } border-b pb-3`}
          >
            <h2
              className={`text-2xl font-semibold ${
                isDarkMode ? "text-sky-400" : "text-sky-600"
              }`}
            >
              Current Inventory
            </h2>
            <input
              type="text"
              placeholder="Search inventory..."
              className={`mt-2 sm:mt-0 w-full sm:w-auto md:w-1/3 p-2 border rounded-lg transition-colors duration-200 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-sky-500 focus:border-sky-500"
                  : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-sky-600 focus:border-sky-600"
              }`}
              value={inventorySearchTerm}
              onChange={(e) => setInventorySearchTerm(e.target.value)}
            />
          </div>
          {inventory.length === 0 ? (
            <p
              className={`${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              } py-4 text-center`}
            >
              Inventory is empty. Add items using the form above.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table
                className={`min-w-full divide-y ${
                  isDarkMode ? "divide-gray-700" : "divide-slate-300"
                }`}
              >
                <thead
                  className={`${isDarkMode ? "bg-gray-700" : "bg-slate-100"}`}
                >
                  <tr>
                    <th
                      className={`px-4 py-3 text-left text-xs font-medium ${
                        isDarkMode ? "text-slate-300" : "text-slate-500"
                      } uppercase tracking-wider`}
                    >
                      Item Name
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-xs font-medium ${
                        isDarkMode ? "text-slate-300" : "text-slate-500"
                      } uppercase tracking-wider`}
                    >
                      Stock Qty
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-xs font-medium ${
                        isDarkMode ? "text-slate-300" : "text-slate-500"
                      } uppercase tracking-wider`}
                    >
                      Stock Unit
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-xs font-medium ${
                        isDarkMode ? "text-slate-300" : "text-slate-500"
                      } uppercase tracking-wider`}
                    >
                      Cost/Stock Unit
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-xs font-medium ${
                        isDarkMode ? "text-slate-300" : "text-slate-500"
                      } uppercase tracking-wider`}
                    >
                      Selling Unit
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-xs font-medium ${
                        isDarkMode ? "text-slate-300" : "text-slate-500"
                      } uppercase tracking-wider`}
                    >
                      Conv. Factor
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-xs font-medium ${
                        isDarkMode ? "text-slate-300" : "text-slate-500"
                      } uppercase tracking-wider`}
                    >
                      Total Selling Units
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-xs font-medium ${
                        isDarkMode ? "text-slate-300" : "text-slate-500"
                      } uppercase tracking-wider`}
                    >
                      Default Selling Price
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-xs font-medium ${
                        isDarkMode ? "text-slate-300" : "text-slate-500"
                      } uppercase tracking-wider`}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`${
                    isDarkMode
                      ? "bg-gray-800 divide-gray-700"
                      : "bg-white divide-slate-200"
                  }`}
                >
                  {inventory
                    .filter((item) =>
                      item.itemName
                        .toLowerCase()
                        .includes(inventorySearchTerm.toLowerCase())
                    )
                    .map((item) => {
                      const conversion = Number(item.conversionFactor) || 1;
                      const totalSellingUnits = (
                        item.quantity * conversion
                      ).toFixed(2);
                      return (
                        <tr
                          key={item._id}
                          className={`${
                            editingItemId === item._id
                              ? isDarkMode
                                ? "bg-sky-800"
                                : "bg-sky-100"
                              : isDarkMode
                              ? "hover:bg-gray-700"
                              : "hover:bg-slate-50"
                          } transition-colors duration-150`}
                        >
                          <td
                            className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                              isDarkMode ? "text-gray-100" : "text-slate-900"
                            } truncate`}
                            title={item.itemName}
                          >
                            {item.itemName}
                          </td>
                          <td
                            className={`px-4 py-3 whitespace-nowrap text-sm ${
                              isDarkMode ? "text-gray-300" : "text-slate-600"
                            }`}
                          >
                            {Number(item.quantity).toFixed(3)}
                          </td>
                          <td
                            className={`px-4 py-3 whitespace-nowrap text-sm ${
                              isDarkMode ? "text-gray-300" : "text-slate-600"
                            }`}
                          >
                            {item.stockUnit}
                          </td>
                          <td
                            className={`px-4 py-3 whitespace-nowrap text-sm ${
                              isDarkMode ? "text-gray-300" : "text-slate-600"
                            }`}
                          >
                            {formatCurrency(item.price)}
                          </td>
                          <td
                            className={`px-4 py-3 whitespace-nowrap text-sm ${
                              isDarkMode ? "text-gray-300" : "text-slate-600"
                            }`}
                          >
                            {item.sellingUnit}
                          </td>
                          <td
                            className={`px-4 py-3 whitespace-nowrap text-sm ${
                              isDarkMode ? "text-gray-300" : "text-slate-600"
                            }`}
                          >
                            {conversion}
                          </td>
                          <td
                            className={`px-4 py-3 whitespace-nowrap text-sm ${
                              isDarkMode ? "text-gray-300" : "text-slate-600"
                            }`}
                          >
                            {totalSellingUnits}{" "}
                            {item.sellingUnit || item.stockUnit}
                          </td>
                          <td
                            className={`px-4 py-3 whitespace-nowrap text-sm ${
                              isDarkMode ? "text-gray-300" : "text-slate-600"
                            }`}
                          >
                            {item.defaultSellingPricePerUnit > 0
                              ? `${formatCurrency(
                                  item.defaultSellingPricePerUnit / conversion
                                )} / ${item.sellingUnit || item.stockUnit}`
                              : "N/A"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleSetEditItem(item)}
                              className={`font-semibold ${
                                isDarkMode
                                  ? "text-sky-400 hover:text-sky-300"
                                  : "text-sky-600 hover:text-sky-800"
                              }`}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteInventoryItem(item._id)
                              }
                              className={`font-semibold ${
                                isDarkMode
                                  ? "text-red-400 hover:text-red-300"
                                  : "text-red-600 hover:text-red-800"
                              }`}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              {inventory.filter((item) =>
                item.itemName
                  .toLowerCase()
                  .includes(inventorySearchTerm.toLowerCase())
              ).length === 0 &&
                inventory.length > 0 && (
                  <p
                    className={`${
                      isDarkMode ? "text-slate-400" : "text-slate-500"
                    } p-4 text-center`}
                  >
                    No items match your search &quot;{inventorySearchTerm}
                    &quot;.
                  </p>
                )}
            </div>
          )}
        </section>

        {/* --- SALES HISTORY SECTION --- */}
        <section
          className={`mt-10 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-xl shadow-lg transition-colors duration-300`}
        >
          <div
            className={`flex flex-col md:flex-row justify-between items-center mb-6 ${
              isDarkMode ? "border-gray-700" : "border-slate-300"
            } border-b pb-3`}
          >
            <h2
              className={`text-2xl font-semibold ${
                isDarkMode ? "text-emerald-400" : "text-emerald-600"
              }`}
            >
              Sales History & Profit
            </h2>
            <div
              className={`mt-3 md:mt-0 text-xl font-bold ${
                isDarkMode
                  ? "text-emerald-400 bg-gray-700"
                  : "text-emerald-700 bg-emerald-100"
              } px-4 py-2 rounded-lg`}
            >
              Total Profit: {formatCurrency(totalProfit)}
            </div>
          </div>
          {sales.length === 0 ? (
            <p
              className={`${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              } py-4 text-center`}
            >
              No sales recorded yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table
                className={`min-w-full divide-y ${
                  isDarkMode ? "divide-gray-700" : "divide-slate-300"
                }`}
              >
                <thead
                  className={`${isDarkMode ? "bg-gray-700" : "bg-slate-100"}`}
                >
                  <tr>
                    <th
                      className={`px-3 py-3 text-left text-xs font-medium ${
                        isDarkMode ? "text-slate-300" : "text-slate-500"
                      } uppercase tracking-wider`}
                    >
                      Date
                    </th>
                    <th
                      className={`px-3 py-3 text-left text-xs font-medium ${
                        isDarkMode ? "text-slate-300" : "text-slate-500"
                      } uppercase tracking-wider`}
                    >
                      Item Name
                    </th>
                    <th
                      className={`px-3 py-3 text-left text-xs font-medium ${
                        isDarkMode ? "text-slate-300" : "text-slate-500"
                      } uppercase tracking-wider`}
                    >
                      Qty Sold
                    </th>
                    <th
                      className={`px-3 py-3 text-left text-xs font-medium ${
                        isDarkMode ? "text-slate-300" : "text-slate-500"
                      } uppercase tracking-wider`}
                    >
                      Unit Sold
                    </th>
                    <th
                      className={`px-3 py-3 text-left text-xs font-medium ${
                        isDarkMode ? "text-slate-300" : "text-slate-500"
                      } uppercase tracking-wider`}
                    >
                      Selling Price / Unit
                    </th>
                    <th
                      className={`px-3 py-3 text-left text-xs font-medium ${
                        isDarkMode ? "text-slate-300" : "text-slate-500"
                      } uppercase tracking-wider`}
                    >
                      Cost Price / Unit
                    </th>
                    <th
                      className={`px-3 py-3 text-left text-xs font-medium ${
                        isDarkMode ? "text-slate-300" : "text-slate-500"
                      } uppercase tracking-wider`}
                    >
                      Profit
                    </th>
                    <th
                      className={`px-3 py-3 text-left text-xs font-medium ${
                        isDarkMode ? "text-slate-300" : "text-slate-500"
                      } uppercase tracking-wider`}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`${
                    isDarkMode
                      ? "bg-gray-800 divide-gray-700"
                      : "bg-white divide-slate-200"
                  }`}
                >
                  {sales
                    .slice()
                    .sort(
                      (a, b) =>
                        new Date(b.saleDate || b.createdAt || 0) -
                        new Date(a.saleDate || a.createdAt || 0)
                    )
                    .map((sale) => {
                      const itemName = sale.itemName || "Item Deleted/Unknown";
                      const costAtSale = sale.costPriceAtTimeOfSale;

                      return (
                        <tr
                          key={sale._id}
                          className={`${
                            isDarkMode
                              ? "hover:bg-gray-700"
                              : "hover:bg-slate-50"
                          } transition-colors duration-150`}
                        >
                          <td
                            className={`px-3 py-4 whitespace-nowrap text-sm ${
                              isDarkMode ? "text-gray-300" : "text-slate-600"
                            }`}
                          >
                            {new Date(
                              sale.saleDate || sale.createdAt
                            ).toLocaleDateString()}{" "}
                            {new Date(
                              sale.saleDate || sale.createdAt
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td
                            className={`px-3 py-4 whitespace-nowrap text-sm font-medium ${
                              isDarkMode ? "text-gray-100" : "text-slate-900"
                            } truncate`}
                            title={itemName}
                          >
                            {itemName}
                          </td>
                          <td
                            className={`px-3 py-4 whitespace-nowrap text-sm ${
                              isDarkMode ? "text-gray-300" : "text-slate-600"
                            }`}
                          >
                            {sale.quantitySold}
                          </td>
                          <td
                            className={`px-3 py-4 whitespace-nowrap text-sm ${
                              isDarkMode ? "text-gray-300" : "text-slate-600"
                            }`}
                          >
                            {sale.unitSold || "unit"}
                          </td>
                          <td
                            className={`px-3 py-4 whitespace-nowrap text-sm ${
                              isDarkMode ? "text-gray-300" : "text-slate-600"
                            }`}
                          >
                            {formatCurrency(sale.sellingPrice)}
                          </td>
                          <td
                            className={`px-3 py-4 whitespace-nowrap text-sm ${
                              isDarkMode ? "text-gray-300" : "text-slate-600"
                            }`}
                          >
                            {formatCurrency(costAtSale)}
                          </td>
                          <td
                            className={`px-3 py-4 whitespace-nowrap text-sm font-semibold ${
                              sale.profit >= 0
                                ? isDarkMode
                                  ? "text-green-400"
                                  : "text-green-600"
                                : isDarkMode
                                ? "text-red-400"
                                : "text-red-600"
                            }`}
                          >
                            {formatCurrency(sale.profit)}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleDeleteSale(sale._id)}
                              className={`font-semibold ${
                                isDarkMode
                                  ? "text-red-400 hover:text-red-300"
                                  : "text-red-600 hover:text-red-800"
                              }`}
                            >
                              Delete
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
  return (
    <div
      className={`p-4 md:p-8 font-sans mt-12 min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-gray-200" : "bg-slate-50 text-slate-900"
      }`}
    >
      {renderView()}
    </div>
  );
}
