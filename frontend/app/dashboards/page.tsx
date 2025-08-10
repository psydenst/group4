'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Calendar } from 'lucide-react';

// Importações do Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Registrando os componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);

  // Dados do gráfico (exemplo simples)
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Price Fluctuation',
        data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
        fill: true,
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'white',
          font: { size: 14 },
        },
      },
      title: { display: false },
      tooltip: { enabled: true, mode: 'nearest' },
    },
    scales: {
      x: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      y: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
  };

  const baseButtonClasses =
    'w-full font-semibold text-white py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100';

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Calendar className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">BookNow</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-white/70">Overview of dashboards</p>
        </div>

        {/* Content Panel */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 space-y-4">
          {/* Price Fluctuation Chart */}
          <div className="text-white">
            <h2 className="text-xl font-semibold mb-4">Price Fluctuation (Insert ToggleBar)</h2>
            <div style={{ overflowX: 'auto', width: '100%' }}>
              <div style={{ width: '100%', height: 300 }}>
                <Line data={data} options={options} />
              </div>
            </div>
          </div>

          {/* Outros indicadores */}
          <div className="text-white">
            <h2 className="text-xl font-semibold mb-2">Total Bookings</h2>
            <p className="text-3xl font-bold">Include chart of total bookings per product here</p>
          </div>

          <div className="text-white">
            <h2 className="text-xl font-semibold mb-2">Revenue</h2>
            <p className="text-3xl font-bold">Include chart of total revenue per product here</p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`${baseButtonClasses} bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600`}
          >
            {loading ? 'Atualizando...' : 'Update Data'}
          </button>
        </div>
      </div>
    </div>
  );
}
