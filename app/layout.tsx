import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/ui/Navbar';
import BottomNav from '@/components/ui/BottomNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'N+ PLAY - Premium Gaming Platform',
  description: 'India\'s most trusted gaming platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="container mx-auto px-4 py-4 pb-24 max-w-4xl">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
