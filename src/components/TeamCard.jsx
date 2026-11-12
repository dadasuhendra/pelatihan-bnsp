// src/components/TeamCard.jsx
// Komponen anak: hanya menampilkan satu kartu & memanggil callback ke induk
export default function TeamCard({
  id, name, role, bio, avatar, status, stars = 0, isNew,
  onToggleStatus, onAddStar
}) {
  return (
    <div className={`team-card ${isNew ? 'card-new' : ''}`}>
      <img src={avatar} alt={name} className="card-avatar" />
      <div className="card-info">
        <h3 className="card-name">{name}</h3>
        <p className="card-role">{role}</p>
        {bio && <p className="card-bio">"{bio}"</p>}

        <div className="card-badges">
          <span className={`badge ${status === 'Online' ? 'badge-online' : 'badge-offline'}`}>
            • {status}
          </span>
          <span className="badge-stars">⭐ {stars} Bintang</span>
        </div>

        <div className="card-actions">
          <button className="btn-star" onClick={() => onAddStar(id)}>
            ⭐ Beri Bintang
          </button>
          <button className="btn-status-toggle" onClick={() => onToggleStatus(id)}>
            Ubah ke {status === 'Online' ? 'Offline' : 'Online'}
          </button>
        </div>
      </div>
    </div>
  );
}