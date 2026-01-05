"use client";
import React, { useState, useEffect, useContext, useMemo } from "react";
import AnalyticsPage from "./AnalyticsPage"; // Assuming this exists
import SellingPriceList from "./SellingPriceList"; // Assuming this exists
import InvoiceReceipt from "./InvoiceReceipt"; // Assuming this exists
import { ThemeContext } from "@/components/Provider";

// Theme Configuration
const THEMES = {
  midnight: {
    name: "Midnight Blue",
    dark: {
      bg: "bg-slate-950",
      bgSecondary: "bg-slate-900",
      bgTertiary: "bg-slate-800",
      text: "text-slate-100",
      textSecondary: "text-slate-400",
      border: "border-slate-700",
      accent: "text-blue-400",
      accentBg: "bg-blue-900",
      accentLight: "bg-blue-800",
    },
  },
  forest: {
    name: "Forest Green",
    dark: {
      bg: "bg-emerald-950",
      bgSecondary: "bg-emerald-900",
      bgTertiary: "bg-emerald-800",
      text: "text-emerald-50",
      textSecondary: "text-emerald-400",
      border: "border-emerald-700",
      accent: "text-green-400",
      accentBg: "bg-green-900",
      accentLight: "bg-green-800",
    },
  },
  sunset: {
    name: "Sunset Orange",
    dark: {
      bg: "bg-orange-950",
      bgSecondary: "bg-orange-900",
      bgTertiary: "bg-orange-800",
      text: "text-orange-50",
      textSecondary: "text-orange-300",
      border: "border-orange-700",
      accent: "text-amber-400",
      accentBg: "bg-amber-900",
      accentLight: "bg-amber-800",
    },
  },
  amethyst: {
    name: "Amethyst Purple",
    dark: {
      bg: "bg-purple-950",
      bgSecondary: "bg-purple-900",
      bgTertiary: "bg-purple-800",
      text: "text-purple-50",
      textSecondary: "text-purple-300",
      border: "border-purple-700",
      accent: "text-fuchsia-400",
      accentBg: "bg-fuchsia-900",
      accentLight: "bg-fuchsia-800",
    },
  },
  crimson: {
    name: "Crimson Red",
    dark: {
      bg: "bg-red-950",
      bgSecondary: "bg-red-900",
      bgTertiary: "bg-red-800",
      text: "text-red-50",
      textSecondary: "text-red-300",
      border: "border-red-700",
      accent: "text-rose-400",
      accentBg: "bg-rose-900",
      accentLight: "bg-rose-800",
    },
  },
  ocean: {
    name: "Ocean Cyan",
    dark: {
      bg: "bg-cyan-950",
      bgSecondary: "bg-cyan-900",
      bgTertiary: "bg-cyan-800",
      text: "text-cyan-50",
      textSecondary: "text-cyan-300",
      border: "border-cyan-700",
      accent: "text-cyan-400",
      accentBg: "bg-cyan-900",
      accentLight: "bg-cyan-800",
    },
  },
};

