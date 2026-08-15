'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, setCurrentUser, getUserData, createUser } from '@/lib/storage/engine';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (getCurrentUser()) router.push('/');
  }, []);

  const handleLogin = () => {
    if (!username.trim()) { setError('Enter username'); return; }
    let user = getUserData(username);
    if (!user) user = createUser(username);
    setCurrentUser(username);
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-[#0f172a] p-8 rounded-2xl border border-[#2a2a3a] max-w-sm w-full">
        <h1 className="text-4xl gold-text font-black text-center mb-2">N+ PLAY</h1>
        <p className="text-center text-gray-400 text-sm mb-6">India's most trusted platform</p>
        <input 
          type="text" 
          placeholder="Enter Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          className="w-full p-3 bg-[#1e293b] border border-[#2a2a3a] rounded-lg text-white mb-4 focus:border-[#f5c518] outline-none"
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />
        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
        <button onClick={handleLogin} className="w-full btn-gold py-3 text-lg">
          Login / Register
        </button>
        <p className="text-center text-xs text-gray-500 mt-4">
          💡 Just type any username and login. Data saved in your browser.
        </p>
      </div>
    </div>
  );
}
