import './globals.css';
import { ReactNode } from 'react';
export const metadata = { title: 'UT Shop Management', description: 'Sistem Informasi Manajemen UT Shop' };
export default function RootLayout({children}:{children:ReactNode}){return <html lang="id"><body>{children}</body></html>}
