'use client';

import { useState, useEffect, useRef } from 'react';
import { getCurrentUser, getUserData, placeBetLocal, settleBetLocal } from '@/lib/storage/engine';

export default function WingoBoard() {
  const [balance, setBalance] = useState(0);
  const [timer, setTimer] = useState(15);
  const [period, setPeriod] = useState('20260815100000001');
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [stake, setStake] = useState(10);
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const current = getCurrentUser();
    if (current) {
      setUser(current);
      const data = getUserData(current);
      if (data) setBalance(data.balance);
    }
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setPeriod(`202608151000${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`);
          setSelectedNumber(null);
          setSelectedColor(null);
          setSelectedSize(null);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handlePlaceBet = async () => {
    if (!user) { setMessage('Please login'); return; }
    let betData: any = {};
    if (selectedNumber !== null) betData = { type: 'number', value: selectedNumber };
    else if (selectedColor) betData = { type: 'color', value: selectedColor };
    else if (selectedSize) betData = { type: 'size', value: selectedSize };
    else { setMessage('Select a bet first'); return; }

    if (stake > balance) { setMessage('Insufficient balance'); return; }

    setIsProcessing(true);
    setMessage('');

    try {
      placeBetLocal(user, 'wingo', stake, betData);
      const result = Math.floor(Math.random() * 10);
      const colors = ['red', 'green', 'green', 'green', 'green', 'violet', 'violet', 'violet', 'violet', 'violet'];
      const resultColor = colors[result];

      let isWin = false;
      let multiplier = 0;
      if (betData.type === 'number' && betData.value === result) {
        isWin = true;
        multiplier = 9;
      } else if (betData.type === 'color' && betData.value === resultColor) {
        isWin = true;
        multiplier = betData.value === 'violet' ? 14 : 2;
      } else if (betData.type === 'size') {
        const isBig = result >= 5;
        if ((betData.value === 'Big' && isBig) || (betData.value === 'Small' && !isBig)) {
          isWin = true;
          multiplier = 2;
        }
      }

      const payout = isWin ? stake * multiplier : 0;
      settleBetLocal(user, 'wingo', stake, `${resultColor} ${result}`, payout);

      const data = getUserData(user);
      if (data) setBalance(data.balance);
      setMessage(isWin ? `🎉 Won! ${resultColor} ${result} (${multiplier}x)` : `😞 Lost. ${resultColor} ${result}`);
    } catch (err: any) {
      setMessage('Error: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-2 text-white pb-20">
      <div className="flex justify-between items-center mb-4 bg-[#0f172a] p-3 rounded-xl border border-[#2a2a3a]">
        <div>
          <p className="text-xs text-gray-400">Wallet Balance</p>
          <p className="text-xl font-bold text-green-400">₹{balance}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Time remaining</span>
            <span className="text-2xl font-mono font-bold text-red-500">{String(timer).padStart(2, '0')}</span>
          </div>
          <p className="text-xs text-gray-500">{period}</p>
        </div>
      </div>

      <div className="mb-4 bg-[#0f172a] p-3 rounded-xl border border-[#2a2a3a]">
        <div className="grid grid-cols-10 gap-1">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
            let bg = 'bg-[#1e293b]';
            if (num <= 4) bg = 'bg-green-600/20 hover:bg-green-600/40';
            else bg = 'bg-purple-600/20 hover:bg-purple-600/40';
            return (
              <button
                key={num}
                onClick={() => { setSelectedNumber(num); setSelectedColor(null); setSelectedSize(null); }}
                className={`py-3 text-lg font-bold rounded-lg transition border-2 ${selectedNumber === num ? 'border-[#f5c518] bg-[#f5c518]/20' : 'border-transparent'} ${bg}`}
              >
                {num}
              </button>
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-xs">
          <span className="text-green-400">Green (0-4)</span>
          <span className="text-purple-400">Violet (5-9)</span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-4">
        {['Red', 'Green', 'Violet'].map((color) => (
          <button
            key={color}
            onClick={() => { setSelectedColor(color.toLowerCase()); setSelectedNumber(null); setSelectedSize(null); }}
            className={`py-2 rounded-lg font-bold border-2 transition ${selectedColor === color.toLowerCase() ? 'border-[#f5c518] bg-[#f5c518]/20' : 'border-transparent'} bg-[#1e293b]`}
            style={{ color: color === 'Red' ? '#ef4444' : color === 'Green' ? '#22c55e' : '#a855f7' }}
          >
            {color}
          </button>
        ))}
        <button
          onClick={() => { setSelectedSize('Big'); setSelectedNumber(null); setSelectedColor(null); }}
          className={`py-2 rounded-lg font-bold border-2 transition ${selectedSize === 'Big' ? 'border-[#f5c518] bg-[#f5c518]/20' : 'border-transparent'} bg-[#1e293b]`}
        >
          Big
        </button>
        <button
          onClick={() => { setSelectedSize('Small'); setSelectedNumber(null); setSelectedColor(null); }}
          className={`py-2 rounded-lg font-bold border-2 transition ${selectedSize === 'Small' ? 'border-[#f5c518] bg-[#f5c518]/20' : 'border-transparent'} bg-[#1e293b]`}
        >
          Small
        </button>
      </div>

      <div className="bg-[#0f172a] p-4 rounded-xl border border-[#2a2a3a] mb-4">
        <p className="text-sm font-bold mb-3">WinGo 30sec</p>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-sm text-gray-400">Quantity</span>
          <div className="flex items-center bg-[#1e293b] rounded-lg overflow-hidden">
            <button onClick={() => setStake(Math.max(1, stake - 1))} className="px-4 py-1 text-xl font-bold hover:bg-[#2a2a3a]">-</button>
            <span className="px-4 py-1 text-lg font-bold">{stake}</span>
            <button onClick={() => setStake(stake + 1)} className="px-4 py-1 text-xl font-bold hover:bg-[#2a2a3a]">+</button>
          </div>
        </div>
        <div className="flex gap-2 mb-3">
          {[1, 10, 100, 1000].map((val) => (
            <button key={val} onClick={() => setStake(val)} className="flex-1 py-1 text-sm font-bold bg-[#1e293b] rounded-lg hover:bg-[#2a2a3a]">
              {val}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#2a2a3a]">
          <div>
            <p className="text-xs text-gray-400">Total amount</p>
            <p className="text-xl font-bold text-green-400">₹{stake}</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-bold bg-red-600/80 rounded-lg hover:bg-red-600">Cancel</button>
            <button onClick={handlePlaceBet} disabled={isProcessing} className="px-6 py-2 text-sm font-bold bg-[#f5c518] text-black rounded-lg hover:bg-[#e6b800] disabled:opacity-50">
              {isProcessing ? 'Placing...' : 'Bet'}
            </button>
          </div>
        </div>
        {message && <p className={`mt-2 text-sm font-bold ${message.includes('Won') ? 'text-green-400' : 'text-red-400'}`}>{message}</p>}
        <p className="text-[10px] text-gray-500 mt-1 text-center">I agree 《Pre-sale rules》</p>
      </div>
    </div>
  );
}
