"use client";
import React, { useRef, useState, useContext } from "react";
import { ThemeContext } from "@/components/Provider";

interface InvoiceItem {
  _id: string;
  itemName: string;
  quantitySold: number;
  sellingPrice: number;
  unitSold: string;
  profit: number;
  costPriceAtTimeOfSale: number;
  saleDate: string;
}

interface InvoiceReceipt {
  sales: InvoiceItem[];
  inventory: any[];
  isDarkMode: boolean;
  onBack: () => void;
  formatCurrency: (value: number) => string;
}

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
      accent: "text-emerald-400",
      accentBg: "bg-emerald-900",
      accentLight: "bg-emerald-800",
    },
  },
  sunset: {
    name: "Sunset Orange",
    dark: {
      bg: "bg-amber-950",
      bgSecondary: "bg-amber-900",
      bgTertiary: "bg-amber-800",
      text: "text-amber-50",
      textSecondary: "text-amber-400",
      border: "border-amber-700",
      accent: "text-orange-400",
      accentBg: "bg-orange-900",
      accentLight: "bg-orange-800",
    },
  },
  amethyst: {
    name: "Amethyst Purple",
    dark: {
      bg: "bg-purple-950",
      bgSecondary: "bg-purple-900",
      bgTertiary: "bg-purple-800",
      text: "text-purple-50",
      textSecondary: "text-purple-400",
      border: "border-purple-700",
      accent: "text-purple-400",
      accentBg: "bg-purple-900",
      accentLight: "bg-purple-800",
    },
  },
  crimson: {
    name: "Crimson Red",
    dark: {
      bg: "bg-red-950",
      bgSecondary: "bg-red-900",
      bgTertiary: "bg-red-800",
      text: "text-red-50",
      textSecondary: "text-red-400",
      border: "border-red-700",
      accent: "text-red-400",
      accentBg: "bg-red-900",
      accentLight: "bg-red-800",
    },
  },
  ocean: {
    name: "Ocean Cyan",
    dark: {
      bg: "bg-cyan-950",
      bgSecondary: "bg-cyan-900",
      bgTertiary: "bg-cyan-800",
      text: "text-cyan-50",
      textSecondary: "text-cyan-400",
      border: "border-cyan-700",
      accent: "text-cyan-400",
      accentBg: "bg-cyan-900",
      accentLight: "bg-cyan-800",
    },
  },
};

