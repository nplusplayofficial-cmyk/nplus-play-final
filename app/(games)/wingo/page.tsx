'use client';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/storage/engine';
import WingoBoard from '@/components/game/WingoBoard';

export default function WingoPage() {
  const router = useRouter();
  if (!getCurrentUser()) { router.push('/login'); return null; }
  return <WingoBoard />;
}
