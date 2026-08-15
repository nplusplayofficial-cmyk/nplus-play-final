'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, getUserData } from '@/lib/storage/engine';

const games = [
  { name: 'WINGO', icon: '🎰', path: '/wingo', popular: true },
  { name: 'AVIATOR', icon: '✈️', path: '/aviator', popular: true },
  { name: 'K3', icon: '🎲', path: '/k3', popular: false },
  { name: '5D', icon: '🎯', path: '/5d', popular: false },
  { name: 'TRX WIN GO', icon: '🔗', path: '/trx', popular: false },
  { name: 'VORTEX', icon: '🌀', path: '/vortex', popular: false },
  { name: 'CHICKEN ROAD 2', icon: '🐔', path: '/chicken', popular: false },
  { name: 'CRAZY TIME', icon: '🎡', path: '/crazy', popular: false },
];

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const current = getCurrentUser();
    if (!current) { router.push('/login'); return; }
    setUser(current);
    const data = getUserData(current);
    if (data) setBalance(data.balance);
  }, []);

  return (
    <div className="pb-20">
      <div className="text-center py-6">
        <h1 className="text-5xl font-black gold-text">N+ PLAY</h1>
        <p className="text-gray-400 text-sm mt-1">India's largest gaming platform</p>
        {user && (
          <div className="mt-2 inline-block bg-green-600/20 px-4 py-1 rounded-full border border-green-600/30">
            <span className="text-green-400 text-sm font-bold">₹{balance}</span>
            <span className="text-gray-500 text-xs ml-2">• {user}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        {games.map((game) => (
          <Link key={game.name} href={game.path}>
            <div className="glass-card p-6 text-center hover:border-gold transition cursor-pointer h-32 flex flex-col justify-center items-center">
              <div className="text-4xl">{game.icon}</div>
              <div className="font-bold mt-2 text-sm">{game.name}</div>
              {game.popular && <span className="text-[10px] text-yellow-500 font-bold mt-1">🔥 POPULAR</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
