import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './Gallery.css';

export default function Gallery() {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  async function fetchPhotos() {
    try {
      const { data, error: fetchError } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setPhotos(data || []);
    } catch (err) {
      setError(`Failed to load photos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  function getImageUrl(storagePath) {
    const { data } = supabase.storage.from('photos').getPublicUrl(storagePath);
    return data.publicUrl;
  }

  function openLightbox(index) {
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    setSelectedIndex(null);
    document.body.style.overflow = '';
  }

  function nextPhoto() {
    if (selectedIndex < photos.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  }

  function prevPhoto() {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowRight') nextPhoto();
      else if (e.key === 'ArrowLeft') prevPhoto();
      else if (e.key === 'Escape') closeLightbox();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, photos.length]);

  if (loading) {
    return (
      <div className="gallery">
        <div className="gallery-loader">⏳ Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gallery">
        <div className="gallery-error">
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="back-link">
            ← Kembali
          </button>
        </div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="gallery">
        <div className="gallery-empty">
          <p>Belum ada foto.</p>
          <button onClick={() => navigate('/camera')} className="btn btn-primary">
            AMBIL FOTO PERTAMA
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery">
      <div className="gallery-header">
        <h2>GALERI FOTO</h2>
        <button onClick={() => navigate('/')} className="back-link">
          ← Kembali
        </button>
      </div>

      <div className="gallery-grid">
        {photos.map((photo, idx) => (
          <div
            key={photo.id}
            className="gallery-item"
            onClick={() => openLightbox(idx)}
          >
            <img
              src={getImageUrl(photo.storage_path)}
              alt={`Photo ${idx + 1}`}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <div className="lightbox">
          <div className="lightbox-overlay" onClick={closeLightbox} />

          <div className="lightbox-content">
            <button
              className="lightbox-close"
              onClick={closeLightbox}
              title="Close"
            >
              ✕
            </button>

            <img
              src={getImageUrl(photos[selectedIndex].storage_path)}
              alt={`Photo ${selectedIndex + 1}`}
            />

            <div className="lightbox-counter">
              {selectedIndex + 1} / {photos.length}
            </div>
          </div>

          {selectedIndex > 0 && (
            <button
              className="lightbox-nav lightbox-prev"
              onClick={prevPhoto}
              title="Previous photo (←)"
            >
              ‹
            </button>
          )}

          {selectedIndex < photos.length - 1 && (
            <button
              className="lightbox-nav lightbox-next"
              onClick={nextPhoto}
              title="Next photo (→)"
            >
              ›
            </button>
          )}
        </div>
      )}
    </div>
  );
}
