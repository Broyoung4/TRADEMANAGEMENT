'use client';
import React, { useState, useMemo, useEffect, useContext } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { useRouter } from 'next/navigation';
import { ThemeContext } from '@/components/Provider';

// Import THEMES from Nav for consistency
const THEMES = {
  midnight: {
    name: "Midnight Blue",
    dark: {
      bg: "bg-slate-950",
      bgSecondary: "bg-slate-900",
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
      text: "text-cyan-50",
      textSecondary: "text-cyan-300",
      border: "border-cyan-700",
      accent: "text-cyan-400",
      accentBg: "bg-cyan-900",
      accentLight: "bg-cyan-800",
    },
  },
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

// Re-define or ensure formatCurrency is available and correctly imported
const formatCurrency = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return 'N/A';
  }
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
};

// --- Data Processing Functions (keep as they are) ---
const getProfitPerItemData = (sales, isDarkMode) => { // Pass isDarkMode
  if (!sales || sales.length === 0) return null;
  const profitByItem = sales.reduce((acc, sale) => {
    const itemName = sale.itemName || 'Unknown/Deleted Item';
    acc[itemName] = (acc[itemName] || 0) + (sale.profit || 0);
    return acc;
  }, {});

  const sortedItems = Object.entries(profitByItem)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const labels = sortedItems.map(([name]) => name);
  const data = sortedItems.map(([, profit]) => profit);

  if (labels.length === 0) return null;

  const baseColors = [
    'rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(255, 206, 86, 0.7)',
    'rgba(75, 192, 192, 0.7)', 'rgba(153, 102, 255, 0.7)', 'rgba(255, 159, 64, 0.7)',
    'rgba(199, 199, 192, 0.7)', 'rgba(83, 102, 255, 0.7)', 'rgba(100, 255, 64, 0.7)',
    'rgba(255, 100, 100, 0.7)'
  ];
   const borderBaseColors = [
    'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)',
    'rgba(199, 199, 192, 1)', 'rgba(83, 102, 255, 1)', 'rgba(100, 255, 64, 1)',
    'rgba(255, 100, 100, 1)'
  ];


  return {
    labels,
    datasets: [
      {
        label: 'Total Profit per Item (Top 10)',
        data,
        backgroundColor: isDarkMode ? baseColors.map(color => color.replace('0.7', '0.5')) : baseColors,
        borderColor: isDarkMode ? borderBaseColors.map(color => color.replace('1', '0.8')) : borderBaseColors,
        borderWidth: 1,
      },
    ],
  };
};

const getDailyProfitData = (sales, isDarkMode) => { // Pass isDarkMode
  if (!sales || sales.length === 0) return null;
  const profitByDay = sales.reduce((acc, sale) => {
    const day = new Date(sale.saleDate || sale.createdAt).toLocaleDateString('en-CA');
    acc[day] = (acc[day] || 0) + (sale.profit || 0);
    return acc;
  }, {});

  const sortedDays = Object.keys(profitByDay).sort((a, b) => new Date(a) - new Date(b));
  const displayDays = sortedDays.slice(-60);

  const labels = displayDays.map(day => new Date(day).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }));
  const data = displayDays.map(day => profitByDay[day]);

  if (labels.length === 0) return null;

  return {
    labels,
    datasets: [
      {
        label: 'Daily Sales Profit',
        data,
        fill: true,
        backgroundColor: isDarkMode ? 'rgba(153, 102, 255, 0.3)' : 'rgba(153, 102, 255, 0.2)',
        borderColor: isDarkMode ? 'rgba(153, 102, 255, 0.8)' : 'rgba(153, 102, 255, 1)',
        tension: 0.1,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: isDarkMode ? 'rgba(153, 102, 255, 0.8)' : 'rgba(153, 102, 255, 1)',
        pointBorderColor: isDarkMode ? '#374151' : '#fff', // Dark: gray-700, Light: white
      },
    ],
  };
};

