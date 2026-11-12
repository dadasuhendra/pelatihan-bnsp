// src/components/TeamDirectory.jsx
import { useState } from 'react';
import TeamCard from './TeamCard';
import AddMemberForm from './AddMemberForm';

// Avatar siluet orang (SVG), tanpa perlu file gambar
const buatAvatar = (warnaLatar, warnaBaju) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150">' +
      '<rect width="150" height="150" fill="' + warnaLatar + '"/>' +
      '<circle cx="75" cy="60" r="28" fill="#f1c9a5"/>' +
      '<path d="M20 150 Q20 100 75 100 Q130 100 130 150 Z" fill="' + warnaBaju + '"/>' +
    '</svg>'
  );

// Data awal anggota tim
const initialMembers = [
  { id: 1, name: 'Dada Suhendra', role: 'Frontend Dev', bio: 'Passionate in React & Modern UI', status: 'Online', stars: 3, avatar: buatAvatar('#bfdbfe', '#1d4ed8') },
  { id: 2, name: 'Nindya Nur Assyifah', role: 'UI/UX Designer', bio: 'Figma Master & User Advocate', status: 'Online', stars: 5, avatar: buatAvatar('#fbcfe8', '#be185d') },
  { id: 3, name: 'Dini Dwi Azkia', role: 'Backend Engineer', bio: 'Node.js API & Cloud Specialist', status: 'Online', stars: 1, avatar: buatAvatar('#bbf7d0', '#15803d') },
];

export default function TeamDirectory() {
  const [members, setMembers] = useState(initialMembers);
  const [searchTerm, setSearchTerm] = useState('');

  // ---- Statistik (otomatis ikut berubah) ----
  const totalMembers = members.length;
  const onlineMembers = members.filter((m) => m.status === 'Online').length;
  const offlineMembers = totalMembers - onlineMembers;

  // ---- Handler: ubah status Online/Offline ----
  const handleToggleStatus = (id) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: m.status === 'Online' ? 'Offline' : 'Online' }
          : m
      )
    );
  };

  // ---- Handler: tambah bintang ----
  const handleAddStar = (id) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, stars: m.stars + 1 } : m))
    );
  };

  // ---- Handler: tambah anggota baru dari form ----
  const handleAddMember = (newMemberData) => {
    const newEntry = {
      ...newMemberData, // name, email, role, bio (sudah valid)
      id: Date.now(),
      isNew: true,      // kartu baru diberi highlight biru
      status: 'Online',
      stars: 0,
      avatar: buatAvatar('#e9d5ff', '#7e22ce'),
    };
    setMembers((prev) => [newEntry, ...prev]);
  };

  // ---- Pencarian ----
  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="directory-container">
      <h2 className="directory-title">Daftar Anggota Tim Developer</h2>

      {/* Bar statistik */}
      <div className="stats-bar">
        <div className="stat-box">
          <div className="stat-num">{totalMembers}</div>
          <div className="stat-label">Total Members</div>
        </div>
        <div className="stat-box highlight">
          <div className="stat-num online">{onlineMembers}</div>
          <div className="stat-label">Online</div>
        </div>
        <div className="stat-box">
          <div className="stat-num offline">{offlineMembers}</div>
          <div className="stat-label">Offline</div>
        </div>
      </div>

      {/* Form tambah anggota */}
      <AddMemberForm onAddMember={handleAddMember} />

      {/* Kotak pencarian */}
      <input
        type="text"
        placeholder="Cari nama anggota tim..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {/* Daftar kartu */}
      <div className="team-grid">
        {filteredMembers.length === 0 ? (
          <div className="empty-state">
            ⚠️ Tidak ada anggota tim yang cocok dengan kata kunci "{searchTerm}".
          </div>
        ) : (
          filteredMembers.map((member) => (
            <TeamCard
              key={member.id}
              {...member}
              onToggleStatus={handleToggleStatus}
              onAddStar={handleAddStar}
            />
          ))
        )}
      </div>
    </div>
  );
}