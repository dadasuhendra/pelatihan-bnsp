// src/components/AddMemberForm.jsx
import { useState } from 'react';
import { z } from 'zod';

// Skema validasi Zod: aturan bentuk data anggota tim
const memberSchema = z.object({
  name: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  role: z.string().min(1, 'Wajib memilih salah satu peran tim'),
  bio: z
    .string()
    .min(10, 'Bio minimal 10 karakter')
    .max(80, 'Bio maksimal 80 karakter'),
});

const emptyForm = { name: '', email: '', role: '', bio: '' };

export default function AddMemberForm({ onAddMember }) {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // Satu handler untuk semua input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Hapus pesan error kolom ini saat pengguna mulai mengetik
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // cegah halaman reload

    const result = memberSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0];
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    onAddMember(result.data); // kirim data bersih ke komponen induk
    setFormData(emptyForm);   // kosongkan form
    setErrors({});
  };

  return (
    <form className="add-member-form" onSubmit={handleSubmit}>
      <h3 className="form-title">➕ Tambah Anggota Tim</h3>

      <div className="form-row">
        <div className="form-group">
          <label>Nama Lengkap</label>
          <input
            name="name"
            placeholder="Contoh: Rina Wijaya"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && <span className="error-text">⚠️ {errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Email Perusahaan</label>
          <input
            name="email"
            placeholder="Contoh: rina@perusahaan.com"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email && <span className="error-text">⚠️ {errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Posisi / Peran</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={errors.role ? 'input-error' : ''}
          >
            <option value="">-- Pilih Posisi Tim --</option>
            <option value="Frontend Dev">Frontend Dev</option>
            <option value="Backend Engineer">Backend Engineer</option>
            <option value="UI/UX Designer">UI/UX Designer</option>
          </select>
          {errors.role && <span className="error-text">⚠️ {errors.role}</span>}
        </div>

        <div className="form-group">
          <label>Bio Singkat</label>
          <input
            type="text"
            name="bio"
            placeholder="Contoh: Senior React Developer"
            value={formData.bio}
            onChange={handleChange}
            className={errors.bio ? 'input-error' : ''}
          />
          {errors.bio && <span className="error-text">⚠️ {errors.bio}</span>}
        </div>

        <button type="submit" className="btn-submit">+ Tambah</button>
      </div>
    </form>
  );
}