// Low Inventory Alert Component (Toast-style)
const LowInventoryAlert = ({ items, isDarkMode, onClose }) => {
  if (items.length === 0) return null;

  // Sort items by quantity (lowest first)
  const sortedItems = [...items].sort((a, b) => Number(a.quantity) - Number(b.quantity));

  return (
    <div className="fixed top-24 right-4 z-50 max-w-sm">
      <div className={`rounded-lg shadow-2xl overflow-hidden ${isDarkMode ? "bg-red-950 border border-red-700" : "bg-red-50 border border-red-300"}`}>
        {/* Header */}
        <div className={`px-4 py-3 ${isDarkMode ? "bg-red-900" : "bg-red-100"} border-b ${isDarkMode ? "border-red-700" : "border-red-300"} flex justify-between items-center`}>
          <div className="flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <h3 className={`font-bold text-sm ${isDarkMode ? "text-red-100" : "text-red-800"}`}>
              Low Stock Alert
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`text-lg leading-none transition-colors ${isDarkMode ? "text-red-400 hover:text-red-200" : "text-red-600 hover:text-red-800"}`}
          >
            ✕
          </button>
        </div>

        {/* Items List */}
        <div className="max-h-80 overflow-y-auto">
          {sortedItems.map((item, idx) => (
            <div
              key={item._id}
              className={`px-4 py-3 border-b last:border-b-0 ${
                isDarkMode
                  ? "bg-red-950 border-red-800 hover:bg-red-900"
                  : "bg-red-50 border-red-200 hover:bg-red-100"
              } transition-colors`}
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${isDarkMode ? "text-red-100" : "text-red-800"} truncate`}>
                    {item.itemName}
                  </p>
                  <p className={`text-xs mt-1 ${isDarkMode ? "text-red-300" : "text-red-600"}`}>
                    Stock: <span className="font-bold">{item.quantity}</span> {item.stockUnit || 'unit(s)'}
                  </p>
                </div>
                <div className={`flex-shrink-0 px-2 py-1 rounded text-xs font-bold ${
                  Number(item.quantity) === 0
                    ? isDarkMode ? "bg-red-700 text-red-100" : "bg-red-200 text-red-800"
                    : isDarkMode ? "bg-orange-700 text-orange-100" : "bg-orange-200 text-orange-800"
                }`}>
                  {Number(item.quantity) === 0 ? "OUT" : "LOW"}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className={`px-4 py-2 text-xs ${isDarkMode ? "bg-red-900 text-red-300" : "bg-red-100 text-red-600"}`}>
          {sortedItems.length} item{sortedItems.length > 1 ? 's' : ''} with low stock
        </div>
      </div>
    </div>
  );
};

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
  const themeContext = useContext(ThemeContext);
  const { isDarkMode: ctxIsDarkMode, setIsDarkMode: ctxSetIsDarkMode, currentTheme: ctxCurrentTheme, setCurrentTheme: ctxSetCurrentTheme } = themeContext || {};
  
  // Use context values if available, otherwise fall back to local state
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("midnight");

  // Sync with context
  useEffect(() => {
    if (ctxIsDarkMode !== undefined) {
      setIsDarkMode(ctxIsDarkMode);
    }
    if (ctxCurrentTheme) {
      setCurrentTheme(ctxCurrentTheme);
    }
  }, [ctxIsDarkMode, ctxCurrentTheme]);

  const handleToggleTheme = () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    if (ctxSetIsDarkMode) ctxSetIsDarkMode(newValue);
  };

  const handleChangeColorTheme = (themeName) => {
    setCurrentTheme(themeName);
    if (ctxSetCurrentTheme) ctxSetCurrentTheme(themeName);
  };

  // Form state for inventory
  const [inventory, setInventory] = useState([]);
  const [sales, setSales] = useState([]);
  const [currentView, setCurrentView] = useState("dashboard");
  const [inventorySearchTerm, setInventorySearchTerm] = useState("");
  const [lowInventoryItems, setLowInventoryItems] = useState([]);
  const [showLowInventoryAlert, setShowLowInventoryAlert] = useState(false);

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
    localStorage.setItem("colorTheme", currentTheme);
  }, [isDarkMode, currentTheme]);

  useEffect(() => {
    // Check local storage for saved theme preference
    const savedTheme = localStorage.getItem("theme");
    const savedColorTheme = localStorage.getItem("colorTheme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    }
    if (savedColorTheme && THEMES[savedColorTheme]) {
      setCurrentTheme(savedColorTheme);
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

        // Check for low inventory items (quantity <= 1)
        const lowItems = inventoryData.filter(
          (item) => Number(item.quantity) <= 1
        );
        setLowInventoryItems(lowItems);
        if (lowItems.length > 0) {
          setShowLowInventoryAlert(true);
        }
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

  // Filter inventory based on search term - memoized to prevent recalculation on every render
  const itemsAvailableForSale = useMemo(
    () => inventory.filter(
      (item) => item.quantity * (Number(item.conversionFactor) || 1) > 0.0001 // Check against a very small number for float precision
    ),
    [inventory]
  );

  const filteredItemsForSale = useMemo(
    () => itemsAvailableForSale.filter((item) =>
      item.itemName.toLowerCase().includes(salesSearchTerm.toLowerCase())
    ),
    [itemsAvailableForSale, salesSearchTerm]
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

    if (currentView === "invoice") {
      return (
        <InvoiceReceipt
          sales={sales}
          inventory={inventory}
          onBack={() => setCurrentView("dashboard")}
          formatCurrency={formatCurrency}
          isDarkMode={isDarkMode}
        />
      );
    }

    return (
      <div
        className={`p-4 md:p-8 font-sans transition-colors duration-300 min-h-screen ${
          isDarkMode
            ? `${THEMES[currentTheme].dark.bg} ${THEMES[currentTheme].dark.text}`
            : "bg-slate-50 text-slate-900"
        }`}
      >
        {showLowInventoryAlert && (
          <LowInventoryAlert
            items={lowInventoryItems}
            isDarkMode={isDarkMode}
            onClose={() => setShowLowInventoryAlert(false)}
          />
        )}
        <div className="pt-20">
          <header className="mb-12 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <h1
                  className={`text-4xl sm:text-5xl font-bold tracking-tight ${
                    isDarkMode ? THEMES[currentTheme].dark.accent : "text-slate-900"
                  }`}
                >
                  Dashboard
                </h1>
                <p
                  className={`mt-2 text-lg ${
                    isDarkMode ? THEMES[currentTheme].dark.textSecondary : "text-slate-600"
                  }`}
                >
                  Manage inventory, track sales, and analyze profits
                </p>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap gap-3 items-center">
                <button
                  onClick={handleToggleTheme}
                  className={`p-2.5 rounded-lg transition-all hover:scale-110 ${
                    isDarkMode
                      ? `${THEMES[currentTheme].dark.accentLight} hover:${THEMES[currentTheme].dark.accentBg} ${THEMES[currentTheme].dark.accent}`
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                  title="Toggle Dark Mode"
                >
                  {isDarkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>

                {isDarkMode && (
                  <select
                    value={currentTheme}
                    onChange={(e) => handleChangeColorTheme(e.target.value)}
                    className={`px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                      THEMES[currentTheme].dark.accentLight
                    } ${THEMES[currentTheme].dark.text} border ${THEMES[currentTheme].dark.border} cursor-pointer`}
                    title="Select Color Theme"
                  >
                    {Object.entries(THEMES).map(([key, theme]) => (
                      <option key={key} value={key} className="bg-slate-900 text-white">
                        {theme.name}
                      </option>
                    ))}
                  </select>
                )}

              <button
                onClick={() => setCurrentView("priceList")}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all shadow-md ${
                  isDarkMode
                    ? `${THEMES[currentTheme].dark.accentLight} hover:${THEMES[currentTheme].dark.accentBg} ${THEMES[currentTheme].dark.accent}`
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                }`}
              >
                Manage Prices
              </button>

              <button
                onClick={() => setCurrentView("analytics")}
                disabled={sales.length === 0}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all shadow-md ${
                  isDarkMode && sales.length > 0
                    ? `${THEMES[currentTheme].dark.accentLight} hover:${THEMES[currentTheme].dark.accentBg} ${THEMES[currentTheme].dark.accent}`
                    : sales.length > 0
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : isDarkMode
                    ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                    : "bg-slate-300 text-slate-500 cursor-not-allowed"
                }`}
                title={
                  sales.length === 0
                    ? "Record sales for analytics"
                    : "View Sales Analytics"
                }
              >
                Analytics
              </button>

              <button
                onClick={() => setCurrentView("invoice")}
                disabled={sales.length === 0}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all shadow-md ${
                  isDarkMode && sales.length > 0
                    ? `${THEMES[currentTheme].dark.accentLight} hover:${THEMES[currentTheme].dark.accentBg} ${THEMES[currentTheme].dark.accent}`
                    : sales.length > 0
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : isDarkMode
                    ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                    : "bg-slate-300 text-slate-500 cursor-not-allowed"
                }`}
                title={
                  sales.length === 0
                    ? "Record sales to generate invoices"
                    : "Generate Invoice / Receipt"
                }
              >
                🧾 Invoice
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* --- INVENTORY MANAGEMENT SECTION --- */}
          <section
            className={`${
              isDarkMode ? THEMES[currentTheme].dark.bgSecondary : "bg-white"
            } p-6 rounded-xl shadow-lg transition-colors duration-300 ${
              isDarkMode ? THEMES[currentTheme].dark.border : "border-slate-200"
            } border`}
          >
            <h2
              className={`text-2xl font-semibold mb-6 ${
                isDarkMode
                  ? `${THEMES[currentTheme].dark.accent} border-${THEMES[currentTheme].dark.border}`
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
                    isDarkMode ? THEMES[currentTheme].dark.textSecondary : "text-slate-700"
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
                      ? `${THEMES[currentTheme].dark.bgTertiary} ${THEMES[currentTheme].dark.border} ${THEMES[currentTheme].dark.text} placeholder-slate-500 focus:ring-2 focus:ring-offset-0 ${THEMES[currentTheme].dark.accentBg} focus:border-transparent`
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
                      isDarkMode ? THEMES[currentTheme].dark.textSecondary : "text-slate-700"
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
                    className={`w-full p-3 border rounded-lg transition-all ${
                      isDarkMode
                        ? `${THEMES[currentTheme].dark.bgTertiary} ${THEMES[currentTheme].dark.border} ${THEMES[currentTheme].dark.text} placeholder-slate-500 disabled:${THEMES[currentTheme].dark.bgTertiary} disabled:${THEMES[currentTheme].dark.textSecondary}`
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
                    className={`w-full p-3 border rounded-lg transition-all ${
                      isDarkMode
                        ? `${THEMES[currentTheme].dark.bgTertiary} ${THEMES[currentTheme].dark.border} ${THEMES[currentTheme].dark.text} placeholder-slate-500 focus:ring-2 ${THEMES[currentTheme].dark.accentBg}`
                        : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-sky-500 focus:border-sky-500"
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
                    className={`w-full p-3 border rounded-lg transition-all ${
                      isDarkMode
                        ? `${THEMES[currentTheme].dark.bgTertiary} ${THEMES[currentTheme].dark.border} ${THEMES[currentTheme].dark.text} placeholder-slate-500 focus:ring-2 ${THEMES[currentTheme].dark.accentBg}`
                        : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-sky-500 focus:border-sky-500"
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
                    className={`w-full p-3 border rounded-lg transition-all ${
                      isDarkMode
                        ? `${THEMES[currentTheme].dark.bgTertiary} ${THEMES[currentTheme].dark.border} ${THEMES[currentTheme].dark.text} placeholder-slate-500 focus:ring-2 ${THEMES[currentTheme].dark.accentBg}`
                        : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-sky-500 focus:border-sky-500"
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
                    className={`w-full p-3 border rounded-lg transition-all ${
                      isDarkMode
                        ? `${THEMES[currentTheme].dark.bgTertiary} ${THEMES[currentTheme].dark.border} ${THEMES[currentTheme].dark.text} placeholder-slate-500 disabled:${THEMES[currentTheme].dark.bgTertiary} disabled:${THEMES[currentTheme].dark.textSecondary} focus:ring-2 ${THEMES[currentTheme].dark.accentBg}`
                        : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 disabled:bg-slate-100 disabled:text-slate-500 focus:ring-sky-500 focus:border-sky-500"
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
                  className={`w-full p-3 border rounded-lg transition-all ${
                    isDarkMode
                      ? `${THEMES[currentTheme].dark.bgTertiary} ${THEMES[currentTheme].dark.border} ${THEMES[currentTheme].dark.text} placeholder-slate-500 focus:ring-2 ${THEMES[currentTheme].dark.accentBg}`
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-sky-500 focus:border-sky-500"
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

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className={`flex-grow font-medium py-3 px-4 rounded-lg transition-all shadow-md ${
                    isDarkMode
                      ? `${THEMES[currentTheme].dark.accentLight} hover:${THEMES[currentTheme].dark.accentBg} ${THEMES[currentTheme].dark.accent}`
                      : "bg-sky-600 hover:bg-sky-700 text-white"
                  }`}
                >
                  {editingItemId
                    ? "Update Item"
                    : "Add to Inventory"}
                </button>
                {editingItemId && (
                  <button
                    type="button"
                    onClick={resetInventoryForm}
                    className={`flex-grow font-medium py-3 px-4 rounded-lg transition-all shadow-md ${
                      isDarkMode
                        ? `bg-slate-700 hover:bg-slate-600 text-slate-200`
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
                    className={`w-full p-3 border rounded-lg transition-all ${
                      isDarkMode
                        ? `${THEMES[currentTheme].dark.bgTertiary} ${THEMES[currentTheme].dark.border} ${THEMES[currentTheme].dark.text} placeholder-slate-500 focus:ring-2 ${THEMES[currentTheme].dark.accentBg}`
                        : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-emerald-500 focus:border-emerald-500"
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
                    className={`w-full p-3 border rounded-lg transition-all ${
                      isDarkMode
                        ? `${THEMES[currentTheme].dark.bgTertiary} ${THEMES[currentTheme].dark.border} ${THEMES[currentTheme].dark.text} focus:ring-2 ${THEMES[currentTheme].dark.accentBg}`
                        : "bg-white border-slate-300 text-slate-900 focus:ring-emerald-500 focus:border-emerald-500"
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
                      className={`w-full p-3 border rounded-lg transition-all ${
                        isDarkMode
                          ? `${THEMES[currentTheme].dark.bgTertiary} ${THEMES[currentTheme].dark.border} ${THEMES[currentTheme].dark.text} placeholder-slate-500 focus:ring-2 ${THEMES[currentTheme].dark.accentBg}`
                          : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-emerald-500 focus:border-emerald-500"
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
                      className={`w-full p-3 border rounded-lg transition-all ${
                        isDarkMode
                          ? `${THEMES[currentTheme].dark.bgTertiary} ${THEMES[currentTheme].dark.border} ${THEMES[currentTheme].dark.text} placeholder-slate-500 focus:ring-2 ${THEMES[currentTheme].dark.accentBg}`
                          : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-emerald-500 focus:border-emerald-500"
                      }`}
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className={`w-full font-medium py-3 px-4 rounded-lg transition-all shadow-md ${
                    isDarkMode
                      ? `${THEMES[currentTheme].dark.accentLight} hover:${THEMES[currentTheme].dark.accentBg} ${THEMES[currentTheme].dark.accent} disabled:bg-slate-700 disabled:text-slate-400`
                      : "bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-slate-300 disabled:text-slate-500"
                  } disabled:cursor-not-allowed`}
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
            isDarkMode ? THEMES[currentTheme].dark.bgSecondary : "bg-white"
          } p-6 rounded-xl shadow-lg transition-colors duration-300 ${
            isDarkMode ? THEMES[currentTheme].dark.border : "border-slate-200"
          } border`}
        >
          <div
            className={`flex flex-col sm:flex-row justify-between items-center mb-6 ${
              isDarkMode ? THEMES[currentTheme].dark.border : "border-slate-300"
            } border-b pb-3`}
          >
            <h2
              className={`text-2xl font-semibold ${
                isDarkMode ? THEMES[currentTheme].dark.accent : "text-sky-600"
              }`}
            >
              Current Inventory
            </h2>
            <input
              type="text"
              placeholder="Search inventory..."
              className={`mt-2 sm:mt-0 w-full sm:w-auto md:w-1/3 p-2.5 border rounded-lg transition-all ${
                isDarkMode
                  ? `${THEMES[currentTheme].dark.bgTertiary} ${THEMES[currentTheme].dark.border} ${THEMES[currentTheme].dark.text} placeholder-slate-500 focus:ring-2 ${THEMES[currentTheme].dark.accentBg}`
                  : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-sky-500 focus:border-sky-500"
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
                  isDarkMode ? THEMES[currentTheme].dark.border : "divide-slate-300"
                }`}
              >
                <thead
                  className={`${isDarkMode ? THEMES[currentTheme].dark.bgTertiary : "bg-slate-100"}`}
                >
                  <tr>
                    <th
                      className={`px-4 py-3 text-left text-xs font-medium ${
                        isDarkMode ? THEMES[currentTheme].dark.textSecondary : "text-slate-500"
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
                        isDarkMode ? THEMES[currentTheme].dark.textSecondary : "text-slate-500"
                      } uppercase tracking-wider`}
                    >
                      Cost/Stock Unit
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-xs font-medium ${
                        isDarkMode ? THEMES[currentTheme].dark.textSecondary : "text-slate-500"
                      } uppercase tracking-wider`}
                    >
                      Selling Unit
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-xs font-medium ${
                        isDarkMode ? THEMES[currentTheme].dark.textSecondary : "text-slate-500"
                      } uppercase tracking-wider`}
                    >
                      Conv. Factor
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-xs font-medium ${
                        isDarkMode ? THEMES[currentTheme].dark.textSecondary : "text-slate-500"
                      } uppercase tracking-wider`}
                    >
                      Total Selling Units
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-xs font-medium ${
                        isDarkMode ? THEMES[currentTheme].dark.textSecondary : "text-slate-500"
                      } uppercase tracking-wider`}
                    >
                      Default Selling Price
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-xs font-medium ${
                        isDarkMode ? THEMES[currentTheme].dark.textSecondary : "text-slate-500"
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
                                ? `${THEMES[currentTheme].dark.accentBg} ${THEMES[currentTheme].dark.accent}`
                                : "bg-sky-100"
                              : isDarkMode
                              ? `hover:${THEMES[currentTheme].dark.bgTertiary}`
                              : "hover:bg-slate-50"
                          } transition-colors duration-150`}
                        >
                          <td
                            className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                              isDarkMode ? THEMES[currentTheme].dark.text : "text-slate-900"
                            } truncate`}
                            title={item.itemName}
                          >
                            {item.itemName}
                          </td>
                          <td
                            className={`px-4 py-3 whitespace-nowrap text-sm ${
                              isDarkMode ? THEMES[currentTheme].dark.textSecondary : "text-slate-600"
                            }`}
                          >
                            {Number(item.quantity).toFixed(3)}
                          </td>
                          <td
                            className={`px-4 py-3 whitespace-nowrap text-sm ${
                              isDarkMode ? THEMES[currentTheme].dark.textSecondary : "text-slate-600"
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
            isDarkMode ? THEMES[currentTheme].dark.bgSecondary : "bg-white"
          } p-6 rounded-xl shadow-lg transition-colors duration-300 ${
            isDarkMode ? THEMES[currentTheme].dark.border : "border-slate-200"
          } border`}
        >
          <div
            className={`flex flex-col md:flex-row justify-between items-center mb-6 ${
              isDarkMode ? THEMES[currentTheme].dark.border : "border-slate-300"
            } border-b pb-3`}
          >
            <h2
              className={`text-2xl font-semibold ${
                isDarkMode ? THEMES[currentTheme].dark.accent : "text-emerald-600"
              }`}
            >
              Sales History & Profit
            </h2>
            <div
              className={`mt-3 md:mt-0 text-xl font-bold ${
                isDarkMode
                  ? `${THEMES[currentTheme].dark.accent} ${THEMES[currentTheme].dark.bgTertiary}`
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
                  isDarkMode ? THEMES[currentTheme].dark.border : "divide-slate-300"
                }`}
              >
                <thead
                  className={`${isDarkMode ? THEMES[currentTheme].dark.bgTertiary : "bg-slate-100"}`}
                >
                  <tr>
                    <th
                      className={`px-3 py-3 text-left text-xs font-medium ${
                        isDarkMode ? THEMES[currentTheme].dark.textSecondary : "text-slate-500"
                      } uppercase tracking-wider`}
                    >
                      Date
                    </th>
                    <th
                      className={`px-3 py-3 text-left text-xs font-medium ${
                        isDarkMode ? THEMES[currentTheme].dark.textSecondary : "text-slate-500"
                      } uppercase tracking-wider`}
                    >
                      Item Name
                    </th>
                    <th
                      className={`px-3 py-3 text-left text-xs font-medium ${
                        isDarkMode ? THEMES[currentTheme].dark.textSecondary : "text-slate-500"
                      } uppercase tracking-wider`}
                    >
                      Qty Sold
                    </th>
                    <th
                      className={`px-3 py-3 text-left text-xs font-medium ${
                        isDarkMode ? THEMES[currentTheme].dark.textSecondary : "text-slate-500"
                      } uppercase tracking-wider`}
                    >
                      Unit Sold
                    </th>
                    <th
                      className={`px-3 py-3 text-left text-xs font-medium ${
                        isDarkMode ? THEMES[currentTheme].dark.textSecondary : "text-slate-500"
                      } uppercase tracking-wider`}
                    >
                      Selling Price / Unit
                    </th>
                    <th
                      className={`px-3 py-3 text-left text-xs font-medium ${
                        isDarkMode ? THEMES[currentTheme].dark.textSecondary : "text-slate-500"
                      } uppercase tracking-wider`}
                    >
                      Cost Price / Unit
                    </th>
                    <th
                      className={`px-3 py-3 text-left text-xs font-medium ${
                        isDarkMode ? THEMES[currentTheme].dark.textSecondary : "text-slate-500"
                      } uppercase tracking-wider`}
                    >
                      Profit
                    </th>
                    <th
                      className={`px-3 py-3 text-left text-xs font-medium ${
                        isDarkMode ? THEMES[currentTheme].dark.textSecondary : "text-slate-500"
                      } uppercase tracking-wider`}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`${
                    isDarkMode
                      ? `${THEMES[currentTheme].dark.bgSecondary} ${THEMES[currentTheme].dark.border}`
                      : "bg-white divide-slate-200"
                  } divide-y`}
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
                              ? `hover:${THEMES[currentTheme].dark.bgTertiary}`
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
