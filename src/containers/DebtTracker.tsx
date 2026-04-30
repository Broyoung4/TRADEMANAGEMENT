"use client";
import React, { useState, useEffect } from "react";

const DebtTracker = ({ theme, isDarkMode, onBack, onDebtSettled }) => {
  const themeConfig = theme?.dark || {};
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showAddDebtForm, setShowAddDebtForm] = useState(false);
  const [customerFilter, setCustomerFilter] = useState("all"); // all, pending, partial, settled
  const [sortBy, setSortBy] = useState("latest"); // latest, oldest, amountOwed
  const [newDebtForm, setNewDebtForm] = useState({
    customerName: "",
    itemName: "",
    totalAmount: "",
    amountPaid: "",
  });

  // Fetch debts
  useEffect(() => {
    fetchDebts();
  }, []);

  const fetchDebts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/debts");
      if (!response.ok) throw new Error("Failed to fetch debts");
      const data = await response.json();
      setDebts(data);
    } catch (error) {
      console.error("Error fetching debts:", error);
      alert("Failed to load debts");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedDebt || !paymentAmount || parseFloat(paymentAmount) <= 0) {
      alert("Please enter a valid payment amount");
      return;
    }

    try {
      const response = await fetch(`/api/debts/${selectedDebt._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountPaid: parseFloat(paymentAmount),
          note: paymentNote,
        }),
      });

      if (!response.ok) throw new Error("Failed to record payment");
      const updatedDebt = await response.json();

      setDebts(debts.map((d) => (d._id === updatedDebt._id ? updatedDebt : d)));
      setPaymentAmount("");
      setPaymentNote("");
      setShowPaymentForm(false);
      setSelectedDebt(null);
      
      // If debt is now settled, notify parent to update profit
      if (updatedDebt.debtStatus === "settled" && onDebtSettled) {
        onDebtSettled(updatedDebt.originalProfit);
      }
      
      alert("Payment recorded successfully");
    } catch (error) {
      console.error("Error recording payment:", error);
      alert("Failed to record payment");
    }
  };

  const handleDeleteDebt = async (debtId) => {
    if (!confirm("Are you sure you want to delete this debt record?")) return;

    try {
      const response = await fetch(`/api/debts/${debtId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete debt");
      setDebts(debts.filter((d) => d._id !== debtId));
      alert("Debt record deleted");
    } catch (error) {
      console.error("Error deleting debt:", error);
      alert("Failed to delete debt");
    }
  };

  const handleAddNewDebt = async () => {
    const { customerName, itemName, totalAmount, amountPaid } = newDebtForm;

    if (!itemName.trim() || !totalAmount || parseFloat(totalAmount) <= 0) {
      alert("Please enter valid item name and total amount");
      return;
    }

    try {
      const response = await fetch("/api/debts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          saleId: new Date().getTime().toString(), // Generate a temporary ID for this debt
          itemName: itemName.trim(),
          customerName: customerName.trim() || "Unknown",
          totalAmount: parseFloat(totalAmount),
          amountPaid: amountPaid ? parseFloat(amountPaid) : 0,
        }),
      });

      if (!response.ok) throw new Error("Failed to create debt");
      const createdDebt = await response.json();

      setDebts([createdDebt, ...debts]);
      setNewDebtForm({
        customerName: "",
        itemName: "",
        totalAmount: "",
        amountPaid: "",
      });
      setShowAddDebtForm(false);
      alert("Debt record created successfully");
    } catch (error) {
      console.error("Error creating debt:", error);
      alert("Failed to create debt: " + error.message);
    }
  };

  // Filter debts
  let filteredDebts = debts;
  if (customerFilter !== "all") {
    filteredDebts = debts.filter((d) => d.debtStatus === customerFilter);
  }

  // Sort debts
  if (sortBy === "latest") {
    filteredDebts = [...filteredDebts].sort(
      (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
    );
  } else if (sortBy === "oldest") {
    filteredDebts = [...filteredDebts].sort(
      (a, b) => new Date(a.createdDate) - new Date(b.createdDate)
    );
  } else if (sortBy === "amountOwed") {
    filteredDebts = [...filteredDebts].sort((a, b) => b.amountOwed - a.amountOwed);
  }

  // Calculate statistics
  const totalDebts = debts.reduce((sum, d) => sum + d.totalAmount, 0);
  const totalPaid = debts.reduce((sum, d) => sum + d.amountPaid, 0);
  const totalOwed = debts.reduce((sum, d) => sum + d.amountOwed, 0);
  const pendingCount = debts.filter((d) => d.debtStatus === "pending").length;
  const partialCount = debts.filter((d) => d.debtStatus === "partial").length;
  const settledCount = debts.filter((d) => d.debtStatus === "settled").length;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return isDarkMode ? "bg-red-900 text-red-100" : "bg-red-100 text-red-800";
      case "partial":
        return isDarkMode
          ? "bg-yellow-900 text-yellow-100"
          : "bg-yellow-100 text-yellow-800";
      case "settled":
        return isDarkMode
          ? "bg-green-900 text-green-100"
          : "bg-green-100 text-green-800";
      default:
        return "";
    }
  };

  return (
    <div
      className={`min-h-screen ${themeConfig.bg} ${themeConfig.text} p-6 transition-colors`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {onBack && (
              <button
                onClick={onBack}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                ← Back to Dashboard
              </button>
            )}
          </div>
          <h1 className="text-4xl font-bold mb-2">Debt Tracker</h1>
          <p className={`${themeConfig.textSecondary}`}>
            Manage customer debts and payment history
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div
            className={`p-4 rounded-lg border ${themeConfig.border} ${themeConfig.bgSecondary}`}
          >
            <p className={`${themeConfig.textSecondary} text-sm`}>Total Debts</p>
            <p className={`text-2xl font-bold ${themeConfig.accent}`}>
              {formatCurrency(totalDebts)}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg border ${themeConfig.border} ${themeConfig.bgSecondary}`}
          >
            <p className={`${themeConfig.textSecondary} text-sm`}>Paid</p>
            <p className="text-2xl font-bold text-green-400">
              {formatCurrency(totalPaid)}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg border ${themeConfig.border} ${themeConfig.bgSecondary}`}
          >
            <p className={`${themeConfig.textSecondary} text-sm`}>Still Owed</p>
            <p className="text-2xl font-bold text-red-400">
              {formatCurrency(totalOwed)}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg border ${themeConfig.border} ${themeConfig.bgSecondary}`}
          >
            <p className={`${themeConfig.textSecondary} text-sm`}>Pending</p>
            <p className="text-2xl font-bold text-red-400">{pendingCount}</p>
          </div>

          <div
            className={`p-4 rounded-lg border ${themeConfig.border} ${themeConfig.bgSecondary}`}
          >
            <p className={`${themeConfig.textSecondary} text-sm`}>Settled</p>
            <p className="text-2xl font-bold text-green-400">{settledCount}</p>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className={`${themeConfig.textSecondary} text-sm`}>
              Filter by Status:
            </label>
            <select
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
              className={`${themeConfig.bgTertiary} ${themeConfig.border} border rounded px-3 py-2 mt-1`}
            >
              <option value="all">All Debts</option>
              <option value="pending">Pending (Unpaid)</option>
              <option value="partial">Partial (Partially Paid)</option>
              <option value="settled">Settled (Fully Paid)</option>
            </select>
          </div>

          <div>
            <label className={`${themeConfig.textSecondary} text-sm`}>
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`${themeConfig.bgTertiary} ${themeConfig.border} border rounded px-3 py-2 mt-1`}
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amountOwed">Amount Owed (Highest)</option>
            </select>
          </div>

          <div className="ml-auto">
            <button
              onClick={() => setShowAddDebtForm(true)}
              className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              + Add New Debt
            </button>
          </div>
        </div>

        {/* Debts Table */}
        {loading ? (
          <div className="text-center py-8">
            <p>Loading debts...</p>
          </div>
        ) : filteredDebts.length === 0 ? (
          <div className="text-center py-8">
            <p className={themeConfig.textSecondary}>No debts found</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border" className={`border-${themeConfig.border}`}>
            <table className="w-full">
              <thead>
                <tr className={themeConfig.bgTertiary}>
                  <th
                    className={`px-6 py-3 text-left text-sm font-semibold ${themeConfig.text}`}
                  >
                    Item
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-sm font-semibold ${themeConfig.text}`}
                  >
                    Customer
                  </th>
                  <th
                    className={`px-6 py-3 text-right text-sm font-semibold ${themeConfig.text}`}
                  >
                    Total Amount
                  </th>
                  <th
                    className={`px-6 py-3 text-right text-sm font-semibold ${themeConfig.text}`}
                  >
                    Paid
                  </th>
                  <th
                    className={`px-6 py-3 text-right text-sm font-semibold ${themeConfig.text}`}
                  >
                    Owed
                  </th>
                  <th
                    className={`px-6 py-3 text-center text-sm font-semibold ${themeConfig.text}`}
                  >
                    Status
                  </th>
                  <th
                    className={`px-6 py-3 text-center text-sm font-semibold ${themeConfig.text}`}
                  >
                    Date
                  </th>
                  <th
                    className={`px-6 py-3 text-center text-sm font-semibold ${themeConfig.text}`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDebts.map((debt) => (
                  <tr
                    key={debt._id}
                    className={`border-t ${themeConfig.border} hover:${themeConfig.bgTertiary}`}
                  >
                    <td className={`px-6 py-4 ${themeConfig.text}`}>
                      {debt.itemName}
                    </td>
                    <td className={`px-6 py-4 ${themeConfig.text}`}>
                      {debt.customerName}
                    </td>
                    <td className={`px-6 py-4 text-right ${themeConfig.text}`}>
                      {formatCurrency(debt.totalAmount)}
                    </td>
                    <td
                      className={`px-6 py-4 text-right ${themeConfig.text} text-green-400`}
                    >
                      {formatCurrency(debt.amountPaid)}
                    </td>
                    <td
                      className={`px-6 py-4 text-right ${themeConfig.text} ${
                        debt.amountOwed > 0 ? "text-red-400 font-semibold" : ""
                      }`}
                    >
                      {formatCurrency(debt.amountOwed)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          debt.debtStatus
                        )}`}
                      >
                        {debt.debtStatus.charAt(0).toUpperCase() +
                          debt.debtStatus.slice(1)}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-center ${themeConfig.textSecondary} text-sm`}>
                      {formatDate(debt.createdDate)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedDebt(debt);
                          setShowPaymentForm(true);
                          setPaymentAmount("");
                        }}
                        className="px-3 py-1 rounded text-sm bg-blue-600 hover:bg-blue-700 text-white mr-2"
                      >
                        Pay
                      </button>
                      <button
                        onClick={() => handleDeleteDebt(debt._id)}
                        className="px-3 py-1 rounded text-sm bg-red-600 hover:bg-red-700 text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add New Debt Form Modal */}
        {showAddDebtForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div
              className={`${themeConfig.bgSecondary} ${themeConfig.border} border rounded-lg p-6 max-w-md w-full`}
            >
              <h2 className={`text-2xl font-bold mb-4 ${themeConfig.text}`}>
                Add New Debt
              </h2>

              <div className="mb-4">
                <label className={`${themeConfig.textSecondary} text-sm`}>
                  Customer Name (Optional):
                </label>
                <input
                  type="text"
                  value={newDebtForm.customerName}
                  onChange={(e) =>
                    setNewDebtForm({ ...newDebtForm, customerName: e.target.value })
                  }
                  placeholder="Enter customer name"
                  className={`w-full mt-2 px-3 py-2 ${themeConfig.bgTertiary} ${themeConfig.border} border rounded`}
                />
              </div>

              <div className="mb-4">
                <label className={`${themeConfig.textSecondary} text-sm`}>
                  Item Name *:
                </label>
                <input
                  type="text"
                  value={newDebtForm.itemName}
                  onChange={(e) =>
                    setNewDebtForm({ ...newDebtForm, itemName: e.target.value })
                  }
                  placeholder="Enter item name or description"
                  className={`w-full mt-2 px-3 py-2 ${themeConfig.bgTertiary} ${themeConfig.border} border rounded`}
                />
              </div>

              <div className="mb-4">
                <label className={`${themeConfig.textSecondary} text-sm`}>
                  Total Amount Owed *:
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newDebtForm.totalAmount}
                  onChange={(e) =>
                    setNewDebtForm({ ...newDebtForm, totalAmount: e.target.value })
                  }
                  placeholder="Enter total amount"
                  className={`w-full mt-2 px-3 py-2 ${themeConfig.bgTertiary} ${themeConfig.border} border rounded`}
                />
              </div>

              <div className="mb-6">
                <label className={`${themeConfig.textSecondary} text-sm`}>
                  Amount Already Paid (Optional):
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newDebtForm.amountPaid}
                  onChange={(e) =>
                    setNewDebtForm({ ...newDebtForm, amountPaid: e.target.value })
                  }
                  placeholder="Enter amount paid (if any)"
                  className={`w-full mt-2 px-3 py-2 ${themeConfig.bgTertiary} ${themeConfig.border} border rounded`}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowAddDebtForm(false);
                    setNewDebtForm({
                      customerName: "",
                      itemName: "",
                      totalAmount: "",
                      amountPaid: "",
                    });
                  }}
                  className={`flex-1 px-4 py-2 rounded ${themeConfig.bgTertiary} ${themeConfig.border} border hover:opacity-80`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNewDebt}
                  className="flex-1 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold"
                >
                  Create Debt
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Form Modal */}
        {showPaymentForm && selectedDebt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div
              className={`${themeConfig.bgSecondary} ${themeConfig.border} border rounded-lg p-6 max-w-md w-full`}
            >
              <h2 className={`text-2xl font-bold mb-4 ${themeConfig.text}`}>
                Record Payment
              </h2>

              <div className="mb-4">
                <p className={themeConfig.textSecondary}>Item:</p>
                <p className={`text-lg font-semibold ${themeConfig.text}`}>
                  {selectedDebt.itemName}
                </p>
              </div>

              <div className="mb-4">
                <p className={themeConfig.textSecondary}>Customer:</p>
                <p className={`text-lg font-semibold ${themeConfig.text}`}>
                  {selectedDebt.customerName}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className={`${themeConfig.textSecondary} text-sm`}>
                    Amount Owed
                  </p>
                  <p className={`text-lg font-bold text-red-400`}>
                    {formatCurrency(selectedDebt.amountOwed)}
                  </p>
                </div>
                <div>
                  <p className={`${themeConfig.textSecondary} text-sm`}>
                    Total Debt
                  </p>
                  <p className={`text-lg font-bold ${themeConfig.accent}`}>
                    {formatCurrency(selectedDebt.totalAmount)}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className={`${themeConfig.textSecondary} text-sm`}>
                  Payment Amount:
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={selectedDebt.amountOwed}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter payment amount"
                  className={`w-full mt-2 px-3 py-2 ${themeConfig.bgTertiary} ${themeConfig.border} border rounded`}
                />
              </div>

              <div className="mb-6">
                <label className={`${themeConfig.textSecondary} text-sm`}>
                  Note (Optional):
                </label>
                <textarea
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  placeholder="Add a note about this payment"
                  className={`w-full mt-2 px-3 py-2 ${themeConfig.bgTertiary} ${themeConfig.border} border rounded`}
                  rows="3"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowPaymentForm(false);
                    setSelectedDebt(null);
                    setPaymentAmount("");
                  }}
                  className={`flex-1 px-4 py-2 rounded ${themeConfig.bgTertiary} ${themeConfig.border} border hover:opacity-80`}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  className="flex-1 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold"
                >
                  Record Payment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebtTracker;
