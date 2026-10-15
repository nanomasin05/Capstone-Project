'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const items = [
  { href: '/dashboard', label: 'Dashboard', icon: '⌂' },
  { href: '/products', label: 'Data Barang', icon: '▣' },
  { href: '/purchases', label: 'Pengadaan Barang', icon: '▤' },
  { href: '/stock', label: 'Stok Barang', icon: '▥' },
  { href: '/sales', label: 'Penjualan', icon: '🛒' },
  { href: '/profit', label: 'Keuntungan', icon: '◉' },
  { href: '/shu', label: 'SHU', icon: '♙' },
  { href: '/reports', label: 'Laporan', icon: '▤' },
];

export default function Nav({
  role,
  username,
}: {
  role: string;
  username: string;
}) {
  const path = usePathname();
  const router = useRouter();

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });

      router.push('/login');
    } catch (error) {
      console.error('Logout gagal:', error);
    }
  };

  const menu =
    role === 'ADMIN'
      ? [
          ...items,
          {
            href: '/users',
            label: 'Pengguna',
            icon: '♙',
          },
        ]
      : items;

  return (
    <aside className="sidebar">

      {/* LOGO UT SHOP */}
      <div
        className="sidebar-brand"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '16px',
        }}
      >

        {/* Kotak logo */}
        <div
          style={{
            width: '48px',
            height: '48px',
            minWidth: '48px',
            minHeight: '48px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative',
            flexShrink: 0,
          }}
        >
          <img
            src="/logo-universitas-terbuka.png"
            alt="Logo Universitas Terbuka"
            style={{
              width: '40px',
              height: '40px',
              maxWidth: '40px',
              maxHeight: '40px',
              minWidth: '40px',
              minHeight: '40px',
              objectFit: 'contain',
              objectPosition: 'center',
              display: 'block',
              position: 'static',
              margin: 0,
              padding: 0,
            }}
          />
        </div>

        {/* Nama aplikasi */}
        <div>
          <div className="brand-title">
            UT SHOP
          </div>

          <div className="brand-subtitle">
            Sistem Pembukuan
          </div>
        </div>

      </div>

      {/* MENU */}
      <nav className="sidebar-menu">

        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={
              path === item.href
                ? 'menu-item active'
                : 'menu-item'
            }
          >
            <span className="menu-icon">
              {item.icon}
            </span>

            <span>
              {item.label}
            </span>
          </Link>
        ))}

      </nav>

      {/* KELUAR */}
      <div className="sidebar-footer">
        <button
          className="logout-button"
          onClick={logout}
        >
          Keluar
        </button>
      </div>

    </aside>
  );
}