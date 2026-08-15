import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X, Loader, Download, Globe, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { isMyPhoto, removeMyPhotoId } from '../lib/ownership';
import './Gallery.css';

export default function Gallery() {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [deletingPhotoId, setDeletingPhotoId] = useState(null);
  const [confirmDeletePhoto, setConfirmDeletePhoto] = useState(null);

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
      setError(`Gagal memuat foto: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  function getImageUrl(storagePath) {
    const { data } = supabase.storage.from('photos').getPublicUrl(storagePath);
    return data.publicUrl;
  }

  function groupByDate(photos) {
    const groups = {};
    for (const photo of photos) {
      const label = new Date(photo.created_at).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      (groups[label] ??= []).push(photo);
    }
    return Object.entries(groups);
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

  async function downloadPhoto(url, idx, storagePath) {
    setDownloading(true);
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      const ext = storagePath.split('.').pop();
      a.download = `foto-warga-${idx + 1}.${ext}`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloading(false);
    }
  }

  async function handleDeletePhoto(photo) {
    if (!photo) return;
    setDeletingPhotoId(photo.id);

    try {
      // 1. Delete record from Supabase DB
      const { error: dbErr } = await supabase
        .from('photos')
        .delete()
        .eq('id', photo.id);

      if (dbErr) throw dbErr;

      // 2. Delete file from Supabase Storage
      await supabase.storage.from('photos').remove([photo.storage_path]);

      // 3. Remove ownership from LocalStorage
      removeMyPhotoId(photo.id);

      // 4. Update UI state
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));

      if (selectedIndex !== null) {
        if (photos.length <= 1) {
          closeLightbox();
        } else if (selectedIndex >= photos.length - 1) {
          setSelectedIndex(photos.length - 2);
        }
      }
    } catch (err) {
      alert(`Gagal menghapus foto: ${err.message}`);
    } finally {
      setDeletingPhotoId(null);
      setConfirmDeletePhoto(null);
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
        <div className="gallery-loader">
          <Loader className="spinner" size={40} />
          <p>Memuat jepretan warga...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gallery">
        <div className="gallery-error">
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="back-link">
            Kembali
          </button>
        </div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="gallery">
        <div className="gallery-empty">
          <p className="empty-title">Belum Ada Jepretan Foto</p>
          <p className="empty-subtitle">Jadilah orang pertama yang mengunggah momen 17-an. Foto pertamamu akan langsung tampil di sini.</p>
          <button onClick={() => navigate('/camera')} className="btn btn-primary">
            JEPRET SEKARANG
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery">
      <div className="gallery-header">
        <div className="header-text-container">
          <h2>GALERI DOKUMENTASI WARGA</h2>
          <p className="header-subtitle">Dari warga, untuk warga. Arsip kebersamaan perayaan 17 Agustus.</p>
        </div>
        <button onClick={() => navigate('/')} className="back-link">
          Kembali
        </button>
      </div>

      <div className="gallery-notice-bar">
        <Globe size={18} className="notice-icon" />
        <span><strong>DOKUMENTASI PUBLIK:</strong> Ini adalah ruang dokumentasi terbuka dari warga untuk warga. Seluruh foto di galeri ini dapat dilihat secara publik.</span>
      </div>

      {groupByDate(photos).map(([dateLabel, group]) => (
        <div key={dateLabel} className="gallery-group">
          <div className="gallery-group-header">
            <span>{dateLabel}</span>
            <span className="gallery-group-count">{group.length} foto</span>
          </div>
          <div className="gallery-grid">
            {group.map((photo, idx) => {
              const photoIndex = photos.findIndex((p) => p.id === photo.id);
              const owned = isMyPhoto(photo.id);

              return (
                <div
                  key={photo.id}
                  className={`gallery-item gallery-item-${idx % 3}`}
                  onClick={() => openLightbox(photoIndex)}
                >
                  <img
                    src={getImageUrl(photo.storage_path)}
                    alt="Photo"
                    loading="lazy"
                  />

                  {owned && (
                    <button
                      className="item-delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDeletePhoto(photo);
                      }}
                      title="Hapus foto saya"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {selectedIndex !== null && photos[selectedIndex] && (
        <div className="lightbox">
          <div className="lightbox-overlay" onClick={closeLightbox} />

          <div className="lightbox-content">
            <button
              className={`lightbox-download ${downloading ? 'downloading' : ''}`}
              onClick={() => downloadPhoto(getImageUrl(photos[selectedIndex].storage_path), selectedIndex, photos[selectedIndex].storage_path)}
              disabled={downloading}
              title="Download foto"
            >
              {downloading ? <Loader size={24} className="spinner" /> : <Download size={24} />}
            </button>

            {isMyPhoto(photos[selectedIndex].id) && (
              <button
                className="lightbox-delete"
                onClick={() => setConfirmDeletePhoto(photos[selectedIndex])}
                title="Hapus foto saya"
              >
                <Trash2 size={22} />
              </button>
            )}

            <button
              className="lightbox-close"
              onClick={closeLightbox}
              title="Close"
            >
              <X size={28} />
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
              title="Previous photo"
            >
              <ChevronLeft size={32} />
            </button>
          )}

          {selectedIndex < photos.length - 1 && (
            <button
              className="lightbox-nav lightbox-next"
              onClick={nextPhoto}
              title="Next photo"
            >
              <ChevronRight size={32} />
            </button>
          )}
        </div>
      )}

      {/* Confirmation Modal for Deletion */}
      {confirmDeletePhoto && (
        <div className="delete-modal-overlay" onClick={() => setConfirmDeletePhoto(null)}>
          <div className="delete-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-icon">
              <Trash2 size={28} />
            </div>
            <h3>Hapus Foto Ini?</h3>
            <p>Foto akan dihapus secara permanen dari Galeri Warga.</p>
            <div className="delete-modal-actions">
              <button
                className="btn-modal-cancel"
                onClick={() => setConfirmDeletePhoto(null)}
                disabled={deletingPhotoId === confirmDeletePhoto.id}
              >
                Batal
              </button>
              <button
                className="btn-modal-delete"
                onClick={() => handleDeletePhoto(confirmDeletePhoto)}
                disabled={deletingPhotoId === confirmDeletePhoto.id}
              >
                {deletingPhotoId === confirmDeletePhoto.id ? (
                  <>
                    <Loader size={16} className="spinner" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <span>Ya, Hapus</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

