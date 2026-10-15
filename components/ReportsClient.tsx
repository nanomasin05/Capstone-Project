'use client';

import { useEffect, useState } from 'react';

const rup = (n: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

type ReportItem = {
  id: string | number;
  invoiceNo: string;
  date: string;
  buyerType: string;
  total: number;
  items: {
    profit: number;
  }[];
};

type ReportData = {
  summary: {
    transactions: number;
    revenue: number;
    purchaseTotal: number;
    profit: number;
  };
  sales: ReportItem[];
};

export default function ReportsClient() {
  const [d, setD] = useState<ReportData | null>(null);

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const [report, setReport] = useState('sales');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();

      if (from) {
        params.set('from', from);
      }

      if (to) {
        params.set('to', to);
      }

      const query = params.toString();

      const response = await fetch(
        `/api/reports${query ? `?${query}` : ''}`,
        {
          method: 'GET',
          cache: 'no-store',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Gagal mengambil data laporan.'
        );
      }

      setD(data);
    } catch (err) {
      console.error('Gagal memuat laporan:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Gagal memuat laporan.'
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * PENTING:
   * Jangan menggunakan useEffect(load, []) karena load()
   * mengembalikan Promise.
   */
  useEffect(() => {
    load();
  }, []);

  if (loading && !d) {
    return (
      <div className="container">
        <div className="card">
          <p>Memuat laporan...</p>
        </div>
      </div>
    );
  }

  if (error && !d) {
    return (
      <div className="container">
        <div className="card">

          <h2 className="card-title">
            Laporan tidak dapat dimuat
          </h2>

          <div className="notice">
            {error}
          </div>

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

  if (!d) {
    return null;
  }

  const sales = Array.isArray(d.sales)
    ? d.sales
    : [];

  return (
    <div className="container">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="page-head">

        <div>
          <h1 className="title">
            Laporan
          </h1>

          <p className="subtitle">
            Lihat dan unduh laporan sesuai kebutuhan.
          </p>
        </div>

      </div>


      {/* =====================================================
          FILTER
          ===================================================== */}

      <div className="card">

        <div className="formgrid">

          <div className="field">

            <label htmlFor="report-type">
              Jenis Laporan
            </label>

            <select
              id="report-type"
              value={report}
              onChange={(e) =>
                setReport(e.target.value)
              }
            >
              <option value="sales">
                Laporan Penjualan
              </option>

              <option value="stock">
                Laporan Stok
              </option>

              <option value="purchase">
                Laporan Pengadaan
              </option>

              <option value="profit">
                Laporan Keuntungan
              </option>
            </select>

          </div>


          <div className="field">

            <label>
              Periode
            </label>

            <div className="toolbar">

              <input
                className="filter-select"
                type="date"
                value={from}
                onChange={(e) =>
                  setFrom(e.target.value)
                }
              />

              <input
                className="filter-select"
                type="date"
                value={to}
                onChange={(e) =>
                  setTo(e.target.value)
                }
              />

              <button
                className="btn"
                onClick={load}
                disabled={loading}
              >
                {loading
                  ? 'Memuat...'
                  : 'Tampilkan'}
              </button>

            </div>

          </div>

        </div>

      </div>


      {/* ERROR KETIKA DATA LAMA MASIH ADA */}

      {error && (
        <div
          className="notice"
          style={{ marginTop: 16 }}
        >
          {error}
        </div>
      )}


      {/* =====================================================
          JENIS LAPORAN
          ===================================================== */}

      <div className="report-type section">

        <div className="report-box">

          <strong>
            ▣ Laporan Penjualan
          </strong>

          <span>
            Detail transaksi penjualan
          </span>

          <div style={{ marginTop: 10 }}>
            <button className="btn secondary">
              Lihat
            </button>
          </div>

        </div>


        <div className="report-box">

          <strong>
            ▣ Laporan Stok
          </strong>

          <span>
            Data stok barang
          </span>

          <div style={{ marginTop: 10 }}>
            <button className="btn secondary">
              Lihat
            </button>
          </div>

        </div>


        <div className="report-box">

          <strong>
            ▣ Laporan Keuntungan
          </strong>

          <span>
            Rincian keuntungan
          </span>

          <div style={{ marginTop: 10 }}>
            <button className="btn secondary">
              Lihat
            </button>
          </div>

        </div>


        <div className="report-box">

          <strong>
            ▣ Laporan SHU
          </strong>

          <span>
            Pembagian hasil usaha
          </span>

          <div style={{ marginTop: 10 }}>
            <button className="btn secondary">
              Lihat
            </button>
          </div>

        </div>

      </div>


      {/* =====================================================
          STATISTIK
          ===================================================== */}

      <div className="grid section">

        <div className="stat-card">

          <div className="stat-icon">
            #
          </div>

          <div>

            <div className="stat-label">
              Transaksi
            </div>

            <div className="stat-value">
              {Number(
                d.summary?.transactions || 0
              )}
            </div>

          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            Rp
          </div>

          <div>

            <div className="stat-label">
              Pendapatan
            </div>

            <div className="stat-value">
              {rup(
                d.summary?.revenue || 0
              )}
            </div>

          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon orange">
            Rp
          </div>

          <div>

            <div className="stat-label">
              Pengadaan
            </div>

            <div className="stat-value">
              {rup(
                d.summary?.purchaseTotal || 0
              )}
            </div>

          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon green">
            Rp
          </div>

          <div>

            <div className="stat-label">
              Keuntungan
            </div>

            <div className="stat-value">
              {rup(
                d.summary?.profit || 0
              )}
            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          TABLE
          ===================================================== */}

      <div className="section tablewrap">

        <table className="table">

          <thead>

            <tr>
              <th>Invoice</th>
              <th>Tanggal</th>
              <th>Pembeli</th>
              <th>Total</th>
              <th>Keuntungan</th>
            </tr>

          </thead>


          <tbody>

            {sales.length === 0 ? (

              <tr>
                <td
                  colSpan={5}
                  style={{
                    textAlign: 'center',
                    padding: 30,
                  }}
                >
                  Tidak ada transaksi pada periode ini.
                </td>
              </tr>

            ) : (

              sales.map((x) => {

                const profit = Array.isArray(x.items)
                  ? x.items.reduce(
                      (total, item) =>
                        total +
                        Number(item.profit || 0),
                      0
                    )
                  : 0;

                return (
                  <tr key={x.id}>

                    <td>
                      {x.invoiceNo}
                    </td>

                    <td>
                      {new Date(
                        x.date
                      ).toLocaleDateString('id-ID')}
                    </td>

                    <td>
                      {x.buyerType === 'PARTNER'
                        ? 'Mitra/SALUT'
                        : 'Umum'}
                    </td>

                    <td>
                      {rup(x.total)}
                    </td>

                    <td>
                      {rup(profit)}
                    </td>

                  </tr>
                );
              })

            )}

          </tbody>

        </table>

      </div>


      {/* =====================================================
          DOWNLOAD
          ===================================================== */}

      <div className="section">

        <h2 className="card-title">
          Unduh Laporan
        </h2>

        <div className="actions">

          <button
            className="btn secondary"
            onClick={() =>
              window.print()
            }
          >
            ▣ PDF
          </button>

          <button
            className="btn secondary"
            onClick={() =>
              window.print()
            }
          >
            ▣ Excel
          </button>

          <button
            className="btn secondary"
            onClick={() =>
              window.print()
            }
          >
            ▣ Cetak
          </button>

        </div>

      </div>

    </div>
  );
}