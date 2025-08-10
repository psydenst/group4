'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Route } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const dashboardsBotao = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboards');
    }, 500);
  }

  const manager_product = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/managerproducts');
    }, 500);
  }

  const manager_reservations = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/managereservations');
    }, 500);
  }

  const baseButtonClasses = 
    "w-full font-semibold text-white py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Calendar className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">BookNow</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-white/70">Welcome to the admin panel.</p>
        </div>

        {/* Painel */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 space-y-4">
          <button
            onClick={dashboardsBotao}
            disabled={loading}
            className={`${baseButtonClasses} bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600`}
          >
            {loading ? 'Carregando...' : 'Dashboards'}
          </button>

          <button
            onClick={manager_product}
            disabled={loading}
            className={`${baseButtonClasses} bg-gradient-to-r from-blue-500 to-purple-600 hover:from-green-600 hover:to-green-700`}
          >
            Manage Products
          </button>

          <button
            onClick={manager_reservations}
            disabled={loading}
            className={`${baseButtonClasses} bg-gradient-to-r from-blue-500 to-purple-600 hover:from-yellow-500 hover:to-yellow-600`}
          >
            Manage Reservations
          </button>
        </div>
      </div>
    </div>
  );
}
