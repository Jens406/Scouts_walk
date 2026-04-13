import React, { useState } from 'react';
import { useRouteStore } from '../state/routeStore';

const CATEGORIES = ['viewpoint', 'water', 'shelter', 'hazard', 'camp', 'other'];

const CATEGORY_ICONS: Record<string, string> = {
  viewpoint: '👁️',
  water: '💧',
  shelter: '🏕️',
  hazard: '⚠️',
  camp: '⛺',
  other: '📌',
};

export default function PoiList() {
  const { pois, addPoi } = useRouteStore();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('viewpoint');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !lat || !lng) return;
    setSaving(true);
    try {
      await addPoi({
        name,
        description,
        category,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      });
      setName(''); setDescription(''); setLat(''); setLng('');
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="poi-card">
      <div className="card-header">
        <h3>📌 Points of Interest</h3>
        <button className="scout-btn small" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add POI'}
        </button>
      </div>

      {showForm && (
        <form className="poi-form" onSubmit={handleAdd}>
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>
            ))}
          </select>
          <div className="poi-coords">
            <input placeholder="Latitude" type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} required />
            <input placeholder="Longitude" type="number" step="any" value={lng} onChange={(e) => setLng(e.target.value)} required />
          </div>
          <button type="submit" className="scout-btn" disabled={saving}>{saving ? 'Adding…' : 'Add POI'}</button>
        </form>
      )}

      {pois.length === 0 ? (
        <p className="empty-msg">No points of interest yet.</p>
      ) : (
        <ul className="poi-list">
          {pois.map((poi) => (
            <li key={poi.id} className="poi-item">
              <span className="poi-icon">{CATEGORY_ICONS[poi.category] ?? '📌'}</span>
              <div>
                <strong>{poi.name}</strong>
                {poi.description && <p className="poi-desc">{poi.description}</p>}
                <small className="poi-coords-display">{poi.lat.toFixed(4)}, {poi.lng.toFixed(4)}</small>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
