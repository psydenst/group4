'use client';

import { User, Calendar, Menu } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Calendar className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">BookNow</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-white/80 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/experiences" className="text-white/80 hover:text-white transition-colors">
              Experiences
            </Link>
            <Link href="/about" className="text-white/80 hover:text-white transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-white/80 hover:text-white transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Login
            </Link>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white p-2"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <nav className="flex flex-col gap-4">
              <Link href="/" className="text-white/80 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/experiences" className="text-white/80 hover:text-white transition-colors">
                Experiences
              </Link>
              <Link href="/about" className="text-white/80 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-white/80 hover:text-white transition-colors">
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}