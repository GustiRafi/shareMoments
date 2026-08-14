import { Link } from 'react-router-dom';
import './Landing.css';

export default function Landing() {
  return (
    <div className="landing">
      <div className="landing-content">
        <div className="bunting">
          {[...Array(10)].map((_, i) => (
            <div key={i} className={`flag ${i % 2 === 0 ? 'merah' : 'putih'}`} />
          ))}
        </div>

        <div className="landing-header">
          <div className="ornamen-flags">
            <span>🇮🇩</span>
          </div>
          <h1>JALAN SEHAT</h1>
          <p className="date">17 AGUSTUS 2026</p>
        </div>

        <p className="tagline">
          Abadikan momennya 📸
          <div className="badge-year">⭐ 81 TAHUN ⭐</div>
        </p>

        <Link to="/camera" className="btn btn-primary">
          AMBIL FOTO
        </Link>

        <div className="gallery-link-small">
          <Link to="/gallery">Lihat galeri</Link>
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