const AnalyticsPage = ({ sales: propsSales, inventory: propsInventory, onBack: propsOnBack, isDarkMode: propsIsDarkMode }) => {
  const router = useRouter();
  const themeContext = useContext(ThemeContext);
  const { isDarkMode: contextIsDarkMode = false, currentTheme = "midnight" } = themeContext || {};
  
  // Use provided props or context values
  const isDarkMode = propsIsDarkMode ?? contextIsDarkMode;
  const [sales, setSales] = useState(propsSales || []);
  const [inventory, setInventory] = useState(propsInventory || []);
  const [loading, setLoading] = useState(!propsSales);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  const onBack = propsOnBack || (() => router.back());
  const themeConfig = isDarkMode ? THEMES[currentTheme]?.dark : {};

  // Fetch sales data if not provided as props
  useEffect(() => {
    if (!propsSales) {
      const fetchData = async () => {
        try {
          const response = await fetch('/api/sales');
          const data = await response.json();
          setSales(data);
          setLoading(false);
        } catch (error) {
          console.error('Failed to fetch sales:', error);
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [propsSales]);

  if (loading) {
    return (
      <div className={`p-8 min-h-screen flex items-center justify-center ${isDarkMode ? "bg-gray-900" : "bg-slate-100"}`}>
        <p className={isDarkMode ? "text-gray-200" : "text-slate-700"}>Loading analytics...</p>
      </div>
    );
  }

  // Filter sales by selected month
  const filteredSales = useMemo(() => {
    if (!sales || !Array.isArray(sales)) return [];
    if (!selectedMonth) return sales;
    
    return sales.filter(sale => {
      const saleDate = new Date(sale.saleDate || sale.createdAt);
      const saleMonth = `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, '0')}`;
      return saleMonth === selectedMonth;
    });
  }, [sales, selectedMonth]);

  // Get available months from sales data
  const availableMonths = useMemo(() => {
    if (!sales || !Array.isArray(sales)) return [];
    const months = new Set();
    sales.forEach(sale => {
      const date = new Date(sale.saleDate || sale.createdAt);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.add(month);
    });
    return Array.from(months).sort().reverse();
  }, [sales]);

  const totalSalesAmount = filteredSales && filteredSales.length > 0 ? filteredSales.reduce((acc, sale) => acc + (sale.sellingPrice * sale.quantitySold || 0), 0) : 0;
  const totalCostOfGoodsSold = filteredSales && filteredSales.length > 0 ? filteredSales.reduce((acc, sale) => acc + ((sale.costPriceAtTimeOfSale || 0) * sale.quantitySold || 0), 0) : 0;
  const totalProfit = filteredSales && filteredSales.length > 0 ? filteredSales.reduce((acc, sale) => acc + (sale.profit || 0), 0) : 0;
  const averageProfitPerSale = filteredSales && filteredSales.length > 0 ? totalProfit / filteredSales.length : 0;

  const profitPerItemChartData = getProfitPerItemData(filteredSales, isDarkMode);
  const dailyProfitChartData = getDailyProfitData(filteredSales, isDarkMode);

  const legendColor = isDarkMode ? '#e5e7eb' : '#374151'; // gray-200 : gray-700
  const titleColor = isDarkMode ? '#d1d5db' : '#1f2937';  // gray-300 : gray-800
  const tickColor = isDarkMode ? '#9ca3af' : '#4b5563';   // gray-400 : gray-600
  const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';

  const getChartOptions = (titleText) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: legendColor }
      },
      title: {
        display: true,
        text: titleText,
        font: { size: 16 },
        color: titleColor
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255,255,255,0.9)', // gray-800 : white
        titleColor: isDarkMode ? '#f3f4f6' : '#1f2937', // gray-100 : gray-800
        bodyColor: isDarkMode ? '#d1d5db' : '#374151', // gray-300 : gray-700
        borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.9)' : 'rgba(209, 213, 219, 0.9)', // gray-600 : gray-300
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) label += formatCurrency(context.parsed.y);
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          color: tickColor,
          callback: function(value) { return formatCurrency(value); }
        },
        grid: { color: gridColor, drawBorder: false }
      },
      x: {
        ticks: { color: tickColor },
        grid: { color: gridColor, drawBorder: false }
      }
    }
  });
  
  const lineChartOptions = getChartOptions('Daily Profit Trend (Last 60 Days)');
  const barChartOptions = getChartOptions('Top 10 Items by Profit');

  const handlePrint = () => {
    window.print();
  };

  const getMonthName = (monthString) => {
    const [year, month] = monthString.split('-');
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleDateString('en-NG', { month: 'long', year: 'numeric' });
  };


  return (
    <div className={`p-4 md:p-8 font-sans min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-gray-900 text-gray-200" : "bg-slate-100 text-slate-900"}`}>
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className={`text-3xl lg:text-4xl font-bold ${isDarkMode ? "text-purple-400" : "text-purple-700"}`}>Sales Analytics</h1>
          <div className="flex gap-2 flex-wrap">
            {/* Month Filter */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className={`px-4 py-2 rounded-lg ${isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-slate-900 border-slate-300"} border font-semibold`}
            >
              <option value="">All Months</option>
              {availableMonths.map(month => (
                <option key={month} value={month}>
                  {getMonthName(month)}
                </option>
              ))}
            </select>
            
            <button
              onClick={handlePrint}
              className={`font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out ${isDarkMode ? "bg-green-600 hover:bg-green-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"}`}
            >
              Print
            </button>
            
            <button
              onClick={onBack}
              className={`font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out ${isDarkMode ? "bg-sky-600 hover:bg-sky-700 text-white" : "bg-sky-600 hover:bg-sky-700 text-white"}`}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      {filteredSales.length === 0 ? (
        <section className={`${isDarkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow-lg text-center transition-colors duration-300`}>
          <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>No Sales Data</h2>
          <p className={`${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>There is no sales data available for {selectedMonth ? getMonthName(selectedMonth) : 'this period'}.</p>
        </section>
      ) : (
        <>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 print:gap-2">
            {[
              { title: "Total Revenue", value: totalSalesAmount, colorClass: isDarkMode ? "text-green-400" : "text-green-600" },
              { title: "Total COGS", value: totalCostOfGoodsSold, colorClass: isDarkMode ? "text-orange-400" : "text-orange-600" },
              { title: "Total Profit", value: totalProfit, colorClass: isDarkMode ? "text-sky-400" : "text-sky-600" },
              { title: "Avg. Profit/Sale", value: averageProfitPerSale, colorClass: isDarkMode ? "text-indigo-400" : "text-indigo-600" }
            ].map(stat => (
              <div key={stat.title} className={`${isDarkMode ? "bg-gray-800" : "bg-white"} p-5 rounded-xl shadow-lg text-center transition-colors duration-300 print:shadow-none print:border print:border-gray-400`}>
                <h3 className={`text-lg font-semibold mb-1 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>{stat.title}</h3>
                <p className={`text-2xl font-bold ${stat.colorClass}`}>{formatCurrency(stat.value)}</p>
              </div>
            ))}
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 print:gap-4 print:grid-cols-1">
            <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow-lg transition-colors duration-300 print:shadow-none print:border print:border-gray-400`}>
              {profitPerItemChartData ? (
                <div style={{ height: '400px' }} className="print:hidden">
                  <Bar options={barChartOptions} data={profitPerItemChartData} />
                </div>
              ) : (
                <p className={`${isDarkMode ? "text-slate-400" : "text-slate-500"} text-center py-10`}>Not enough data for &apos;Profit per Item&apos; chart.</p>
              )}
            </div>
            <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow-lg transition-colors duration-300 print:shadow-none print:border print:border-gray-400`}>
              {dailyProfitChartData ? (
                <div style={{ height: '400px' }} className="print:hidden">
                  <Line options={lineChartOptions} data={dailyProfitChartData} />
                </div>
              ) : (
                <p className={`${isDarkMode ? "text-slate-400" : "text-slate-500"} text-center py-10`}>Not enough data for &apos;Daily Profit&apos; chart.</p>
              )}
            </div>
          </section>

          <section className={`${isDarkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow-lg transition-colors duration-300 print:shadow-none print:border print:border-gray-400`}>
            <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
              Sales Report - {selectedMonth ? getMonthName(selectedMonth) : 'All Months'} ({filteredSales.length} sales)
            </h2>
            <div className="overflow-x-auto">
              <table className={`w-full text-sm ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>
                <thead className={`${isDarkMode ? "bg-gray-700" : "bg-slate-100"} print:bg-gray-200`}>
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">Item</th>
                    <th className="px-4 py-2 text-right font-semibold">Qty</th>
                    <th className="px-4 py-2 text-right font-semibold">Unit</th>
                    <th className="px-4 py-2 text-right font-semibold">Selling Price</th>
                    <th className="px-4 py-2 text-right font-semibold">Cost Price</th>
                    <th className="px-4 py-2 text-right font-semibold">Profit</th>
                    <th className="px-4 py-2 text-left font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-slate-200"}`}>
                  {filteredSales
                    .slice()
                    .sort((a, b) => new Date(b.saleDate || b.createdAt) - new Date(a.saleDate || a.createdAt))
                    .map((sale, idx) => {
                      let itemNameForDisplay = sale.itemName || 'Item Deleted/Unknown';
                      let unitSoldForDisplay = sale.unitSold || 'unit(s)';
                      if (sale.itemName === 'Item Deleted/Unknown' && inventory && inventory.length > 0) {
                        const currentItemDetails = inventory.find(inv => inv._id === sale.itemId);
                        if (currentItemDetails) {
                          itemNameForDisplay = currentItemDetails.itemName;
                          if (!sale.unitSold) unitSoldForDisplay = currentItemDetails.sellingUnit || currentItemDetails.stockUnit || 'unit(s)';
                        }
                      }
                      return (
                        <tr key={sale._id || idx} className={`${isDarkMode ? "hover:bg-gray-700" : "hover:bg-slate-50"} print:border-b`}>
                          <td className="px-4 py-2">{itemNameForDisplay}</td>
                          <td className="px-4 py-2 text-right">{sale.quantitySold}</td>
                          <td className="px-4 py-2 text-right">{unitSoldForDisplay}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(sale.sellingPrice)}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(sale.costPriceAtTimeOfSale)}</td>
                          <td className={`px-4 py-2 text-right font-semibold ${sale.profit >= 0 ? (isDarkMode ? "text-green-400" : "text-green-600") : (isDarkMode ? "text-red-400" : "text-red-600")}`}>
                            {formatCurrency(sale.profit)}
                          </td>
                          <td className="px-4 py-2">{new Date(sale.saleDate || sale.createdAt).toLocaleDateString()}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      <style jsx global>{`
        @media print {
          body {
            background: white;
            margin: 0;
            padding: 10mm;
          }
          
          button {
            display: none !important;
          }
          
          select {
            display: none !important;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:border {
            border: 1px solid #d1d5db !important;
          }
          
          .print\\:border-gray-400 {
            border-color: #9ca3af !important;
          }
          
          .print\\:bg-gray-200 {
            background-color: #e5e7eb !important;
          }
          
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
          }
          
          th, td {
            border: 1px solid #d1d5db;
            padding: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default AnalyticsPage;
