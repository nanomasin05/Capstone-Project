'use client';

import { useEffect, useState } from 'react';

type User = {
  id: string | number;
  name: string;
  username: string;
  role: string;
  active: boolean;
};

type FormData = {
  name: string;
  username: string;
  password: string;
  role: string;
};

const initialForm: FormData = {
  name: '',
  username: '',
  password: '',
  role: 'STAFF',
};

export default function UsersClient() {
  const [list, setList] = useState<User[]>([]);

  const [f, setF] = useState<FormData>(initialForm);

  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /*
   * =====================================================
   * LOAD USERS
   * =====================================================
   */

  const load = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/users', {
        method: 'GET',
        cache: 'no-store',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Gagal mengambil data pengguna.'
        );
      }

      setList(
        Array.isArray(data)
          ? data
          : Array.isArray(data.users)
            ? data.users
            : []
      );
    } catch (err) {
      console.error('Gagal memuat pengguna:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Gagal memuat data pengguna.'
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * =====================================================
   * LOAD SAAT HALAMAN DIBUKA
   * =====================================================
   *
   * Jangan:
   *
   * useEffect(load, []);
   *
   * karena load adalah fungsi async.
   */

  useEffect(() => {
    load();
  }, []);

  /*
   * =====================================================
   * SIMPAN PENGGUNA
   * =====================================================
   */

  const save = async () => {
    setMsg('');
    setError('');

    if (!f.name.trim()) {
      setError('Nama wajib diisi.');
      return;
    }

    if (!f.username.trim()) {
      setError('Username wajib diisi.');
      return;
    }

    if (!f.password) {
      setError('Password wajib diisi.');
      return;
    }

    try {
      setSaving(true);

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: f.name.trim(),
          username: f.username.trim(),
          password: f.password,
          role: f.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            'Gagal membuat pengguna.'
        );

        return;
      }

      setMsg('Pengguna berhasil dibuat.');

      setF(initialForm);

      setOpen(false);

      /*
       * Tunggu sampai daftar pengguna selesai
       * dimuat kembali.
       */
      await load();

    } catch (err) {
      console.error(
        'Gagal membuat pengguna:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Gagal membuat pengguna.'
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * =====================================================
   * FILTER PENGGUNA
   * =====================================================
   */

  const keyword = q.trim().toLowerCase();

  const filtered = list.filter((x) => {
    const name =
      String(x.name || '').toLowerCase();

    const username =
      String(x.username || '').toLowerCase();

    return (
      name.includes(keyword) ||
      username.includes(keyword)
    );
  });

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <div className="container">

      {/* =================================================
          HEADER
          ================================================= */}

      <div className="page-head">

        <div>

          <h1 className="title">
            Pengguna
          </h1>

          <p className="subtitle">
            Kelola akun pengguna sistem.
          </p>

        </div>


        <button
          className="btn"
          onClick={() => {
            setError('');
            setMsg('');
            setOpen(true);
          }}
        >
          ＋ Tambah Pengguna
        </button>

      </div>


      {/* =================================================
          SUCCESS MESSAGE
          ================================================= */}

      {msg && !open && (
        <div className="notice successmsg">
          {msg}
        </div>
      )}


      {/* =================================================
          ERROR MESSAGE
          ================================================= */}

      {error && !open && (
        <div className="notice">
          {error}
        </div>
      )}


      {/* =================================================
          SEARCH
          ================================================= */}

      <div className="card">

        <div className="search">

          <input
            type="text"
            placeholder="⌕  Cari nama atau username..."
            value={q}
            onChange={(e) =>
              setQ(e.target.value)
            }
          />

        </div>

      </div>


      {/* =================================================
          TABLE
          ================================================= */}

      <div className="section tablewrap">

        {loading ? (

          <div className="card">

            <p>
              Memuat pengguna...
            </p>

          </div>

        ) : error && list.length === 0 ? (

          <div className="card">

            <h2 className="card-title">
              Data pengguna tidak dapat dimuat
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

        ) : (

          <table className="table">

            <thead>

              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Username</th>
                <th>Role</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>

            </thead>


            <tbody>

              {filtered.length === 0 ? (

                <tr>

                  <td
                    colSpan={6}
                    style={{
                      textAlign: 'center',
                      padding: 30,
                    }}
                  >
                    {keyword
                      ? 'Pengguna tidak ditemukan.'
                      : 'Belum ada data pengguna.'}
                  </td>

                </tr>

              ) : (

                filtered.map((x, i) => (

                  <tr key={x.id}>

                    <td>
                      {i + 1}
                    </td>

                    <td>
                      {x.name}
                    </td>

                    <td>
                      {x.username}
                    </td>

                    <td>
                      {x.role}
                    </td>

                    <td>

                      <span
                        className={
                          x.active
                            ? 'badge'
                            : 'badge danger'
                        }
                      >
                        {x.active
                          ? 'Aktif'
                          : 'Nonaktif'}
                      </span>

                    </td>

                    <td>

                      <div className="actions">

                        <button
                          className="btn secondary"
                          onClick={() => {
                            setMsg(
                              'Fitur edit pengguna belum diaktifkan.'
                            );
                          }}
                        >
                          Edit
                        </button>

                        <button
                          className="btn danger"
                          onClick={() => {
                            setMsg(
                              'Fitur hapus pengguna belum diaktifkan.'
                            );
                          }}
                        >
                          Hapus
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        )}

      </div>


      {/* =================================================
          MODAL TAMBAH PENGGUNA
          ================================================= */}

      {open && (

        <div className="modal-backdrop">

          <div className="modal">

            {/* MODAL HEADER */}

            <div className="modal-head">

              <h2 className="modal-title">
                Tambah Pengguna
              </h2>

              <button
                className="modal-close"
                onClick={() => {
                  if (!saving) {
                    setOpen(false);
                  }
                }}
                disabled={saving}
              >
                ×
              </button>

            </div>


            {/* MODAL BODY */}

            <div className="modal-body">

              {error && (
                <div
                  className="notice"
                  style={{
                    marginBottom: 16,
                  }}
                >
                  {error}
                </div>
              )}

              <div className="formgrid">

                {/* NAMA */}

                <div className="field">

                  <label htmlFor="user-name">
                    Nama
                  </label>

                  <input
                    id="user-name"
                    type="text"
                    value={f.name}
                    onChange={(e) =>
                      setF({
                        ...f,
                        name: e.target.value,
                      })
                    }
                    disabled={saving}
                  />

                </div>


                {/* USERNAME */}

                <div className="field">

                  <label htmlFor="user-username">
                    Username
                  </label>

                  <input
                    id="user-username"
                    type="text"
                    value={f.username}
                    onChange={(e) =>
                      setF({
                        ...f,
                        username: e.target.value,
                      })
                    }
                    disabled={saving}
                  />

                </div>


                {/* PASSWORD */}

                <div className="field">

                  <label htmlFor="user-password">
                    Password
                  </label>

                  <input
                    id="user-password"
                    type="password"
                    value={f.password}
                    onChange={(e) =>
                      setF({
                        ...f,
                        password: e.target.value,
                      })
                    }
                    disabled={saving}
                  />

                </div>


                {/* ROLE */}

                <div className="field">

                  <label htmlFor="user-role">
                    Role
                  </label>

                  <select
                    id="user-role"
                    value={f.role}
                    onChange={(e) =>
                      setF({
                        ...f,
                        role: e.target.value,
                      })
                    }
                    disabled={saving}
                  >

                    <option value="STAFF">
                      Staff
                    </option>

                    <option value="ADMIN">
                      Admin
                    </option>

                  </select>

                </div>

              </div>

            </div>


            {/* MODAL FOOTER */}

            <div className="modal-foot">

              <button
                className="btn secondary"
                onClick={() => {
                  if (!saving) {
                    setOpen(false);
                  }
                }}
                disabled={saving}
              >
                Batal
              </button>


              <button
                className="btn"
                onClick={save}
                disabled={saving}
              >
                {saving
                  ? 'Menambahkan...'
                  : 'Tambah Pengguna'}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}