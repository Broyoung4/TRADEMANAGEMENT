'use client';
import React from 'react';
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

const AnalyticsPage = ({ sales, inventory, onBack, isDarkMode }) => { // Added isDarkMode
  const totalSalesAmount = sales.reduce((acc, sale) => acc + (sale.sellingPrice * sale.quantitySold || 0), 0);
  const totalCostOfGoodsSold = sales.reduce((acc, sale) => acc + ((sale.costPriceAtTimeOfSale || 0) * sale.quantitySold || 0), 0);
  const totalProfit = sales.reduce((acc, sale) => acc + (sale.profit || 0), 0);
  const averageProfitPerSale = sales.length > 0 ? totalProfit / sales.length : 0;

  const profitPerItemChartData = getProfitPerItemData(sales, isDarkMode);
  const dailyProfitChartData = getDailyProfitData(sales, isDarkMode);

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


  return (
    <div className={`p-4 md:p-8 font-sans min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-gray-900 text-gray-200" : "bg-slate-100 text-slate-900"}`}>
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <h1 className={`text-3xl lg:text-4xl font-bold ${isDarkMode ? "text-purple-400" : "text-purple-700"}`}>Sales Analytics</h1>
          <button
            onClick={onBack}
            className={`mt-4 sm:mt-0 font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out ${isDarkMode ? "bg-sky-600 hover:bg-sky-700 text-white" : "bg-sky-600 hover:bg-sky-700 text-white"}`}
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      {sales.length === 0 ? (
        <section className={`${isDarkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow-lg text-center transition-colors duration-300`}>
          <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>No Sales Data</h2>
          <p className={`${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>There is no sales data available to display analytics.</p>
        </section>
      ) : (
        <>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { title: "Total Revenue", value: totalSalesAmount, colorClass: isDarkMode ? "text-green-400" : "text-green-600" },
              { title: "Total COGS", value: totalCostOfGoodsSold, colorClass: isDarkMode ? "text-orange-400" : "text-orange-600" },
              { title: "Total Profit", value: totalProfit, colorClass: isDarkMode ? "text-sky-400" : "text-sky-600" },
              { title: "Avg. Profit/Sale", value: averageProfitPerSale, colorClass: isDarkMode ? "text-indigo-400" : "text-indigo-600" }
            ].map(stat => (
              <div key={stat.title} className={`${isDarkMode ? "bg-gray-800" : "bg-white"} p-5 rounded-xl shadow-lg text-center transition-colors duration-300`}>
                <h3 className={`text-lg font-semibold mb-1 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>{stat.title}</h3>
                <p className={`text-2xl font-bold ${stat.colorClass}`}>{formatCurrency(stat.value)}</p>
              </div>
            ))}
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow-lg transition-colors duration-300`}>
              {profitPerItemChartData ? (
                <div style={{ height: '400px' }}>
                  <Bar options={barChartOptions} data={profitPerItemChartData} />
                </div>
              ) : (
                <p className={`${isDarkMode ? "text-slate-400" : "text-slate-500"} text-center py-10`}>Not enough data for 'Profit per Item' chart.</p>
              )}
            </div>
            <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow-lg transition-colors duration-300`}>
              {dailyProfitChartData ? (
                <div style={{ height: '400px' }}>
                  <Line options={lineChartOptions} data={dailyProfitChartData} />
                </div>
              ) : (
                <p className={`${isDarkMode ? "text-slate-400" : "text-slate-500"} text-center py-10`}>Not enough data for 'Daily Profit' chart.</p>
              )}
            </div>
          </section>

          <section className={`${isDarkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow-lg transition-colors duration-300`}>
            <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>Recent Sales Activity (Top 10)</h2>
            <ul className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-slate-200"}`}>
              {sales
                .slice() // Create a copy before sorting
                .sort((a, b) => new Date(b.saleDate || b.createdAt) - new Date(a.saleDate || a.createdAt))
                .slice(0, 10)
                .map(sale => {
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
                    <li key={sale._id} className="py-3 flex justify-between items-center">
                      <div>
                        <p className={`text-md font-semibold ${isDarkMode ? "text-gray-100" : "text-slate-800"}`}>{itemNameForDisplay}</p>
                        <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Qty: {sale.quantitySold} {unitSoldForDisplay} on {new Date(sale.saleDate || sale.createdAt).toLocaleDateString()}</p>
                      </div>
                      <p className={`text-md font-semibold ${sale.profit >=0 ? (isDarkMode ? "text-green-400" : "text-green-600") : (isDarkMode ? "text-red-400" : "text-red-600")}`}>{formatCurrency(sale.profit)}</p>
                    </li>
                  );
              })}
            </ul>
          </section>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
