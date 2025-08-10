'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Calendar, ArrowLeft } from 'lucide-react';
import ChartDataLabels from 'chartjs-plugin-datalabels';
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
import { useRouter } from 'next/navigation';

ChartJS.register(
  CategoryScale,
  ChartDataLabels,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function getRandomColor() {
  return `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
}

// Componente gráfico de Price Fluctuation com formatação em R$
function PriceFluctuationChart({ selectedProduct, setSelectedProduct }) {
  const priceData = [
    { product: 'Product A', values: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120] },
    { product: 'Product B', values: [5, 15, 25, 35, 50, 65, 60, 85, 95, 110, 100, 130] },
    { product: 'Product C', values: [20, 30, 40, 55, 65, 75, 85, 95, 100, 120, 140, 160] },
  ];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const filtered = priceData.find(item => item.product === selectedProduct);
  const data = {
    labels: months,
    datasets: filtered ? [{
      label: filtered.product,
      data: filtered.values,
      borderColor: getRandomColor(),
      backgroundColor: context => {
        const borderColor = context.dataset.borderColor;
        return borderColor.replace('hsl', 'hsla').replace(')', ', 0.2)');
      },
      fill: true,
      pointBackgroundColor: '#fff',
      pointBorderColor: '#fff',
      tension: 0.3,
    }] : [],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      datalabels: {
        color: '#fff',
        font: { size: 14, weight: 'bold' },
        formatter: val => `$ ${val}`,
        align: 'top',
        anchor: 'end',
      },
      tooltip: {
        callbacks: {
          label: ctx => `$ ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        offset: true,
        ticks: { color: 'white', font: { size: 16 } },
        grid: { color: 'rgba(255, 255, 255, 0.2)' },
      },
      y: {
        ticks: {
          color: 'white',
          font: { size: 16 },
          callback: val => `$ ${val}`,
        },
        grid: { color: 'rgba(255, 255, 255, 0.2)' },
      },
    },
  };

  return (
    <div className="text-white">
      <h2 className="text-xl font-semibold mb-4 text-center">Price Fluctuation</h2>
      <div className="mb-6 flex justify-center">
        <select
          value={selectedProduct}
          onChange={e => setSelectedProduct(e.target.value)}
          className="bg-white text-black rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {priceData.map(p => (
            <option key={p.product} value={p.product}>{p.product}</option>
          ))}
        </select>
      </div>
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <div style={{ width: '100%', height: 300 }}>
          <Line data={data} options={options} plugins={[ChartDataLabels]} />
        </div>
      </div>
    </div>
  );
}

// Componente gráfico de Total Bookings sem R$
function TotalBookingsChart({ selectedProduct, setSelectedProduct }) {
  const bookingData = [
    { product: 'Product A', values: [120, 140, 150, 160, 180, 170, 175, 190, 200, 210, 220, 230] },
    { product: 'Product B', values: [80, 90, 95, 110, 120, 130, 135, 145, 155, 165, 175, 185] },
    { product: 'Product C', values: [150, 155, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250] },
  ];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const filtered = bookingData.find(item => item.product === selectedProduct);
  const data = {
    labels: months,
    datasets: filtered ? [{
      label: filtered.product,
      data: filtered.values,
      borderColor: getRandomColor(),
      backgroundColor: context => {
        const borderColor = context.dataset.borderColor;
        return borderColor.replace('hsl', 'hsla').replace(')', ', 0.2)');
      },
      fill: true,
      pointBackgroundColor: '#fff',
      pointBorderColor: '#fff',
      tension: 0.3,
    }] : [],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      datalabels: {
        color: '#fff',
        font: { size: 14, weight: 'bold' },
        formatter: val => val,
        align: 'top',
        anchor: 'end',
      },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        offset: true,
        ticks: { color: 'white', font: { size: 16 } },
        grid: { color: 'rgba(255, 255, 255, 0.2)' },
      },
      y: {
        ticks: { color: 'white', font: { size: 16 } },
        grid: { color: 'rgba(255, 255, 255, 0.2)' },
      },
    },
  };

  return (
    <div className="text-white">
      <h2 className="text-xl font-semibold mb-4 text-center">Total Bookings</h2>
      <div className="mb-6 flex justify-center">
        <select
          value={selectedProduct}
          onChange={e => setSelectedProduct(e.target.value)}
          className="bg-white text-black rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {bookingData.map(p => (
            <option key={p.product} value={p.product}>{p.product}</option>
          ))}
        </select>
      </div>
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <div style={{ width: '100%', height: 300 }}>
          <Line data={data} options={options} plugins={[ChartDataLabels]} />
        </div>
      </div>
    </div>
  );
}

