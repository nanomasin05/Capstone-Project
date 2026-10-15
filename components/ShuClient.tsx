'use client';

import { useEffect, useState } from 'react';

const rup = (n: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n);

type ShuData = {
  shu: number;
  profit: number;
  setting?: {
    percentage?: number;
    description?: string;
  };
};

export default function ShuClient() {
  const [d, setD] = useState<ShuData | null>(null);
  const [p, setP] = useState(0);
  const [desc, setDesc] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setMsg('');

      const response = await fetch('/api/shu', {
        method: 'GET',
        cache: 'no-store',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal mengambil data SHU.');
      }

      setD(data);
      setP(data.setting?.percentage ?? 0);
      setDesc(data.setting?.description ?? '');
    } catch (error) {
      console.error('Gagal memuat SHU:', error);

      setMsg(
        error instanceof Error
          ? error.message
          : 'Gagal memuat data SHU.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    try {
      setSaving(true);
      setMsg('');

      const response = await fetch('/api/shu', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          percentage: p,
          description: desc,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMsg(data.message || 'Gagal menyimpan pengaturan SHU.');
        return;
      }

      setMsg('Pengaturan SHU berhasil disimpan.');

      await load();
    } catch (error) {
      console.error('Gagal menyimpan SHU:', error);

      setMsg(
        error instanceof Error
          ? error.message
          : 'Gagal menyimpan pengaturan SHU.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <p>Memuat SHU...</p>
        </div>
      </div>
    );
  }

  if (!d) {
    return (
      <div className="container">
        <div className="card">
          <h2 className="card-title">
            Data SHU tidak dapat dimuat
          </h2>

          {msg && (
            <div className="notice">
              {msg}
            </div>
          )}

          <button
            className="btn"
            onClick={load}
            style={{ marginTop: 12 }}
          >
            ↻ Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">

      {/* HEADER */}
      <div className="page-head">

        <div>
          <h1 className="title">
            Pembagian SHU
          </h1>

          <p className="subtitle">
            Hitung dan kelola pembagian hasil usaha.
          </p>
        </div>

        <div className="actions">

          <select className="filter-select">
            <option value="2026">
              Tahun 2026
            </option>
          </select>

          <button
            className="btn"
            onClick={load}
            disabled={loading}
          >
            ↻ Hitung SHU
          </button>

        </div>
      </div>


      {/* MESSAGE */}
      {msg && (
        <div className="notice successmsg">
          {msg}
        </div>
      )}


      {/* STATISTICS */}
      <div className="grid">

        {/* TOTAL SHU */}
        <div className="stat-card">

          <div className="stat-icon">
            Rp
          </div>

          <div>
            <div className="stat-label">
              Total SHU Tahun Ini
            </div>

            <div className="stat-value">
              {rup(Number(d.shu || 0))}
            </div>
          </div>

        </div>


        {/* JUMLAH ANGGOTA */}
        <div className="stat-card">

          <div className="stat-icon green">
            #
          </div>

          <div>
            <div className="stat-label">
              Jumlah Anggota
            </div>

            <div className="stat-value">
              -
            </div>
          </div>

        </div>


        {/* NILAI PER ANGGOTA */}
        <div className="stat-card">

          <div
            className="stat-icon"
            style={{
              background: '#f0eaff',
              color: '#7047c7',
            }}
          >
            Rp
          </div>

          <div>
            <div className="stat-label">
              Nilai per Anggota
            </div>

            <div className="stat-value">
              -
            </div>
          </div>

        </div>


        {/* PERSENTASE */}
        <div className="stat-card">

          <div className="stat-icon orange">
            %
          </div>

          <div>
            <div className="stat-label">
              Persentase SHU
            </div>

            <div className="stat-value">
              {Number(d.setting?.percentage ?? 0)}%
            </div>
          </div>

        </div>

      </div>


      {/* CONTENT */}
      <div className="two section">

        {/* RINCIAN */}
        <div className="card">

          <h2 className="card-title">
            Rincian Perhitungan
          </h2>


          <div className="recent-row">
            <span>
              Total Penjualan
            </span>

            <b>
              {rup(Number(d.profit || 0))}
            </b>
          </div>


          <div className="recent-row">
            <span>
              Total Keuntungan Bersih
            </span>

            <b>
              {rup(Number(d.profit || 0))}
            </b>
          </div>


          <div className="recent-row">
            <span>
              SHU
            </span>

            <b>
              {rup(Number(d.shu || 0))}
            </b>
          </div>


          <div
            className="notice"
            style={{ marginTop: 14 }}
          >
            Rumus dan persentase SHU harus mengikuti
            ketentuan resmi pihak UT.
          </div>

        </div>


        {/* PENGATURAN */}
        <div className="card">

          <h2 className="card-title">
            Pengaturan SHU
          </h2>


          <div className="field">

            <label htmlFor="shu-percentage">
              Persentase SHU
            </label>

            <input
              id="shu-percentage"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={p}
              onChange={(e) =>
                setP(Number(e.target.value))
              }
              disabled={saving}
            />

          </div>


          <div
            className="field"
            style={{ marginTop: 10 }}
          >

            <label htmlFor="shu-description">
              Keterangan
            </label>

            <textarea
              id="shu-description"
              rows={4}
              value={desc}
              onChange={(e) =>
                setDesc(e.target.value)
              }
              disabled={saving}
            />

          </div>


          <button
            className="btn"
            style={{ marginTop: 12 }}
            onClick={save}
            disabled={saving}
          >
            {saving
              ? 'Menyimpan...'
              : 'Simpan Pengaturan'}
          </button>

        </div>

      </div>

    </div>
  );
}