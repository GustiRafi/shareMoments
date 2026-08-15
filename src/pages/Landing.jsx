import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Camera } from 'lucide-react';
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
          <h1>JALAN SEHAT</h1>
          <p className="date">17 AGUSTUS 2026</p>
        </div>

        <p className="tagline">Jepret dulu, mikir belakangan.</p>

        <Link to="/camera" className="btn btn-primary">
          JEPRET SEKARANG
        </Link>

        {!loading && photos.length > 0 && (
          <div className="recent-photos">
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
              LIHAT SEMUA
            </Link>
          </div>
        )}

        {loading && (
          <div style={{ color: '#999', fontSize: '14px' }}>Loading photos...</div>
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
