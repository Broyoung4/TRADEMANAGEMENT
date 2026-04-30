"use client";
import React, { useState, useEffect, useContext, useMemo } from "react";
import AnalyticsPage from "./AnalyticsPage"; // Assuming this exists
import SellingPriceList from "./SellingPriceList"; // Assuming this exists
import InvoiceReceipt from "./InvoiceReceipt"; // Assuming this exists
import DebtTracker from "./DebtTracker"; // Debt tracking
import { ThemeContext } from "@/components/Provider";

// Modern & Elegant Theme Configuration
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
      borderLight: "border-slate-600",
      accent: "text-blue-400",
      accentBg: "bg-blue-900/50",
      accentLight: "bg-blue-800/40",
      accentBorder: "border-blue-700",
      accentText: "text-blue-300",
      shadow: "shadow-xl shadow-blue-900/20",
      gradient: "from-blue-900 to-blue-800",
      hoverBg: "hover:bg-slate-800",
      buttonBg: "bg-blue-600",
      buttonHover: "hover:bg-blue-500",
      buttonText: "text-white",
      inputBg: "bg-slate-800",
      inputBorder: "border-slate-700",
      inputFocus: "focus:border-blue-500 focus:ring-blue-500/20",
    },
  },
  forest: {
    name: "Forest Green",
    dark: {
      bg: "bg-emerald-950",
      bgSecondary: "bg-emerald-900",
      bgTertiary: "bg-emerald-800",
      text: "text-emerald-50",
      textSecondary: "text-emerald-300",
      border: "border-emerald-700",
      borderLight: "border-emerald-600",
      accent: "text-emerald-400",
      accentBg: "bg-emerald-900/50",
      accentLight: "bg-emerald-800/40",
      accentBorder: "border-emerald-700",
      accentText: "text-emerald-300",
      shadow: "shadow-xl shadow-emerald-900/20",
      gradient: "from-emerald-900 to-emerald-800",
      hoverBg: "hover:bg-emerald-800",
      buttonBg: "bg-emerald-600",
      buttonHover: "hover:bg-emerald-500",
      buttonText: "text-white",
      inputBg: "bg-emerald-800",
      inputBorder: "border-emerald-700",
      inputFocus: "focus:border-emerald-500 focus:ring-emerald-500/20",
    },
  },
  sunset: {
    name: "Sunset Orange",
    dark: {
      bg: "bg-orange-950",
      bgSecondary: "bg-orange-900",
      bgTertiary: "bg-orange-800",
      text: "text-orange-50",
      textSecondary: "text-orange-200",
      border: "border-orange-700",
      borderLight: "border-orange-600",
      accent: "text-amber-400",
      accentBg: "bg-amber-900/50",
      accentLight: "bg-amber-800/40",
      accentBorder: "border-amber-700",
      accentText: "text-amber-300",
      shadow: "shadow-xl shadow-amber-900/20",
      gradient: "from-amber-900 to-orange-800",
      hoverBg: "hover:bg-orange-800",
      buttonBg: "bg-amber-600",
      buttonHover: "hover:bg-amber-500",
      buttonText: "text-white",
      inputBg: "bg-orange-800",
      inputBorder: "border-orange-700",
      inputFocus: "focus:border-amber-500 focus:ring-amber-500/20",
    },
  },
  amethyst: {
    name: "Amethyst Purple",
    dark: {
      bg: "bg-purple-950",
      bgSecondary: "bg-purple-900",
      bgTertiary: "bg-purple-800",
      text: "text-purple-50",
      textSecondary: "text-purple-200",
      border: "border-purple-700",
      borderLight: "border-purple-600",
      accent: "text-fuchsia-400",
      accentBg: "bg-fuchsia-900/50",
      accentLight: "bg-fuchsia-800/40",
      accentBorder: "border-fuchsia-700",
      accentText: "text-fuchsia-300",
      shadow: "shadow-xl shadow-fuchsia-900/20",
      gradient: "from-fuchsia-900 to-purple-800",
      hoverBg: "hover:bg-purple-800",
      buttonBg: "bg-fuchsia-600",
      buttonHover: "hover:bg-fuchsia-500",
      buttonText: "text-white",
      inputBg: "bg-purple-800",
      inputBorder: "border-purple-700",
      inputFocus: "focus:border-fuchsia-500 focus:ring-fuchsia-500/20",
    },
  },
  crimson: {
    name: "Crimson Red",
    dark: {
      bg: "bg-red-950",
      bgSecondary: "bg-red-900",
      bgTertiary: "bg-red-800",
      text: "text-red-50",
      textSecondary: "text-red-200",
      border: "border-red-700",
      borderLight: "border-red-600",
      accent: "text-rose-400",
      accentBg: "bg-rose-900/50",
      accentLight: "bg-rose-800/40",
      accentBorder: "border-rose-700",
      accentText: "text-rose-300",
      shadow: "shadow-xl shadow-rose-900/20",
      gradient: "from-rose-900 to-red-800",
      hoverBg: "hover:bg-red-800",
      buttonBg: "bg-rose-600",
      buttonHover: "hover:bg-rose-500",
      buttonText: "text-white",
      inputBg: "bg-red-800",
      inputBorder: "border-red-700",
      inputFocus: "focus:border-rose-500 focus:ring-rose-500/20",
    },
  },
  ocean: {
    name: "Ocean Cyan",
    dark: {
      bg: "bg-cyan-950",
      bgSecondary: "bg-cyan-900",
      bgTertiary: "bg-cyan-800",
      text: "text-cyan-50",
      textSecondary: "text-cyan-200",
      border: "border-cyan-700",
      borderLight: "border-cyan-600",
      accent: "text-cyan-400",
      accentBg: "bg-cyan-900/50",
      accentLight: "bg-cyan-800/40",
      accentBorder: "border-cyan-700",
      accentText: "text-cyan-300",
      shadow: "shadow-xl shadow-cyan-900/20",
      gradient: "from-cyan-900 to-cyan-800",
      hoverBg: "hover:bg-cyan-800",
      buttonBg: "bg-cyan-600",
      buttonHover: "hover:bg-cyan-500",
      buttonText: "text-white",
      inputBg: "bg-cyan-800",
      inputBorder: "border-cyan-700",
      inputFocus: "focus:border-cyan-500 focus:ring-cyan-500/20",
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
  const [isPaid, setIsPaid] = useState(true); // True = paid, False = debt
  const [debtAmountPaid, setDebtAmountPaid] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash"); // cash or transfer

  const [totalProfit, setTotalProfit] = useState(0);

  // State for undo/redo functionality
  interface UndoRedoEntry {
    saleId: string;
    itemId: string;
    quantitySoldInStockUnits: number;
    profitFromSale: number;
    isDebt?: boolean;
    // Complete sale data for redo
    itemName?: string;
    quantitySold?: number;
    sellingPrice?: number;
    unitSold?: string;
    costPriceAtTimeOfSale?: number;
    saleDate?: string;
    paymentMethod?: string;
    // Debt data if applicable
    customerName?: string;
    totalDebtAmount?: number;
    amountPaidOnDebt?: number;
    originalProfit?: number;
  }
  const [undoStack, setUndoStack] = useState<UndoRedoEntry[]>([]);
  const [redoStack, setRedoStack] = useState<UndoRedoEntry[]>([]);

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

  const handleDebtSettled = async (profitAmount: number) => {
    // When a debt is settled, add the profit to total profit
    setTotalProfit((prevProfit) => prevProfit + profitAmount);
    
    // Refresh sales to show updated profit and debt status
    try {
      const response = await fetch("/api/sales");
      if (response.ok) {
        const updatedSales = await response.json();
        setSales(updatedSales);
      }
    } catch (error) {
      console.error("Error refreshing sales after debt settlement:", error);
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

    // If it's a debt, validate debt amount paid
    if (!isPaid) {
      const debtPaid = debtAmountPaid ? parseFloat(debtAmountPaid) : 0;
      if (isNaN(debtPaid) || debtPaid < 0) {
        alert("Invalid amount paid for debt. Please enter a valid number.");
        return;
      }
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
      profit: isPaid ? profitForThisSale : 0, // Don't record profit for debts
      unitSold: itemInInventory.sellingUnit,
      costPriceAtTimeOfSale: costPricePerSellingUnit, // Cost per selling unit
      saleDate: new Date().toISOString(),
      isDebt: !isPaid, // Add flag to mark this as debt sale
      paymentMethod, // Add payment method
    };

    console.log("Recording sale with payment method:", paymentMethod, "Full sale object:", newSale);

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

        // Only add profit if it's a paid sale, not a debt
        if (isPaid) {
          setTotalProfit((prevProfit) => prevProfit + profitForThisSale);
        }

        // Add to undo stack with complete sale data for redo
        const undoEntry: UndoRedoEntry = {
          saleId: createdSale._id,
          itemId: selectedItemId,
          quantitySoldInStockUnits,
          profitFromSale: isPaid ? profitForThisSale : 0, // Don't count debt profit
          isDebt: !isPaid, // Store debt flag
          // Store complete sale data
          itemName: itemInInventory.itemName,
          quantitySold: quantitySoldInSellingUnits,
          sellingPrice: sellingPricePerSellingUnit,
          unitSold: itemInInventory.sellingUnit,
          costPriceAtTimeOfSale: costPricePerSellingUnit, // Cost per SELLING unit (not stock unit)
          saleDate: new Date().toISOString(),
          paymentMethod,
          // Store debt data if applicable
          customerName: customerName.trim() || "Unknown Customer",
          totalDebtAmount: sellingPricePerSellingUnit * quantitySoldInSellingUnits,
          amountPaidOnDebt: debtAmountPaid ? parseFloat(debtAmountPaid) : 0,
          originalProfit: profitForThisSale,
        };
        setUndoStack((prevStack) => [...prevStack, undoEntry]);
        // Clear redo stack when new action is taken
        setRedoStack([]);

        // If it's a debt, create a debt record
        if (!isPaid) {
          const totalDebtAmount = sellingPricePerSellingUnit * quantitySoldInSellingUnits;
          const amountPaidOnDebt = debtAmountPaid ? parseFloat(debtAmountPaid) : 0;

          // Validate debt data before sending
          if (!createdSale._id) {
            console.error("Sale ID is missing:", createdSale);
            alert("Sale recorded but debt has no ID. Please refresh and try again.");
            return;
          }
          if (isNaN(totalDebtAmount) || totalDebtAmount <= 0) {
            console.error("Invalid total debt amount:", totalDebtAmount);
            alert("Sale recorded but debt amount is invalid. Please add debt manually.");
            return;
          }

          try {
            const debtPayload = {
              saleId: String(createdSale._id),
              itemName: String(itemInInventory.itemName),
              customerName: String(customerName.trim() || "Unknown Customer"),
              totalAmount: Number(totalDebtAmount),
              amountPaid: Number(amountPaidOnDebt),
              originalProfit: Number(profitForThisSale),
            };

            console.log("Creating debt with payload:", debtPayload);

            const debtResponse = await fetch("/api/debts", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(debtPayload),
            });

            console.log("Debt API response status:", debtResponse.status);

            if (!debtResponse.ok) {
              let errorMessage = `HTTP ${debtResponse.status}: ${debtResponse.statusText}`;
              try {
                const contentType = debtResponse.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                  const errorJson = await debtResponse.json();
                  errorMessage = errorJson.message || errorJson.error || JSON.stringify(errorJson);
                } else {
                  const errorText = await debtResponse.text();
                  errorMessage = errorText || errorMessage;
                }
              } catch (parseError) {
                console.error("Could not parse error response:", parseError);
              }
              console.error("Error creating debt record:", errorMessage);
              alert(`⚠️ Sale recorded but debt tracking failed: ${errorMessage}\n\nPlease go to Debts section and add it manually.`);
            } else {
              try {
                const createdDebt = await debtResponse.json();
                console.log("✅ Debt created successfully:", createdDebt);
                // Show success message
                const debtSuccessMsg = `Debt successfully recorded for ${customerName || 'customer'}`;
                console.log(debtSuccessMsg);
              } catch (parseError) {
                console.error("Could not parse debt response:", parseError);
                alert("Debt might have been created but response parsing failed. Check Debts section.");
              }
            }
          } catch (debtError) {
            console.error("Network error creating debt record:", debtError);
            alert(`⚠️ Sale recorded but network error during debt creation: ${debtError.message}\n\nPlease add debt manually in Debts section.`);
          }
        }

        alert(
          `Sale recorded for ${
            itemInInventory.itemName
          }${
            isPaid 
              ? `. Profit: ${formatCurrency(profitForThisSale)}` 
              : `. Debt: ${formatCurrency(sellingPricePerSellingUnit * quantitySoldInSellingUnits)} (unresolved)`
          }`
        );
        
        // Reset form
        setSelectedItemId("");
        setSaleQuantity("");
        setSellingPrice("");
        setIsPaid(true);
        setDebtAmountPaid("");
        setCustomerName("");
        setPaymentMethod("cash");
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

  const handleUndoSale = async () => {
    if (undoStack.length === 0) {
      alert("No sales to undo.");
      return;
    }

    const latestSale = undoStack[undoStack.length - 1];
    const { saleId, itemId, quantitySoldInStockUnits, profitFromSale, isDebt } =
      latestSale;

    try {
      // Delete the sale from the database
      const response = await fetch(`/api/sales/${saleId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove from sales
        setSales((prev) => prev.filter((s) => s._id !== saleId));

        // Restore inventory
        setInventory((prevInv) =>
          prevInv.map((item) =>
            item._id === itemId
              ? {
                  ...item,
                  quantity: item.quantity + quantitySoldInStockUnits,
                }
              : item
          )
        );

        // Adjust total profit
        setTotalProfit((prevProfit) => prevProfit - profitFromSale);

        // If this was a debt sale, also delete the debt record
        if (isDebt) {
          try {
            // Find the debt record associated with this sale
            const debtsResponse = await fetch("/api/debts");
            if (debtsResponse.ok) {
              const debts = await debtsResponse.json();
              const debtRecord = debts.find((d) => d.saleId === saleId);
              
              if (debtRecord) {
                // Delete the debt record
                await fetch(`/api/debts/${debtRecord._id}`, {
                  method: "DELETE",
                });
                console.log("Debt record deleted for sale:", saleId);
              }
            }
          } catch (error) {
            console.error("Error deleting debt record:", error);
            // Don't fail the undo if debt deletion fails - the sale was already undone
          }
        }

        // Move from undo stack to redo stack
        setUndoStack((prev) => prev.slice(0, -1));
        setRedoStack((prev) => [...prev, latestSale]);

        alert("Sale undone successfully. Inventory restored.");
      } else {
        alert("Failed to undo sale.");
      }
    } catch (error) {
      alert(`Error undoing sale: ${error.message}`);
    }
  };

  const handleRedoSale = async () => {
    if (redoStack.length === 0) {
      alert("No sales to redo.");
      return;
    }

    const latestUndone = redoStack[redoStack.length - 1];
    const {
      itemId,
      quantitySoldInStockUnits,
      profitFromSale,
      isDebt,
      itemName,
      quantitySold,
      sellingPrice,
      unitSold,
      costPriceAtTimeOfSale,
      saleDate,
      paymentMethod,
      customerName,
      totalDebtAmount,
      amountPaidOnDebt,
      originalProfit,
    } = latestUndone;

    try {
      // Recreate the sale using stored data
      const salePayload = {
        itemId,
        itemName,
        quantitySold,
        sellingPrice,
        profit: isDebt ? 0 : profitFromSale, // Don't record profit for debts
        unitSold,
        costPriceAtTimeOfSale,
        saleDate,
        isDebt: isDebt || false,
        paymentMethod: paymentMethod || "cash",
      };

      console.log("Redo sale payload:", salePayload);

      const response = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(salePayload),
      });

      if (response.ok) {
        const restoredSale = await response.json();
        console.log("✅ Sale restored successfully:", restoredSale);

        // Add back to sales
        setSales((prev) => [...prev, restoredSale]);

        // Deduct from inventory
        setInventory((prevInv) =>
          prevInv.map((item) =>
            item._id === itemId
              ? {
                  ...item,
                  quantity: item.quantity - quantitySoldInStockUnits,
                }
              : item
          )
        );

        // Adjust total profit only for paid sales
        if (!isDebt) {
          setTotalProfit((prevProfit) => prevProfit + profitFromSale);
        }

        // If this was a debt sale, recreate the debt record
        if (isDebt) {
          try {
            const debtPayload = {
              saleId: String(restoredSale._id),
              itemName: String(itemName || "Unknown"),
              customerName: String(customerName || "Unknown Customer"),
              totalAmount: Number(totalDebtAmount || 0),
              amountPaid: Number(amountPaidOnDebt || 0),
              originalProfit: Number(originalProfit || 0),
            };

            console.log("Redo debt payload:", debtPayload);

            const debtResponse = await fetch("/api/debts", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(debtPayload),
            });

            if (debtResponse.ok) {
              console.log("✅ Debt recreated successfully on redo");
            } else {
              const errorData = await debtResponse.json();
              console.error("Failed to recreate debt record on redo:", errorData);
              alert(
                "Sale redone but debt record recreation failed. Please add it manually."
              );
            }
          } catch (error) {
            console.error("Error recreating debt record:", error);
            alert(
              "Sale redone but debt record recreation failed. Please add it manually."
            );
          }
        }

        // Move from redo stack back to undo stack
        setRedoStack((prev) => prev.slice(0, -1));
        setUndoStack((prev) => [...prev, latestUndone]);

        alert("Sale redone successfully.");
      } else {
        const errorData = await response.json();
        console.error("Failed to redo sale. Response:", errorData);
        alert(`Failed to redo sale: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      alert(`Error redoing sale: ${error.message}`);
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

    if (currentView === "debts") {
      return (
        <DebtTracker
          theme={THEMES[currentTheme]}
          isDarkMode={isDarkMode}
          onBack={() => setCurrentView("dashboard")}
          onDebtSettled={handleDebtSettled}
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
                  sales.length > 0
                    ? isDarkMode
                      ? `${THEMES[currentTheme].dark.accentLight} hover:${THEMES[currentTheme].dark.accentBg} ${THEMES[currentTheme].dark.accent}`
                      : "bg-purple-600 hover:bg-purple-700 text-white"
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

              <button
                onClick={() => setCurrentView("debts")}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all shadow-md ${
                  isDarkMode
                    ? `${THEMES[currentTheme].dark.accentLight} hover:${THEMES[currentTheme].dark.accentBg} ${THEMES[currentTheme].dark.accent}`
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
                title="Manage customer debts and payments"
              >
                💳 Debts
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

                {/* Payment Status Toggle */}
                <div className={`p-4 rounded-lg ${isDarkMode ? THEMES[currentTheme].dark.bgTertiary : "bg-slate-100"}`}>
                  <label className={`block text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"} mb-3`}>
                    Payment Status:
                  </label>
                  <div className="flex gap-4 items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentStatus"
                        checked={isPaid}
                        onChange={() => {
                          setIsPaid(true);
                          setDebtAmountPaid("");
                          setCustomerName("");
                        }}
                        className="w-4 h-4"
                      />
                      <span className={`text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                        ✓ Paid
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentStatus"
                        checked={!isPaid}
                        onChange={() => setIsPaid(false)}
                        className="w-4 h-4"
                      />
                      <span className={`text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                        💳 Debt
                      </span>
                    </label>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className={`p-4 rounded-lg ${isDarkMode ? THEMES[currentTheme].dark.bgTertiary : "bg-slate-100"}`}>
                  <label className={`block text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"} mb-3`}>
                    Payment Method:
                  </label>
                  <div className="flex gap-4 items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={paymentMethod === "cash"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className={`text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                        💵 Cash
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="transfer"
                        checked={paymentMethod === "transfer"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className={`text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                        💳 Transfer
                      </span>
                    </label>
                  </div>
                </div>

                {/* Debt Fields - Show only when marked as debt */}
                {!isPaid && (
                  <div className="space-y-4 p-4 rounded-lg border-2 border-orange-500 bg-opacity-10" style={{backgroundColor: isDarkMode ? 'rgba(234, 179, 8, 0.1)' : 'rgba(255, 193, 7, 0.1)'}}>
                    <div>
                      <label
                        htmlFor="customerName"
                        className={`block text-sm font-medium ${
                          isDarkMode ? "text-slate-300" : "text-slate-700"
                        } mb-1`}
                      >
                        Customer Name (Optional):
                      </label>
                      <input
                        type="text"
                        id="customerName"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter customer name"
                        className={`w-full p-3 border rounded-lg transition-all ${
                          isDarkMode
                            ? `${THEMES[currentTheme].dark.bgTertiary} ${THEMES[currentTheme].dark.border} ${THEMES[currentTheme].dark.text} placeholder-slate-500 focus:ring-2 ${THEMES[currentTheme].dark.accentBg}`
                            : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-orange-500 focus:border-orange-500"
                        }`}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="debtAmountPaid"
                        className={`block text-sm font-medium ${
                          isDarkMode ? "text-slate-300" : "text-slate-700"
                        } mb-1`}
                      >
                        Amount Already Paid (If Any):
                      </label>
                      <input
                        type="number"
                        id="debtAmountPaid"
                        value={debtAmountPaid}
                        onChange={(e) => setDebtAmountPaid(e.target.value)}
                        placeholder="0.00 (Leave blank or 0 if unpaid)"
                        min="0"
                        step="0.01"
                        className={`w-full p-3 border rounded-lg transition-all ${
                          isDarkMode
                            ? `${THEMES[currentTheme].dark.bgTertiary} ${THEMES[currentTheme].dark.border} ${THEMES[currentTheme].dark.text} placeholder-slate-500 focus:ring-2 ${THEMES[currentTheme].dark.accentBg}`
                            : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-orange-500 focus:border-orange-500"
                        }`}
                      />
                      <p className={`text-xs mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                        Leave blank or enter 0 if customer hasn't paid anything yet
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className={`flex-1 font-medium py-3 px-4 rounded-lg transition-all shadow-md ${
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
                  <button
                    type="button"
                    onClick={handleUndoSale}
                    className={`flex-1 font-medium py-3 px-4 rounded-lg transition-all shadow-md ${
                      isDarkMode
                        ? `${undoStack.length > 0 ? "bg-orange-900 hover:bg-orange-800" : "bg-slate-700"} ${THEMES[currentTheme].dark.text} disabled:text-slate-400`
                        : `${undoStack.length > 0 ? "bg-orange-500 hover:bg-orange-600" : "bg-slate-400"} text-white disabled:text-slate-500`
                    } disabled:cursor-not-allowed`}
                    disabled={undoStack.length === 0}
                    title={`Undo (${undoStack.length} available)`}
                  >
                    ↶ Undo
                  </button>
                  <button
                    type="button"
                    onClick={handleRedoSale}
                    className={`flex-1 font-medium py-3 px-4 rounded-lg transition-all shadow-md ${
                      isDarkMode
                        ? `${redoStack.length > 0 ? "bg-blue-900 hover:bg-blue-800" : "bg-slate-700"} ${THEMES[currentTheme].dark.text} disabled:text-slate-400`
                        : `${redoStack.length > 0 ? "bg-blue-500 hover:bg-blue-600" : "bg-slate-400"} text-white disabled:text-slate-500`
                    } disabled:cursor-not-allowed`}
                    disabled={redoStack.length === 0}
                    title={`Redo (${redoStack.length} available)`}
                  >
                    ↷ Redo
                  </button>
                </div>
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
                      Debt Status
                    </th>
                    <th
                      className={`px-3 py-3 text-left text-xs font-medium ${
                        isDarkMode ? THEMES[currentTheme].dark.textSecondary : "text-slate-500"
                      } uppercase tracking-wider`}
                    >
                      Payment Method
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
                              sale.isDebt
                                ? isDarkMode
                                  ? "text-orange-400"
                                  : "text-orange-600"
                                : sale.profit >= 0
                                ? isDarkMode
                                  ? "text-green-400"
                                  : "text-green-600"
                                : isDarkMode
                                ? "text-red-400"
                                : "text-red-600"
                            }`}
                          >
                            {sale.isDebt ? "🔄 Unresolved" : formatCurrency(sale.profit)}
                          </td>
                          <td
                            className={`px-3 py-4 whitespace-nowrap text-sm font-semibold`}
                          >
                            {sale.isDebt ? (
                              <span className={isDarkMode ? "text-orange-400" : "text-orange-600"}>
                                💳 Pending Debt
                              </span>
                            ) : (
                              <span className={isDarkMode ? "text-green-400" : "text-green-600"}>
                                ✓ Paid
                              </span>
                            )}
                          </td>
                          <td
                            className={`px-3 py-4 whitespace-nowrap text-sm font-medium ${
                              isDarkMode ? "text-gray-300" : "text-slate-600"
                            }`}
                          >
                            {(() => {
                              const method = sale.paymentMethod || "cash";
                              return method === "transfer" ? (
                                <span>💳 Transfer</span>
                              ) : (
                                <span>💵 Cash</span>
                              );
                            })()}
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