export default function InvoiceReceipt({
  sales,
  isDarkMode,
  onBack,
  formatCurrency,
}: InvoiceReceipt) {
  const themeContext = useContext(ThemeContext);
  const currentTheme = themeContext?.currentTheme || "midnight";
  
  const [selectedSales, setSelectedSales] = useState<string[]>([]);
  const [businessName, setBusinessName] = useState("BroyoungTradeStores");
  const [buyerName, setBuyerName] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [notes, setNotes] = useState("");
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const [signature, setSignature] = useState<string>("");
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialize invoice date on client side to prevent hydration mismatch
  React.useEffect(() => {
    setInvoiceDate(new Date().toISOString().split("T")[0]);
  }, []);

  // Drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!signatureCanvasRef.current) return;
    setIsDrawing(true);
    const canvas = signatureCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !signatureCanvasRef.current) return;
    const canvas = signatureCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (signatureCanvasRef.current) {
      setSignature(signatureCanvasRef.current.toDataURL());
    }
  };

  const clearSignature = () => {
    if (signatureCanvasRef.current) {
      const ctx = signatureCanvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(
          0,
          0,
          signatureCanvasRef.current.width,
          signatureCanvasRef.current.height
        );
      }
      setSignature("");
    }
  };

  const toggleSaleSelection = (saleId: string) => {
    setSelectedSales((prev) =>
      prev.includes(saleId)
        ? prev.filter((id) => id !== saleId)
        : [...prev, saleId]
    );
  };

  const selectedSalesData = sales.filter((sale) =>
    selectedSales.includes(sale._id)
  );

  const totalAmount = selectedSalesData.reduce(
    (sum, sale) => sum + sale.quantitySold * sale.sellingPrice,
    0
  );

  const totalCost = selectedSalesData.reduce(
    (sum, sale) => sum + sale.costPriceAtTimeOfSale * sale.quantitySold,
    0
  );

  const totalProfit = totalAmount - totalCost;

  const printInvoice = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Invoice #${invoiceNumber}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Courier New', Courier, monospace;
              background: white;
              padding: 20px;
            }
            .receipt-container {
              max-width: 800px;
              margin: 0 auto;
              border: 2px solid #000;
              padding: 30px;
              background: white;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #000;
              padding-bottom: 20px;
              margin-bottom: 20px;
            }
            .header h1 {
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .header p {
              font-size: 12px;
              margin-bottom: 5px;
            }
            .invoice-details {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
              font-size: 12px;
            }
            .details-section {
              flex: 1;
            }
            .details-section strong {
              display: block;
              margin-bottom: 5px;
            }
            .divider {
              border-bottom: 1px dashed #000;
              margin: 15px 0;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
              font-size: 12px;
            }
            .items-table th {
              border-bottom: 2px solid #000;
              padding: 10px 5px;
              text-align: left;
              font-weight: bold;
            }
            .items-table td {
              padding: 8px 5px;
              border-bottom: 1px solid #ccc;
            }
            .items-table tr:last-child td {
              border-bottom: 2px solid #000;
            }
            .amount-right {
              text-align: right;
            }
            .summary {
              margin-top: 20px;
              text-align: right;
              font-size: 12px;
            }
            .summary-line {
              display: flex;
              justify-content: flex-end;
              margin-bottom: 5px;
            }
            .summary-line span:first-child {
              min-width: 150px;
            }
            .summary-line span:last-child {
              min-width: 100px;
              text-align: right;
            }
            .total-line {
              border-top: 2px solid #000;
              padding-top: 10px;
              font-weight: bold;
              font-size: 14px;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 11px;
              border-top: 1px solid #000;
              padding-top: 20px;
            }
            .signature-section {
              margin-top: 40px;
              display: flex;
              justify-content: space-between;
              font-size: 11px;
            }
            .signature-box {
              text-align: center;
              min-width: 150px;
            }
            .signature-image {
              height: 60px;
              margin-bottom: 10px;
              border-bottom: 1px solid #000;
            }
            .signature-line {
              height: 60px;
              border-bottom: 1px solid #000;
              margin-bottom: 10px;
            }
            .notes {
              margin-top: 15px;
              font-size: 11px;
              border-top: 1px solid #000;
              padding-top: 10px;
            }
            @media print {
              body {
                padding: 0;
              }
              .receipt-container {
                border: none;
                max-width: 100%;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="header">
              <h1>${businessName}</h1>
              <p>INVOICE / RECEIPT</p>
            </div>

            <div class="invoice-details">
              <div class="details-section">
                <strong>Invoice #:</strong>
                <p>${invoiceNumber || "N/A"}</p>
                <strong>Date:</strong>
                <p>${invoiceDate}</p>
              </div>
              <div class="details-section">
                <strong>Customer:</strong>
                <p>${buyerName || "Not Specified"}</p>
              </div>
            </div>

            <div class="divider"></div>

            <table class="items-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Unit Price</th>
                  <th class="amount-right">Total</th>
                </tr>
              </thead>
              <tbody>
                ${selectedSalesData
                  .map(
                    (sale) => `
                  <tr>
                    <td>${sale.itemName}</td>
                    <td>${sale.quantitySold}</td>
                    <td>${sale.unitSold}</td>
                    <td>${formatCurrency(sale.sellingPrice)}</td>
                    <td class="amount-right">${formatCurrency(
                      sale.quantitySold * sale.sellingPrice
                    )}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>

            <div class="summary">
              <div class="summary-line">
                <span>Total Amount:</span>
                <span>${formatCurrency(totalAmount)}</span>
              </div>
            </div>

            ${
              signature || true
                ? `
              <div class="signature-section">
                <div class="signature-box">
                  ${
                    signature
                      ? `<div class="signature-image"><img src="${signature}" style="height: 100%; width: 100%; object-fit: contain;" /></div>`
                      : '<div class="signature-line"></div>'
                  }
                  <p>Seller Signature</p>
                </div>
                <div class="signature-box">
                  <div class="signature-line"></div>
                  <p>Buyer Signature</p>
                </div>
              </div>
            `
                : ""
            }

            ${
              notes
                ? `
              <div class="notes">
                <strong>Notes:</strong>
                <p>${notes}</p>
              </div>
            `
                : ""
            }

            <div class="footer">
              <p>Thank you for your business!</p>
              <p style="margin-top: 10px; font-size: 10px;">Printed on ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div
      className={`p-4 md:p-8 font-sans transition-colors duration-300 min-h-screen ${
        isDarkMode
          ? `${THEMES[currentTheme].dark.bg} ${THEMES[currentTheme].dark.text}`
          : "bg-slate-50 text-slate-900"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className={`px-4 py-2 rounded-lg font-medium transition-all shadow-md mb-6 ${
              isDarkMode
                ? `${THEMES[currentTheme].dark.accentLight} hover:${THEMES[currentTheme].dark.accentBg}`
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            ← Back to Dashboard
          </button>
          <h1
            className={`text-4xl sm:text-5xl font-bold tracking-tight ${
              isDarkMode ? THEMES[currentTheme].dark.accent : "text-slate-900"
            }`}
          >
            Generate Invoice / Receipt
          </h1>
          <p
            className={`mt-2 text-lg ${
              isDarkMode
                ? THEMES[currentTheme].dark.textSecondary
                : "text-slate-600"
            }`}
          >
            Create professional invoices from your sales records
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Form Inputs */}
          <div className="lg:col-span-1">
            <section
              className={`${
                isDarkMode ? THEMES[currentTheme].dark.bgSecondary : "bg-white"
              } p-6 rounded-xl shadow-lg transition-colors duration-300 ${
                isDarkMode ? THEMES[currentTheme].dark.border : "border-slate-200"
              } border`}
            >
              <h2
                className={`text-2xl font-semibold mb-6 pb-3 border-b ${
                  isDarkMode
                    ? `${THEMES[currentTheme].dark.accent} ${THEMES[currentTheme].dark.border}`
                    : "text-blue-600 border-slate-300"
                }`}
              >
                Invoice Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      isDarkMode
                        ? THEMES[currentTheme].dark.textSecondary
                        : "text-slate-700"
                    }`}
                  >
                    Invoice Number:
                  </label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    placeholder="e.g., INV-001"
                    className={`w-full p-3 border rounded-lg transition-all ${
                      isDarkMode
                        ? `${THEMES[currentTheme].dark.bgTertiary} ${THEMES[currentTheme].dark.border} ${THEMES[currentTheme].dark.text} focus:ring-2 ${THEMES[currentTheme].dark.accentBg}`
                        : "bg-white border-slate-300 text-slate-900 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      isDarkMode
                        ? THEMES[currentTheme].dark.textSecondary
                        : "text-slate-700"
                    }`}
                  >
                    Invoice Date:
                  </label>
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className={`w-full p-3 border rounded-lg transition-all ${
                      isDarkMode
                        ? `${THEMES[currentTheme].dark.bgTertiary} ${THEMES[currentTheme].dark.border} ${THEMES[currentTheme].dark.text} focus:ring-2 ${THEMES[currentTheme].dark.accentBg}`
                        : "bg-white border-slate-300 text-slate-900 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      isDarkMode
                        ? THEMES[currentTheme].dark.textSecondary
                        : "text-slate-700"
                    }`}
                  >
                    Business Name:
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Your business name"
                    className={`w-full p-3 border rounded-lg transition-all ${
                      isDarkMode
                        ? `${THEMES[currentTheme].dark.bgTertiary} ${THEMES[currentTheme].dark.border} ${THEMES[currentTheme].dark.text} focus:ring-2 ${THEMES[currentTheme].dark.accentBg}`
                        : "bg-white border-slate-300 text-slate-900 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      isDarkMode
                        ? THEMES[currentTheme].dark.textSecondary
                        : "text-slate-700"
                    }`}
                  >
                    Buyer Name:
                  </label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Customer name"
                    className={`w-full p-3 border rounded-lg transition-all ${
                      isDarkMode
                        ? `${THEMES[currentTheme].dark.bgTertiary} ${THEMES[currentTheme].dark.border} ${THEMES[currentTheme].dark.text} focus:ring-2 ${THEMES[currentTheme].dark.accentBg}`
                        : "bg-white border-slate-300 text-slate-900 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      isDarkMode
                        ? THEMES[currentTheme].dark.textSecondary
                        : "text-slate-700"
                    }`}
                  >
                    Notes:
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Additional notes or terms..."
                    rows={3}
                    className={`w-full p-3 border rounded-lg transition-all ${
                      isDarkMode
                        ? `${THEMES[currentTheme].dark.bgTertiary} ${THEMES[currentTheme].dark.border} ${THEMES[currentTheme].dark.text} focus:ring-2 ${THEMES[currentTheme].dark.accentBg}`
                        : "bg-white border-slate-300 text-slate-900 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                </div>

                <button
                  onClick={() => setShowSignaturePad(!showSignaturePad)}
                  className={`w-full px-4 py-2.5 rounded-lg font-medium transition-all shadow-md ${
                    isDarkMode
                      ? `${THEMES[currentTheme].dark.accentLight} hover:${THEMES[currentTheme].dark.accentBg} ${THEMES[currentTheme].dark.accent}`
                      : "bg-purple-600 hover:bg-purple-700 text-white"
                  }`}
                >
                  {showSignaturePad ? "Hide Signature Pad" : "Add Signature"}
                </button>

                {showSignaturePad && (
                  <div className="mt-4 p-4 bg-white rounded-lg border-2 border-dashed border-gray-300">
                    <p
                      className={`text-sm font-medium mb-2 ${
                        isDarkMode ? "text-gray-300" : "text-slate-700"
                      }`}
                    >
                      Draw your signature:
                    </p>
                    <canvas
                      ref={signatureCanvasRef}
                      width={280}
                      height={100}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      className="border border-gray-400 rounded cursor-crosshair bg-white w-full"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={clearSignature}
                        className="flex-1 px-3 py-2 rounded bg-slate-500 hover:bg-slate-600 text-white text-sm font-medium"
                      >
                        Clear
                      </button>
                    </div>
                    {signature && (
                      <p className="text-xs text-green-600 mt-2">
                        ✓ Signature captured
                      </p>
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Middle Panel - Sales Selection */}
          <div className="lg:col-span-2">
            <section
              className={`${
                isDarkMode ? THEMES[currentTheme].dark.bgSecondary : "bg-white"
              } p-6 rounded-xl shadow-lg transition-colors duration-300 ${
                isDarkMode ? THEMES[currentTheme].dark.border : "border-slate-200"
              } border`}
            >
              <h2
                className={`text-2xl font-semibold mb-6 pb-3 border-b ${
                  isDarkMode
                    ? `${THEMES[currentTheme].dark.accent} ${THEMES[currentTheme].dark.border}`
                    : "text-blue-600 border-slate-300"
                }`}
              >
                Select Sales to Include
              </h2>

              {sales.length === 0 ? (
                <p
                  className={`${
                    isDarkMode ? "text-slate-400" : "text-slate-500"
                  } py-4 text-center`}
                >
                  No sales recorded yet. Record sales first to generate invoices.
                </p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {sales.map((sale) => (
                    <div
                      key={sale._id}
                      onClick={() => toggleSaleSelection(sale._id)}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        selectedSales.includes(sale._id)
                          ? isDarkMode
                            ? `${THEMES[currentTheme].dark.accentBg} ${THEMES[currentTheme].dark.accent} border-2 ${THEMES[currentTheme].dark.border}`
                            : "bg-blue-100 border-2 border-blue-500 text-blue-900"
                          : isDarkMode
                          ? `${THEMES[currentTheme].dark.bgTertiary} border-2 ${THEMES[currentTheme].dark.border} hover:border-blue-400`
                          : "bg-slate-100 border-2 border-slate-300 hover:border-blue-400"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedSales.includes(sale._id)}
                          onChange={() => {}}
                          className="mt-1 w-5 h-5 cursor-pointer"
                        />
                        <div className="flex-1">
                          <p className="font-semibold">{sale.itemName}</p>
                          <div
                            className={`text-sm ${
                              isDarkMode
                                ? THEMES[currentTheme].dark.textSecondary
                                : "text-slate-600"
                            } grid grid-cols-2 gap-2 mt-1`}
                          >
                            <span>
                              Qty: {sale.quantitySold} {sale.unitSold}
                            </span>
                            <span>
                              Price: {formatCurrency(sale.sellingPrice)}
                            </span>
                            <span>
                              Total:{" "}
                              {formatCurrency(
                                sale.quantitySold * sale.sellingPrice
                              )}
                            </span>
                            <span>
                              Date:{" "}
                              {new Date(sale.saleDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Summary */}
            {selectedSalesData.length > 0 && (
              <section
                className={`mt-8 ${
                  isDarkMode ? THEMES[currentTheme].dark.bgSecondary : "bg-white"
                } p-6 rounded-xl shadow-lg transition-colors duration-300 ${
                  isDarkMode ? THEMES[currentTheme].dark.border : "border-slate-200"
                } border`}
              >
                <h3
                  className={`text-xl font-semibold mb-4 pb-3 border-b ${
                    isDarkMode
                      ? `${THEMES[currentTheme].dark.accent} ${THEMES[currentTheme].dark.border}`
                      : "text-emerald-600 border-slate-300"
                  }`}
                >
                  Invoice Summary
                </h3>

                <div
                  className={`space-y-3 text-lg ${
                    isDarkMode
                      ? THEMES[currentTheme].dark.textSecondary
                      : "text-slate-600"
                  }`}
                >
                  <div className="flex justify-between">
                    <span>Items Selected:</span>
                    <span className="font-semibold">
                      {selectedSalesData.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Quantity:</span>
                    <span className="font-semibold">
                      {selectedSalesData.reduce(
                        (sum, s) => sum + s.quantitySold,
                        0
                      )}
                    </span>
                  </div>
                  <div
                    className={`border-t pt-3 text-xl font-bold ${
                      isDarkMode
                        ? THEMES[currentTheme].dark.text
                        : "text-slate-900"
                    }`}
                  >
                    <div className="flex justify-between">
                      <span>Total Sale Amount:</span>
                      <span className="text-emerald-600">
                        {formatCurrency(totalAmount)}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`text-lg font-semibold ${
                      isDarkMode
                        ? THEMES[currentTheme].dark.textSecondary
                        : "text-slate-600"
                    }`}
                  >
                    <div className="flex justify-between">
                      <span>Total Profit:</span>
                      <span
                        className={
                          totalProfit >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {formatCurrency(totalProfit)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={printInvoice}
                  disabled={selectedSalesData.length === 0}
                  className={`w-full mt-6 px-6 py-3 rounded-lg font-medium transition-all shadow-md ${
                    selectedSalesData.length > 0
                      ? isDarkMode
                        ? `${THEMES[currentTheme].dark.accentLight} hover:${THEMES[currentTheme].dark.accentBg} ${THEMES[currentTheme].dark.accent}`
                        : "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : isDarkMode
                      ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                      : "bg-slate-300 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  🖨️ Print / Generate Invoice
                </button>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
