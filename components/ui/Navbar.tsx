'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCurrentUser, getUserData } from '@/lib/storage/engine';

export default function Navbar() {
  const [user, setUser] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const current = getCurrentUser();
    setUser(current);
    if (current) {
      const data = getUserData(current);
      if (data) setBalance(data.balance);
    }
  }, []);

  return (
    <nav className="navbar flex justify-between items-center max-w-4xl mx-auto">
      <Link href="/" className="text-2xl font-black gold-text tracking-wider">
        N+ PLAY
      </Link>
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-600/30">
              ₹{balance}
            </span>
            <span className="text-xs text-gray-400 hidden sm:block">{user}</span>
            <button 
              onClick={() => {
                localStorage.removeItem('nplus_current_user');
                window.location.href = '/login';
              }}
              className="text-xs text-gray-500 hover:text-white transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" className="text-sm text-gray-400 hover:text-white transition">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
