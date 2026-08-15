import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Landing.css';

export default function Landing() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentPhotos();
  }, []);

  async function fetchRecentPhotos() {
    try {
      const { data } = await supabase
        .from('photos')
        .select('id, storage_path')
        .order('created_at', { ascending: false })
        .limit(6);
      setPhotos(data || []);
    } catch (err) {
      console.error('Failed to fetch photos:', err);
    } finally {
      setLoading(false);
    }
  }

  function getImageUrl(storagePath) {
    const { data } = supabase.storage.from('photos').getPublicUrl(storagePath);
    return data.publicUrl;
  }

  return (
    <div className="landing">
      <div className="landing-content">
        <div className="decorative-top">
          <div className="flag-accent flag-red"></div>
          <div className="flag-accent flag-white"></div>
        </div>

        <div className="landing-header">
          <div className="year-badge">81</div>
          <h1>SEMARAK AGUSTUS</h1>
          <p className="date">17 AGUSTUS 2026</p>
          <p className="builder">Built by Gusti</p>
        </div>

        <div className="hero-text-card">
          <span className="community-badge">DARI WARGA, UNTUK WARGA</span>
          <p className="tagline">Dokumentasi Keseruan 17 Agustus</p>
          <p className="sub-tagline">Wadah bersama untuk mengabadikan dan membagikan setiap momen seru perayaan kemerdekaan.</p>
        </div>

        {/* <div className="public-notice">
          <Globe size={20} className="notice-icon" />
          <span><strong>INFO DOKUMENTASI PUBLIK:</strong> Ini adalah ruang dokumentasi terbuka dari warga untuk warga. Semua foto yang diambil akan langsung dipublikasikan dan dapat dilihat oleh seluruh warga.</span>
        </div> */}

        <Link to="/camera" className="btn btn-primary">
          JEPRET SEKARANG
        </Link>

        {!loading && photos.length > 0 && (
          <div className="recent-photos">
            <div className="section-header-card">
              <span className="section-title">DOKUMENTASI TERBARU WARGA</span>
              <p className="section-subtitle">Kumpulan foto momen 17-an yang diabadikan langsung oleh warga.</p>
            </div>
            <div className="photos-grid">
              {photos.map((photo) => (
                <img
                  key={photo.id}
                  src={getImageUrl(photo.storage_path)}
                  alt="Recent photo"
                  className="photo-thumb"
                  loading="lazy"
                />
              ))}
            </div>
            <Link to="/gallery" className="btn btn-primary">
              LIHAT SEMUA FOTO
            </Link>
          </div>
        )}

        {loading && (
          <div className="loading-card">Memuat foto warga...</div>
        )}

        <div className="decorative-bottom">
          <div className="dot-accent red"></div>
          <div className="dot-accent white"></div>
          <div className="dot-accent red"></div>
        </div>
      </div>

      <footer className="landing-footer">
        <p>Built by Gusti</p>
        <a href="https://gustirafi.my.id" target="_blank" rel="noopener noreferrer">
          gustirafi.my.id
        </a>
      </footer>
    </div>
  );
}
