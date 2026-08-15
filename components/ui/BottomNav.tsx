'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Home', icon: '🏠', path: '/' },
  { name: 'Activity', icon: '🔥', path: '/activity' },
  { name: 'Get ₹500', icon: '🎁', path: '/bonus' },
  { name: 'Promotion', icon: '📢', path: '/promotion' },
  { name: 'Account', icon: '👤', path: '/account' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link
            key={item.name}
            href={item.path}
            className={`flex flex-col items-center text-xs transition ${
              isActive ? 'text-[#f5c518]' : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="mt-0.5">{item.name}</span>
            {item.name === 'Get ₹500' && (
              <span className="absolute -top-1 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
