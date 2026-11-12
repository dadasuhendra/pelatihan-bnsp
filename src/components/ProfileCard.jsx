import { useState } from 'react';

function ProfileCard() {
  const [isOnline, setIsOnline] = useState(true);

  return (
    <div className="card-profil">
      <h3>Budi Santoso</h3>
      {/* Percabangan Ternary untuk teks dan warna badge: */}
      <span style={{ color: isOnline ? '#16a34a' : '#64748b' }}>
        • {isOnline ? 'Sedang Aktif' : 'Offline'}
      </span>

      <button onClick={() => setIsOnline(!isOnline)}>
        Ganti Status
      </button>
    </div>
  );
}

export default ProfileCard;