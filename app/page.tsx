import { redirect } from 'next/navigation';
import { readSession } from '@/lib/auth';
export default function Home(){ const s=readSession(); redirect(s?'/dashboard':'/login'); }