// Componente gráfico de Revenue com R$
function RevenueChart({ selectedProduct, setSelectedProduct }) {
  const revenueData = [
    { product: 'Product A', values: [1000, 1200, 1300, 1400, 1500, 1700, 1800, 1900, 2000, 2100, 2200, 2400] },
    { product: 'Product B', values: [800, 900, 1000, 1100, 1150, 1200, 1300, 1350, 1400, 1500, 1600, 1700] },
    { product: 'Product C', values: [1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600] },
  ];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const filtered = revenueData.find(item => item.product === selectedProduct);
  const data = {
    labels: months,
    datasets: filtered ? [{
      label: filtered.product,
      data: filtered.values,
      borderColor: getRandomColor(),
      backgroundColor: context => {
        const borderColor = context.dataset.borderColor;
        return borderColor.replace('hsl', 'hsla').replace(')', ', 0.2)');
      },
      fill: true,
      pointBackgroundColor: '#fff',
      pointBorderColor: '#fff',
      tension: 0.3,
    }] : [],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      datalabels: {
        color: '#fff',
        font: { size: 14, weight: 'bold' },
        formatter: val => `$ ${val}`,
        align: 'top',
        anchor: 'end',
      },
      tooltip: {
        callbacks: {
          label: ctx => `$ ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        offset: true,
        ticks: { color: 'white', font: { size: 16 } },
        grid: { color: 'rgba(255, 255, 255, 0.2)' },
      },
      y: {
        ticks: {
          color: 'white',
          font: { size: 16 },
          callback: val => `$ ${val}`,
        },
        grid: { color: 'rgba(255, 255, 255, 0.2)' },
      },
    },
  };

  return (
    <div className="text-white">
      <h2 className="text-xl font-semibold mb-4 text-center">Revenue</h2>
      <div className="mb-6 flex justify-center">
        <select
          value={selectedProduct}
          onChange={e => setSelectedProduct(e.target.value)}
          className="bg-white text-black rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {revenueData.map(p => (
            <option key={p.product} value={p.product}>{p.product}</option>
          ))}
        </select>
      </div>
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <div style={{ width: '100%', height: 300 }}>
          <Line data={data} options={options} plugins={[ChartDataLabels]} />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Estados independentes para cada gráfico (podem ser o mesmo, se preferir)
  const [selectedPriceProduct, setSelectedPriceProduct] = useState('Product A');
  const [selectedBookingProduct, setSelectedBookingProduct] = useState('Product A');
  const [selectedRevenueProduct, setSelectedRevenueProduct] = useState('Product A');

  const baseButtonClasses = 'px-4 py-2 rounded-lg font-semibold transition-all duration-200';

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-5xl w-full mx-auto space-y-12">
        {/* Back Button */}
      <button
        onClick={() => router.push('/admin')}
        className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Admin Panel
      </button>
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Calendar className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">BookNow</span>
          </Link>
        </div>

        {/* Content Panel */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 space-y-12">
          <PriceFluctuationChart
            selectedProduct={selectedPriceProduct}
            setSelectedProduct={setSelectedPriceProduct}
          />

          <TotalBookingsChart
            selectedProduct={selectedBookingProduct}
            setSelectedProduct={setSelectedBookingProduct}
          />

          <RevenueChart
            selectedProduct={selectedRevenueProduct}
            setSelectedProduct={setSelectedRevenueProduct}
          />

          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`${baseButtonClasses} w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600`}
          >
            {loading ? 'Atualizando...' : 'Update Data'}
          </button>
        </div>
      </div>
    </div>
  );
}
