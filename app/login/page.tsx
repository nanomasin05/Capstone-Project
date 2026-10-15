'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setErr('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErr(data.message || 'Login gagal');
        return;
      }

      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      setErr('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <form
        className="loginbox"
        onSubmit={submit}
      >

        {/* =====================================
            LOGO DAN JUDUL
            ===================================== */}

        <div className="login-brand">

          <div
            className="login-logo"
            style={{
              width: '90px',
              height: '90px',
              margin: '0 auto 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <img
              src="/logo-universitas-terbuka.png"
              alt="Logo Universitas Terbuka"
              style={{
                width: '80px',
                height: '80px',
                maxWidth: '80px',
                maxHeight: '80px',
                minWidth: '80px',
                minHeight: '80px',
                objectFit: 'contain',
                objectPosition: 'center',
                display: 'block',
                position: 'static',
                margin: 0,
                padding: 0,
              }}
            />
          </div>

          <h1>
            UT SHOP
          </h1>

          <p>
            Sistem Pembukuan &amp; Penjualan
          </p>

        </div>


        {/* =====================================
            ERROR
            ===================================== */}

        {err && (
          <div className="notice error">
            {err}
          </div>
        )}


        {/* =====================================
            USERNAME
            ===================================== */}

        <div className="field">

          <label>
            Username
          </label>

          <input
            value={username}
            placeholder="Masukkan username"
            onChange={(e) => setUsername(e.target.value)}
          />

        </div>


        {/* =====================================
            PASSWORD
            ===================================== */}

        <div className="field">

          <label>
            Password
          </label>

          <input
            type="password"
            value={password}
            placeholder="Masukkan password"
            onChange={(e) => setPassword(e.target.value)}
          />

        </div>


        {/* =====================================
            TOMBOL LOGIN
            ===================================== */}

        <button
          type="submit"
          className="btn login-button"
          disabled={loading}
        >
          {loading ? 'Memproses...' : 'MASUK'}
        </button>


        {/* =====================================
            DEMO ACCOUNT
            ===================================== */}

        <div className="login-demo">
          Demo: admin / admin123
          &nbsp;•&nbsp;
          staff / staff123
        </div>

      </form>

    </div>
  );
}