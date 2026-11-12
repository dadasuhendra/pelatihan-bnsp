// Tulis kode lengkap ini di src/components/GreetingForm.jsx
import { useState } from 'react';

function GreetingForm() {
  const [nama, setNama] = useState('');

  return (
    <div style={{ margin: '20px 0' }}>
      <input
        type="text"
        placeholder="Ketik nama Anda..."
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        className="input-teks"
      />
      <p>Halo, {nama || 'Tamu'}</p>
    </div>
  );
}

export default GreetingForm;